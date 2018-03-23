chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
  if (request.ansel_snapshot) {
    var url = request.ansel_snapshot.content_type + encodeURIComponent(request.ansel_snapshot.content_body);
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
