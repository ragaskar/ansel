function Allocation(project, slot) {
  this.project = project;
  this.person = slot.person;
  this.slot = slot;
}


Allocation.prototype.id = function() {
  return this.person.id;
}

Allocation.prototype.onProjectIndex = function() {
  var week1 = new Week(this.slots.weeks[0]);
  var week2 = new Week(this.slots.weeks[1]);
  if (week1.onProject()) {
    return 0;
  }
  if (week2.onProject()) {
    return 1;
  }

}
