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

