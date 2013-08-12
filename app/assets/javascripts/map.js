// really, really, ridiculously (good looking) big object for our app
var solarEyes = {
    areasArray: [],
    originalTableData: [],
    input: "",
    oilBarrels: "",
    oilPrice: "",
    width: "",
    height: "",
    gradient: "",
    d3Data: [],
    stateInfo: function () {
        // function to grab JSON data from #index action in home_controller.rb
        // calls createAreas() function after receiving JSON data and passes the data as an argument
        // calls saveOriginalTableData() function after receiving JSON data and passes the data as an argument

        var that = this;
        $.ajax({
            url: '/home',
            dataType: 'json',
            data: 'GET'
        }).done(function (data) {
            console.log(data);
            that.createAreas(data);
            that.saveOriginalTableData(data);
        });
    },
    getOilPrice: function () {
        // function to grab JSON data from #get_oil_price action in home_controller.rb
        // assigns JSON data as oilPrice value
        // JSON data is latest crude oil stock price from Yahoo finance API

        var that = this;
        $.ajax({
            url: '/get_oil_price',
            dataType: 'json',
            data: 'GET'
        }).done(function (data) {
            console.log("get oil price data: " + data);
            that.oilPrice = data;
        });
    },
    enterKey: function (e) {
        // function lets user hit 'enter' key to submit desired input value
        // called by event listener when the map loads

        if (e.which == 13) {
            console.log("enter key pressed");
            solarEyes.mapClick();
        }

    },
    mapClick: function () {
        // function for when user clicks on calculate button
        // called by solarEyes.enterKey() and click event listener when the map loads

        var stateBarrels,
            stateAbbreviation,
            originalTableDataLength,
            calculation,
            oilCalculation,
            svg,
            installVal;

        console.log('map clicked');

        // if else statement to handle invalid user input
        // assigns user input as value to variable input
        installVal = parseInt($('#installs').val(), 10);
        if (installVal > 0) {
            solarEyes.input = installVal;
            console.log(solarEyes.input);
        } else {
            solarEyes.input = 0;
        }

        console.log("user input: " + solarEyes.input);
        console.log("oil price: " + solarEyes.oilPrice);

        // assigns id attribute of the state that the user clicked on to variable stateAbbreviation
        stateAbbreviation = $(".state-abbreviation").attr("id");

        // assigns value of variable stateBarrels to be equal to the number of barrels of oil (misleadingly named 'description') of the object in originalTableData array whose id is the same as stateAbbreviation
        originalTableDataLength = solarEyes.originalTableData.length;
        for (var k = 0; k < originalTableDataLength; k++) {
            if (solarEyes.originalTableData[k].id === stateAbbreviation) {
                stateBarrels = solarEyes.originalTableData[k].description;
            }
        }

        // updates text value of element in DOM
        calculation = solarEyes.input * stateBarrels;
        console.log("calculation: " + calculation);
        $('#barrels-display').text(calculation.formatMoney(2, '.', ','));

        // updates text value of element in DOM
        oilCalculation = solarEyes.input * stateBarrels * solarEyes.oilPrice;
        console.log("oilCalculation: " + oilCalculation);
        $('#oil-value').text(oilCalculation.formatMoney(2, '.', ','));

        // d3 oil drop visualization
        width = 290;
        height = 200;

        $("#d3-div").empty();

        d3DataArrayElementToBePushed = calculation / 30;
        if (d3DataArrayElementToBePushed > 90) {
            d3DataArrayElementToBePushed = 90;
            solarEyes.d3Data.push(d3DataArrayElementToBePushed);
        } else {
            solarEyes.d3Data.push(d3DataArrayElementToBePushed);
        }

        // solarEyes.d3Data.push(d3DataArrayElementToBePushed);
        console.log(solarEyes.d3Data);

        var startVal = solarEyes.d3Data.slice(-2)[0];
        var endVal = solarEyes.d3Data.slice(-1)[0];

        console.log('startVal: ' + startVal + '/ endVal: ' + endVal);

        svg = d3.select("#d3-div").append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + width / 8 + "," + height / 2.3 + ")");

        gradient = svg.append("defs").append("linearGradient")
            .attr("id", "gradient")
            .attr("x1", "0%")
            .attr("y1", "20%")
            .attr("x2", "20%")
            .attr("y2", "100%");

        gradient.append("stop")
            .attr("offset", "20%")
            .attr("stop-color", "#ccf");

        gradient.append("stop")
            .attr("offset", "70%")
            .attr("stop-color", "#1C425C");

        gradient.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", "#19162B");

        // declare start value and transition to input value for animation
        svg.selectAll("path")
            .data(d3.range(endVal))
            .enter().append("path")
            .attr("fill", "url(#gradient)")
            .transition()
            .duration(1000)
            .ease("elastic")
            .attr("d", function() { return oildrop(Math.random() * 4500); })
            .attr("transform", function(d) {
              return "translate(" + (Math.random() * width / 1.6) + ",10)";
            });

        function oildrop(size) {
          var r = Math.sqrt(size / Math.PI);
          return "M" + r + ",0"
              + "A" + r + "," + r + " 0 1,1 " + -r + ",0"
              + "C" + -r + "," + -r + " 0," + -r + " 0," + -3*r
              + "C0," + -r + " " + r + "," + -r + " " + r + ",0"
              + "Z";
        }

        d3.select("#d3-div")
            .on("mouseover", function() {
            console.log("mouseover animation");
            svg.selectAll("path")
            .data(d3.range(endVal))
            .transition()
            .duration(2000)
            .each("start", function() {
               d3.select(this)
               .attr("fill", "url(#gradient)");
            })
            .ease("elastic")
            .attr("d", function() { return oildrop(Math.random() * 4500); })
            .attr("transform", function(d) {
              return "translate(" + (Math.random() * width / 1.6) + ",10)";
            });

            function oildrop(size) {
          var r = Math.sqrt(size / Math.PI);
          return "M" + r + ",0"
              + "A" + r + "," + r + " 0 1,1 " + -r + ",0"
              + "C" + -r + "," + -r + " 0," + -r + " 0," + -3*r
              + "C0," + -r + " " + r + "," + -r + " " + r + ",0"
              + "Z";
        }
        });

        d3.select("#calc-button")
            .on("click", function() {
            console.log("click animation");
            svg.selectAll("path")
            .data(d3.range(endVal))
            .transition()
            .duration(2000)
            .each("start", function() {
               d3.select(this)
               .attr("fill", "url(#gradient)");
            })
            .ease("elastic")
            .attr("d", function() { return oildrop(Math.random() * 4500); })
            .attr("transform", function(d) {
              return "translate(" + (Math.random() * width / 1.6) + ",10)";
            });

        function oildrop(size) {
          var r = Math.sqrt(size / Math.PI);
          return "M" + r + ",0"
              + "A" + r + "," + r + " 0 1,1 " + -r + ",0"
              + "C" + -r + "," + -r + " 0," + -r + " 0," + -3*r
              + "C0," + -r + " " + r + "," + -r + " " + r + ",0"
              + "Z";
        }
        });

    },
    area: {
        // object to clone
        id: "",
        description: ""
    },
    createAreas: function (data) {
        // function readies areas attribute of var dataProvider in makeMap function
        // calls makeMap()

        var j,
            newArea,
            createAreasDataLength;

        // creates content for each State balloon that the user will see after clicking on a state on the map
        createAreasDataLength = data.length;
        for (j = 0; j < createAreasDataLength; j++) {
            newArea = Object.create(this.area);
            newArea.id = data[j].state_name;
            newArea.description = '<div class="input-group"><span class="input-group-addon"><span class="glyphicons glyphicon-sun" style="color:#FFCC21"></span> &nbsp;</span><input type="number" class="form-control" autofocus="true" placeholder="installs" id="installs"><span class="input-group-btn"><button class="btn btn-primary" type="button" id="calc-button">Calculate</button></span></div><p style="line-height:"3px"> </p><span class="glyphicon glyphicon-tint"></span> barrels saved/year: <span id="barrels-display"> '+ this.input +' </span><br><span class="glyphicon glyphicon-usd" style="color:#00AB01"></span> value: <span id="oil-value"></span><span class="state-abbreviation" id=' + data[j].state_name + '></span><br><br><div id="d3-div"> </div>';
            this.areasArray.push(newArea);
        }
        this.makeMap();
    },
    saveOriginalTableData: function (data) {
        // saves JSON data in originalTableData array

        var i,
            newTableData,
            saveOriginalTableDataLength;

        saveOriginalTableDataLength = data.length;
        for (i = 0; i < saveOriginalTableDataLength; i ++) {
            newTableData = Object.create(this.area);
            newTableData.id += data[i].state_name;
            newTableData.description += data[i].barrels_of_oil_per_year;
            this.originalTableData.push(newTableData);
        }
    },
    makeMap: function () {
        var map,
            dataProvider;

        // create AmMap object
        map = new AmCharts.AmMap();

        fitMapToContainer = true;
        // set path to images
        map.pathToImages = "/assets/";

        map.balloon.adjustBorderColor = true;
        map.balloon.borderColor = "#BDBDBD";
        map.balloon.color = "#333333";
        map.balloon.fillColor = "#FFFFFF";
        map.balloon.cornerRadius = "3";
        map.balloon.borderThickness = "1";
        map.balloon.fontSize = "20";
        map.balloon.horizontalPadding = "5";
        map.balloon.textShadowColor = "#FFFFFF";
        map.balloon.fillAlpha = "0.8";
        map.fontFamily = "HelveticaNeue-Light";

        /* create data provider object
         mapVar tells the map name of the variable of the map data. You have to
         view source of the map file you included in order to find the name of the
         variable - it's the very first line after commented lines.

         getAreasFromMap indicates that amMap should read all the areas available
         in the map data and treat them as they are included in your data provider.
         in case you don't set it to true, all the areas except listed in data
         provider will be treated as unlisted.
        */
        dataProvider = {
            mapVar: AmCharts.maps.usaHigh,
            getAreasFromMap:true,

            areas: this.areasArray,

            zoomLevel: .6,
            zoomLongitude: 150,
            zoomLatitude: -80
        };

        /* create area settings
         * autoZoom set to true means that the map will zoom-in when clicked on the area
         * selectedColor indicates color of the clicked area.
         */
        map.areasSettings = {
            autoZoom: true,
            descriptionWindowY: 300,
            descriptionWindowWidth: 275,
            descriptionWindowHeight: 335,
            rollOverColor: "#60ABEB",
            rollOverOutlinecolor: "#3277BA",
            selectedColor: "#60ABEB"
        };

        // pass data provider to the map object
        map.dataProvider = dataProvider;

        // let's say we want a small map to be displayed, so let's create it
        // map.smallMap = new AmCharts.SmallMap();

        // write the map to container div
        map.write("mapdiv");

    }
};

// For cloning objects
if (typeof Object.create !== 'function') {
  Object.create = function(o) {
    var F = function() {};
    F.prototype = o;
    return new F();
  };
}

// TODO Better variable names here
// This is from StackOverflow to format numbers with commas, no idea what the variables actually are
Number.prototype.formatMoney = function(c, d, t){
var n = this,
    c = isNaN(c = Math.abs(c)) ? 2 : c,
    d = d == undefined ? "." : d,
    t = t == undefined ? "," : t,
    s = n < 0 ? "-" : "",
    i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
    j = (j = i.length) > 3 ? j % 3 : 0;
   return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
 };

// responsible for page load
AmCharts.ready(function() {

    solarEyes.stateInfo();
    solarEyes.getOilPrice();

    // event listeners
    $('#mapdiv').on('click', '#calc-button', solarEyes.mapClick);
    $('#mapdiv').on('keyup', '#installs', solarEyes.enterKey);

});
