function AdminRenderer(locationMap, projectMap) {
  this.locationMap = locationMap || new MapFactory({});
  this.projectMap = projectMap || new MapFactory({});
  this.records = [];

}

//TODO: opportunity here to have a base renderer that handles record adding.
AdminRenderer.prototype.addRecord = function(record) {
  if (record.type() != "rotation") {
    return;
  }
  this.records.push(record);
}

AdminRenderer.prototype.render = function() {
  var sections = ['"Date", "Name", "From", "To"'];
  $.each(this.records, function(k, record) {
    var  cols = [];
    cols.push(""); //we'll get the date later.
    cols.push('\"' + this.escapeCommas(record.person.name) + "\"");
    cols.push(this.escapeCommas(record.leavingProject.name || ""));
    cols.push(this.escapeCommas(record.joiningProject.name || ""));
    sections.push(cols.join(","));
  }.bind(this));
  return sections.join("\r\n");
}

AdminRenderer.prototype.escapeCommas = function(string) {
  return string.replace(',', '\\,')
}

AdminRenderer.prototype.content_type = function() {
  return "data:text/csv;charset=utf-8,";
}


