describe("Allocation Analyzer", function() {


  describe("deltaRecord", function() {

    describe("When there is just 1 slot", function() {
      it("returns goingOnVacation delta if slots show pivot going on vacation", function() {


        var slotData = {"id":96616,
          "start_on":"2018-02-05",
          "finish_on":"2018-06-10",
          "role":{"id":13,"name":"Designer"},
          "person":{"id":4345,"name":"Meghan Radke"},
          "imported":false,
          "weeks":[{"start_on":"2018-03-19",
            "days":[
              {"on_project":true,"on_vacation":false},
              {"on_project":true,"on_vacation":false},
              {"on_project":true,"on_vacation":false},
              {"on_project":true,"on_vacation":false},
              {"on_project":true,"on_vacation":false}]},
              {"start_on":"2018-03-26",
                "days":[{"on_project":true,"on_vacation":true},
                  {"on_project":true,"on_vacation":true},
                  {"on_project":true,"on_vacation":false},
                  {"on_project":true,"on_vacation":false},
                  {"on_project":true,"on_vacation":true}]}]}
                  var mother = new ObjectMother();
                  var goingOnVacationSlot = mother.vacationSlot(); 
      });
      it("returns returningFromVacation delta if slots show pivot returning from vacation", function() {

      });
    });
    describe("goingOnVacation", function() {
      it("returns true if week1 is not a vacation week and week2 is a vacation week (irrespective of on/off project)", function() {
      });
      it("returns false if week1 and week2 are vacation weeks", function() {
        mother = new ObjectMother();
        var week1 = mother.week_on_vacation();
        var week2 = mother.week_on_vacation();
        detector = new DeltaDetector(week1, week2);
        expect(detector.goingOnVacation()).toBe(false);
      });
    });

    describe("returningFromVacation", function() {
      it("returns true if week1 is a vacation week and week2 is not a vacation week", function() {
        mother = new ObjectMother();
        var week1 = mother.week_on_vacation();
        var week2 = mother.week_on_project();
        detector = new DeltaDetector(week1, week2);
        expect(detector.returningFromVacation()).toBe(true);
      });
      it("returns false if week1 and week2 are on_project weeks", function() {
        mother = new ObjectMother();
        var week1 = mother.week_on_project();
        var week2 = mother.week_on_project();
        detector = new DeltaDetector(week1, week2);
        expect(detector.returningFromVacation()).toBe(false);
      });
    });

    describe("leavingProject", function() {
      //I don't think we care about the state of week1, we should assume it is an
      //on_project week because otherwise the person would not show up on the project at all.
      it("returns true if week2 is not an on_project week", function() {
        mother = new ObjectMother();
        var week1 = mother.week_on_project();
        var week2 = mother.week_off_project();
        detector = new DeltaDetector(week1, week2);
        expect(detector.leavingProject()).toBe(true);
      });
      it("returns false if week2 is an on_project week", function() {
        mother = new ObjectMother();
        var week1 = mother.week_on_project();
        var week2 = mother.week_on_project();
        detector = new DeltaDetector(week1, week2);
        expect(detector.leavingProject()).toBe(false);
      });
    });

    describe("joiningProject", function() {
      it("returns true if week1 is an off project week and week2 is an on project week", function() {
        mother = new ObjectMother();
        var week1 = mother.week_off_project();
        var week2 = mother.week_on_project();
        detector = new DeltaDetector(week1, week2);
        expect(detector.joiningProject()).toBe(true);
      });
      it("returns false if week1 is an on project week and week2 is an on project week", function() {
        mother = new ObjectMother();
        var week1 = mother.week_on_project();
        var week2 = mother.week_on_project();
        detector = new DeltaDetector(week1, week2);
        expect(detector.joiningProject()).toBe(false);
      });
    });
  });

});
