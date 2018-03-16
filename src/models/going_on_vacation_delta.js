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
