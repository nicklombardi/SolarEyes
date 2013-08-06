// global variables
var areasArray = [];
var originalTableData = [];

var input = 0;

var oilBarrels = "";

if (typeof Object.create !== 'function') {
  Object.create = function(o) {
    var F = function() {};
    F.prototype = o;
    return new F();
  };
}

// function to grab json data from #index action in home_controller.rb
function stateInfo() {
    $.ajax({
        url: '/',
        dataType: 'json',
        data: 'GET'
    }).done(function(data){
        console.log(data);
        createAreas(data);
        saveOriginalTableData(data);
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
    console.log(input);

    var stateAbbreviation = $(".state-abbreviation").attr("id");
    var stateBarrels;
    for (var k = 0; k < originalTableData.length; k++) {
        if (originalTableData[k].id === stateAbbreviation) {
            stateBarrels = originalTableData[k].description;
        }
    }

    var calculation = input * stateBarrels;
    $('#barrels-display').text(calculation.toFixed(2));

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
        newArea.description = '<div class="input-group"><span class="input-group-addon"><span class="glyphicons glyphicon-sun" style="color:#FFCC21"></span> &nbsp;</span><input type="text" class="form-control" autofocus="true" placeholder="installs" id="installs"><span class="input-group-btn"><button class="btn btn-primary" type="button" id="calc-button">Calculate</button></span></div><p style="line-height:"3px"> </p><span class="glyphicon glyphicon-tint"></span> barrels saved annually: <span id="barrels-display"> '+ input +' </span><br><span class="glyphicon glyphicon-usd" style="color#00AB01"></span> value: <span class="state-abbreviation" id=' + data[j].state_name + '></span>';
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

        // areas: [{id:"US-AK", description: descriptionAK},{id:"US-AL", description: descriptionAL},{id:"US-AR", description: descriptionAR},{id:"US-AZ", description: descriptionAZ},{id:"US-CA"},{id:"US-CO"},{id:"US-CT"},{id:"US-DC"},{id:"US-DE"},{id:"US-FL"},{id:"US-GA"},{id:"US-HI"},{id:"US-IA"},{id:"US-ID"},{id:"US-IL"},{id:"US-IN"},{id:"US-KS"},{id:"US-KY"},{id:"US-LA"},{id:"US-MA"},{id:"US-MD"},{id:"US-ME"},{id:"US-MI"},{id:"US-MN"},{id:"US-MO"},{id:"US-MS"},{id:"US-MT"},{id:"US-NC"},{id:"US-ND"},{id:"US-NE"},{id:"US-NH"},{id:"US-NJ"},{id:"US-NM"},{id:"US-NV"},{id:"US-NY"},{id:"US-OH"},{id:"US-OK"},{id:"US-OR"},{id:"US-PA"},{id:"US-RI"},{id:"US-SC"},{id:"US-SD"},{id:"US-TN"},{id:"US-TX"},{id:"US-UT"},{id:"US-VA"},{id:"US-VT"},{id:"US-WA"},{id:"US-WI"},{id:"US-WV"},{id:"US-WY"}],

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

    $('#mapdiv').click(function(event) {
        mapClick();
        console.log(this);
    });
}

// add all your code to this method, as this will ensure that page is loaded
AmCharts.ready(function() {

    // call stateInfo function
    stateInfo();

    $('#mapdiv').click(mapClick);
});
