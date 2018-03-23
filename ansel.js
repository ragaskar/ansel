function AdminRenderer(locationMap, projectMap) {
  this.locationMap = locationMap || new MapFactory({});
  this.projectMap = projectMap || new MapFactory({});
  this.result = {}

}

//TODO: opportunity here to have a base renderer that handles record adding.
AdminRenderer.prototype.addRecord = function(record) {
  if (record.type() != "rotation") {
    return;
  }
  if (record.leavingProject.id) {
    this.result[record.leavingProject.id] = this.result[record.leavingProject.id] || new AdminProjectDeltas(record.leavingProject);
    this.result[record.leavingProject.id].leaving.push(record);
  }
  if (record.joiningProject.id) {
    this.result[record.joiningProject.id] = this.result[record.joiningProject.id] || new AdminProjectDeltas(record.joiningProject);
    this.result[record.joiningProject.id].joining.push(record);
  }
}

AdminRenderer.prototype.render = function() {
  var sections = [];
  $.each(this.result, function(k, project_delta) {
    var projectSection = ["<strong>" + project_delta.project.name + "</strong>"];
    if (project_delta.leaving.length > 0) {
      projectSection.push("<i>Leaving</i>");
      $.each(project_delta.leaving, function(index, record) {
        projectSection.push(record.person.name);
      });
    }
    if (project_delta.joining.length > 0) {
      projectSection.push("<i>Joining</i>");
      $.each(project_delta.joining, function(index, record) {
        projectSection.push(record.person.name);
      });
    }
    sections.push(projectSection.join("<br />"));
  })
  return sections.join("<br /><br />");
}

function AdminProjectDeltas(project) {
  this.project = project;
  this.leaving = [];
  this.joining = [];
}

var Ansel = function(renderer, locationMap, projectMap) {
  this.renderer = this.getRenderer(renderer)
  this.locationMap = new MapFactory(locationMap || {});
  this.projectMap = new MapFactory(projectMap || {});
}

Ansel.prototype.snapshot = function(data) {
  var renderer = new this.renderer(this.locationMap, this.projectMap);
  var timelinesParser = new TimelinesParser();
  var deltaRecords = timelinesParser.parse(data)
  var result = {content_type: "data:text/html,", content_body: deltaRecords.render(renderer)}
  return result;
}

Ansel.prototype.getRenderer = function(renderer_string) {
  return {
    "html": HtmlRenderer,
    "text": TextRenderer,
    "admin": AdminRenderer
  }[renderer_string] || HtmlRenderer;
}
function Delta(data) {
  this.person = data.person;
  this.fromProject = data.fromProject;
  this.toProject = data.toProject;
  this.location = data.location;
}

function DeltaDetector(week1, week2) {
  this.week1 = week1;
  this.week2 = week2;
}

DeltaDetector.prototype.goingOnVacation = function() {
  return !this.week1.onVacation() && this.week2.onVacation();
}

DeltaDetector.prototype.returningFromVacation = function() {
  return this.week1.onVacation() && !this.week2.onVacation();
}

DeltaDetector.prototype.leavingProject = function() {
  return !this.week2.onProject();
}

DeltaDetector.prototype.joiningProject = function() {
  return !this.week1.onProject() && this.week2.onProject();
}

function DeltaRecords() {
  this.records = {};
}

DeltaRecords.prototype.goingOnVacation = function(person, project, location) {
  this.records[person.id] = new GoingOnVacationDelta({
    person: person,
    project: project,
    location: location
  });
}

DeltaRecords.prototype.returningFromVacation = function(person, project, location) {
  this.records[person.id] = new ReturningFromVacationDelta({
    person: person,
    project: project,
    location: location
  });
}

DeltaRecords.prototype.leavingProject = function(person, project, location) {
  if (this.records[person.id]) {
    this.records[person.id].addLeavingProject(project);
  } else {
    this.records[person.id] = new RotationDelta({
      person: person,
      leavingProject: project,
      location: location
    });
  }
}

DeltaRecords.prototype.joiningProject = function(person, project, location) {
  if (this.records[person.id]) {
    this.records[person.id].addJoiningProject(project)
  } else {
    this.records[person.id] = new RotationDelta({
      person: person,
      joiningProject: project,
      location: location
    });
  }
}

DeltaRecords.prototype.render = function(renderer) {
  $.each(this.records, function(index, record) {
    renderer.addRecord(record);
  });
  return renderer.render();
}

