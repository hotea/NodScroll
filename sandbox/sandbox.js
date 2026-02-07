/**
 * Sandbox 页面 - 运行 MediaPipe FaceMesh
 * sandbox 允许 unsafe-eval，解决 Manifest V3 CSP 限制
 * 通过 postMessage 与 offscreen document 通信
 */

let faceMesh = null;
const inputCanvas = document.getElementById('inputCanvas');
const inputCtx = inputCanvas.getContext('2d', { willReadFrequently: true });

// 监听来自 offscreen 的消息
window.addEventListener('message', async (event) => {
  const { type, data } = event.data;

  switch (type) {
    case 'INIT':
      await initFaceMesh(data.mediapipeBaseUrl);
      break;

    case 'PROCESS_FRAME':
      await processFrame(data.imageData, data.width, data.height);
      break;

    case 'DESTROY':
      faceMesh = null;
      break;
  }
});

/**
 * 初始化 FaceMesh
 */
async function initFaceMesh(baseUrl) {
  try {
    faceMesh = new FaceMesh({
      locateFile: (file) => baseUrl + file
    });

    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });

    faceMesh.onResults((results) => {
      // 将结果发回 offscreen
      let landmarks = null;
      if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
        // 转为普通数组（避免序列化问题）
        landmarks = results.multiFaceLandmarks[0].map(p => ({
          x: p.x, y: p.y, z: p.z
        }));
      }
      window.parent.postMessage({
        type: 'FACE_RESULTS',
        data: { landmarks }
      }, '*');
    });

    // 发送一个空帧来触发 WASM 加载
    inputCanvas.width = 2;
    inputCanvas.height = 2;
    await faceMesh.send({ image: inputCanvas });

    window.parent.postMessage({ type: 'INIT_DONE' }, '*');
    console.log('Sandbox: FaceMesh initialized');
  } catch (error) {
    console.error('Sandbox: FaceMesh init error:', error);
    window.parent.postMessage({
      type: 'INIT_ERROR',
      data: { error: error.message }
    }, '*');
  }
}

/**
 * 处理视频帧
 */
async function processFrame(imageData, width, height) {
  if (!faceMesh) return;

  try {
    // 将 ImageData 绘制到 canvas 上
    if (inputCanvas.width !== width || inputCanvas.height !== height) {
      inputCanvas.width = width;
      inputCanvas.height = height;
    }
    const imgData = new ImageData(
      new Uint8ClampedArray(imageData),
      width,
      height
    );
    inputCtx.putImageData(imgData, 0, 0);

    await faceMesh.send({ image: inputCanvas });
  } catch (error) {
    console.error('Sandbox: processFrame error:', error);
  }
}
