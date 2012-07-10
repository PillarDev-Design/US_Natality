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
// Midwest
//      Illinois, Indiana, Iowa, Kansas, Michigan, Minnesota, Missouri,
//      Nebraska, North Dakota, Ohio, South Dakota, Wisconsin
// South
//      Alabama, Arkansas, Delaware, District of Columbia, Florida, Georgia,
//      Kentucky, Louisiana, Maryland, Mississippi, North Carolina,
//      Oklahoma, South Carolina, Tennessee, Texas, Viriginia, West Virginia
// West
//      Alaska, Arizona, California, Colorado, Hawaii, Idaho, Montana,
//      Nevada, New Mexico, Oregon, Utah, Washington, Wyoming

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
var return_text;
    // This variable is used as a palceholder when the states are formed. It
    //      contains the hover text.
var current_state_data = [10,10];
    // This variable will hold the current male-female numbers for the state pie
    //      chart.
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
            .style("stroke", "black")
            .style("cursor", "pointer")
            .attr("d", path)
            .append("svg:title")
            .text(function(d){ 
                for(var i=0; i<state_births_array['2007-2009'].length; i++){
                    if(d.properties.name === state_births_array['2007-2009'][i]['state']){
                        return_text = (d.properties.name + ": " + state_births_array['2007-2009'][i]['births']);
                    }
                }
                return return_text;
                });
        states.selectAll("path").on("click", function(d){
            add_middle_content();

            var state_name = d.properties.name;
           
            $('main_container_state_pie_title').innerHTML = state_name;

            // Clear the div in preparation for the new pie chart.
            $('main_container_state_pie').innerHTML = "";
            
            // Load in the new data - [male#, female#]
            for(var i=0; i<state_births_array['2007-2009'].length; i++){
                if(state_name === state_births_array['2007-2009'][i]['state']){
                    var data_array = [state_births_array['2007-2009'][i]['male'],
                        state_births_array['2007-2009'][i]['female']];
                    create_state_pie(data_array);
                    $('male_count_body').innerHTML = (state_births_array['2007-2009'][i]['male']);
                    $('female_count_body').innerHTML = (state_births_array['2007-2009'][i]['female']);
                }
            }
        });
    });
}
function add_middle_content(){
    $('main_container_national_pie').fade(0); 
    $('main_container_northeast_pie').fade(0); 
    $('main_container_west_pie').fade(0); 
    $('main_container_midwest_pie').fade(0); 
    $('main_container_south_pie').fade(0); 
    $('main_container_state_pie').fade(1);
    $('main_container_state_pie_title').fade(1);
    $('male_count_container').fade(1);
    $('female_count_container').fade(1);
    $('click_to_return').fade(1);
    $('bottom_content_main_container').setStyle('cursor','pointer');
}
function remove_middle_content(){
    $('main_container_national_pie').fade(1); 
    $('main_container_northeast_pie').fade(1); 
    $('main_container_west_pie').fade(1); 
    $('main_container_midwest_pie').fade(1); 
    $('main_container_south_pie').fade(1);
    $('main_container_state_pie').fade(0);
    $('main_container_state_pie_title').fade(0);
    $('male_count_container').fade(0);
    $('female_count_container').fade(0);
    $('click_to_return').fade(0);
    $('bottom_content_main_container').setStyle('cursor','auto');
}
function populate_names(){
    // www.ssa.gov/oact/babynames/#ht=1
    var seven_to_nine_male = ['Jacob','Michael','Ethan','Joshua','Daniel'];
    var seven_to_nine_female = ['Isabella','Emma','Emily','Olivia','Ava'];

     var temp_male_content = "<ul>";
     for(var i=0; i<5; i++){
        temp_male_content += ("<li>" + seven_to_nine_male[i] + "</li>");
     }
     temp_male_content += "</ul>";
     $('male_name_container_body').innerHTML = temp_male_content;

     var temp_female_content = "<ul>";
     for(var i=0; i<5; i++){
        temp_female_content += ("<li>" + seven_to_nine_female[i] + "</li>");
     }
     temp_female_content += "</ul>";
     $('female_name_container_body').innerHTML = temp_female_content;
}
function populate_top_ten(){
    var top_ten_array = [];

    d3.json("data/json/state_births.json", function(json){
        for(var i=0;i<json['2007-2009'].length;i++){
            top_ten_array[i] = [json['2007-2009'][i]['births'],
                json['2007-2009'][i]['state']];
        }
        top_ten_array.sort(function(a,b){return b[0]-a[0];});
        
        var temp_content = "<ul>";
        for(var i=0;i<10;i++){
            temp_content += ("<li><div id='" +
                top_ten_array[i][1] + "_box' class='state_box'>" +
                top_ten_array[i][1] + "<br /><div class='state_number'>" + 
                top_ten_array[i][0] + "</div></div></li>");
        }
        temp_content += "</ul>";
        $('bottom_content_left_container_body').innerHTML = temp_content;
        
        $('bottom_content_main_container').addEvent('click', function(){
            remove_middle_content();
        });
        
        for(var i=0;i<10;i++){
            var temp_place = '';
            temp_place = top_ten_array[i][1] + '_box';
            add_event_to_state(temp_place);
        }
    });
    
}
function populate_full_list(){
    var full_list_array = [];
    
    d3.json("data/json/state_births.json", function(json){
        for(var i=0;i<json['2007-2009'].length;i++){
            full_list_array[i] = [json['2007-2009'][i]['births'],
                json['2007-2009'][i]['state']];
        }
        
        var temp_content = "<ul>";
        for(var i=0;i<full_list_array.length;i++){
            temp_content += ("<li><div id='" +
                full_list_array[i][1] + "_lst' class='state_box'>" +
                full_list_array[i][1] + "<br /><div class='state_number'>" +
                full_list_array[i][0] + "</div></div></li>");
        }
        temp_content += "</ul>";
        $('bottom_content_right_container_body').innerHTML = temp_content;

        for(var i=0;i<full_list_array.length;i++){
            var temp_place = '';
            temp_place = full_list_array[i][1] + '_lst';
            add_event_to_state(temp_place);
        }
    });
}
function add_event_to_state(state){
    $(state).addEvent('click', function(){
        add_middle_content();

        // Ex - Florida_box -> Florida
        var state_name = state.substring(0, state.length - 4);
       
        $('main_container_state_pie_title').innerHTML = state_name;

        // Clear the div in preparation for the new pie chart.
        $('main_container_state_pie').innerHTML = "";
        
        // Load in the new data - [male#, female#]
        for(var i=0; i<state_births_array['2007-2009'].length; i++){
            if(state_name === state_births_array['2007-2009'][i]['state']){
                var data_array = [state_births_array['2007-2009'][i]['male'],
                    state_births_array['2007-2009'][i]['female']];
                create_state_pie(data_array);
                $('male_count_body').innerHTML = (state_births_array['2007-2009'][i]['male']);
                $('female_count_body').innerHTML = (state_births_array['2007-2009'][i]['female']);
            }
        }
    });
}
function create_state_pie(state_data){
    var width = 550;
    var height = 550;
    var w = (width - 100),
        h = (height - 20),
        r = Math.min(w, h) / 2,
        color = d3.scale.category20()
            .range(['#17becf', '#f7b6d2']),
        donut = d3.layout.pie().sort(null),
        arc = d3.svg.arc().innerRadius(0).outerRadius(r - 10);
    
    var svg = d3.select('#main_container_state_pie').append("svg:svg")
        .attr("width", w)
        .attr("height", h)
        .append("svg:g")
        .attr("transform", "translate(" + (w/2) + "," + (h/2) + ")");
    
    var arcs = svg.selectAll("path")
        .data(donut(state_data))
        .enter().append("svg:path")
        .attr("fill", function(d, i){ return color(i); })
        .attr("d", arc)
        .each(function(d){ this._current = d; });
}
function default_region_charts(){
    var national_color = d3.scale
        .linear()
        .domain([6110, 527020])
        .range(['#E5F5F9','#2CA25F']);

    var northeast_color = d3.scale
        .linear()
        .domain([6110, 248110])
        .range(['#E5F5F9','#2CA25F']);

    var midwest_color = d3.scale
        .linear()
        .domain([9001, 171163])
        .range(['#E5F5F9','#2CA25F']);

    var west_color = d3.scale
        .linear()
        .domain([7881, 527020])
        .range(['#E5F5F9','#2CA25F']);

    var south_color = d3.scale
        .linear()
        .domain([9040, 401977])
        .range(['#E5F5F9','#2CA25F']);

    // Create the Blank State Chart
    create_state_pie(current_state_data);

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
            .style("font-size", "3em")
            .style("font-family", "'The Girl Next Door', cursive")
            .text("United States");

        var g = circle_svg.selectAll("g")
            .data(function(d){ return pie(d.values); })
            .enter().append("svg:g");
        
        g.append("svg:path")
            .attr("d", circle_arc)
            .style("fill", function(d){ return national_color(d.data.count); })
            .style("stroke", "black")
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
            .style("fill", function(d){ return northeast_color(d.data.count); })
            .style("stroke", "black")
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
            .style("fill", function(d){ return west_color(d.data.count); })
            .style("stroke", "black")
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
            .style("fill", function(d){ return midwest_color(d.data.count); })
            .style("stroke", "black")
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
            .style("fill", function(d){ return south_color(d.data.count); })
            .style("stroke", "black")
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