DeltaRecords.prototype.sort_by_type = function(record1, record2) {
  if (record1.sortIndex() == record2.sortIndex()) {
    return 0;
  }
  if (record1.sortIndex() > record2.sortIndex()) {
    return 1;
  }
  return -1;
}

function GoingOnVacationDelta(data) {
  this.person = data.person;
  this.project = data.project;
  this.location = data.location;
}

GoingOnVacationDelta.prototype.type = function() {
  return 'going-on-vacation';
}

GoingOnVacationDelta.prototype.sortIndex = function() {
  return 2;
}
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
      return "(" + locationMap(record.location) + ") <strong>" + record.person.name + "</strong> taking a vacation from <strong>" + projectMap(record.project) + "</strong>";
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

HtmlRenderer.prototype.render = function() {
  var sections = [];
  if (this.result["rotation"].length > 0) {
    sections.push("<i>Rotations</i><br />" + this.result["rotation"].join("<br />"));
  }
  if (this.result["going-on-vacation"].length > 0) {
    sections.push("<i>Going on Vacation</i><br />" + this.result["going-on-vacation"].join("<br />"));
  }
  if (this.result["returning-from-vacation"].length > 0) {
    sections.push("<i>Returning from Vacation</i><br />" + this.result["returning-from-vacation"].join("<br />"));
  }
  return sections.join("<br /><br />");
}


function Location(data) {
  this.id = data.id;
  this.name = data.name;
}
function MapFactory(map) {
  map = map || {};
  return function(value) {
    return map[value.name] || value.name;
  }
}
function Person(data) {
  this.id = data.id;
  this.name = data.name;
}
function Project(data) {
  this.id = data.id;
  this.name = data.name;
}
function ReturningFromVacationDelta(data) {
  this.person = data.person;
  this.project = data.project;
  this.location = data.location;
}

ReturningFromVacationDelta.prototype.type = function() {
  return 'returning-from-vacation';
}

ReturningFromVacationDelta.prototype.sortIndex = function() {
  return 3;
}



function RotationDelta(data) {
  this.person = data.person;
  this.leavingProject = data.leavingProject || {};
  this.joiningProject = data.joiningProject || {};
  this.location = data.location;
}

RotationDelta.prototype.addJoiningProject = function(project) {
  this.joiningProject = project;
}

RotationDelta.prototype.addLeavingProject = function(project) {
  this.leavingProject = project;
}

RotationDelta.prototype.type = function() {
  return 'rotation';
}

RotationDelta.prototype.sortIndex = function() {
  return 1;
}

function TextRenderer(locationMap, projectMap) {
  this.locationMap = locationMap || new MapFactory({});
  this.projectMap = projectMap || new MapFactory({});
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


function TimelinesParser() {
}

TimelinesParser.prototype.parse = function(projectData) {
  var deltaRecords = new DeltaRecords();
  $.map(projectData, function(record) {
    var location = new Location(record.project.location);
    var currentProject = new Project(record.project);
    $.each(record.slots, function(index, slot) {
      if (!slot.person) {
        return; //no tests for this.
      }
      var person = new Person(slot.person);
      var week1 = new Week(slot.weeks[0]);
      var week2 = new Week(slot.weeks[1]);
      var deltaDetector = new DeltaDetector(week1, week2);
      if (deltaDetector.leavingProject()) {
        deltaRecords.leavingProject(person, currentProject, location);
      }
      if (deltaDetector.joiningProject()) {
        deltaRecords.joiningProject(person, currentProject, location);
      }
      if (deltaDetector.goingOnVacation()) {
        deltaRecords.goingOnVacation(person, currentProject, location);
      }
      if (deltaDetector.returningFromVacation()) {
        deltaRecords.returningFromVacation(person, currentProject, location);
      }
    })
  });
  return deltaRecords;
}

function Vacation() {
  this.id = null;
  this.name = "Vacation";
}
function Week(data) {
  this.startOn = data.start_on
  this.days = data.days;
}

Week.prototype.onVacation = function() {
  var vacationDays = $.grep(this.days, function(day) { return day.on_vacation; });
  return vacationDays.length >= 3;
}

Week.prototype.onProject = function() {
  var projectDays = $.grep(this.days, function(day) { return day.on_project; });
  return projectDays.length >= 3;
}
