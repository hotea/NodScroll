/**
 * Popup Script - Simplified version using offscreen document
 * Main logic for UI control, communicates with offscreen for tracking
 */

// DOM Elements
const overlay = document.getElementById('overlay');
const cameraPlaceholder = document.getElementById('cameraPlaceholder');
const permissionOverlay = document.getElementById('permissionOverlay');
const statusBadge = document.getElementById('statusBadge');
const pitchBar = document.getElementById('pitchBar');
const yawBar = document.getElementById('yawBar');
const pitchValue = document.getElementById('pitchValue');
const yawValue = document.getElementById('yawValue');
const actionIndicator = document.getElementById('actionIndicator');
const actionIcon = document.getElementById('actionIcon');
const actionText = document.getElementById('actionText');
const toggleBtn = document.getElementById('toggleBtn');
const calibrateBtn = document.getElementById('calibrateBtn');
const retryBtn = document.getElementById('retryBtn');
const warningMessage = document.getElementById('warningMessage');

// Settings elements
const languageSelect = document.getElementById('languageSelect');
const pitchThresholdInput = document.getElementById('pitchThreshold');
const yawThresholdInput = document.getElementById('yawThreshold');
const scrollAmountInput = document.getElementById('scrollAmount');
const cooldownInput = document.getElementById('cooldown');
const scrollDirectionSelect = document.getElementById('scrollDirection');
const turnActionSelect = document.getElementById('turnAction');
const pitchThresholdValue = document.getElementById('pitchThresholdValue');
const yawThresholdValue = document.getElementById('yawThresholdValue');
const scrollAmountValue = document.getElementById('scrollAmountValue');
const cooldownValue = document.getElementById('cooldownValue');

// State
let isRunning = false;
let ctx = null;

// Action icons and text keys
const ACTION_CONFIG = {
  NOD_DOWN: { icon: '⬇️', textKey: 'actionScrollDown' },
  NOD_UP: { icon: '⬆️', textKey: 'actionScrollUp' },
  TURN_LEFT: { icon: '⬅️', textKey: 'actionGoBack' },
  TURN_RIGHT: { icon: '➡️', textKey: 'actionGoForward' }
};

/**
 * Initialize the application
 */
async function init() {
  // Initialize i18n
  await window.i18n.init();
  languageSelect.value = window.i18n.getLanguage();
  applyTranslations();

  // Set up canvas context
  ctx = overlay.getContext('2d');

  // Set up event listeners
  setupEventListeners();

  // Load saved settings
  loadSettings();

  // Listen for messages from offscreen
  chrome.runtime.onMessage.addListener(handleOffscreenMessage);

  // Check if offscreen is already running
  await checkOffscreenStatus();

  updateStatus('statusReady', '');
}

/**
 * Check if offscreen document is running
 */
async function checkOffscreenStatus() {
  try {
    const response = await chrome.runtime.sendMessage({ type: 'GET_STATUS' });
    if (response && response.success && response.isRunning) {
      console.log('Offscreen is already running');
      isRunning = true;
      toggleBtn.textContent = window.i18n.t('btnStop');
      toggleBtn.classList.add('active');
      calibrateBtn.disabled = false;
      cameraPlaceholder.classList.add('hidden');

      if (response.isCalibrated) {
        updateStatus('statusActive', 'active');
      } else {
        updateStatus('statusCalibrating', 'calibrating');
      }
    }
  } catch (error) {
    // Offscreen not running, ignore
    console.log('Offscreen not running');
  }
}

/**
 * Apply translations
 */
function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = window.i18n.t(key);
  });

  if (!isRunning) {
    toggleBtn.textContent = window.i18n.t('btnStart');
  } else {
    toggleBtn.textContent = window.i18n.t('btnStop');
  }

  updateGestureHelp();
}

/**
 * 根据当前设置更新手势说明
 */
