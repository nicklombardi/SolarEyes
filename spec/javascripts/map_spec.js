//Test the Object.create method
describe("Object", function() {
  it("should have a create method to duplicate objects", function() {
    var o = {name: "team purple octopodes"};
    var o2 = Object.create(o);
    expect(o2.name).toBe("team purple octopodes");
  });
});

