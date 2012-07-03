/******************************************************************************\
| us_natality.js                                                               |
|------------------------------------------------------------------------------|
| Contains all the JavaScript code for the US_Natality project.                |
\******************************************************************************/

/******************************************************************************\
| Region Definitions (wonder.cdc.gov/wonder/help/Natality.html)                |
\******************************************************************************/
// Northeast
//      Connecticut, Maine, Massachusetts, New Hampshire, New Jersey,
//      New York, Pennsylvania, Rhode Island, Vermont
var northeast = [
        ['Connecticut', 0],
        ['Maine', 0],
        ['Massachusetts', 0],
        ['New Hampshire', 0],
        ['New Jersey', 0],
        ['New York', 0],
        ['Pennsylvania', 0],
        ['Rhode Island', 0],
        ['Vermont', 0]];
// Midwest
//      Illinois, Indiana, Iowa, Kansas, Michigan, Minnesota, Missouri,
//      Nebraska, North Dakota, Ohio, South Dakota, Wisconsin
var midwest = [
        ['Illinois', 0],
        ['Indiana', 0],
        ['Iowa', 0],
        ['Kansas', 0],
        ['Michigan', 0],
        ['Minnesota', 0],
        ['Missorui', 0],
        ['Nebraska', 0],
        ['North Dakota', 0],
        ['Ohio', 0],
        ['South Dakota', 0],
        ['Wisconsin', 0]];
// South
//      Alabama, Arkansas, Delaware, District of Columbia, Florida, Georgia,
//      Kentucky, Louisiana, Maryland, Mississippi, North Carolina,
//      Oklahoma, South Carolina, Tennessee, Texas, Viriginia, West Virginia
var south = [
        ['Alabama', 0],
        ['Arkansas', 0],
        ['Delaware', 0],
        ['District of Columbia', 0],
        ['Florida', 0],
        ['Georgia', 0],
        ['Kentucky', 0],
        ['Louisiana', 0],
        ['Maryland', 0],
        ['Mississippi', 0],
        ['North Carolina', 0],
        ['Oklahoma', 0],
        ['South Carolina', 0],
        ['Tennessee', 0],
        ['Texas', 0],
        ['Virginia', 0],
        ['West Virginia', 0]];
// West
//      Alaska, Arizona, California, Colorado, Hawaii, Idaho, Montana,
//      Nevada, New Mexico, Oregon, Utah, Washington, Wyoming
var west = [
        ['Alaska', 0],
        ['Arizona', 0],
        ['California', 0],
        ['Colorado', 0],
        ['Hawaii', 0],
        ['Idaho', 0],
        ['Montana', 0],
        ['Nevada', 0],
        ['New Mexico', 0],
        ['Oregon', 0],
        ['Utah', 0],
        ['Washington', 0],
        ['Wyoming', 0]];

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

    /* Section Works for an Example of a Circle Packing procedure.
    // Assign the regions the current population of the year(s).
    d3.json("data/json/state_births.json", function(json){
        for(var i=0; i<json['2007-2009'].length; i++){
            // northeast
            for(var s=0; s<northeast.length; s++){
                if(json['2007-2009'][i]['state'] === northeast[s][0]){
                    northeast[s][1] = json['2007-2009'][i]['births'];
                }
            }
            // midwest
            for(var s=0; s<midwest.length; s++){
                if(json['2007-2009'][i]['state'] === midwest[s][0]){
                    midwest[s][1] = json['2007-2009'][i]['births'];
                }
            }
            // south
            for(var s=0; s<south.length; s++){
                if(json['2007-2009'][i]['state'] === south[s][0]){
                    south[s][1] = json['2007-2009'][i]['births'];
                }
            }
            // west
            for(var s=0; s<west.length; s++){
                if(json['2007-2009'][i]['state'] === west[s][0]){
                    west[s][1] = json['2007-2009'][i]['births'];
                }
            }
            
        }
    });

    var data = {
        children: [
            {value: 1.94},
            {value: 0.42},
            {value: 0},
            {value: 3.95},
            {value: 0.06},
            {value: 0.91}
        ]
    };
   
    var width = 500,
        height = 500;
    var pack = d3.layout.pack()
        .sort(d3.descending)
        .size([width, height]);
    var svg = d3.select("#bottom_content_main_container").append("svg")
        .attr("width", width)
        .attr("height", height);
    svg.data([data]).selectAll(".node")
        .data(pack.nodes)
        .enter()
        .append("circle")
        .attr("class", "node")
        .attr("transform", function(d){ return "translate(" + d.x + "," + d.y + ")"; })
        .attr("r", function(d){ return (d.r); });
    */
    
    function arcTween(a){
        var i = d3.interpolate(this._current, a);
        this._current = i(0);
        return function(t){ return arc(i(t)); };
    }

    var data1 = [53245,28479,19697,24037,40245],
        data2 = [200,200,200,200,200],
        data = data1;
    
    var formatted_data = [
            ['Alabama', 62475, [ 31750, 30725]],
            ['Alaska', 11324, [5965, 5359]]
        ];
    var new_data = formatted_data[0][2];

    console.log(formatted_data);
    console.log(new_data);

    var width = $('bottom_content_main_container').getStyle("width");
    width = width.substring(0, width.length - 2);
    var height = $('bottom_content_main_container').getStyle("height");
    height = height.substring(0, height.length - 2);

    var w = (width - 100),
        h = (height - 20),
        r = Math.min(w, h) / 2,
        color = d3.scale.category20()
            .range(['#17becf', '#f7b6d2']),
        donut = d3.layout.pie().sort(null),
        arc = d3.svg.arc().innerRadius(r/2).outerRadius(r - 10);

    var svg = d3.select("#bottom_content_main_container").append("svg:svg")
        .attr("width", w)
        .attr("height", h)
        .append("svg:g")
        .attr("transform", "translate(" + (w/2) + "," + (h/2) + ")");

    svg.append("svg:text")
        .data(new_data)
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .text(function(d){
            var temp_text;
            for(var i=0; i < formatted_data.length; i++){
                if(d === formatted_data[i][2][0]){
                    temp_text = formatted_data[i][0]; 
                }
            }
            return temp_text;
        });

    var arcs = svg.selectAll("path")
        .data(donut(new_data))
        .enter().append("svg:path")
        .attr("fill", function(d, i){ return color(i); })
        .attr("d", arc)
        .each(function(d){ this._current = d; });

    d3.select("#bottom_content_main_container").on("click", function(){
        data = data === formatted_data[0][2] ? formatted_data[1][2] : formatted_data[0][2];
        arcs = arcs.data(donut(data));
        arcs.transition().duration(750).attrTween("d", arcTween);
        console.log(data[0]);

    });
}
// Main Function
function central_init(){
    map_init();
    populate_names();
    populate_top_ten();
    populate_full_list();
    test_pie_chart();
}
