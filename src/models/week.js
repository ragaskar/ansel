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
