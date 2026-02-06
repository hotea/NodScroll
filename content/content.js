/**
 * Content Script
 * Receives scroll commands and executes them on the page
 */

// Configuration
const SCROLL_CONFIG = {
  defaultAmount: 300,
  smoothBehavior: 'smooth'
};

// Listen for scroll commands from background
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'SCROLL_COMMAND') {
    const amount = message.amount || SCROLL_CONFIG.defaultAmount;
    const behavior = message.behavior || SCROLL_CONFIG.smoothBehavior;

    try {
      if (message.direction === 'down') {
        window.scrollBy({
          top: amount,
          behavior: behavior
        });
      } else if (message.direction === 'up') {
        window.scrollBy({
          top: -amount,
          behavior: behavior
        });
      }
      sendResponse({ success: true });
    } catch (error) {
      sendResponse({ success: false, error: error.message });
    }
    return true;
  }

  return false;
});

// Log that content script is loaded
console.log('NodScroll content script loaded');
