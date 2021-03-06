var Ansel = function(renderer, locationMap, projectMap) {
  this.renderer = this.getRenderer(renderer)
  this.locationMap = new MapFactory(locationMap || {});
  this.projectMap = new MapFactory(projectMap || {});
}

Ansel.prototype.snapshot = function(data) {
  var renderer = new this.renderer(this.locationMap, this.projectMap);
  var timelinesParser = new TimelinesParser();
  var deltaRecords = timelinesParser.parse(data)
  var result = {content_type: renderer.content_type(), content_body: deltaRecords.render(renderer)}
  return result;
}

Ansel.prototype.getRenderer = function(renderer_string) {
  return {
    "html": HtmlRenderer,
    "text": TextRenderer,
    "admin": AdminRenderer
  }[renderer_string] || HtmlRenderer;
}