function updateGestureHelp() {
  const isNatural = scrollDirectionSelect.value === 'natural';
  const isSwitchTab = turnActionSelect.value === 'switchTab';

  document.getElementById('helpNodDownAction').textContent =
    window.i18n.t(isNatural ? 'helpScrollUp' : 'helpScrollDown');
  document.getElementById('helpNodUpAction').textContent =
    window.i18n.t(isNatural ? 'helpScrollDown' : 'helpScrollUp');
  document.getElementById('helpTurnLeftAction').textContent =
    window.i18n.t(isSwitchTab ? 'helpPrevTab' : 'helpGoBack');
  document.getElementById('helpTurnRightAction').textContent =
    window.i18n.t(isSwitchTab ? 'helpNextTab' : 'helpGoForward');
}

/**
 * Set up event listeners
 */
function setupEventListeners() {
  if (!toggleBtn) {
    console.error('toggleBtn not found!');
    return;
  }

  toggleBtn.addEventListener('click', toggleTracking);
  calibrateBtn.addEventListener('click', recalibrate);
  retryBtn.addEventListener('click', () => {
    hidePermissionError();
    startTracking();
  });

  // Language selector
  languageSelect.addEventListener('change', (e) => {
    window.i18n.setLanguage(e.target.value);
    applyTranslations();
  });

  // Settings listeners
  pitchThresholdInput.addEventListener('input', (e) => {
    const value = e.target.value;
    pitchThresholdValue.textContent = `${value}°`;
    updateOffscreenConfig();
    saveSettings();
  });

  yawThresholdInput.addEventListener('input', (e) => {
    const value = e.target.value;
    yawThresholdValue.textContent = `${value}°`;
    updateOffscreenConfig();
    saveSettings();
  });

  scrollAmountInput.addEventListener('input', (e) => {
    scrollAmountValue.textContent = `${e.target.value}px`;
    updateOffscreenConfig();
    saveSettings();
  });

  cooldownInput.addEventListener('input', (e) => {
    const value = e.target.value;
    cooldownValue.textContent = `${value}ms`;
    updateOffscreenConfig();
    saveSettings();
  });

  scrollDirectionSelect.addEventListener('change', () => {
    updateOffscreenConfig();
    saveSettings();
    updateGestureHelp();
  });

  turnActionSelect.addEventListener('change', () => {
    updateOffscreenConfig();
    saveSettings();
    updateGestureHelp();
  });
}

/**
 * Toggle tracking on/off
 */
async function toggleTracking() {
  if (isRunning) {
    await stopTracking();
  } else {
    await startTracking();
  }
}

/**
 * Start tracking
 */
async function startTracking() {
  try {
    console.log('startTracking: Beginning...');
    updateStatus('statusStarting', '');
    hidePermissionError();

    const config = {
      pitchThreshold: parseInt(pitchThresholdInput.value),
      yawThreshold: parseInt(yawThresholdInput.value),
      cooldownMs: parseInt(cooldownInput.value),
      scrollAmount: parseInt(scrollAmountInput.value),
      scrollDirection: scrollDirectionSelect.value,
      turnAction: turnActionSelect.value
    };

    console.log('startTracking: Sending START_TRACKING message with config:', config);

    const response = await chrome.runtime.sendMessage({
      type: 'START_TRACKING',
      config: config
    });

    console.log('startTracking: Got response:', response);

    if (!response.success) {
      if (response.error.includes('Permission') || response.error.includes('NotAllowedError')) {
        // Open auth page
        chrome.tabs.create({
          url: chrome.runtime.getURL('auth/auth.html?auto=true'),
          active: true
        });
        updateStatus('cameraPermissionDismissed', 'error');
      } else {
        updateStatus('statusError', 'error');
        console.error('Start tracking error:', response.error);
      }
      return;
    }

    isRunning = true;
    toggleBtn.textContent = window.i18n.t('btnStop');
    toggleBtn.classList.add('active');
    calibrateBtn.disabled = false;
    cameraPlaceholder.classList.add('hidden');

    updateStatus('statusCalibrating', 'calibrating');

  } catch (error) {
    console.error('Error starting tracking:', error);
    updateStatus('statusError', 'error');
  }
}

/**
 * Stop tracking
 */
