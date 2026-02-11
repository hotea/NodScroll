# Privacy Policy for NodScroll

**Last Updated**: February 7, 2025

## Overview

NodScroll is committed to protecting your privacy. This extension operates with a privacy-first approach - all processing happens locally on your device, and we do not collect, store, or transmit any personal data.

## Data Collection

**NodScroll does NOT collect, store, or transmit any personal data.**

We do not:
- Collect any personal information
- Track your browsing activity
- Store any camera images or video
- Send any data to external servers
- Use analytics or tracking services
- Share data with third parties

## Camera Usage

### When Camera is Accessed
- Camera access is only enabled when you explicitly click "Start" in the extension popup
- A permission dialog will appear asking for your consent
- You can revoke camera permission at any time through your browser settings

### How Camera is Used
- Camera feed is processed locally in your browser using MediaPipe Face Mesh technology
- Face detection happens entirely on your device
- No images or video frames are saved, uploaded, or shared
- Camera access stops immediately when you:
  - Click "Stop" in the extension popup
  - Close the extension popup
  - Revoke camera permission in browser settings

### Technical Details
- All video processing uses the browser's MediaPipe library (runs locally)
- Face landmarks are computed in real-time and discarded immediately
- Only head gesture detection results (e.g., "nod detected") are used to trigger scrolling
- No raw video data leaves your browser

## Permissions Justification

NodScroll requests the following browser permissions:

### `activeTab`
- **Purpose**: Send scroll commands to the current webpage
- **Privacy**: Only accesses the active tab, not all tabs

### `scripting`
- **Purpose**: Inject content script to execute page scrolling
- **Privacy**: Only injects simple scrolling code, no data collection

### `storage`
- **Purpose**: Save your preferences (sensitivity settings, scroll direction, etc.)
- **Privacy**: Settings stored locally in your browser, never uploaded

### `offscreen`
- **Purpose**: Run MediaPipe face detection in background for better performance
- **Privacy**: Processing happens locally, improves user experience

### `host_permissions: <all_urls>`
- **Purpose**: Enable scroll control on any webpage you visit
- **Privacy**: Only executes scrolling actions, does not read page content

## Third-Party Services

### MediaPipe Face Mesh
- **Provider**: Google (via CDN)
- **Purpose**: Local face landmark detection
- **Privacy**: Runs entirely in your browser, no data sent to Google servers
- **More Info**: [MediaPipe Privacy](https://developers.google.com/mediapipe)

### No Other Third Parties
- No analytics services (e.g., Google Analytics)
- No advertising networks
- No social media integrations
- No crash reporting services

## Local Storage

NodScroll stores only your preference settings locally using Chrome's Storage API:
- Pitch/Yaw thresholds (gesture sensitivity)
- Scroll amount per gesture
- Cooldown time
- Scroll direction preference
- Language preference

**This data:**
- Stays on your device
- Is never uploaded or shared
- Can be cleared by uninstalling the extension
- Is not accessible to other websites or extensions

## Open Source

NodScroll is fully open source, allowing you to:
- Review all source code: [https://github.com/hotea/NodScroll](https://github.com/hotea/NodScroll)
- Verify privacy claims
- Audit camera usage
- Inspect data handling
- Build from source

## Your Rights

You have complete control over your data:
- **Access**: Review all settings in the extension popup
- **Modification**: Change settings at any time
- **Deletion**: Uninstall the extension to remove all data
- **Camera Control**: Enable/disable camera access at will
- **Transparency**: Review source code on GitHub

## Children's Privacy

NodScroll does not collect data from anyone, including children under 13. Since no data is collected, COPPA compliance is inherent to our design.

## Changes to Privacy Policy

We may update this privacy policy from time to time. Changes will be:
- Posted on this page with an updated "Last Updated" date
- Communicated in extension update notes if significant
- Never retroactively applied to already-collected data (because we don't collect any)

## Contact Us

If you have questions or concerns about privacy:

**Email**: oksukai@gmail.com
**GitHub Issues**: [https://github.com/hotea/NodScroll/issues](https://github.com/hotea/NodScroll/issues)

## Compliance

This extension complies with:
- Chrome Web Store Developer Program Policies
- Microsoft Edge Add-ons Policies
- General Data Protection Regulation (GDPR) principles
- California Consumer Privacy Act (CCPA) principles

## Data Breach Notification

Since NodScroll does not collect, store, or transmit any user data, a data breach is not possible. All processing is local and ephemeral.

## Summary

**TL;DR**: NodScroll is completely private. Your camera feed never leaves your device, we don't collect any data, and everything happens locally in your browser. You have full control at all times.

---

**Version**: 1.0
**Effective Date**: February 7, 2025
**NodScroll Version**: 1.1.5
