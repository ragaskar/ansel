function HtmlRenderer(locationMap, projectMap) {
  this.locationMap = locationMap || new MapFactory({});
  this.projectMap = projectMap || new MapFactory({});
  this.result = {
    "going-on-vacation": [],
    "returning-from-vacation": [],
    "rotation": []
  }

}

//TODO: opportunity here to have a base renderer that handles record adding.
HtmlRenderer.prototype.addRecord = function(record) {
  this.result[record.type()].push({
    "going-on-vacation": function(record, locationMap, projectMap) {
      return "(" + locationMap(record.location) + ") <strong>" + record.person.name + "</strong> taking some time away from <strong>" + projectMap(record.project) + "</strong>";
    },
    "returning-from-vacation": function(record, locationMap, projectMap) {
      return "(" + locationMap(record.location) + ") <strong>" + record.person.name + "</strong> returning to <strong>" + projectMap(record.project) + "</strong>";
    },
    "rotation": function(record, locationMap, projectMap) {
      if (!record.leavingProject.id) {
        return "(" + locationMap(record.location) + ") <strong>" + record.person.name + "</strong> joining <strong>" + projectMap(record.joiningProject) + "</strong>";
      }
      if (!record.joiningProject.id) {
        return "(" + locationMap(record.location) + ") <strong>" + record.person.name + "</strong> rolling off <strong>" + projectMap(record.leavingProject) + "</strong>";
      }
      return "(" + locationMap(record.location) + ") <strong>" + record.person.name + "</strong> rotating from <strong>" + projectMap(record.leavingProject) + "</strong> to <strong>" +  projectMap(record.joiningProject) + "</strong>";
    }
  }[record.type()](record, this.locationMap, this.projectMap))
}

HtmlRenderer.prototype.content_type = function() {
  return "data:text/html,";
}

HtmlRenderer.prototype.render = function() {
  var sections = [];
  if (this.result["rotation"].length > 0) {
    sections.push("<i>Rotations</i><br />" + this.result["rotation"].join("<br />"));
  }
  if (this.result["going-on-vacation"].length > 0) {
    sections.push("<i>Going on Vacation/Leave</i><br />" + this.result["going-on-vacation"].join("<br />"));
  }
  if (this.result["returning-from-vacation"].length > 0) {
    sections.push("<i>Returning from Vacation/Leave</i><br />" + this.result["returning-from-vacation"].join("<br />"));
  }
  return sections.join("<br /><br />");
}


