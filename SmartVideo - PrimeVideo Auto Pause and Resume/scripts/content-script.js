chrome.runtime.onMessage.addListener(
    function(request) {

        let videoElems = [...document.getElementsByTagName('video')];
        let targetVideoElem = videoElems.find(elem => elem.currentSrc.indexOf('blob') > -1);

        if(request.action === 'pause') {            
            targetVideoElem.pause();
        }
        else if(request.action === 'resume') {
            targetVideoElem.play();
        }
    });