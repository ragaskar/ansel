describe("Week", function() {
  var mother;
  beforeEach(function() {
    mother = new ObjectMother();
  });

  describe("onVacation", function() {
    it("returns true if the week has 3 or more days of vacation", function() {
      var week = mother.week({
        days: [
          {on_project: true, on_vacation: true},
          {on_project: true, on_vacation: true},
          {on_project: true, on_vacation: true},
          {on_project: true, on_vacation: false},
          {on_project: true, on_vacation: false}
        ]
      });
      expect(week.onVacation()).toBe(true);
    });

    it("returns false if the week has fewer than 3 days of vacation", function() {
      var week = mother.week({
        days: [
          {on_project: true, on_vacation: false},
          {on_project: true, on_vacation: true},
          {on_project: true, on_vacation: false},
          {on_project: true, on_vacation: true},
          {on_project: true, on_vacation: false}
        ]
      });
      expect(week.onVacation()).toBe(false);
    });
  });

  describe("onProject", function() {

    it("returns true if the week has 3 or more days of on_project", function() {
      var week = mother.week({
        days: [
          {on_project: true, on_vacation: false},
          {on_project: true, on_vacation: false},
          {on_project: true, on_vacation: false},
          {on_project: false, on_vacation: false},
          {on_project: false, on_vacation: false}
        ]
      });
      expect(week.onProject()).toBe(true);
    });

    it("still returns true if the week is a vacation week (more than 3 days of vacation), since you're still on the project", function() {
      var week = mother.week({
        days: [
          {on_project: true, on_vacation: false},
          {on_project: true, on_vacation: true},
          {on_project: true, on_vacation: true},
          {on_project: true, on_vacation: true},
          {on_project: true, on_vacation: false}
        ]
      });
      expect(week.onProject()).toBe(true);
    });

    it("returns false if the week has fewer than 3 days on project", function() {
      var week = mother.week({
        days: [
          {on_project: true, on_vacation: false},
          {on_project: true, on_vacation: false},
          {on_project: false, on_vacation: false},
          {on_project: false, on_vacation: false},
          {on_project: false, on_vacation: false}
        ]
      });
      expect(week.onProject()).toBe(false);
    });
  });

});
