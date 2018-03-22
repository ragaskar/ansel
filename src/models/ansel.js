var Ansel = function(locationMap, projectMap) {
  this.locationMap = new MapFactory(locationMap || {});
  this.projectMap = new MapFactory(projectMap || {});
}

Ansel.prototype.snapshot = function(data) {
  var renderer = new HtmlRenderer(this.locationMap, this.projectMap);
  var timelinesParser = new TimelinesParser();
  var deltaRecords = timelinesParser.parse(data)
  return deltaRecords.render(renderer);
}
