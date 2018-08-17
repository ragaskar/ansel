function AllocationAnalyzer(allocations) {
  this.allocations = allocations;
}

AllocationAnalyzer.prototype.deltaRecord = function() {
  if (this.allocations > 2) {
    console.log(this.allocations);
    throw "Unexpected number of allocations (more than 2)";
  }
  if (this.allocations.length == 1) {
    //no project change, just handle vacation
    var allocation = this.allocations[0];
    if (allocation.goingOnVacation()) {
      return new GoingOnVacationDelta(allocation);
    }
    if (allocation.returningFromVacation) {
      return new ReturningFromVacationDelta(allocation);
    }
  }
  if (allocations.length == 2) {
    //we may have heard about the records in the "wrong" order (wrong chronological). 
    var orderedSlots = this.allocations.sort(this.sortByOnProject);
    var allocation1 = orderedSlots[0];
    var allocation2 = orderedSlots[1];
    //for vacation we only care about allocation 2.
    if (allocation2.goingOnVacation()) {
      return new GoingOnVacationDelta(allocation2);
    } else {
      return new ReturningFromVacationDelta(allocation2);
    }
    if (allocation1.project.id != allocation2.project.id) {
      return new RotationDelta(allocation1, allocation2);
    }
  }
}

AllocationAnalyzer.prototype.sortByOnProject = function(allocation1,allocation2) {
  if (allocation1.onProjectIndex() == record2.onProjectIndex()) {
    return 0;
  }
  if (record1.onProjectIndex() > record2.onProjectIndex()) {
    return 1;
  }
  return -1;
}

AllocationAnalyzer.prototype.goingOnVacation = function() {
  return !this.week1.onVacation() && this.week2.onVacation();
}

AllocationAnalyzer.prototype.returningFromVacation = function() {
  return this.week1.onVacation() && !this.week2.onVacation();
}

AllocationAnalyzer.prototype.leavingProject = function() {
  return !this.week2.onProject();
}

AllocationAnalyzer.prototype.joiningProject = function() {
  return !this.week1.onProject() && this.week2.onProject();
}

