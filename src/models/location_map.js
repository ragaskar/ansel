function LocationMap() {
  return function(value) {
    return {
      "Tokyo": "NRT"
    }[value.name] || value.name;
  }
}
