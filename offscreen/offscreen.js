/**
 * Offscreen Document
 * 负责摄像头访问和视频预览
 * FaceMesh 在 sandbox iframe 中运行（绕过 CSP 限制）
 */

const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const canvasCtx = canvas.getContext('2d');
const previewCanvas = document.createElement('canvas');

let isRunning = false;
let headTracker = null;
let stream = null;
let frameLoopId = null;
let sandboxReady = false;
let sandboxIframe = null;

// 帧捕获用的临时 canvas
const captureCanvas = document.createElement('canvas');
const captureCtx = captureCanvas.getContext('2d');

// 鼻尖运动轨迹
const TRAIL_MAX = 40;
let noseTrail = [];

// 预览发送控制
let lastPreviewTime = 0;
const PREVIEW_INTERVAL = 80; // ~12fps

console.log('Offscreen document loaded');

let scrollDirection = 'natural'; // 'classic' 或 'natural'
let turnAction = 'switchTab'; // 'switchTab' 或 'navigate'

// 监听 chrome 消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case 'GET_STATUS':
      sendResponse({
        success: true,
        isRunning,
        isCalibrated: headTracker ? headTracker.isCalibrated : false
      });
      return true;

    case 'START_TRACKING':
      startTracking(message.config).then(sendResponse).catch(e =>
        sendResponse({ success: false, error: e.message })
      );
      return true;

    case 'STOP_TRACKING':
      stopTracking();
      sendResponse({ success: true });
      return true;

    case 'RECALIBRATE':
      if (headTracker) {
        headTracker.resetCalibration();
        noseTrail = [];
        notifyPopup('STATUS_UPDATE', { status: 'calibrating' });
        sendResponse({ success: true });
      } else {
        sendResponse({ success: false, error: 'Not running' });
      }
      return true;

    case 'UPDATE_CONFIG':
      if (headTracker) {
        headTracker.updateConfig(message.config);
        if (message.config.scrollDirection) {
          scrollDirection = message.config.scrollDirection;
        }
        if (message.config.turnAction) {
          turnAction = message.config.turnAction;
        }
        sendResponse({ success: true });
      } else {
        sendResponse({ success: false, error: 'Not running' });
      }
      return true;
  }
});

/**
 * 监听来自 sandbox iframe 的消息
 */
window.addEventListener('message', (event) => {
  const { type, data } = event.data || {};

  switch (type) {
    case 'INIT_DONE':
      console.log('Offscreen: Sandbox FaceMesh ready');
      sandboxReady = true;
      break;

    case 'INIT_ERROR':
      console.error('Offscreen: Sandbox init error:', data.error);
      break;

    case 'FACE_RESULTS':
      onFaceResults(data.landmarks);
      break;
  }
});

/**
 * 创建 sandbox iframe
 */
function createSandbox() {
  return new Promise((resolve) => {
    sandboxIframe = document.createElement('iframe');
    sandboxIframe.src = chrome.runtime.getURL('sandbox/sandbox.html');
    sandboxIframe.style.display = 'none';
    document.body.appendChild(sandboxIframe);

    const onReady = (event) => {
      if (event.data && event.data.type === 'INIT_DONE') {
        window.removeEventListener('message', onReady);
        resolve();
      }
    };
    window.addEventListener('message', onReady);

    // iframe 加载后初始化 FaceMesh
    sandboxIframe.onload = () => {
      const baseUrl = chrome.runtime.getURL('lib/mediapipe/');
      sandboxIframe.contentWindow.postMessage({
        type: 'INIT',
        data: { mediapipeBaseUrl: baseUrl }
      }, '*');
    };

    // 超时保底
    setTimeout(() => resolve(), 8000);
  });
}

/**
 * 向 sandbox 发送视频帧
 */
function sendFrameToSandbox() {
  if (!sandboxIframe || !sandboxReady) return;
  if (video.videoWidth === 0) return;

  const w = 320;
  const h = 240;
  if (captureCanvas.width !== w) captureCanvas.width = w;
  if (captureCanvas.height !== h) captureCanvas.height = h;

  captureCtx.drawImage(video, 0, 0, w, h);
  const imageData = captureCtx.getImageData(0, 0, w, h);

  sandboxIframe.contentWindow.postMessage({
    type: 'PROCESS_FRAME',
    data: {
      imageData: imageData.data.buffer,
      width: w,
      height: h
    }
  }, '*', [imageData.data.buffer]);
}

/**
 * 启动追踪
 */
