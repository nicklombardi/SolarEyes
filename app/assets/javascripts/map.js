var stateBarrelsOfOilPerYear = [];

function createStateDescriptions(data) {
    for (var i = 0; i < data.length; i++) {
        //console.log(data[i].state_name + ": " + data[i].barrels_of_oil_per_year);
        stateBarrelsOfOilPerYear.push(data[i].barrels_of_oil_per_year);
        // debugger;
    }
    console.log("test you" + stateBarrelsOfOilPerYear[0]);
    // return stateBarrelsOfOilPerYear;
    makeMap();
}

// function to grab json data from #index action in home_controller.rb
function stateInfo() {
    $.ajax({
        url: '/',
        dataType: 'json',
        data: 'GET'
    }).done(function(data){
        console.log(data);
        return createStateDescriptions(data);
    });
}

// add all your code to this method, as this will ensure that page is loaded
AmCharts.ready(function() {

    stateInfo();
    // call stateInfo function
    console.log("test me" + stateBarrelsOfOilPerYear[0]);


});

function makeMap(){
     // create AmMap object
    var map = new AmCharts.AmMap();

    var descriptionAK = 'please work, i think this works! ' + (stateBarrelsOfOilPerYear[0]).toString();

    var descriptionAL = '<div class="input-group"><span class="input-group-addon"><span class="glyphicons glyphicon-sun" style="color:#FFCC21"></span> &nbsp;</span><input type="text" class="form-control" autofocus="true" placeholder="installs" name="installs"><span class="input-group-btn"><button class="btn btn-primary" type="button">Calculate</button></span></div><p style="line-height:"3px"> </p><span class="glyphicon glyphicon-tint"></span> barrels saved annually: 29.63 <br><span class="glyphicon glyphicon-usd" style="color#00AB01"></span> value: 3140.78';

    var descriptionAR = 'test';

    var descriptionAZ = '<div class="input-group"><span class="input-group-addon"><span class="glyphicons glyphicon-sun" style="color:#FFCC21"></span> &nbsp;</span><input type="text" class="form-control" autofocus="true" placeholder="installs" id="installs"><span class="input-group-btn"><button class="btn btn-primary" type="button">Calculate</button></span></div><p style="line-height:"3px"> </p><span class="glyphicon glyphicon-tint"></span> barrels saved annually: ' + ( 2 * (stateBarrelsOfOilPerYear[3]).toFixed(2).toString()) + '<br><span class="glyphicon glyphicon-usd" style="color#00AB01"></span> value: 3140.78';

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
        // getAreasFromMap:false,

        areas: [{id:"US-AK", description: descriptionAK},{id:"US-AL", description: descriptionAL},{id:"US-AR", description: descriptionAR},{id:"US-AZ", description: descriptionAZ},{id:"US-CA"},{id:"US-CO"},{id:"US-CT"},{id:"US-DC"},{id:"US-DE"},{id:"US-FL"},{id:"US-GA"},{id:"US-HI"},{id:"US-IA"},{id:"US-ID"},{id:"US-IL"},{id:"US-IN"},{id:"US-KS"},{id:"US-KY"},{id:"US-LA"},{id:"US-MA"},{id:"US-MD"},{id:"US-ME"},{id:"US-MI"},{id:"US-MN"},{id:"US-MO"},{id:"US-MS"},{id:"US-MT"},{id:"US-NC"},{id:"US-ND"},{id:"US-NE"},{id:"US-NH"},{id:"US-NJ"},{id:"US-NM"},{id:"US-NV"},{id:"US-NY"},{id:"US-OH"},{id:"US-OK"},{id:"US-OR"},{id:"US-PA"},{id:"US-RI"},{id:"US-SC"},{id:"US-SD"},{id:"US-TN"},{id:"US-TX"},{id:"US-UT"},{id:"US-VA"},{id:"US-VT"},{id:"US-WA"},{id:"US-WI"},{id:"US-WV"},{id:"US-WY"}],

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
