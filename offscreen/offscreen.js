/**
 * Offscreen Document
 * 负责摄像头访问和视频预览
 * FaceMesh 在 sandbox iframe 中运行（绕过 CSP 限制）
 */

const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const canvasCtx = canvas.getContext('2d', { willReadFrequently: true });
const previewCanvas = document.createElement('canvas');
const previewCtx = previewCanvas.getContext('2d', { willReadFrequently: true });

let isRunning = false;
let isPaused = false; // 浏览器后台时暂停
let headTracker = null;
let stream = null;
let frameLoopId = null;
let sandboxReady = false;
let sandboxIframe = null;

// 帧捕获用的临时 canvas
const captureCanvas = document.createElement('canvas');
captureCanvas.width = 320;
captureCanvas.height = 240;
let captureCtx = captureCanvas.getContext('2d', { willReadFrequently: true });

// 鼻尖运动轨迹
const TRAIL_MAX = 60; // 增加轨迹长度（从40增加到60）
let noseTrail = [];

// 保存上一次的 landmarks，避免关键点闪烁
let lastLandmarks = null;

// 预览发送控制
let lastPreviewTime = 0;
const PREVIEW_INTERVAL = 50; // ~20fps（更流畅）

// Blob URL 管理
let lastBlobUrl = null;

console.log('Offscreen document loaded');

