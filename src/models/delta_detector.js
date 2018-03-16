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

