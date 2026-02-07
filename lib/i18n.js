/**
 * Internationalization (i18n) module
 * Supports English and Chinese
 */

const TRANSLATIONS = {
  en: {
    // Header
    appName: 'NodScroll',

    // Status
    statusInitializing: 'Initializing',
    statusReady: 'Ready',
    statusStarting: 'Starting...',
    statusCalibrating: 'Calibrating...',
    statusCalibratingProgress: 'Calibrating... {progress}%',
    statusActive: 'Active',
    statusStopped: 'Stopped',
    statusPaused: 'Paused',
    statusNoFace: 'No face detected',
    statusError: 'Error',

    // Camera
    cameraPreview: 'Camera preview',
    cameraPermissionTitle: 'Camera Permission Required',
    cameraPermissionDesc: 'The permission prompt may appear behind this popup window.',
    cameraPermissionHint: 'Look for a browser notification asking for camera access, then click "Allow". You may need to move this popup window to see it.',
    cameraPermissionDenied: 'Camera blocked. Please allow in settings.',
    cameraPermissionDismissed: 'Opening permission page...',
    cameraInUse: 'Camera is in use by another app',
    cameraNotFound: 'No camera found',
    cameraError: 'Camera error',

    // Pose
    pitch: 'Pitch',
    yaw: 'Yaw',

    // Actions
    actionReady: 'Ready',
    actionDetecting: 'Detecting... {progress}%',
    actionCooldown: 'Cooldown...',
    actionKeepStill: 'Keep still...',
    actionScrollDown: 'Scroll Down',
    actionScrollUp: 'Scroll Up',
    actionGoBack: 'Go Back',
    actionGoForward: 'Go Forward',

    // Buttons
    btnStart: 'Start',
    btnStop: 'Stop',
    btnCalibrate: 'Calibrate',
    btnRetry: 'Retry',

    // Settings
    settings: 'Settings',
    settingPitchThreshold: 'Pitch Threshold',
    settingYawThreshold: 'Yaw Threshold',
    settingScrollAmount: 'Scroll Amount',
    settingCooldown: 'Cooldown',
    settingLanguage: 'Language',
    settingScrollDirection: 'Scroll Direction',
    scrollDirectionNatural: 'Natural (Mac)',
    scrollDirectionClassic: 'Classic (Windows)',
    settingTurnAction: 'Turn Action',
    turnActionSwitchTab: 'Switch Tab',
    turnActionNavigate: 'Back/Forward',
    turnActionNone: 'None',
    settingBlurAction: 'On Lose Focus',
    blurActionPause: 'Pause',
    blurActionStop: 'Stop',

    // Help
    helpTitle: 'Gestures',
    helpNodDown: 'Nod down',
    helpNodUp: 'Nod up',
    helpTurnLeft: 'Turn left',
    helpTurnRight: 'Turn right',
    helpScrollDown: 'Scroll down',
    helpScrollUp: 'Scroll up',
    helpGoBack: 'Go back',
    helpGoForward: 'Go forward',
    helpPrevTab: 'Previous tab',
    helpNextTab: 'Next tab',
    helpNone: 'None',

    // Footer
    footerPrivacy: 'All processing is local. No data is uploaded.'
  },

  zh: {
    // Header
    appName: 'NodScroll',

    // Status
    statusInitializing: '初始化中',
    statusReady: '就绪',
    statusStarting: '启动中...',
    statusCalibrating: '校准中...',
    statusCalibratingProgress: '校准中... {progress}%',
    statusActive: '运行中',
    statusStopped: '已停止',
    statusPaused: '已暂停',
    statusNoFace: '未检测到人脸',
    statusError: '错误',

    // Camera
    cameraPreview: '摄像头预览',
    cameraPermissionTitle: '需要摄像头权限',
    cameraPermissionDesc: '权限请求窗口可能被遮挡在此弹窗后面。',
    cameraPermissionHint: '请查找浏览器的摄像头权限通知（可能在地址栏或屏幕其他位置），然后点击"允许"。您可能需要移动此弹窗才能看到。',
    cameraPermissionDenied: '摄像头已被禁止，请在设置中允许',
    cameraPermissionDismissed: '正在打开权限页面...',
    cameraInUse: '摄像头正被其他应用使用',
    cameraNotFound: '未找到摄像头',
    cameraError: '摄像头错误',

    // Pose
    pitch: '俯仰',
    yaw: '偏航',

    // Actions
    actionReady: '就绪',
    actionDetecting: '检测中... {progress}%',
    actionCooldown: '冷却中...',
    actionKeepStill: '请保持不动...',
    actionScrollDown: '向下滚动',
    actionScrollUp: '向上滚动',
    actionGoBack: '后退',
    actionGoForward: '前进',

    // Buttons
    btnStart: '开始',
    btnStop: '停止',
    btnCalibrate: '校准',
    btnRetry: '重试',

    // Settings
    settings: '设置',
    settingPitchThreshold: '俯仰阈值',
    settingYawThreshold: '偏航阈值',
    settingScrollAmount: '滚动距离',
    settingCooldown: '冷却时间',
    settingLanguage: '语言',
    settingScrollDirection: '滚动方向',
    scrollDirectionNatural: '自然（Mac 风格）',
    scrollDirectionClassic: '经典（Windows 风格）',
    settingTurnAction: '转头动作',
    turnActionSwitchTab: '切换标签页',
    turnActionNavigate: '前进/后退',
    turnActionNone: '无',
    settingBlurAction: '失去焦点时',
    blurActionPause: '暂停',
    blurActionStop: '停止',

    // Help
    helpTitle: '手势说明',
    helpNodDown: '低头',
    helpNodUp: '抬头',
    helpTurnLeft: '左转头',
    helpTurnRight: '右转头',
    helpScrollDown: '向下滚动',
    helpScrollUp: '向上滚动',
    helpGoBack: '后退',
    helpGoForward: '前进',
    helpPrevTab: '上一个标签页',
    helpNextTab: '下一个标签页',
    helpNone: '无',

    // Footer
    footerPrivacy: '所有处理均在本地完成，不会上传任何数据。'
  }
};

