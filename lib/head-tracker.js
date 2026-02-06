/**
 * Head Tracker - Core algorithm for head pose estimation
 * Uses MediaPipe Face Mesh landmarks for pitch/yaw calculation
 */

// Key landmark indices from MediaPipe Face Mesh (468 points)
const LANDMARKS = {
  NOSE_TIP: 1,
  CHIN: 199,
  LEFT_EYE_OUTER: 33,
  RIGHT_EYE_OUTER: 263,
  LEFT_MOUTH: 61,
  RIGHT_MOUTH: 291,
  FOREHEAD: 10,
  LEFT_EYE_INNER: 133,
  RIGHT_EYE_INNER: 362
};

class HeadTracker {
  constructor(config = {}) {
    this.config = {
      smoothingWindow: config.smoothingWindow || 5,
      pitchThreshold: config.pitchThreshold || 15,
      yawThreshold: config.yawThreshold || 20,
      confirmFrames: config.confirmFrames || 3,
      cooldownMs: config.cooldownMs || 800
    };

    // Smoothing buffers
    this.pitchHistory = [];
    this.yawHistory = [];

    // State tracking
    this.baselinePitch = null;
    this.baselineYaw = null;
    this.calibrationFrames = [];
    this.isCalibrated = false;

    // Action detection state
    this.state = 'IDLE'; // IDLE, DETECTING, TRIGGERED, COOLDOWN
    this.confirmCount = 0;
    this.lastAction = null;
    this.lastTriggerTime = 0;
  }

  /**
   * Calculate head pose from face landmarks
   * @param {Array} landmarks - MediaPipe face mesh landmarks
   * @returns {Object} - { pitch, yaw, roll } in degrees
   */
  calculatePose(landmarks) {
    if (!landmarks || landmarks.length < 468) {
      return null;
    }

    const nose = landmarks[LANDMARKS.NOSE_TIP];
    const chin = landmarks[LANDMARKS.CHIN];
    const leftEye = landmarks[LANDMARKS.LEFT_EYE_OUTER];
    const rightEye = landmarks[LANDMARKS.RIGHT_EYE_OUTER];
    const forehead = landmarks[LANDMARKS.FOREHEAD];

    // Calculate eye center
    const eyeCenterX = (leftEye.x + rightEye.x) / 2;
    const eyeCenterY = (leftEye.y + rightEye.y) / 2;

    // Pitch calculation (up/down nod)
    // Compare nose position relative to eye-chin line
    const faceHeight = Math.abs(chin.y - forehead.y);
    const noseToEyeY = nose.y - eyeCenterY;
    const normalizedPitchOffset = noseToEyeY / faceHeight;

    // Convert to approximate degrees
    // Positive = looking down, Negative = looking up
    const pitch = normalizedPitchOffset * 90;

    // Yaw calculation (left/right turn)
    // Compare nose X position relative to eye center
    const faceWidth = Math.abs(rightEye.x - leftEye.x);
    const noseToEyeCenterX = nose.x - eyeCenterX;
    const normalizedYawOffset = noseToEyeCenterX / faceWidth;

    // Convert to approximate degrees
    // Positive = turned right, Negative = turned left
    const yaw = normalizedYawOffset * 90;

    // Roll calculation (head tilt)
    const eyeDeltaY = rightEye.y - leftEye.y;
    const eyeDeltaX = rightEye.x - leftEye.x;
    const roll = Math.atan2(eyeDeltaY, eyeDeltaX) * (180 / Math.PI);

    return { pitch, yaw, roll };
  }

  /**
   * Apply smoothing to reduce noise
   * @param {number} value - Current value
   * @param {Array} history - History buffer
   * @returns {number} - Smoothed value
   */
  smooth(value, history) {
    history.push(value);
    if (history.length > this.config.smoothingWindow) {
      history.shift();
    }
    const sum = history.reduce((a, b) => a + b, 0);
    return sum / history.length;
  }

  /**
   * Calibrate baseline head position
   * @param {Object} pose - Current pose
   * @returns {boolean} - True if calibration complete
   */
  calibrate(pose) {
    if (!pose) return false;

    this.calibrationFrames.push(pose);

    if (this.calibrationFrames.length >= 30) {
      // Calculate average baseline
      const avgPitch = this.calibrationFrames.reduce((sum, p) => sum + p.pitch, 0) / this.calibrationFrames.length;
      const avgYaw = this.calibrationFrames.reduce((sum, p) => sum + p.yaw, 0) / this.calibrationFrames.length;

      this.baselinePitch = avgPitch;
      this.baselineYaw = avgYaw;
      this.isCalibrated = true;
      this.calibrationFrames = [];

      return true;
    }

    return false;
  }

