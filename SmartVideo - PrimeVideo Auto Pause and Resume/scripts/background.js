let currentTabID;

const sitesKey = 'autoPauseSites';

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
	
	if(tab && tab.url) {
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
	chrome.tabs.get(currentTabID, pauseMediaInTab);

	currentTabID = activeInfo.tabId;
}


chrome.runtime.onInstalled.addListener(function() {

	chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
		currentTabID = tabs[0].id;
	});

	chrome.storage.sync.set({autoPauseSites: ['www.primevideo.com']});	
	chrome.tabs.onActivated.addListener(activatedTabHandler);
});