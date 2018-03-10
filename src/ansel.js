var startOn = new Date(Date.parse($('input#start_on').val())).toISOString().split('T')[0];
var groupIds = $.makeArray($('input[name="group_ids"]').map(function() { return $(this).val(); }));
var locationIds = $.makeArray($('input[name="location_ids"]').map(function() { return $(this).val(); }));

function Delta(data) {
  this.person = data.person;
  this.fromProject = data.fromProject;
  this.toProject = data.toProject;
  this.location = data.location;
}

function Location(data) {
  this.id = data.id;
  this.name = data.name;
}

function Project(data) {
  this.id = data.id;
  this.name = data.name;
}

function Vacation() {
  this.id = null;
  this.name = "Vacation";
}

function Person(data) {
  this.id = data.id;
  this.name = data.name;
}

function Week(data) {
  this.startOn = data.start_on
  this.days = data.days;
}

function Week.onVacation() {
  var vacationDays = $(this.days).filter(function(day) { return day.on_vacation == "true" });
  return vacationDays.length > 3;
}

function Week.onProject() {
  var projectDays = $(this.days).filter(function(day) { return day.on_project == "true" });
  return projectDays.length >= 1;
}

function DeltaDetector(week1, week2) {
  this.week1 = week1;
  this.week2 = week2;
}

function TimelinesParser() {
}

function DeltaRecords() {
  this.records = {};
}

function DeltaRecords.addVacation(person, project, location) {
  this.records[person.id] = new Delta({
    person: person,
    fromProject: project,
    toProject: new Vacation(),
    location: location
  });
}

function DeltaRecords.leavingProject(person, project, location) {
  if (this.records[person.id]) {
    this.records[person.id].fromProject = project;
  } else {
    this.records[person.id] = new Delta({
      person: person,
      fromProject: project,
      toProject: null,
      location: location
    });
  }
}

function DeltaRecords.joiningProject(person, project, location) {
  if (this.records[person.id]) {
    this.records[person.id].toProject = project;
  } else {
    this.records[person.id] = new Delta({
      person: person,
      fromProject: null,
      toProject: project,
      location: location
    });
  }
}


TimelinesParser.parse = function(response) {
  var deltaRecords = new DeltaRecords();
  var projects = response.data;
  $.map(projects, function(project) {
    var location = new Location(project.location);
    var currentProject = new Project(project.project);
    $.each(project.slots, function(slot) {
      var person = new Person(slot.person);
      var week1 = new Week(slot.weeks[0]);
      var week2 = new Week(slot.weeks[1]);
      var deltaDetector = new DeltaDetector(week1, week2);
      if (deltaDetector.goingOnVacation()) {
        deltaRecords.addVacation(person, project, location);
      }
      if (deltaDetector.leavingProject()) {
        deltaRecords.leavingProject(person, project, location);
      }
      if (deltaDetector.joiningProject()) {
        deltaRecords.joiningProject(person, project, location);
      }
    })
  });
}

$.getJSON("/api/timelines", {
  per_page: 100,
  start_on: startOn,
  number_of_weeks:2,
  group_ids: groupIds.join(','),
  location_ids: locationIds.join(','),
  page:1
},
function(data) {
  console.log(data);
});