async function startTracking(config) {
  if (isRunning) {
    stopTracking();
    await new Promise(r => setTimeout(r, 100));
  }

  try {
    headTracker = new HeadTracker(config);
    noseTrail = [];
    if (config.scrollDirection) {
      scrollDirection = config.scrollDirection;
    }
    if (config.turnAction) {
      turnAction = config.turnAction;
    }

    // 获取摄像头
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'user', width: 640, height: 480 }
    });
    video.srcObject = stream;
    await video.play();

    // 预览 canvas
    previewCanvas.width = 320;
    previewCanvas.height = 240;

    // 创建 sandbox 并初始化 FaceMesh
    await createSandbox();

    isRunning = true;

    // 帧处理循环
    let processing = false;
    frameLoopId = setInterval(() => {
      if (!isRunning || video.paused || video.readyState < 2) return;

      // 发送预览帧（按时间节流）
      const now = Date.now();
      if (now - lastPreviewTime >= PREVIEW_INTERVAL) {
        lastPreviewTime = now;
        sendPreviewFrame(null);
      }

      // 发送帧给 sandbox 处理
      if (!processing && sandboxReady) {
        processing = true;
        sendFrameToSandbox();
        // 简单延迟重置，避免堆积
        setTimeout(() => { processing = false; }, 50);
      }
    }, 33);

    notifyPopup('STATUS_UPDATE', { status: 'calibrating' });
    return { success: true };

  } catch (error) {
    console.error('Error starting tracking:', error);
    return { success: false, error: error.message };
  }
}

/**
 * 停止追踪
 */
function stopTracking() {
  isRunning = false;
  sandboxReady = false;

  if (frameLoopId) { clearInterval(frameLoopId); frameLoopId = null; }
  if (stream) { stream.getTracks().forEach(t => t.stop()); stream = null; }
  if (video.srcObject) { video.srcObject = null; }
  if (sandboxIframe) {
    sandboxIframe.contentWindow.postMessage({ type: 'DESTROY' }, '*');
    sandboxIframe.remove();
    sandboxIframe = null;
  }

  headTracker = null;
  noseTrail = [];
  notifyPopup('STATUS_UPDATE', { status: 'stopped' });
}

/**
 * 处理来自 sandbox 的面部识别结果
 */
function onFaceResults(landmarks) {
  if (!isRunning || !headTracker) return;

  if (!landmarks) {
    notifyPopup('STATUS_UPDATE', { status: 'no_face' });
    return;
  }

  // 记录鼻尖轨迹
  const nose = landmarks[1];
  noseTrail.push({ x: nose.x, y: nose.y });
  if (noseTrail.length > TRAIL_MAX) noseTrail.shift();

  // 发送带特征点的预览帧
  lastPreviewTime = Date.now();
  sendPreviewFrame(landmarks);

  // 校准阶段
  if (!headTracker.isCalibrated) {
    const pose = headTracker.calculatePose(landmarks);
    const calibrated = headTracker.calibrate(pose);
    if (calibrated) {
      notifyPopup('STATUS_UPDATE', { status: 'active' });
    } else {
      const progress = Math.round(headTracker.calibrationFrames.length / 30 * 100);
      notifyPopup('CALIBRATION_PROGRESS', { progress });
    }
    return;
  }

  // 正常追踪
  const result = headTracker.processFrame(landmarks);

  if (result.relativePose) {
    notifyPopup('POSE_UPDATE', {
      pitch: result.relativePose.pitch,
      yaw: result.relativePose.yaw
    });
  }

  notifyPopup('STATE_UPDATE', {
    state: result.state,
    pendingAction: result.pendingAction,
    confirmProgress: result.confirmProgress
  });

  if (result.action) {
    handleAction(result.action);
  }
}

/**
 * 生成并发送预览帧
 */