async function stopTracking() {
  try {
    await chrome.runtime.sendMessage({ type: 'STOP_TRACKING' });

    isRunning = false;
    toggleBtn.textContent = window.i18n.t('btnStart');
    toggleBtn.classList.remove('active');
    calibrateBtn.disabled = true;
    cameraPlaceholder.classList.remove('hidden');
    hidePermissionError();

    // Clear overlay
    ctx.clearRect(0, 0, overlay.width, overlay.height);

    updateStatus('statusStopped', '');
    updatePoseDisplay(0, 0);
    updateActionIndicator('IDLE');

  } catch (error) {
    console.error('Error stopping tracking:', error);
  }
}

/**
 * Recalibrate
 */
async function recalibrate() {
  try {
    await chrome.runtime.sendMessage({ type: 'RECALIBRATE' });
    updateStatus('statusCalibrating', 'calibrating');
  } catch (error) {
    console.error('Error recalibrating:', error);
  }
}

/**
 * Update offscreen config
 */
async function updateOffscreenConfig() {
  if (!isRunning) return;

  const config = {
    pitchThreshold: parseInt(pitchThresholdInput.value),
    yawThreshold: parseInt(yawThresholdInput.value),
    cooldownMs: parseInt(cooldownInput.value),
    scrollAmount: parseInt(scrollAmountInput.value),
    scrollDirection: scrollDirectionSelect.value,
    turnAction: turnActionSelect.value
  };

  try {
    await chrome.runtime.sendMessage({
      type: 'UPDATE_CONFIG',
      config: config
    });
  } catch (error) {
    console.error('Error updating config:', error);
  }
}

/**
 * Handle messages from offscreen document
 */
function handleOffscreenMessage(message) {
  if (message.target !== 'popup') return;

  switch (message.type) {
    case 'STATUS_UPDATE':
      handleStatusUpdate(message);
      break;

    case 'CALIBRATION_PROGRESS':
      updateStatusWithParams('statusCalibratingProgress', 'calibrating', {
        progress: message.progress
      });
      break;

    case 'POSE_UPDATE':
      updatePoseDisplay(message.pitch, message.yaw);
      break;

    case 'STATE_UPDATE':
      updateActionIndicator(message.state, message.pendingAction, message.confirmProgress);
      break;

    case 'ACTION_TRIGGERED':
      showActionFeedback(message.action);
      break;

    case 'FRAME_UPDATE':
      updateVideoPreview(message.frame);
      break;
  }
}

/**
 * Handle status update
 */
function handleStatusUpdate(message) {
  const statusMap = {
    'calibrating': ['statusCalibrating', 'calibrating'],
    'active': ['statusActive', 'active'],
    'stopped': ['statusStopped', ''],
    'no_face': ['statusNoFace', 'error']
  };

  const [statusKey, className] = statusMap[message.status] || ['statusError', 'error'];
  updateStatus(statusKey, className);
}

/**
 * Update video preview from frame data
 */
function updateVideoPreview(dataUrl) {
  if (!dataUrl || !ctx) return;

  const img = new Image();
  img.onload = () => {
    const container = document.querySelector('.camera-container');
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    const aspectRatio = img.width / img.height;

    let canvasWidth, canvasHeight;
    if (aspectRatio > containerWidth / containerHeight) {
      canvasWidth = containerWidth;
      canvasHeight = containerWidth / aspectRatio;
    } else {
      canvasHeight = containerHeight;
      canvasWidth = containerHeight * aspectRatio;
    }

    overlay.width = canvasWidth;
    overlay.height = canvasHeight;
    ctx.clearRect(0, 0, overlay.width, overlay.height);
    ctx.drawImage(img, 0, 0, overlay.width, overlay.height);
  };
  img.src = dataUrl;
}

/**
 * Show action feedback
 */
function showActionFeedback(action) {
  const config = ACTION_CONFIG[action];
  if (config) {
    actionIndicator.classList.add('triggered');
    actionIcon.textContent = config.icon;
    actionText.textContent = window.i18n.t(config.textKey);
    setTimeout(() => {
      actionIndicator.classList.remove('triggered');
    }, 300);
  }
}

/**
 * Show/hide permission error overlay
 */
function showPermissionError() {
  permissionOverlay.classList.remove('hidden');
  cameraPlaceholder.classList.add('hidden');
}

function hidePermissionError() {
  permissionOverlay.classList.add('hidden');
}

