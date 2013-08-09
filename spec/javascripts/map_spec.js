//Test the Object.create method
describe("Object", function () {
    it("should have a create method to duplicate objects", function () {
        var o = {name: "team purple octopodes"};
        var o2 = Object.create(o);
        expect(o2.name).toBe("team purple octopodes");
    });
});

//Test the Number.prototype.formatMoney method
describe("Number.prototype", function () {
    it("should have a formatMoney method to format a number to include commas and decimal places where appropriate for US currency", function () {
        var num = 4500;
        expect(num.formatMoney(2, '.', ',')).toBe("4,500.00");
    });
});

//Test solarEyes methods
describe("solarEyes", function () {
    //Test stateInfo()
    describe("stateInfo", function () {
        it("should make an AJAX request", function () {

        });

        it("should call createAreas()", function () {

        });

        it("should call saveOriginalTableData()", function () {

        });
    });
    //Test getOilPrice()
    describe("getOilPrice", function () {
        it("should make an AJAX request", function () {

        });

        it("should assign a value to oilPrice", function () {

        });
    });
    //Test enterKey()
    describe("enterKey", function () {
        it("should call mapClick()", function () {

        });
    });
    //Test mapClick()
    describe("mapClick", function () {
        it("should assign a value to input", function () {

        });
    });
    //Test createAreas()
    describe("createAreas", function () {
        it("should populate areasArray", function () {

        });

        it("should call makeMap()", function () {
            spyOn(solarEyes, "makeMap");
            var data = [1, 2, 3];
            solarEyes.createAreas(data);
            expect(solarEyes.makeMap).toHaveBeenCalled();
        });
    });
    //Test saveOriginalTableData()
    describe("saveOriginalTableData", function () {

        it("should populate originalTableData", function () {
            var data = [{state_name: 'US-NY', barrels_of_oil_per_year: 10}, {state_name: 'US-VA', barrels_of_oil_per_year: 20}];
            solarEyes.saveOriginalTableData(data);
            expect(solarEyes.originalTableData).toEqual([{id: 'US-NY', description: '10'}, {id: 'US-VA', description: '20'}]);
        });
    });
    //Test makeMap()
    describe("makeMap", function () {
        it("should call write('mapdiv')", function () {

        });
    });
});

//Test AmCharts
describe("AmCharts", function () {

    it("should have a ready method", function () {

    });

    it("should call stateInfo()", function () {

    });

    it("should call getOilPrice()", function () {

    });
});