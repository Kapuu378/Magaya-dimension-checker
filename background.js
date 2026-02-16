chrome.action.onClicked.addListener((tab) => {
    if (tab.url) {
        chrome.scripting.executeScript({
        target: {tabId: tab.id},
        files: ["changeBg.js"]
        })
    }
});