//Test the Object.create method
//this is fine
describe("Object", function () {
    it("should have a create method to duplicate objects", function () {
        var o = {name: "team purple octopodes"};
        var o2 = Object.create(o);
        expect(o2.name).toBe("team purple octopodes");
    });
});

//Test the Number.prototype.formatMoney method
//this is fine
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
        //this is fine
        it("should be called", function () {
            spyOn(solarEyes, "stateInfo");
            solarEyes.stateInfo();
            expect(solarEyes.stateInfo).toHaveBeenCalled();
        });

        //this is fine
        it("should make an AJAX request", function () {
            function fakeAjaxRequest () {
                $.ajax({
                url: '/home',
                dataType: 'json',
                data: 'GET'
                });
            }

            spyOn($, "ajax");
            fakeAjaxRequest();
            expect($.ajax.mostRecentCall.args[0]["url"]).toEqual("/home");
        });

        it("should call createAreas()", function () {
            spyOn(solarEyes, "createAreas");
            expect(solarEyes.createAreas).toHaveBeenCalled();
        });

        it("should call saveOriginalTableData()", function () {
            spyOn(solarEyes, "saveOriginalTableData");
            expect(solarEyes.saveOriginalTableData).toHaveBeenCalled();
        });
    });
    //Test getOilPrice()
    describe("getOilPrice", function () {
        //this is fine
        it("should be called", function () {
            spyOn(solarEyes, "getOilPrice");
            solarEyes.getOilPrice();
            expect(solarEyes.getOilPrice).toHaveBeenCalled();
        });

        //this is fine
        it("should not affect the value of oilPrice before being called", function () {
            expect(solarEyes.oilPrice).toBeFalsy();
        });

        //this is fine
        it("should make an AJAX request", function () {
            function fakeAjaxRequest () {
                $.ajax({
                url: '/get_oil_price',
                dataType: 'json',
                data: 'GET'
                });
            }

            spyOn($, "ajax");
            fakeAjaxRequest();
            expect($.ajax.mostRecentCall.args[0]["url"]).toEqual("/get_oil_price");
        });

    });
    //Test enterKey()
    //this is fine
    describe("enterKey", function () {
        it("should call mapClick()", function () {
            spyOn(solarEyes, "mapClick");
            var e = $.Event("keyup");
            e.which = 13;
            $("#installs").trigger(solarEyes.enterKey(e));
            expect(solarEyes.mapClick).toHaveBeenCalled();
        });
    });
    //Test mapClick()
    describe("mapClick", function () {
        //this is fine
        it("should not affect the value of input before being called", function () {
            expect(solarEyes.input).toBeFalsy();
        });
    });
    //Test createAreas()
    describe("createAreas", function () {
        it("should populate areasArray", function () {

        });
        //this is fine
        it("should call makeMap()", function () {
            spyOn(solarEyes, "makeMap");
            var data = [1, 2, 3];
            solarEyes.createAreas(data);
            expect(solarEyes.makeMap).toHaveBeenCalled();
        });
    });
    //Test saveOriginalTableData()
    //this is fine
    describe("saveOriginalTableData", function () {

        it("should populate originalTableData", function () {
            var data = [{state_name: 'US-NY', barrels_of_oil_per_year: 10}, {state_name: 'US-VA', barrels_of_oil_per_year: 20}];
            solarEyes.saveOriginalTableData(data);
            expect(solarEyes.originalTableData).toEqual([{id: 'US-NY', description: '10'}, {id: 'US-VA', description: '20'}]);
        });
    });
    //Test makeMap()
    describe("makeMap", function () {
        it("should define map", function () {
            spyOn(makeMap, "map");
            solarEyes.makeMap();
            expect(map).toBeTruthy();
        });
    });
});

//Test AmCharts
//Capybara??
describe("AmCharts", function () {

    it("should call stateInfo()", function () {
        spyOn(solarEyes, "stateInfo");

        expect(solarEyes.stateInfo).toHaveBeenCalled();
    });

    it("should call getOilPrice()", function () {
        spyOn(solarEyes, "getOilPrice");

        expect(solarEyes.getOilPrice).toHaveBeenCalled();
    });
});