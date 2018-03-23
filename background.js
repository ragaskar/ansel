chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
  if (request.ansel_snapshot) {
    var url = "data:text/html," + encodeURIComponent(request.ansel_snapshot);
    chrome.tabs.create({url: url});
  }
});

chrome.browserAction.onClicked.addListener(function(tab) {
  var boot = function() {
    chrome.tabs.executeScript(null, {
      file: 'boot.js'
    });
  };
  var loadAnsel = function() {
    chrome.tabs.executeScript(null, {
      file: 'ansel.js'
    }, boot);
  };
  chrome.tabs.executeScript(null, {
    file: 'vendor/jquery-3.3.1.min.js'
  }, loadAnsel);
});
