describe("ObjectMother", function() {
  var mother;

  beforeEach(function() {
    mother = new ObjectMother();
  });

  describe("weeks", function() {
    it("week_on_vacation returns true for onVacation()", function() {
      var week = mother.week_on_vacation();
      expect(week.onVacation()).toBe(true);
    });
    it("week_on_project returns true for onProject()", function() {
      var week = mother.week_on_project();
      expect(week.onProject()).toBe(true);
    });
    it("week_off_project returns true for onProject()", function() {
      var week = mother.week_off_project();
      expect(week.onProject()).toBe(false);
    });
  });

  describe("person", function() {
    it("should return people with a name and incrementing ids", function() {
        var person_1 = mother.person();
        var person_2 = mother.person();
        expect(person_2.id).toBeGreaterThan(person_1.id);
        expect(person_1.name).toBeTruthy();
        expect(person_2.name).toBeTruthy();
    });
  });

  describe("project", function() {
    it("should return people with a name and incrementing ids", function() {
        var project_1 = mother.project();
        var project_2 = mother.project();
        expect(project_2.id).toBeGreaterThan(project_1.id);
        expect(project_1.name).toBeTruthy();
        expect(project_2.name).toBeTruthy();
    });
  });

  describe("location", function() {
    it("should return people with a name and incrementing ids", function() {
        var location_1 = mother.location();
        var location_2 = mother.location();
        expect(location_2.id).toBeGreaterThan(location_1.id);
        expect(location_1.name).toBeTruthy();
        expect(location_2.name).toBeTruthy();
    });
  });


});
