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