/**
 * Update status badge
 */
function updateStatus(textKey, className) {
  statusBadge.textContent = window.i18n.t(textKey);
  statusBadge.className = 'status-badge';
  if (className) {
    statusBadge.classList.add(className);
  }
}

function updateStatusWithParams(textKey, className, params) {
  statusBadge.textContent = window.i18n.t(textKey, params);
  statusBadge.className = 'status-badge';
  if (className) {
    statusBadge.classList.add(className);
  }
}

/**
 * Update pose display bars
 */
function updatePoseDisplay(pitch, yaw) {
  // Update pitch bar
  const pitchPercent = Math.min(Math.abs(pitch) / 30 * 50, 50);
  pitchBar.style.width = `${pitchPercent}%`;
  pitchBar.className = 'pose-bar pitch-bar ' + (pitch >= 0 ? 'positive' : 'negative');
  if (pitch < 0) {
    pitchBar.style.left = 'auto';
    pitchBar.style.right = '50%';
  } else {
    pitchBar.style.left = '50%';
    pitchBar.style.right = 'auto';
  }
  pitchValue.textContent = `${pitch.toFixed(1)}°`;

  // Update yaw bar
  const yawPercent = Math.min(Math.abs(yaw) / 40 * 50, 50);
  yawBar.style.width = `${yawPercent}%`;
  yawBar.className = 'pose-bar yaw-bar ' + (yaw >= 0 ? 'positive' : 'negative');
  if (yaw < 0) {
    yawBar.style.left = 'auto';
    yawBar.style.right = '50%';
  } else {
    yawBar.style.left = '50%';
    yawBar.style.right = 'auto';
  }
  yawValue.textContent = `${yaw.toFixed(1)}°`;
}

/**
 * Update action indicator
 */
function updateActionIndicator(state, pendingAction, confirmProgress) {
  actionIndicator.className = 'action-indicator';

  switch (state) {
    case 'IDLE':
      actionIcon.textContent = '👀';
      actionText.textContent = window.i18n.t('actionReady');
      break;
    case 'DETECTING':
      actionIndicator.classList.add('detecting');
      if (pendingAction && ACTION_CONFIG[pendingAction]) {
        actionIcon.textContent = ACTION_CONFIG[pendingAction].icon;
        actionText.textContent = window.i18n.t('actionDetecting', {
          progress: Math.round((confirmProgress || 0) * 100)
        });
      }
      break;
    case 'COOLDOWN':
      actionIndicator.classList.add('cooldown');
      actionText.textContent = window.i18n.t('actionCooldown');
      break;
    case 'CALIBRATING':
      actionIcon.textContent = '🎯';
      actionText.textContent = window.i18n.t('actionKeepStill');
      break;
  }
}

/**
 * Save/load settings
 */
function saveSettings() {
  const settings = {
    pitchThreshold: pitchThresholdInput.value,
    yawThreshold: yawThresholdInput.value,
    scrollAmount: scrollAmountInput.value,
    cooldown: cooldownInput.value,
    scrollDirection: scrollDirectionSelect.value,
    turnAction: turnActionSelect.value
  };
  chrome.storage.local.set({ nodScrollSettings: settings });
}

function loadSettings() {
  chrome.storage.local.get(['nodScrollSettings'], (result) => {
    if (result.nodScrollSettings) {
      const settings = result.nodScrollSettings;

      pitchThresholdInput.value = settings.pitchThreshold;
      pitchThresholdValue.textContent = `${settings.pitchThreshold}°`;

      yawThresholdInput.value = settings.yawThreshold;
      yawThresholdValue.textContent = `${settings.yawThreshold}°`;

      scrollAmountInput.value = settings.scrollAmount;
      scrollAmountValue.textContent = `${settings.scrollAmount}px`;

      cooldownInput.value = settings.cooldown;
      cooldownValue.textContent = `${settings.cooldown}ms`;

      if (settings.scrollDirection) {
        scrollDirectionSelect.value = settings.scrollDirection;
      }
      if (settings.turnAction) {
        turnActionSelect.value = settings.turnAction;
      }
      updateGestureHelp();
    }
  });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init);