class I18n {
  constructor() {
    this.currentLang = 'en';
    this.listeners = [];
  }

  /**
   * Initialize with saved language or browser default
   */
  init() {
    return new Promise((resolve) => {
      chrome.storage.local.get(['nodScrollLang'], (result) => {
        if (result.nodScrollLang) {
          this.currentLang = result.nodScrollLang;
        } else {
          // Detect browser language
          const browserLang = navigator.language.toLowerCase();
          if (browserLang.startsWith('zh')) {
            this.currentLang = 'zh';
          } else {
            this.currentLang = 'en';
          }
        }
        resolve(this.currentLang);
      });
    });
  }

  /**
   * Get translation for key
   */
  t(key, params = {}) {
    const translations = TRANSLATIONS[this.currentLang] || TRANSLATIONS.en;
    let text = translations[key] || TRANSLATIONS.en[key] || key;

    // Replace parameters
    Object.keys(params).forEach(param => {
      text = text.replace(`{${param}}`, params[param]);
    });

    return text;
  }

  /**
   * Set language
   */
  setLanguage(lang) {
    if (TRANSLATIONS[lang]) {
      this.currentLang = lang;
      chrome.storage.local.set({ nodScrollLang: lang });
      this.notifyListeners();
    }
  }

  /**
   * Get current language
   */
  getLanguage() {
    return this.currentLang;
  }

  /**
   * Get available languages
   */
  getAvailableLanguages() {
    return [
      { code: 'en', name: 'English' },
      { code: 'zh', name: '中文' }
    ];
  }

  /**
   * Add language change listener
   */
  onLanguageChange(callback) {
    this.listeners.push(callback);
  }

  /**
   * Notify listeners of language change
   */
  notifyListeners() {
    this.listeners.forEach(cb => cb(this.currentLang));
  }
}

// Export singleton
if (typeof window !== 'undefined') {
  window.i18n = new I18n();
}
