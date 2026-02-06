# NodScroll

A Chrome/Edge browser extension that uses your camera to detect head gestures and control webpage scrolling.

## Features

- **Nod down** → Scroll down
- **Nod up** → Scroll up
- **Turn left** → Go back (browser history)
- **Turn right** → Go forward (browser history)

## Privacy

- All processing happens locally in your browser
- No data is uploaded anywhere
- Camera is only active when the popup is open

## Installation

### From Source (Developer Mode)

1. Clone or download this repository
2. Open Chrome/Edge and navigate to `chrome://extensions`
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked"
5. Select the `nod-scroll` folder

## Usage

### First Time Setup
1. Click the NodScroll extension icon
2. Click "Start" - A new tab will open asking for camera permission
3. Click "Grant Camera Access" and allow camera access
4. Close the permission tab and return to any webpage

### Regular Use
1. Click the NodScroll extension icon
2. Click "Start" to begin tracking
3. Wait ~1 second for calibration (you'll see progress 0-100%)
4. You can now close the popup - tracking continues in the background!
5. Perform head gestures to control the page
6. Open the popup again and click "Stop" to disable

## Settings

- **Pitch Threshold**: Sensitivity for up/down nod detection (default: 15°)
- **Yaw Threshold**: Sensitivity for left/right turn detection (default: 20°)
- **Scroll Amount**: Pixels to scroll per gesture (default: 300px)
- **Cooldown**: Minimum time between gestures (default: 800ms)

## Technical Details

- Built with Manifest V3
- Uses [MediaPipe Face Mesh](https://google.github.io/mediapipe/solutions/face_mesh) for face landmark detection
- Head pose is estimated from 468 facial landmarks
- Smoothing and debouncing prevent accidental triggers

## Requirements

- Chrome 88+ or Edge 88+ (Manifest V3 support)
- Webcam access
- JavaScript enabled

## Troubleshooting

**Camera not working?**
- Ensure you've granted camera permissions to the extension
- Try closing other applications that might be using the camera

**Gestures not detected?**
- Ensure good lighting on your face
- Try recalibrating with the "Calibrate" button
- Adjust threshold settings for more/less sensitivity

**Accidental triggers?**
- Increase the threshold values
- Increase the cooldown time

## License

MIT
