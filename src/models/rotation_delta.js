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

