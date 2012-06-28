// us_natality.js

// Map
function map_init(){
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
        .attr("transform", "traslate(" + map_width / 2 + "," + map_height / 2 + ")")
        .append("g")
        .attr("id", "map_states");

    d3.json("data/json/us-states.json", function(json){
        states.selectAll("path")
        .data(json.features)
        .enter()
        .append("path")
        .attr("d", path)
    });
    d3.json("data/json/state_births.json", function(json){
        console.log(json);
    });
}
