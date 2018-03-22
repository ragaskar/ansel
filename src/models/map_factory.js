function MapFactory(map) {
  map = map || {};
  return function(value) {
    return map[value.name] || value.name;
  }
}
