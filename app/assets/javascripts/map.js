// global variables
var areasArray = [];
var originalTableData = [];

var input = "";

var oilBarrels = "";

var oil_price = "";

if (typeof Object.create !== 'function') {
  Object.create = function(o) {
    var F = function() {};
    F.prototype = o;
    return new F();
  };
}

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

// function to grab json data from #index action in home_controller.rb
function stateInfo() {
    $.ajax({
        url: '/home',
        dataType: 'json',
        data: 'GET'
    }).done(function(data){
        console.log(data);
        createAreas(data);
        saveOriginalTableData(data);
    });
}

function getOilPrice() {
    $.ajax({
        url: '/get_oil_price',
        dataType: 'json',
        data: 'GET'
    }).done(function(data){
        console.log("get oil price data: " + data);
        oil_price = data;
    });
}

function enterKey(){
    $("#installs").keyup(function (e) {
        if (e.keyCode == 13) {
            console.log("enter key pressed");
            mapClick();
        }
    });
}

// function intended for when user clicks on calculate button
function mapClick(){

    console.log('map clicked');

    if ($('#installs').val()) {
        input = $('#installs').val();
    } else {
        input = 0;
    }

    console.log("user input: " + input);
    console.log("oil price: " + oil_price);

    var stateAbbreviation = $(".state-abbreviation").attr("id");
    var stateBarrels;
    for (var k = 0; k < originalTableData.length; k++) {
        if (originalTableData[k].id === stateAbbreviation) {
            stateBarrels = originalTableData[k].description;
        }
    }

    var calculation = input * stateBarrels;
    $('#barrels-display').text(calculation.toFixed(2));

    var oilCalculation = input * stateBarrels * oil_price;
    $('#oil-value').text(oilCalculation.formatMoney(2, '.', ','));

}

// object to clone
var area = {
    id: "",
    description: ""
};

// function readies areas attribute of var dataProvider in makeMap function
function createAreas(data) {
    for (var j = 0; j < data.length; j++) {
        var newArea = Object.create(area);
        newArea.id = data[j].state_name;
        // based on Arizona
        newArea.description = '<div class="input-group"><span class="input-group-addon"><span class="glyphicons glyphicon-sun" style="color:#FFCC21"></span> &nbsp;</span><input type="number" class="form-control" autofocus="true" placeholder="installs" id="installs"><span class="input-group-btn"><button class="btn btn-primary" type="button" id="calc-button">Calculate</button></span></div><p style="line-height:"3px"> </p><span class="glyphicon glyphicon-tint"></span> barrels saved annually: <span id="barrels-display"> '+ input +' </span><br><span class="glyphicon glyphicon-usd" style="color#00AB01"></span> value: <span id="oil-value"></span><span class="state-abbreviation" id=' + data[j].state_name + '></span>';
        areasArray.push(newArea);
    }
    makeMap();
}

function saveOriginalTableData(data) {
    for (var i = 0; i < data.length; i ++) {
        var newTableData = Object.create(area);
        newTableData.id += data[i].state_name;
        newTableData.description += data[i].barrels_of_oil_per_year;
        originalTableData.push(newTableData);
    }
}

// content of this function originally inside amCharts.ready function
function makeMap(){
     // create AmMap object
    var map = new AmCharts.AmMap();

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
    var dataProvider = {
        mapVar: AmCharts.maps.usaHigh,
        getAreasFromMap:true,

        areas: areasArray,

        zoomLevel: 1,
        zoomLongitude: 18,
        zoomLatitude: 30
    };

    /* create areas settings
     * autoZoom set to true means that the map will zoom-in when clicked on the area
     * selectedColor indicates color of the clicked area.
     */
    map.areasSettings = {
        autoZoom: true,
        descriptionWindowY: 350,
        descriptionWindowWidth: 280,
        descriptionWindowHeight: 330,
        rollOverOutlineColor: "#3277BA",
        selectedColor: "#60ABEB"
    };

    // pass data provider to the map object
    map.dataProvider = dataProvider;

    // let's say we want a small map to be displayed, so let's create it
    // map.smallMap = new AmCharts.SmallMap();

    // write the map to container div
    map.write("mapdiv");

}

// add all your code to this method, as this will ensure that page is loaded
AmCharts.ready(function() {

    // call stateInfo function
    stateInfo();
    getOilPrice();

    $('#mapdiv').on('click', '#calc-button', mapClick);
    $('#mapdiv').on('keyup', enterKey);

});
