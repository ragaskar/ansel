function ObjectMother() {
  this.personId = 0;
  this.projectId = 0;
  this.locationId = 0;
}

ObjectMother.prototype.personName = function() {
  var first_names = ['Julian', 'Adrian', 'Griffin', 'Tomas', 'Owen', 'Filipe', 'Michel', 'Michael', 'Adriano', 'Mick', 'Kanoa', 'Mikey', 'Gabriel', 'Jordy', 'Kolohe', 'Joel'];
  var last_names = ['Wilson', 'Buchan', 'Colapinto', 'Hermes', 'Wright', 'Toledo', 'Bourez', 'Rodrigues', 'de Souza', 'Fanning', 'Igarashi', 'Wright', 'Medina', 'Smith', 'Andino', 'Parkinson'];
  return [this.random(first_names), this.random(last_names)].join(' ');
}

ObjectMother.prototype.projectName = function() {
  var projects = [
    'Quiksilver Pro Gold Coast',
    'Rip Curl Pro Bells Beach',
    'Margaret River Pro',
    'Oi Rio Pro',
    'Bali Pro',
    'Corona Open J-Bay',
    'Tahiti Pro Teahupo\'o',
    'Surf Ranch Lemoore',
    'Quiksilver Pro France',
    'MEO Rip Curl Pro Portugal',
    'Billabong Pipe Masters'
  ]
  return this.random(projects);
}

ObjectMother.prototype.locationName = function() {
  var projects = [
    'Australia',
    'Brazil',
    'Indonesia',
    'South Africa',
    'Tahiti',
    'California',
    'France',
    'Portugal',
    'Hawaii'
  ]
  return this.random(projects);
}

ObjectMother.prototype.random = function(arr) {
  return arr[Math.floor(Math.random()*arr.length)]
}

ObjectMother.prototype.person = function(attrs) {
  return new Person($.extend({
    name: this.personName(),
    id: this.getNextPersonId()
  },
  attrs || {}))
}

ObjectMother.prototype.project = function(attrs) {
  return new Project($.extend({
    name: this.projectName(),
    id: this.getNextProjectId()
  },
  attrs || {}))
}

ObjectMother.prototype.location = function(attrs) {
  return new Location($.extend({
    name: this.locationName(),
    id: this.getNextLocationId()
  },
  attrs || {}))
}

ObjectMother.prototype.getNextPersonId = function() {
  this.personId++;
  return this.personId;
}

ObjectMother.prototype.getNextProjectId = function() {
  this.projectId++;
  return this.projectId;
}

ObjectMother.prototype.getNextLocationId = function() {
  this.locationId++;
  return this.locationId;
}

ObjectMother.prototype.week = function(attrs) {
  return new Week(
    $.extend({
    start_on: "2018-03-05",
    days: [
      {on_project: true, on_vacation: false},
      {on_project: true, on_vacation: false},
      {on_project: true, on_vacation: false},
      {on_project: true, on_vacation: false},
      {on_project: true, on_vacation: false}
    ]},
    attrs || {})
  );
}

ObjectMother.prototype.week_on_project = function(attrs) {
  return this.week($.extend(attrs || {}, {
    days: [
      {on_project: true, on_vacation: false},
      {on_project: true, on_vacation: false},
      {on_project: true, on_vacation: false},
      {on_project: true, on_vacation: false},
      {on_project: true, on_vacation: false}
    ]
  }));
}

ObjectMother.prototype.week_off_project = function(attrs) {
  return this.week($.extend(attrs || {}, {
    days: [
      {on_project: false, on_vacation: false},
      {on_project: false, on_vacation: false},
      {on_project: false, on_vacation: false},
      {on_project: false, on_vacation: false},
      {on_project: false, on_vacation: false}
    ]
  }));
}

ObjectMother.prototype.week_on_vacation = function(attrs) {
  return this.week($.extend(attrs || {}, {
    days: [
      {on_project: true, on_vacation: true},
      {on_project: true, on_vacation: true},
      {on_project: true, on_vacation: true},
      {on_project: true, on_vacation: true},
      {on_project: true, on_vacation: true}
    ]
  }));
}
