/**
 * Background Service Worker
 * Manages offscreen document and routes messages
 */

let offscreenCreated = false;

/**
 * Create offscreen document if needed
 */
async function setupOffscreenDocument() {
  if (offscreenCreated) return;

  const existingContexts = await chrome.runtime.getContexts({
    contextTypes: ['OFFSCREEN_DOCUMENT']
  });

  if (existingContexts.length > 0) {
    offscreenCreated = true;
    return;
  }

  await chrome.offscreen.createDocument({
    url: 'offscreen/offscreen.html',
    reasons: ['USER_MEDIA'],
    justification: 'Camera access for head gesture detection'
  });

  offscreenCreated = true;
  console.log('Offscreen document created');
}

/**
 * Close offscreen document
 */
async function closeOffscreenDocument() {
  if (!offscreenCreated) return;

  await chrome.offscreen.closeDocument();
  offscreenCreated = false;
  console.log('Offscreen document closed');
}

// Listen for messages
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // 来自 offscreen 的消息：popup 通知直接放行广播，滚动/导航命令继续处理
  if (sender.url && sender.url.includes('offscreen.html')) {
    if (message.target === 'popup') {
      return false; // 放行给 popup
    }
    // SCROLL_COMMAND / NAVIGATE_COMMAND 继续往下处理
  }

  // Get status from offscreen
  if (message.type === 'GET_STATUS') {
    if (!offscreenCreated) {
      sendResponse({ success: true, isRunning: false });
      return true;
    }
    chrome.runtime.sendMessage(message).then(result => {
      sendResponse(result);
    }).catch(error => {
      sendResponse({ success: true, isRunning: false });
    });
    return true;
  }

  // Messages from popup to offscreen
  if (message.type === 'START_TRACKING') {
    console.log('Background: START_TRACKING received from popup');
    setupOffscreenDocument().then(() => {
      console.log('Background: Offscreen setup complete, forwarding message');
      // Wait a bit for offscreen to fully initialize
      return new Promise(resolve => setTimeout(resolve, 100));
    }).then(() => {
      return chrome.runtime.sendMessage(message);
    }).then(result => {
      console.log('Background: Got result from offscreen:', result);
      sendResponse(result);
    }).catch(error => {
      console.error('Background: Error in START_TRACKING:', error);
      sendResponse({ success: false, error: error.message });
    });
    return true;
  }

  if (message.type === 'STOP_TRACKING') {
    chrome.runtime.sendMessage(message).then(() => {
      return closeOffscreenDocument();
    }).then(() => {
      sendResponse({ success: true });
    }).catch(error => {
      sendResponse({ success: false, error: error.message });
    });
    return true;
  }

  if (message.type === 'RECALIBRATE' || message.type === 'UPDATE_CONFIG') {
    chrome.runtime.sendMessage(message).then(result => {
      sendResponse(result);
    }).catch(error => {
      sendResponse({ success: false, error: error.message });
    });
    return true;
  }

  // Forward scroll/navigate commands to active tab
  if (message.type === 'SCROLL_COMMAND') {
    console.log('Background: SCROLL_COMMAND received, direction:', message.direction);
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        const tabId = tabs[0].id;
        console.log('Background: Forwarding to tab', tabId);
        chrome.tabs.sendMessage(tabId, message, (response) => {
          if (chrome.runtime.lastError) {
            console.log('Content script not available, injecting scroll directly');
            // content script 未注入，直接注入滚动代码
            const direction = message.direction;
            const amount = message.amount || 300;
            chrome.scripting.executeScript({
              target: { tabId },
              func: (dir, amt) => {
                window.scrollBy({ top: dir === 'down' ? amt : -amt, behavior: 'smooth' });
              },
              args: [direction, amount]
            }).then(() => {
              sendResponse({ success: true });
            }).catch(err => {
              console.error('executeScript failed:', err);
              sendResponse({ success: false, error: err.message });
            });
          } else {
            sendResponse(response || { success: true });
          }
        });
      } else {
        sendResponse({ success: false, error: 'No active tab' });
      }
    });
    return true;
  }

  if (message.type === 'NAVIGATE_COMMAND') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        if (message.direction === 'back') {
          chrome.tabs.goBack(tabs[0].id);
        } else if (message.direction === 'forward') {
          chrome.tabs.goForward(tabs[0].id);
        }
        sendResponse({ success: true });
      } else {
        sendResponse({ success: false, error: 'No active tab' });
      }
    });
    return true;
  }

  if (message.type === 'TAB_COMMAND') {
    chrome.tabs.query({ currentWindow: true }, (tabs) => {
      if (tabs.length === 0) {
        sendResponse({ success: false, error: 'No tabs' });
        return;
      }
      const activeTab = tabs.find(t => t.active);
      if (!activeTab) {
        sendResponse({ success: false, error: 'No active tab' });
        return;
      }
      const currentIndex = activeTab.index;
      let newIndex;
      if (message.direction === 'next') {
        newIndex = (currentIndex + 1) % tabs.length;
      } else {
        newIndex = (currentIndex - 1 + tabs.length) % tabs.length;
      }
      chrome.tabs.update(tabs[newIndex].id, { active: true });
      sendResponse({ success: true });
    });
    return true;
  }

  return false;
});

// Log when service worker starts
console.log('NodScroll background service worker started');
