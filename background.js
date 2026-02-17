chrome.action.onClicked.addListener((tab) => {
    chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
    if (changeInfo.status === "complete") {
            if (tab.url) {
                chrome.scripting.executeScript({
                target: {tabId: tab.id},
                files: ["changeBg.js"]
                })
            }
        }
    });


})