function sendPreviewFrame(landmarks) {
  if (video.videoWidth === 0) return;

  const pw = previewCanvas.width;
  const ph = previewCanvas.height;
  const pctx = previewCanvas.getContext('2d');

  pctx.drawImage(video, 0, 0, pw, ph);

  // 鼻尖运动轨迹
  if (noseTrail.length > 1) {
    pctx.lineCap = 'round';
    pctx.lineJoin = 'round';
    for (let i = 1; i < noseTrail.length; i++) {
      const alpha = i / noseTrail.length;
      const hue = 200 + alpha * 60;
      pctx.strokeStyle = `hsla(${hue}, 80%, 60%, ${alpha * 0.8})`;
      pctx.lineWidth = 1 + alpha * 2;
      pctx.beginPath();
      pctx.moveTo(noseTrail[i - 1].x * pw, noseTrail[i - 1].y * ph);
      pctx.lineTo(noseTrail[i].x * pw, noseTrail[i].y * ph);
      pctx.stroke();
    }
    // 最新点亮点
    const last = noseTrail[noseTrail.length - 1];
    pctx.fillStyle = '#00ffcc';
    pctx.shadowColor = '#00ffcc';
    pctx.shadowBlur = 8;
    pctx.beginPath();
    pctx.arc(last.x * pw, last.y * ph, 4, 0, Math.PI * 2);
    pctx.fill();
    pctx.shadowBlur = 0;
  }

  // 面部特征点和轮廓
  if (landmarks) {
    pctx.fillStyle = '#4a90d9';
    [1, 199, 33, 263, 61, 291].forEach(idx => {
      const p = landmarks[idx];
      pctx.beginPath();
      pctx.arc(p.x * pw, p.y * ph, 3, 0, Math.PI * 2);
      pctx.fill();
    });

    pctx.strokeStyle = 'rgba(74, 144, 217, 0.4)';
    pctx.lineWidth = 1.5;
    const oval = [10,338,297,332,284,251,389,356,454,323,361,288,
      397,365,379,378,400,377,152,148,176,149,150,136,
      172,58,132,93,234,127,162,21,54,103,67,109,10];
    pctx.beginPath();
    oval.forEach((idx, i) => {
      const p = landmarks[idx];
      i === 0 ? pctx.moveTo(p.x * pw, p.y * ph) : pctx.lineTo(p.x * pw, p.y * ph);
    });
    pctx.stroke();
  }

  // 校准进度条
  if (headTracker && !headTracker.isCalibrated) {
    const progress = headTracker.calibrationFrames.length / 30;
    const barW = pw * 0.6;
    const barH = 8;
    const barX = (pw - barW) / 2;
    const barY = ph - 24;

    pctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    pctx.fillRect(barX - 2, barY - 2, barW + 4, barH + 4);

    const fillW = Math.max(barW * progress, 1);
    const grad = pctx.createLinearGradient(barX, 0, barX + fillW, 0);
    grad.addColorStop(0, '#4a90d9');
    grad.addColorStop(1, '#64f0c8');
    pctx.fillStyle = grad;
    pctx.fillRect(barX, barY, fillW, barH);

    pctx.fillStyle = '#fff';
    pctx.font = '11px sans-serif';
    pctx.textAlign = 'center';
    pctx.fillText(`${Math.round(progress * 100)}%`, pw / 2, barY - 4);
  }

  try {
    const dataUrl = previewCanvas.toDataURL('image/jpeg', 0.55);
    notifyPopup('FRAME_UPDATE', { frame: dataUrl });
  } catch (e) { /* 忽略 */ }
}

/**
 * 处理检测到的动作
 */
function handleAction(action) {
  const invert = scrollDirection === 'natural';

  switch (action) {
    case 'NOD_DOWN': sendScrollCommand(invert ? 'up' : 'down', 300); break;
    case 'NOD_UP':   sendScrollCommand(invert ? 'down' : 'up', 300); break;
    case 'TURN_LEFT':
      if (turnAction === 'switchTab') {
        sendTabCommand('prev');
      } else {
        sendNavigateCommand('back');
      }
      break;
    case 'TURN_RIGHT':
      if (turnAction === 'switchTab') {
        sendTabCommand('next');
      } else {
        sendNavigateCommand('forward');
      }
      break;
  }
  notifyPopup('ACTION_TRIGGERED', { action });
}

function sendScrollCommand(direction, amount) {
  chrome.runtime.sendMessage({
    type: 'SCROLL_COMMAND', direction, amount, behavior: 'smooth'
  }).catch(() => {});
}

function sendNavigateCommand(direction) {
  chrome.runtime.sendMessage({
    type: 'NAVIGATE_COMMAND', direction
  }).catch(() => {});
}

function sendTabCommand(direction) {
  chrome.runtime.sendMessage({
    type: 'TAB_COMMAND', direction
  }).catch(() => {});
}

/**
 * 通知 popup
 */
function notifyPopup(type, data = {}) {
  const msg = Object.assign({}, data, { type, target: 'popup' });
  chrome.runtime.sendMessage(msg).catch(() => {});
}