  /**
   * Reset calibration
   */
  resetCalibration() {
    this.baselinePitch = null;
    this.baselineYaw = null;
    this.calibrationFrames = [];
    this.isCalibrated = false;
    this.pitchHistory = [];
    this.yawHistory = [];
    this.state = 'IDLE';
    this.confirmCount = 0;
  }

  /**
   * Process a frame and detect actions
   * @param {Array} landmarks - Face mesh landmarks
   * @returns {Object} - { action, pose, relativePose }
   */
  processFrame(landmarks) {
    const pose = this.calculatePose(landmarks);

    if (!pose) {
      return { action: null, pose: null, relativePose: null, state: this.state };
    }

    // Apply smoothing
    const smoothedPitch = this.smooth(pose.pitch, this.pitchHistory);
    const smoothedYaw = this.smooth(pose.yaw, this.yawHistory);

    const smoothedPose = {
      pitch: smoothedPitch,
      yaw: smoothedYaw,
      roll: pose.roll
    };

    // Handle calibration phase
    if (!this.isCalibrated) {
      return {
        action: null,
        pose: smoothedPose,
        relativePose: null,
        state: 'CALIBRATING',
        calibrationProgress: this.calibrationFrames.length / 30
      };
    }

    // Calculate relative pose (from baseline)
    const relativePose = {
      pitch: smoothedPitch - this.baselinePitch,
      yaw: smoothedYaw - this.baselineYaw
    };

    // Check cooldown
    const now = Date.now();
    if (this.state === 'COOLDOWN') {
      if (now - this.lastTriggerTime > this.config.cooldownMs) {
        this.state = 'IDLE';
      } else {
        return {
          action: null,
          pose: smoothedPose,
          relativePose,
          state: this.state,
          cooldownRemaining: this.config.cooldownMs - (now - this.lastTriggerTime)
        };
      }
    }

    // Detect action
    const detectedAction = this.detectAction(relativePose);

    if (detectedAction) {
      if (this.lastAction === detectedAction) {
        this.confirmCount++;
      } else {
        this.lastAction = detectedAction;
        this.confirmCount = 1;
      }

      if (this.confirmCount >= this.config.confirmFrames) {
        this.state = 'COOLDOWN';
        this.lastTriggerTime = now;
        this.confirmCount = 0;
        this.lastAction = null;

        return {
          action: detectedAction,
          pose: smoothedPose,
          relativePose,
          state: 'TRIGGERED'
        };
      } else {
        this.state = 'DETECTING';
      }
    } else {
      this.confirmCount = 0;
      this.lastAction = null;
      this.state = 'IDLE';
    }

    return {
      action: null,
      pose: smoothedPose,
      relativePose,
      state: this.state,
      pendingAction: this.lastAction,
      confirmProgress: this.confirmCount / this.config.confirmFrames
    };
  }

  /**
   * Detect action based on relative pose
   * @param {Object} relativePose - Pose relative to baseline
   * @returns {string|null} - Action name or null
   */
  detectAction(relativePose) {
    const { pitch, yaw } = relativePose;

    // Priority: larger movement takes precedence
    const pitchMagnitude = Math.abs(pitch);
    const yawMagnitude = Math.abs(yaw);

    // Check if any threshold is exceeded
    const pitchExceeded = pitchMagnitude > this.config.pitchThreshold;
    const yawExceeded = yawMagnitude > this.config.yawThreshold;

    if (!pitchExceeded && !yawExceeded) {
      return null;
    }

    // Determine primary movement
    if (pitchExceeded && (!yawExceeded || pitchMagnitude > yawMagnitude)) {
      return pitch > 0 ? 'NOD_DOWN' : 'NOD_UP';
    }

    if (yawExceeded) {
      return yaw > 0 ? 'TURN_RIGHT' : 'TURN_LEFT';
    }

    return null;
  }

  /**
   * Update configuration
   * @param {Object} newConfig - New configuration values
   */
  updateConfig(newConfig) {
    Object.assign(this.config, newConfig);
  }
}

// Export for use in popup
if (typeof window !== 'undefined') {
  window.HeadTracker = HeadTracker;
}
