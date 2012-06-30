/******************************************************************************\
| us_natality.js                                                               |
|------------------------------------------------------------------------------|
| Contains all the JavaScript code for the US_Natality project.                |
\******************************************************************************/

/******************************************************************************\
| Global Variables                                                             |
\******************************************************************************/
var state_births_array;
    // This variable will contain data extracted from the state_births.json
    //  file. Includes (state, births, and state_code).
    // Accessing Example - 
    //      ex.state_births_array['2007-2009'][0]['state'] = "Alabama"
var map_states_array;
    // This variable will contain data extracted from the us-states.json file.
    //  The features from this file will allow d3 to draw a map of the US.
    // Accessing Example -
    //      map_states_array['features'][0]['properties']['name'] = "Alabama"
var color_holder;
    // This variable is used as a placeholder when the states are being applied
    //      their color based on a domain of state births extracted from the
    //      state_births_array.

/******************************************************************************\
| Global Functions                                                             |
\******************************************************************************/
function retrieve_year(){
    // This function can be called to return a string of the current year
    //      set selected. Ex - '2007-2009'.
    return ($('year_selector').value);
}
function map_init(){
    // Upon initial loading of the map, this function will call and load the
    //      default values to active the top US map.

    // Load the state_births data
    d3.json("data/json/state_births.json", function(json){
        state_births_array = json;
    });

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
    
    // Loaded with the low/high domain of the 2007-2009 births values.
    var state_color = d3.scale
        .linear()
        .domain([6110, 527020])
        .range(['brown','steelblue']);

    d3.json("data/json/us-states.json", function(json){
        map_states_array = json;

        states.selectAll("path")
            .data(json.features)
            .enter()
            .append("path")
            .style("fill", function(d) {
                for(var i=0; i<state_births_array['2007-2009'].length; i++){
                    if(d.properties.name === state_births_array['2007-2009'][i]['state']){
                        color_holder =  state_color(state_births_array['2007-2009'][i]['births']);
                    }
                }
                return color_holder;
                })
            .attr("d", path);
    });
}
function populate_names(){
    // www.ssa.gov/oact/babynames/#ht=1
    var seven_to_nine_male = ['Jacob','Michael','Ethan','Joshua','Daniel'];
    var seven_to_nine_female = ['Isabella','Emma','Emily','Olivia','Ava'];

    // NOTE: OPTIMIZE!
     $('male_name_container_body').innerHTML = "<ul>" +
         "<li>" + seven_to_nine_male[0] + "</li>" +
         "<li>" + seven_to_nine_male[1] + "</li>" +
         "<li>" + seven_to_nine_male[2] + "</li>" +
         "<li>" + seven_to_nine_male[3] + "</li>" +
         "<li>" + seven_to_nine_male[4] + "</li></ul>";

     $('female_name_container_body').innerHTML = "<ul>" +
         "<li>" + seven_to_nine_female[0] + "</li>" +
         "<li>" + seven_to_nine_female[1] + "</li>" +
         "<li>" + seven_to_nine_female[2] + "</li>" +
         "<li>" + seven_to_nine_female[3] + "</li>" +
         "<li>" + seven_to_nine_female[4] + "</li></ul>";
}
function populate_top_ten(){
    var top_ten_array = [];

    d3.json("data/json/state_births.json", function(json){
        for(var i=0;i<json['2007-2009'].length;i++){
            top_ten_array[i] = [json['2007-2009'][i]['births'],
                json['2007-2009'][i]['state']];
        }
        top_ten_array.sort(function(a,b){return b[0]-a[0];});
        $('bottom_content_left_container_body').innerHTML = "<ul>" +
            "<li>" + top_ten_array[0][1] + "<ul><li>" + top_ten_array[0][0] + "</li></ul></li>" +
            "<li>" + top_ten_array[1][1] + "<ul><li>" + top_ten_array[1][0] + "</li></ul></li>" +
            "<li>" + top_ten_array[2][1] + "<ul><li>" + top_ten_array[2][0] + "</li></ul></li>" +
            "<li>" + top_ten_array[3][1] + "<ul><li>" + top_ten_array[3][0] + "</li></ul></li>" +
            "<li>" + top_ten_array[4][1] + "<ul><li>" + top_ten_array[4][0] + "</li></ul></li>" +
            "<li>" + top_ten_array[5][1] + "<ul><li>" + top_ten_array[5][0] + "</li></ul></li>" +
            "<li>" + top_ten_array[6][1] + "<ul><li>" + top_ten_array[6][0] + "</li></ul></li>" +
            "<li>" + top_ten_array[7][1] + "<ul><li>" + top_ten_array[7][0] + "</li></ul></li>" +
            "<li>" + top_ten_array[8][1] + "<ul><li>" + top_ten_array[8][0] + "</li></ul></li>" +
            "<li>" + top_ten_array[9][1] + "<ul><li>" + top_ten_array[9][0] + "</li></ul></li></ul>";
    });
}
function populate_full_list(){
    var full_list_array = [];

    d3.json("data/json/state_births.json", function(json){
        $('bottom_content_right_container_body').innerHTML = "<ul>"
        for(var i=0;i<json['2007-2009'].length;i++){
            $('bottom_content_right_container_body').innerHTML +=
                "<li>" + json['2007-2009'][i]['state'] + "<ul><li>" +
                    json['2007-2009'][i]['births'] + "</li></ul></li>";
        }
        $('bottom_content_right_container_body').innerHTML += "</ul>"
    });
}
function test_pie_chart(){
    // bl.ocks.org/1346410
    // bl.ocks.org/1305111
}
// Main Function
function central_init(){
    map_init();
    populate_names();
    populate_top_ten();
    populate_full_list();
    test_pie_chart();
}
