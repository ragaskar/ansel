function save_options() {
  var formatter = document.getElementById('formatter').value;
  chrome.storage.sync.set({
    ansel_formatter: formatter
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

function restore_options() {
  chrome.storage.sync.get({
    ansel_formatter: 'html',
  }, function(items) {
    document.getElementById('formatter').value = items.ansel_formatter;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);
