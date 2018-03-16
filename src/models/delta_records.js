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

