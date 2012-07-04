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
        .range(['#E5F5F9','#2CA25F']);

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

function default_region_charts(){
    // United States (Large Circle)
    d3.csv("data/json/national_births.csv", function(csv){
        var m = 10,
            r = 200,
            z = d3.scale.category20c();
        
        var pie = d3.layout.pie()
            .value(function(d){ return +d.count; })
            .sort(function(a,b){ return b.count - a.count; });
        
        var circle_arc = d3.svg.arc()
            .innerRadius(r/2)
            .outerRadius(r);
        
        var states = d3.nest()
            .key(function(d){ return d.country; })
            .entries(csv);
        
        var circle_svg = d3.select("#main_container_national_pie").selectAll("div")
            .data(states)
            .enter().append("div")
                .style("display", "inline-block")
                .style("width", (r+m) * 2 + "px")
                .style("height", (r+m) * 2 + "px")
                .style("bottom", "-170px")
                .style("right", "-190px")
                .style("position","relative")
            .append("svg:svg")
                .attr("width", (r+m) * 2)
                .attr("height", (r+m) * 2)
            .append("svg:g")
                .attr("transform", "translate(" + (r+m) + "," + (r+m) + ")");
        
        circle_svg.append("svg:text")
            .attr("dy", ".35em")
            .attr("text-anchor", "middle")
            .style("font", "50px")
            .text("United States");

        var g = circle_svg.selectAll("g")
            .data(function(d){ return pie(d.values); })
            .enter().append("svg:g");
        
        g.append("svg:path")
            .attr("d", circle_arc)
            .style("fill", function(d){ return z(d.data.count); })
            .style("border", "1px solid black")
            .append("svg:title")
            .text(function(d){ return d.data.state + ": " + d.data.count; });

        g.filter(function(d){ return d.endAngle - d.startAngle > .10; }).append("svg:text")
            .attr("dy", ".35em")
            .attr("text-anchor", "middle")
            .attr("transform", function(d){ return "translate(" + circle_arc.centroid(d) + ")rotate(" + angle(d) + ")"; })
            .text(function(d){ return d.data.state; });

        function angle(d){
            var a = (d.startAngle + d.endAngle) * 90 / Math.PI - 90;
            return a > 90 ? a - 180 : a;
        }
    });

    // Northeast (Smaller Circle)
    d3.csv("data/json/northeast_births.csv", function(csv){
        var m = 10,
            r = 90,
            z = d3.scale.category20c();
        
        var pie = d3.layout.pie()
            .value(function(d){ return +d.count; })
            .sort(function(a,b){ return b.count - a.count; });
        
        var circle_arc = d3.svg.arc()
            .innerRadius(r/3.8)
            .outerRadius(r);
        
        var states = d3.nest()
            .key(function(d){ return d.region; })
            .entries(csv);
        
        var circle_svg = d3.select("#main_container_northeast_pie").selectAll("div")
            .data(states)
            .enter().append("div")
                .style("display", "inline-block")
                .style("width", (r+m) * 2 + "px")
                .style("height", (r+m) * 2 + "px")
                .style("position","relative")
            .append("svg:svg")
                .attr("width", (r+m) * 2)
                .attr("height", (r+m) * 2)
            .append("svg:g")
                .attr("transform", "translate(" + (r+m) + "," + (r+m) + ")");
        
        circle_svg.append("svg:text")
            .attr("dy", ".35em")
            .attr("text-anchor", "middle")
            .text(function(d){ return d.key; });

        var g = circle_svg.selectAll("g")
            .data(function(d){ return pie(d.values); })
            .enter().append("svg:g");
        
        g.append("svg:path")
            .attr("d", circle_arc)
            .style("fill", function(d){ return z(d.data.state); })
            .append("svg:title")
            .text(function(d){ return d.data.state + ": " + d.data.count; });

        g.filter(function(d){ return d.endAngle - d.startAngle > .2; }).append("svg:text")
            .attr("dy", ".35em")
            .attr("text-anchor", "middle")
            .attr("transform", function(d){ return "translate(" + circle_arc.centroid(d) + ")rotate(" + angle(d) + ")"; })
            .text(function(d){ return d.data.state; });

        function angle(d){
            var a = (d.startAngle + d.endAngle) * 90 / Math.PI - 90;
            return a > 90 ? a - 180 : a;
        }
    });

    // West (Smaller Circle)
    d3.csv("data/json/west_births.csv", function(csv){
        var m = 10,
            r = 90,
            z = d3.scale.category20c();
        
        var pie = d3.layout.pie()
            .value(function(d){ return +d.count; })
            .sort(function(a,b){ return b.count - a.count; });
        
        var circle_arc = d3.svg.arc()
            .innerRadius(r/6)
            .outerRadius(r);
        
        var states = d3.nest()
            .key(function(d){ return d.region; })
            .entries(csv);
        
        var circle_svg = d3.select("#main_container_west_pie").selectAll("div")
            .data(states)
            .enter().append("div")
                .style("display", "inline-block")
                .style("width", (r+m) * 2 + "px")
                .style("height", (r+m) * 2 + "px")
                .style("position","relative")
            .append("svg:svg")
                .attr("width", (r+m) * 2)
                .attr("height", (r+m) * 2)
            .append("svg:g")
                .attr("transform", "translate(" + (r+m) + "," + (r+m) + ")");
        
        circle_svg.append("svg:text")
            .attr("dy", ".35em")
            .attr("text-anchor", "middle")
            .text(function(d){ return d.key; });

        var g = circle_svg.selectAll("g")
            .data(function(d){ return pie(d.values); })
            .enter().append("svg:g");
        
        g.append("svg:path")
            .attr("d", circle_arc)
            .style("fill", function(d){ return z(d.data.state); })
            .append("svg:title")
            .text(function(d){ return d.data.state + ": " + d.data.count; });

        g.filter(function(d){ return d.endAngle - d.startAngle > .2; }).append("svg:text")
            .attr("dy", ".35em")
            .attr("text-anchor", "middle")
            .attr("transform", function(d){ return "translate(" + circle_arc.centroid(d) + ")rotate(" + angle(d) + ")"; })
            .text(function(d){ return d.data.state; });

        function angle(d){
            var a = (d.startAngle + d.endAngle) * 90 / Math.PI - 90;
            return a > 90 ? a - 180 : a;
        }
    });

    // Midwest (Smaller Circle)
    d3.csv("data/json/midwest_births.csv", function(csv){
        var m = 10,
            r = 90,
            z = d3.scale.category20c();
        
        var pie = d3.layout.pie()
            .value(function(d){ return +d.count; })
            .sort(function(a,b){ return b.count - a.count; });
        
        var circle_arc = d3.svg.arc()
            .innerRadius(r/4.5)
            .outerRadius(r);
        
        var states = d3.nest()
            .key(function(d){ return d.region; })
            .entries(csv);
        
        var circle_svg = d3.select("#main_container_midwest_pie").selectAll("div")
            .data(states)
            .enter().append("div")
                .style("display", "inline-block")
                .style("width", (r+m) * 2 + "px")
                .style("height", (r+m) * 2 + "px")
                .style("position","relative")
            .append("svg:svg")
                .attr("width", (r+m) * 2)
                .attr("height", (r+m) * 2)
            .append("svg:g")
                .attr("transform", "translate(" + (r+m) + "," + (r+m) + ")");
        
        circle_svg.append("svg:text")
            .attr("dy", ".35em")
            .attr("text-anchor", "middle")
            .text(function(d){ return d.key; });

        var g = circle_svg.selectAll("g")
            .data(function(d){ return pie(d.values); })
            .enter().append("svg:g");
        
        g.append("svg:path")
            .attr("d", circle_arc)
            .style("fill", function(d){ return z(d.data.state); })
            .append("svg:title")
            .text(function(d){ return d.data.state + ": " + d.data.count; });

        g.filter(function(d){ return d.endAngle - d.startAngle > .2; }).append("svg:text")
            .attr("dy", ".35em")
            .attr("text-anchor", "middle")
            .attr("transform", function(d){ return "translate(" + circle_arc.centroid(d) + ")rotate(" + angle(d) + ")"; })
            .text(function(d){ return d.data.state; });

        function angle(d){
            var a = (d.startAngle + d.endAngle) * 90 / Math.PI - 90;
            return a > 90 ? a - 180 : a;
        }
    });

    // South (Smaller Circle)
    d3.csv("data/json/south_births.csv", function(csv){
        var m = 10,
            r = 90,
            z = d3.scale.category20c();
        
        var pie = d3.layout.pie()
            .value(function(d){ return +d.count; })
            .sort(function(a,b){ return b.count - a.count; });
        
        var circle_arc = d3.svg.arc()
            .innerRadius(r/5.5)
            .outerRadius(r);
        
        var states = d3.nest()
            .key(function(d){ return d.region; })
            .entries(csv);
        
        var circle_svg = d3.select("#main_container_south_pie").selectAll("div")
            .data(states)
            .enter().append("div")
                .style("display", "inline-block")
                .style("width", (r+m) * 2 + "px")
                .style("height", (r+m) * 2 + "px")
                .style("position","relative")
            .append("svg:svg")
                .attr("width", (r+m) * 2)
                .attr("height", (r+m) * 2)
            .append("svg:g")
                .attr("transform", "translate(" + (r+m) + "," + (r+m) + ")");
        
        circle_svg.append("svg:text")
            .attr("dy", ".35em")
            .attr("text-anchor", "middle")
            .text(function(d){ return d.key; });

        var g = circle_svg.selectAll("g")
            .data(function(d){ return pie(d.values); })
            .enter().append("svg:g");
        
        g.append("svg:path")
            .attr("d", circle_arc)
            .style("fill", function(d){ return z(d.data.state); })
            .append("svg:title")
            .text(function(d){ return d.data.state + ": " + d.data.count; });

        g.filter(function(d){ return d.endAngle - d.startAngle > .2; }).append("svg:text")
            .attr("dy", ".35em")
            .attr("text-anchor", "middle")
            .attr("transform", function(d){ return "translate(" + circle_arc.centroid(d) + ")rotate(" + angle(d) + ")"; })
            .text(function(d){ return d.data.state; });

        function angle(d){
            var a = (d.startAngle + d.endAngle) * 90 / Math.PI - 90;
            return a > 90 ? a - 180 : a;
        }
    });

}
// Main Function
function central_init(){
    // These functions are fired on the inital load of the page.
    map_init();
    populate_names();
    populate_top_ten();
    populate_full_list();
    default_region_charts();
}
