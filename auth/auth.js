/**
 * Camera Authorization Page
 * Handles camera permission in a stable page context
 */

const grantBtn = document.getElementById('grantBtn');
const status = document.getElementById('status');
const video = document.getElementById('video');
const title = document.getElementById('title');
const description = document.getElementById('description');

// i18n
const lang = navigator.language.toLowerCase().startsWith('zh') ? 'zh' : 'en';

const i18n = {
  en: {
    title: 'Camera Permission Required',
    description: 'NodScroll needs camera access to detect head gestures and control scrolling.',
    btnGrant: 'Grant Camera Access',
    btnGranting: 'Requesting...',
    statusSuccess: 'Success! Camera access granted. You can close this page now.',
    statusError: 'Permission denied. Please try again and click "Allow".',
    statusDismissed: 'Permission dismissed. Please try again and make sure to click "Allow".',
    stepsTitle: 'What happens next:',
    step1: 'Click the button above',
    step2: 'Your browser will ask for camera permission',
    step3: 'Click "Allow" in the permission dialog',
    step4: 'This page will close automatically',
    step5: 'You can then use NodScroll from the extension popup'
  },
  zh: {
    title: '需要摄像头权限',
    description: 'NodScroll 需要访问摄像头来检测头部动作并控制滚动。',
    btnGrant: '授予摄像头权限',
    btnGranting: '请求中...',
    statusSuccess: '成功！摄像头权限已授予。您现在可以关闭此页面了。',
    statusError: '权限被拒绝。请重试并点击"允许"。',
    statusDismissed: '权限请求被忽略。请重试并确保点击"允许"。',
    stepsTitle: '接下来会发生什么：',
    step1: '点击上方按钮',
    step2: '浏览器会请求摄像头权限',
    step3: '在权限对话框中点击"允许"',
    step4: '此页面将自动关闭',
    step5: '然后您就可以从扩展弹窗中使用 NodScroll 了'
  }
};

const t = (key) => i18n[lang][key] || i18n.en[key];

// Apply translations
title.textContent = t('title');
description.textContent = t('description');
grantBtn.textContent = t('btnGrant');
document.getElementById('stepsTitle').textContent = t('stepsTitle');
document.getElementById('step1').textContent = t('step1');
document.getElementById('step2').textContent = t('step2');
document.getElementById('step3').textContent = t('step3');
document.getElementById('step4').textContent = t('step4');
document.getElementById('step5').textContent = t('step5');

// Handle grant button click
grantBtn.addEventListener('click', async () => {
  grantBtn.disabled = true;
  grantBtn.textContent = t('btnGranting');
  status.className = 'status';
  status.style.display = 'none';

  try {
    // Request camera access
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: 640 },
        height: { ideal: 480 },
        facingMode: 'user'
      }
    });

    console.log('Camera access granted!');

    // Show video briefly to confirm
    video.srcObject = stream;
    video.style.display = 'block';
    video.style.width = '100%';
    video.style.maxWidth = '400px';
    video.style.borderRadius = '8px';
    video.style.marginTop = '20px';

    // Show success message
    status.textContent = t('statusSuccess');
    status.className = 'status success';

    // Store permission granted flag
    chrome.storage.local.set({ cameraPermissionGranted: true });

    // Close after a short delay
    setTimeout(() => {
      stream.getTracks().forEach(track => track.stop());
      window.close();
    }, 2000);

  } catch (error) {
    console.error('Camera permission error:', error);

    grantBtn.disabled = false;
    grantBtn.textContent = t('btnGrant');

    if (error.name === 'NotAllowedError') {
      if (error.message.includes('dismissed')) {
        status.textContent = t('statusDismissed');
      } else {
        status.textContent = t('statusError');
      }
    } else {
      status.textContent = `Error: ${error.message}`;
    }

    status.className = 'status error';
  }
});

// Auto-trigger if coming from popup
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('auto') === 'true') {
  // Wait a bit for page to fully load
  setTimeout(() => {
    grantBtn.click();
  }, 500);
}