let scrollDirection = 'natural'; // 'classic' 或 'natural'
let turnAction = 'switchTab'; // 'switchTab' 或 'navigate'
let highQualityMode = false; // 高质量模式：减少叠加层，优先视频清晰度（默认关闭以显示轨迹）

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

    case 'PAUSE_TRACKING':
      if (isRunning && !isPaused) {
        isPaused = true;
        notifyPopup('STATUS_UPDATE', { status: 'paused' });
      }
      sendResponse({ success: true });
      return true;

    case 'RESUME_TRACKING':
      if (isRunning && isPaused) {
        isPaused = false;
        const status = headTracker && headTracker.isCalibrated ? 'active' : 'calibrating';
        notifyPopup('STATUS_UPDATE', { status });
      }
      sendResponse({ success: true });
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
  if (captureCanvas.width !== w || captureCanvas.height !== h) {
    captureCanvas.width = w;
    captureCanvas.height = h;
    // 重设尺寸会重置上下文，需要重新获取
    captureCtx = captureCanvas.getContext('2d', { willReadFrequently: true });
  }

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

    // 尝试恢复上次的校准数据
    let calibrationRestored = false;
    try {
      const stored = await chrome.runtime.sendMessage({ type: 'LOAD_CALIBRATION' });
      if (stored && stored.data) {
        calibrationRestored = headTracker.restoreCalibration(stored.data);
      }
    } catch (e) { /* 忽略 */ }

    // 获取摄像头 - 请求最高清晰度
    stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'user',
        width: { ideal: 1920, min: 1280 },
        height: { ideal: 1080, min: 720 },
        frameRate: { ideal: 30, min: 24 },
        aspectRatio: { ideal: 16/9 }
      }
    });
    video.srcObject = stream;
    await video.play();

    // 预览 canvas - 使用视频的实际分辨率（避免缩放模糊）
    // 等待一帧确保 videoWidth/videoHeight 已设置
    await new Promise(resolve => setTimeout(resolve, 100));

    const actualWidth = video.videoWidth || 1280;
    const actualHeight = video.videoHeight || 720;

    previewCanvas.width = actualWidth;
    previewCanvas.height = actualHeight;

    // 禁用图像平滑以获得更清晰的像素（避免插值模糊）
    previewCtx.imageSmoothingEnabled = false;

    // 记录实际获得的视频分辨率
    console.log('✅ Video resolution:', actualWidth, 'x', actualHeight);
    console.log('✅ Preview canvas:', previewCanvas.width, 'x', previewCanvas.height);

    // 创建 sandbox 并初始化 FaceMesh
    await createSandbox();

    isRunning = true;

    // 帧处理循环
    let processing = false;
    frameLoopId = setInterval(() => {
      if (!isRunning || isPaused || video.paused || video.readyState < 2) return;

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

    notifyPopup('STATUS_UPDATE', { status: calibrationRestored ? 'active' : 'calibrating' });
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
  console.log('Offscreen: stopTracking called, stream:', !!stream, 'tracks:', stream ? stream.getTracks().length : 0);
  isRunning = false;
  isPaused = false;
  sandboxReady = false;

  if (frameLoopId) { clearInterval(frameLoopId); frameLoopId = null; }

  // 先暂停 video，断开 srcObject，再逐个停止 track
  if (video) {
    video.pause();
    video.srcObject = null;
  }
  if (stream) {
    const tracks = stream.getTracks();
    tracks.forEach(t => {
      console.log('Offscreen: stopping track', t.kind, t.label, 'readyState:', t.readyState);
      t.stop();
    });
    stream = null;
  }

  if (sandboxIframe) {
    sandboxIframe.contentWindow.postMessage({ type: 'DESTROY' }, '*');
    sandboxIframe.remove();
    sandboxIframe = null;
  }

  headTracker = null;
  noseTrail = [];
  console.log('Offscreen: stopTracking complete');
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

  // 保存 landmarks，防止关键点闪烁
  lastLandmarks = landmarks;

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
      // 保存校准数据，下次启动时跳过校准
      const calData = headTracker.exportCalibration();
      if (calData) {
        chrome.runtime.sendMessage({ type: 'SAVE_CALIBRATION', data: calData }).catch(() => {});
      }
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

  // 确保每次绘制都禁用图像平滑（防止被重置）
  previewCtx.imageSmoothingEnabled = false;

  // 直接绘制视频到canvas（1:1像素映射，无缩放）
  previewCtx.drawImage(video, 0, 0, pw, ph);

  // 使用上一次的 landmarks 作为后备，避免关键点闪烁
  const displayLandmarks = landmarks || lastLandmarks;

  // 高质量模式：减少叠加层，保持视频原始清晰度
  if (!highQualityMode) {
    // 鼻尖运动轨迹（连续线条，从旧到新渐变）
    if (noseTrail.length > 1) {
      previewCtx.lineCap = 'round';
      previewCtx.lineJoin = 'round';

      // 绘制连续的轨迹路径，使用渐变色和更粗的线条
      for (let i = 1; i < noseTrail.length; i++) {
        const progress = i / noseTrail.length;
        const alpha = 0.4 + progress * 0.6; // 透明度从 0.4 到 1.0
        const hue = 180 + progress * 80; // 色相从青色到绿色
        const width = 4 + progress * 6; // 线宽从 4 到 10（更粗）

        previewCtx.strokeStyle = `hsla(${hue}, 90%, 55%, ${alpha})`;
        previewCtx.lineWidth = width;
        previewCtx.beginPath();
        previewCtx.moveTo(noseTrail[i - 1].x * pw, noseTrail[i - 1].y * ph);
        previewCtx.lineTo(noseTrail[i].x * pw, noseTrail[i].y * ph);
        previewCtx.stroke();
      }

      // 最新点：更大更亮的指示器
      const last = noseTrail[noseTrail.length - 1];

      // 最外圈光晕（更大）
      previewCtx.fillStyle = 'rgba(0, 255, 204, 0.2)';
      previewCtx.beginPath();
      previewCtx.arc(last.x * pw, last.y * ph, 15, 0, Math.PI * 2);
      previewCtx.fill();

      // 中圈光晕
      previewCtx.fillStyle = 'rgba(0, 255, 204, 0.4)';
      previewCtx.beginPath();
      previewCtx.arc(last.x * pw, last.y * ph, 10, 0, Math.PI * 2);
      previewCtx.fill();

      // 内圈亮点
      previewCtx.fillStyle = '#00ffcc';
      previewCtx.shadowColor = '#00ffcc';
      previewCtx.shadowBlur = 15;
      previewCtx.beginPath();
      previewCtx.arc(last.x * pw, last.y * ph, 6, 0, Math.PI * 2);
      previewCtx.fill();
      previewCtx.shadowBlur = 0;
    }

    // 面部特征点和轮廓（仅在非高质量模式下绘制）
    if (displayLandmarks) {
      // 关键特征点：鼻尖、下巴、眼睛、嘴角
      const keyPoints = [
        { idx: 1, label: 'Nose', color: '#ff6b6b' },      // 鼻尖 - 红色
        { idx: 199, label: 'Chin', color: '#4ecdc4' },    // 下巴 - 青色
        { idx: 33, label: 'L Eye', color: '#95e1d3' },    // 左眼外角 - 浅青
        { idx: 263, label: 'R Eye', color: '#95e1d3' },   // 右眼外角 - 浅青
        { idx: 61, label: 'L Mouth', color: '#f38181' },  // 左嘴角 - 粉红
        { idx: 291, label: 'R Mouth', color: '#f38181' }  // 右嘴角 - 粉红
      ];

      keyPoints.forEach(({ idx, color }) => {
        const p = displayLandmarks[idx];

        // 最外圈光晕
        previewCtx.fillStyle = color + '30'; // 30% 透明度
        previewCtx.beginPath();
        previewCtx.arc(p.x * pw, p.y * ph, 12, 0, Math.PI * 2);
        previewCtx.fill();

        // 中圈光晕
        previewCtx.fillStyle = color + '60'; // 60% 透明度
        previewCtx.beginPath();
        previewCtx.arc(p.x * pw, p.y * ph, 8, 0, Math.PI * 2);
        previewCtx.fill();

        // 内圈（实心点）- 更大更清晰
        previewCtx.fillStyle = color;
        previewCtx.shadowColor = color;
        previewCtx.shadowBlur = 8;
        previewCtx.beginPath();
        previewCtx.arc(p.x * pw, p.y * ph, 5, 0, Math.PI * 2);
        previewCtx.fill();
        previewCtx.shadowBlur = 0;
      });

      // 面部轮廓线（更平滑和清晰）
      previewCtx.strokeStyle = 'rgba(100, 200, 255, 0.6)'; // 更亮的蓝色
      previewCtx.lineWidth = 2;
      previewCtx.lineCap = 'round';
      previewCtx.lineJoin = 'round';

      const oval = [10,338,297,332,284,251,389,356,454,323,361,288,
        397,365,379,378,400,377,152,148,176,149,150,136,
        172,58,132,93,234,127,162,21,54,103,67,109,10];

      previewCtx.beginPath();
      oval.forEach((idx, i) => {
        const p = displayLandmarks[idx];
        i === 0 ? previewCtx.moveTo(p.x * pw, p.y * ph) : previewCtx.lineTo(p.x * pw, p.y * ph);
      });
      previewCtx.stroke();
    }
  } // 结束高质量模式条件

  // 校准进度条（始终显示，用户需要知道校准状态）
  if (headTracker && !headTracker.isCalibrated) {
    const progress = headTracker.calibrationFrames.length / 30;
    const barW = pw * 0.6;
    const barH = 8;
    const barX = (pw - barW) / 2;
    const barY = ph - 24;

    previewCtx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    previewCtx.fillRect(barX - 2, barY - 2, barW + 4, barH + 4);

    const fillW = Math.max(barW * progress, 1);
    const grad = previewCtx.createLinearGradient(barX, 0, barX + fillW, 0);
    grad.addColorStop(0, '#4a90d9');
    grad.addColorStop(1, '#64f0c8');
    previewCtx.fillStyle = grad;
    previewCtx.fillRect(barX, barY, fillW, barH);

    previewCtx.fillStyle = '#fff';
    previewCtx.font = '11px sans-serif';
    previewCtx.textAlign = 'center';
    previewCtx.fillText(`${Math.round(progress * 100)}%`, pw / 2, barY - 4);
  }

  // 使用 Blob URL 替代 base64，性能更好
  // 使用 WebP 格式（更好的质量/大小平衡）或 PNG（无损）
  try {
    // 优先尝试 WebP（质量更好，文件更小）
    previewCanvas.toBlob((blob) => {
      if (blob) {
        // 清理旧的 Blob URL
        if (lastBlobUrl) {
          URL.revokeObjectURL(lastBlobUrl);
        }
        // 创建新的 Blob URL
        lastBlobUrl = URL.createObjectURL(blob);
        notifyPopup('FRAME_UPDATE', { frame: lastBlobUrl });
      }
    }, 'image/webp', 0.98); // WebP 高质量（接近无损）
  } catch (e) {
    // 降级到 PNG（无损但文件更大）
    try {
      previewCanvas.toBlob((blob) => {
        if (blob) {
          if (lastBlobUrl) {
            URL.revokeObjectURL(lastBlobUrl);
          }
          lastBlobUrl = URL.createObjectURL(blob);
          notifyPopup('FRAME_UPDATE', { frame: lastBlobUrl });
        }
      }, 'image/png');
    } catch (e2) { /* 忽略 */ }
  }
}

/**
 * 处理检测到的动作
 */
function handleAction(action) {
  const invert = scrollDirection === 'natural';

  switch (action) {
    case 'NOD_DOWN': sendScrollCommand(invert ? 'up' : 'down', 300); break;
    case 'NOD_UP':   sendScrollCommand(invert ? 'down' : 'up', 300); break;
    // 注意：摄像头画面在 popup 中是镜像的，所以左右需要交换
    case 'TURN_LEFT':
      if (turnAction === 'none') break;
      if (turnAction === 'switchTab') {
        sendTabCommand('next');
      } else {
        sendNavigateCommand('forward');
      }
      break;
    case 'TURN_RIGHT':
      if (turnAction === 'none') break;
      if (turnAction === 'switchTab') {
        sendTabCommand('prev');
      } else {
        sendNavigateCommand('back');
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
