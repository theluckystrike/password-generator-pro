// Password Generator Pro - Background Service Worker
// Handles install events, context menu, and Zovo integration

const EXTENSION_SLUG = 'password-generator';
const ZOVO_URL = 'https://zovo.one';

// Create context menu on install
chrome.runtime.onInstalled.addListener((details) => {
  // Create context menu for feature requests
  chrome.contextMenus.create({
    id: 'zovo-feedback',
    title: '💡 Request a feature (Zovo)',
    contexts: ['action']
  });

  // Handle first install
  if (details.reason === 'install') {
    // Set flag to show welcome state
    chrome.storage.local.set({
      isFirstInstall: true,
      installDate: Date.now()
    });

    // Optionally open welcome page or show badge
    chrome.action.setBadgeText({ text: 'NEW' });
    chrome.action.setBadgeBackgroundColor({ color: '#7C3AED' });
  }

  // Handle updates
  if (details.reason === 'update') {
    const previousVersion = details.previousVersion;
    const currentVersion = chrome.runtime.getManifest().version;

    // Show update badge
    chrome.action.setBadgeText({ text: '✓' });
    chrome.action.setBadgeBackgroundColor({ color: '#00d4aa' });

    // Store update info
    chrome.storage.local.set({
      lastUpdate: Date.now(),
      previousVersion: previousVersion,
      currentVersion: currentVersion
    });

    // Clear badge after 24 hours
    setTimeout(() => {
      chrome.action.setBadgeText({ text: '' });
    }, 24 * 60 * 60 * 1000);
  }
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'zovo-feedback') {
    chrome.tabs.create({
      url: `${ZOVO_URL}/features?ref=${EXTENSION_SLUG}&utm_source=extension&utm_medium=contextmenu`
    });
  }
});

// Clear badge when popup is opened
chrome.action.onClicked.addListener(() => {
  chrome.action.getBadgeText({}, (text) => {
    if (text === 'NEW') {
      chrome.storage.local.set({ isFirstInstall: false });
      chrome.action.setBadgeText({ text: '' });
    }
  });
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'clearBadge') {
    chrome.action.setBadgeText({ text: '' });
    sendResponse({ success: true });
  }

  if (message.action === 'openZovo') {
    const medium = message.medium || 'popup';
    chrome.tabs.create({
      url: `${ZOVO_URL}?ref=${EXTENSION_SLUG}&utm_source=extension&utm_medium=${medium}`
    });
    sendResponse({ success: true });
  }

  return true; // Keep message channel open for async response
});
