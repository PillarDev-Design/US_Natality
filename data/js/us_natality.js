// us_natality.js

var state_births_array;
// state_births_array['2007-2009'][0]['state'] = "Alabama"

var map_states_array;
// map_states_array['features'][0]['properties']['name'] = "Alabama"

// Map Functions
function map_init(){
    // Load the state_births data
    d3.json("data/json/state_births.json", function(json){
        state_births_array = json;
    });
    
    var state_color = d3.scale.quantize().range(["#660000", "#663300", "#666600", "#669900", "#66CC00"]);

    // Use Mootools to grab the DIV and extract the width and height.
    // Then, remove the last two characters off of the string.
    //      Ex. (500px -> 500)
    var map_width = $('top_content_right_container').getStyle("width");
    map_width = map_width.substring(0, map_width.length - 2);
    var map_height = $('top_content_right_container').getStyle("height");
    map_height = map_height.substring(0, map_height.length - 2);

    var projection = d3.geo.albersUsa()
        .scale(map_width)
        .translate([map_width / 2, map_height / 2]);

    var path = d3.geo.path()
        .projection(projection);

    var svg = d3.select("#top_content_right_container")
        .append("svg")
        .attr("width", map_width)
        .attr("height", map_height);

    svg.append("rect")
        .attr("class", "map_background")
        .attr("width", map_width)
        .attr("height", map_height);

    var states = svg.append("g")
        .append("g")
        .attr("id", "map_states");

    d3.json("data/json/us-states.json", function(json){
        map_states_array = json;

        states.selectAll("path")
            .data(json.features)
            .enter()
            .append("path")
            .attr("d", path);
    });
}
