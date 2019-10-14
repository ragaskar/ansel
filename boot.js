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
    "Dublin": "DUB",
    "Colorado": "DEN",
    "Santa Monica": "LA"
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
    "CF - SF - CLI": "CLI",
    "CF - SF - Cloud Ops PWS": "CloudOps",
    "CF - TOR - App CI/CD - Deploy DevOps Tools (Draupnir)": "Draupnir",
    "CF - TOR - App CI/CD - Concourse OSS": "Concourse",
    "CF - NYC - PCF Dev": "PCFDev",
    "CF - SF - Diego": "Diego",
    "CF - SF - CAPI": "CAPI",
    "CF - Elafros": "Elafros",
    "CF - LA - Networking": "Networking",
    "CF - DEN - Platform Monitoring (Healthwatch)": "Healthwatch",
    "CF - DEN - Event Producer": "Event Producer",
    "CF - DEN - EATs": "EATs",
    "CF - LDN - Redis Tile": "Redis",
    "CF - DEN - Norm": "Norm",
    "CF - DEN - Loggregator": "Loggregator",
    "CF - LDN - Disaster Recovery": "Disaster Recovery",
    "CF - TOR - Master Pipeline": "Master Pipeline",
    "CF - SF - Toolsmiths": "Toolsmiths",
    "CF - SF - Mysql Galera": "MySQL Galera",
    "CF - TOR - AWS Service Broker": "AWS Service Broker",
    "CF - PA - PKS Release Engineering": "PKS RelEng",
    "CF - TOR - Push Notification": "Push Notification",
    "CF - DUB - OD-PKS": "OD-PKS",
    "CF - SF - Identity Service": "SSO",
    "CF - NYC - Greenhouse / Garden Windows": "Greenhouse",
    "CF - LDN - RMQ Tile": "RMQ Tile",
    "CF - LDN - Garden Core": "Garden",
    "CF - SF - Ops Manager": "OpsManager",
    "CF - LA - Release Engineering": "RelEng",
    "CF - LA - Infrastructure": "Infrastructure",
    "CF - SF - Identity UAA": "UAA",
    "CF - SF - BOSH": "BOSH",
    "CF - TOR - Open Source License Tooling": "OSLT",
    "CF - SF - Documentation": "Docs",
    "CF - SF - Permissions": "Perm",
    "CF - SF - UAA": "UAA",
    "CF - SF - Onboarding": "Onboarding Week",
    "CF - SF - Billing and Account Management": "BAM",
    "CF - DUB - PKS Telemetry": "PKS Telemetry",
    "CF - BOSH Director": "BOSH Director",
    "CF - DUB - Navigating Containers (NavCon)": "NavCon",
    "CF - TOR - Security PCI Compliance": "Security PCI Compliance",
    "CF - LDN - CF Services API": "CF Services API",
    "CF - SF - Security Triage (Davos)": "Davos",
    "CF - DUB - Eirini CFF": "Eirini CFF",
    "PVD: Pivotal R&D - Cloud 2 - Cloud Foundry (CF)": "PVD",
    "CF - Networking Program": "Networking Program",
    "CF - Distributed Security ": "Distributed Security",
    "CF - NYC - Buildpacks": "Buildpacks",
    "CF - LDN - Independent Services Marketplace": "Independent Services Marketplace",
    "CF - DEN - Data Visualization": "Dataviz",
    "GP - REM - Greenplum Building Blocks": "GBB",
    "CF - NYC - Build Service": "Build Service"
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


