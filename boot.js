var startOn = new Date(Date.parse($('input#start_on').val())).toISOString().split('T')[0];
var groupIds = $.makeArray($('input[name="group_ids"]').map(function() { return $(this).val(); }));
var locationIds = $.makeArray($('input[name="location_ids"]').map(function() { return $(this).val(); }));

//TODO: this pager is jank.
var PageGetter = function(url, params, done) {
  this.records = [];
  this.page = 1;
  this.url = url;
  this.params = params;
  this.done = done;
}

PageGetter.prototype.run = function() {
  this.page = 1;
  $.getJSON(this.url, $.extend(this.params, {page: this.page}), this.next.bind(this));
}

PageGetter.prototype.next = function(response) {
  this.records = this.records.concat(response.data);
  if (response.meta.page == response.meta.total_pages) {
    this.done(this.records);
  } else {
    this.page = this.page + 1;
    $.getJSON(this.url, $.extend(this.params, {page: this.page}), this.next.bind(this));
  }
}

var getter = new PageGetter("/api/timelines", {
  per_page: 100,
  start_on: startOn,
  number_of_weeks:2,
  group_ids: groupIds.join(','),
  location_ids: locationIds.join(','),
},
function(records) {
  var locationMap = {
    "Tokyo": "NRT",
    "New York": "NYC",
    "London": "LON",
    "San Francisco": "SF",
    "Toronto": "TOR",
    "Palo Alto": "PA",
    "Dublin": "DUB"
  };

  var projectMap = {
    "CF - TOR - BOSH": "BOSH",
    "CF - SF - Pivotal MySQL": "Pivotal MySQL",
    "CF - DUB - CFCR": "CFCR",
    "CF - DUB - PKS": "PKS",
    "CF - PA - PKS": "PKS",
    "CF - NYC - CredHub": "CredHub",
    "CF - NYC - Cloud Cache / PCC": "Cloud Cache",
    "CF - DUB - Cloud Ops EU": "Cloud Ops EU",
    "CF - NYC - Onboarding": "Onboarding",
    "CF - NYC - BOSH Windows": "BOSH Windows",
    "CF - Operator Experience Research": "Operator Experience Research",
    "CF - DEN - PCF Metrics App Dev": "PCF Metrics",
    "CF - NYC - Pivotal Network / PivNet": "PivNet",
    "CF - LDN - Services Enablement": "Services Enablement",
    "CF - SF - Release Integration": "Release Integration",
    "CF - SF - AppsManager": "AppsManager",
    "CF - Security Triage (Davos)": "Davos",
    "CF - SF - Routing": "Routing",
    "CF - SF - CLI": "CLI"
  };

  chrome.storage.sync.get({
    ansel_formatter: 'html',
  }, function(items) {
    var ansel = new Ansel(items.ansel_formatter, locationMap, projectMap);
    var result = ansel.snapshot(records);
    chrome.runtime.sendMessage({ansel_snapshot: result})
  });
});

getter.run();


