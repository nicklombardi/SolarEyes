//Test the Object.create method
describe("Object", function() {
    it("should have a create method to duplicate objects", function() {
        var o = {name: "team purple octopodes"};
        var o2 = Object.create(o);
        expect(o2.name).toBe("team purple octopodes");
    });
});

//Test the Number.prototype.formatMoney method
describe("Number.prototype", function() {
    it("should have a formatMoney method to format a number to include commas and decimal places where appropriate for US currency", function() {
        var num = 4500;
        expect(num.formatMoney(2, '.', ',')).toBe("4,500.00");
    });
});

// describe("stateInfo()", function() {
//     it("should make an AJAX request", function() {

//     });
// });

// describe("enterKey()", function() {
//     it("should call the makClick() function when the enter key is pressed", function() {

//     });
// });