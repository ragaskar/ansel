chrome.browserAction.onClicked.addListener(function(tab) {
  var loadAfter = function() {
  chrome.tabs.executeScript(null, {
    file: 'ansel.js'
  });
  };
  chrome.tabs.executeScript(null, {
    file: 'vendor/jquery-3.3.1.min.js'
  }, loadAfter);
});
