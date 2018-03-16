function TextRenderer(locationMap, projectMap) {
  this.locationMap = locationMap || function(value) {
    return value.name;
  }

  this.projectMap = projectMap || function(value) {
    return value.name;
  }
  this.result = {
    "going-on-vacation": [],
    "returning-from-vacation": [],
    "rotation": []
  }

}

TextRenderer.prototype.addRecord = function(record) {
  this.result[record.type()].push({
    "going-on-vacation": function(record, locationMap, projectMap) {
      return "(" + locationMap(record.location) + ") " + record.person.name + " taking a vacation from " + projectMap(record.project);
    },
    "returning-from-vacation": function(record, locationMap, projectMap) {
      return "(" + locationMap(record.location) + ") " + record.person.name + " returning to " + projectMap(record.project);
    },
    "rotation": function(record, locationMap, projectMap) {
      if (!record.leavingProject.id) {
        return "(" + locationMap(record.location) + ") " + record.person.name + " joining " + projectMap(record.joiningProject);
      }
      if (!record.joiningProject.id) {
        return "(" + locationMap(record.location) + ") " + record.person.name + " rolling off " + projectMap(record.leavingProject);
      }
      return "(" + locationMap(record.location) + ") " + record.person.name + " rotating from " + projectMap(record.leavingProject) + " to " +  projectMap(record.joiningProject);
    }
  }[record.type()](record, this.locationMap, this.projectMap))
}

TextRenderer.prototype.render = function() {
  var sections = [];
  if (this.result["rotation"].length > 0) {
    sections.push("Rotations\n\n" + this.result["rotation"].join("\n"));
  }
  if (this.result["going-on-vacation"].length > 0) {
    sections.push("Going on Vacation\n\n" + this.result["going-on-vacation"].join("\n"));
  }
  if (this.result["returning-from-vacation"].length > 0) {
    sections.push("Returning from Vacation\n\n" + this.result["returning-from-vacation"].join("\n"));
  }
  return sections.join("\n\n");
}


