const sitesKey = 'autoPauseSites';
const currentTabKey = 'currentTabID';

function resumeMediaInTab(tab) {
	
	if(tab && tab.url) {
		chrome.storage.sync.get([sitesKey], function(result) {
			//console.log(result.autoPauseSites);
			let tabHostname = new URL(tab.url).hostname;

			if(result.autoPauseSites.includes(tabHostname)) {
				chrome.tabs.sendMessage(tab.id, { action: "resume" });
			}
		});
	}
}

function pauseMediaInTab(tab) {
	
	if(!chrome.runtime.lastError && tab && tab.url) {
		chrome.storage.sync.get([sitesKey], function(result) {
			let tabHostname = new URL(tab.url).hostname;

			if(result.autoPauseSites.includes(tabHostname) && tab.audible) {
				chrome.tabs.sendMessage(tab.id, { action: "pause" });
			}
		});				
	}
}

function activatedTabHandler(activeInfo) {
	chrome.tabs.get(activeInfo.tabId, resumeMediaInTab);
	chrome.storage.local.get([currentTabKey], function(result) {
		chrome.tabs.get(result.currentTabID, pauseMediaInTab);
		chrome.storage.local.set({ currentTabID: activeInfo.tabId });
	});
}

chrome.runtime.onInstalled.addListener(function() {
	chrome.storage.sync.set({autoPauseSites: ['www.primevideo.com']});
	chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
		chrome.storage.local.set({ currentTabID: tabs[0].id });
	});
});

chrome.tabs.onActivated.addListener(activatedTabHandler);