function TimelinesParser() {
}

TimelinesParser.prototype.parse = function(projectData) {
  var deltaRecords = new DeltaRecords();
  $.map(projectData, function(record) {
    var currentProject = new Project(record.project);
    $.each(record.slots, function(index, slot) {
      if (!slot.person) {
        return; //no tests for this.
      }
      var allocation = new Allocation(currentProject, slot);
      deltaRecords.addData(allocation);
    })
  });
  return deltaRecords;
}





