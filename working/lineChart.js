
// Set the dimensions of the canvas / graph
var margin = {top: 15, right: 200, bottom: 30, left:75
},
    width = 900 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

// Parse the date / time
var parseDate = d3.time.format("%Y-%m-%d").parse; 
var bisectDate = d3.bisector(function(d) { return d.date; }).left;

// Set the ranges
var x = d3.time.scale().range([0, width]);
var y = d3.scale.linear().range([height, 0]);

//var color = d3.scale.category10();
var color = d3.scale.ordinal().range(["#ffa69e","#896978","#b8f2e6","#62a87c","#9db4e0","#e9d985","#084c61","#db504a","#c4a9d8","#fc7753"]);

// Define the axes
var xAxis = d3.svg.axis().scale(x)
    .orient("bottom").ticks(6);

var yAxis = d3.svg.axis().scale(y)
    .orient("left").ticks(5);

// Define the line
var priceline = d3.svg.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.freq); });
    
// Adds the svg canvas
var svg = d3.select("#lineChart")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", 
              "translate(" + margin.left + "," + margin.top + ")");

//var focus = svg.append("g").style("display", "none");

// Get the data
d3.csv('twitter_data.csv', function(error, data) {
    data.forEach(function (d) {
        //d.tweet_timestamp = parseDate(d.tweet_timestamp);
    });

    var new_data = d3.nest().key(function(d) { return d.tweet_timestamp; }).entries(data);       
    new_data.forEach(function(d){d.votono=0;d.colombiavotano = 0;d.encartagenadecimosno = 0;d.noalasfarc = 0;d.cartagenapitano = 0;d.voteno = 0;d.votonoalplebiscito = 0;d.hagahistoriavoteno = 0;d.colombiaconelno = 0;d.votonoycorrijoacuerdos = 0; }); // new_data.forEach
    new_data.forEach(function(d){
        var v = d.values;
        v.forEach(function(w){
            var hashtags = w.tweet_hashtag.split(','); // create array of hastags
                if (hashtags.indexOf('votono') > -1){
                    d.votono = d.votono + 1;
                } else if (hashtags.indexOf('colombiavotano') > -1){
                    d.colombiavotano = d.colombiavotano + 1;
                } else if (hashtags.indexOf('encartagenadecimosno') > -1){
                    d.encartagenadecimosno = d.encartagenadecimosno + 1;
                } else if (hashtags.indexOf('noalasfarc') > -1){
                    d.noalasfarc = d.noalasfarc + 1;
                } else if (hashtags.indexOf('cartagenapitano') > -1){
                    d.cartagenapitano = d.cartagenapitano + 1;
                } else if (hashtags.indexOf('voteno') > -1){
                    d.voteno = d.voteno + 1;
                } else if (hashtags.indexOf('votonoalplebiscito') > -1){
                    d.votonoalplebiscito = d.votonoalplebiscito + 1;
                } else if (hashtags.indexOf('hagahistoriavoteno') > -1){
                    d.hagahistoriavoteno = d.hagahistoriavoteno + 1;
                } else if (hashtags.indexOf('colombiaconelno') > -1){
                    d.colombiaconelno = d.colombiaconelno + 1;
                } else if (hashtags.indexOf('votonoycorrijoacuerdos') > -1){
                    d.votonoycorrijoacuerdos = d.votonoycorrijoacuerdos + 1;
                } 
        }); // end v.forEach
    }); // new_data.forEach
    var arr = []
    new_data.forEach(function(d){
        arr.push({date:parseDate(d.key), freq:d.votono, hashtag:'votono'});
        arr.push({date:parseDate(d.key), freq:d.colombiavotano, hashtag:'colombiavotano'})
        arr.push({date:parseDate(d.key), freq:d.encartagenadecimosno, hashtag:'encartagenadecimosno'});
        arr.push({date:parseDate(d.key), freq:d.noalasfarc, hashtag:'noalasfarc'});
        arr.push({date:parseDate(d.key), freq:d.cartagenapitano, hashtag:'cartagenapitano'});
        arr.push({date:parseDate(d.key), freq:d.voteno, hashtag:'voteno'});
        arr.push({date:parseDate(d.key), freq:d.votonoalplebiscito, hashtag:'votonoalplebiscito'});
        arr.push({date:parseDate(d.key), freq:d.hagahistoriavoteno, hashtag:'hagahistoriavoteno'});
        arr.push({date:parseDate(d.key), freq:d.colombiaconelno, hashtag:'colombiaconelno'})
        arr.push({date:parseDate(d.key), freq:d.votonoycorrijoacuerdos, hashtag:'votonoycorrijoacuerdos'});
    }); // end new-data.forEach

    function sortByDateAscending(a,b){
        // dates will be cast to numbers automatically
        return a.date-b.date;
    }
    arr = arr.sort(sortByDateAscending);
    // Scale the range of the data
    x.domain(d3.extent(arr, function(d) { return d.date; }));
    y.domain([0, d3.max(arr, function(d) { return d.freq; })]); 

    // Nest the entries by symbol
    var dataNest = d3.nest()
        .key(function(d) {return d.hashtag;})
        .entries(arr);
    legendSpace = width/dataNest.length;

    // Loop through each symbol / key
    dataNest.forEach(function(d,i) {
        svg.append("path")
            .attr("class", "line")
            .style("stroke", function(){
                return d.color = color(d.key);})
            .attr("id", 'tag'+d.key.replace(/\s+/g, ''))
            .attr("d", priceline(d.values));
            /*// this is new
            .on("mousemove", mMove)
            .append("title");
            // end new*/
        
        // add the legend
        svg.append("text")
            //.attr("x", (legendSpace/2)+i*legendSpace) // spacing // ****
            //.attr("y", height + (margin.bottom/2)+ 5)         // *******
            .attr("x", width)// - margin.right)
            .attr("y", i*20)
            .attr("class", "legend")    // style the legend   // *******
            .style("fill", function() { // dynamic colours    // *******
                return d.color = color(d.key); })             // *******
            .on("click", function(){
                var active   = d.active ? false : true,  // ************ 
                newOpacity = active ? 0 : 1;             // ************
                // Hide or show the elements based on the ID
                d3.select("#tag"+d.key.replace(/\s+/g, '')) // *********
                    .transition().duration(200)          // ************
                    .style("opacity", newOpacity);       // ************
                // Update whether or not the elements are active
                d.active = active;    
            })
            .text("#"+d.key);
            /*function mMove(){
                var m = d3.mouse(this);
                d3.select("#tag"+d.key.replace(/\s+/g, ''))
                    .select("title").text(m[1]);
            }*/
    });
    

    // Add the X Axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    // Add the Y Axis
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("fill", "#5e6472")
        .text("Hashtag Frequency");

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    


    // append a g for all the mouse over nonsense
var mouseG = svg.append("g")
  .attr("class", "mouse-over-effects");

// this is the vertical line
mouseG.append("path")
  .attr("class", "mouse-line")
  .style("stroke", "grey")
  .style("stroke-width", ".5px")
  .style("opacity", "0");

// keep a reference to all our lines
var lines = document.getElementsByClassName('line');

// here's a g for each circle and text on the line
var mousePerLine = mouseG.selectAll('.mouse-per-line')
  .data(dataNest)
  .enter()
  .append("g")
  .attr("class", "mouse-per-line");

// the circle
mousePerLine.append("circle")
  .attr("r", 7)
  .style("stroke", function(d) {
    return color(d.key);
  })
  .style("fill", "none")
  .style("stroke-width", "1px")
  .style("opacity", "0");

// the text
mousePerLine.append("text")
  .attr("transform", "translate(10,3)");

// rect to capture mouse movements
mouseG.append('svg:rect')
  .attr('width', width)
  .attr('height', height)
  .attr('fill', 'none')
  .attr('pointer-events', 'all')
  .on('mouseout', function() { // on mouse out hide line, circles and text
    d3.select(".mouse-line")
      .style("opacity", "0");
    d3.selectAll(".mouse-per-line circle")
      .style("opacity", "0");
    d3.selectAll(".mouse-per-line text")
      .style("opacity", "0");
  })
  .on('mouseover', function() { // on mouse in show line, circles and text
    d3.select(".mouse-line")
      .style("opacity", "1");
    d3.selectAll(".mouse-per-line circle")
      .style("opacity", "1");
    d3.selectAll(".mouse-per-line text")
      .style("opacity", "1");
  })
  .on('mousemove', function() { // mouse moving over canvas
    var mouse = d3.mouse(this);

    // move the vertical line
    d3.select(".mouse-line")
      .attr("d", function() {
        var d = "M" + mouse[0] + "," + height;
        d += " " + mouse[0] + "," + 0;
        return d;
      });

    // position the circle and text
    d3.selectAll(".mouse-per-line")
      .attr("transform", function(d, i) {
        //console.log(width/mouse[0])
        var xDate = x.invert(mouse[0]),
            bisect = d3.bisector(function(d) { return d.date; }).right;
            idx = bisect(d.values, xDate);

        // since we are use curve fitting we can't relay on finding the points like I had done in my last answer
        // this conducts a search using some SVG path functions
        // to find the correct position on the line
        // from http://bl.ocks.org/duopixel/3824661
        var beginning = 0,
            end = lines[i].getTotalLength(),
            target = null;

        while (true){
          target = Math.floor((beginning + end) / 2);
          pos = lines[i].getPointAtLength(target);
          if ((target === end || target === beginning) && pos.x !== mouse[0]) {
              break;
          }
          if (pos.x > mouse[0])      end = target;
          else if (pos.x < mouse[0]) beginning = target;
          else break; //position found
        }

        // update the text with y value
        d3.select(this).select('text')
          //.text(y.invert(pos.y).toFixed(2));
          .text(Math.round(y.invert(pos.y)));


        // return position
        return "translate(" + mouse[0] + "," + pos.y +")";
      });
    });
 
});
d3.select("#checkFemale").on("change", updateData);
d3.select("#checkMale").on("change", updateData);
d3.select("#checkAntioquia").on("change", updateData);
d3.select("#checkBogota").on("change", updateData);
d3.select("#checkCafetero").on("change", updateData);
d3.select("#checkCaribe").on("change", updateData);
d3.select("#checkCentro").on("change", updateData);
d3.select("#checkOriento").on("change", updateData);
d3.select("#checkOtres").on("change", updateData);
d3.select("#checkPacifica").on("change", updateData);
d3.select("#checkOtro").on("change", updateData);

function updateData(){
    d3.csv('twitter_data.csv', function(error, data) {
    data.forEach(function (d) {
        //d.tweet_timestamp = parseDate(d.tweet_timestamp);
    }); // end data.forEach

    var new_data = d3.nest().key(function(d) { return d.tweet_timestamp; }).entries(data);       
    new_data.forEach(function(d){d.votono=0;d.colombiavotano = 0;d.encartagenadecimosno = 0;d.noalasfarc = 0;d.cartagenapitano = 0;d.voteno = 0;d.votonoalplebiscito = 0;d.hagahistoriavoteno = 0;d.colombiaconelno = 0;d.votonoycorrijoacuerdos = 0; }); // new_data.forEach
    
    var genders = []
    var locations = []

    if (d3.select("#checkFemale").property("checked")){
        genders.push("Female")
    }
    if (d3.select("#checkMale").property("checked")){
        genders.push("Male")
    }
    if (d3.select("#checkAntioquia").property("checked")){
        locations.push("Antioquia")
    }
    if (d3.select("#checkBogota").property("checked")){
        locations.push("Bogota")
    }
    if (d3.select("#checkCafetero").property("checked")){
        locations.push("Cafetero")
    }
    if (d3.select("#checkCaribe").property("checked")){
        locations.push("Caribe")
    }
    if (d3.select("#checkCentro").property("checked")){
        locations.push("Centro")
    }
    if (d3.select("#checkOriento").property("checked")){
        locations.push("Oriento")
    }
    if (d3.select("#checkOtres").property("checked")){
        locations.push("Otres")
    }
    if (d3.select("#checkPacifica").property("checked")){
        locations.push("Pacifica")
    }
    if (d3.select("#checkOtro").property("checked")){
        locations.push("-1")
    }

    new_data.forEach(function(d){
        var v = d.values;
        v.forEach(function(w){
            if (genders.indexOf(w.user_gender) == -1){
                return;
            }
            if (locations.indexOf(w.user_location) == -1){
                return;
            }
            var hashtags = w.tweet_hashtag.split(','); // create array of hastags
                if (hashtags.indexOf('votono') > -1){
                    d.votono = d.votono + 1;
                } else if (hashtags.indexOf('colombiavotano') > -1){
                    d.colombiavotano = d.colombiavotano + 1;
                } else if (hashtags.indexOf('encartagenadecimosno') > -1){
                    d.encartagenadecimosno = d.encartagenadecimosno + 1;
                } else if (hashtags.indexOf('noalasfarc') > -1){
                    d.noalasfarc = d.noalasfarc + 1;
                } else if (hashtags.indexOf('cartagenapitano') > -1){
                    d.cartagenapitano = d.cartagenapitano + 1;
                } else if (hashtags.indexOf('voteno') > -1){
                    d.voteno = d.voteno + 1;
                } else if (hashtags.indexOf('votonoalplebiscito') > -1){
                    d.votonoalplebiscito = d.votonoalplebiscito + 1;
                } else if (hashtags.indexOf('hagahistoriavoteno') > -1){
                    d.hagahistoriavoteno = d.hagahistoriavoteno + 1;
                } else if (hashtags.indexOf('colombiaconelno') > -1){
                    d.colombiaconelno = d.colombiaconelno + 1;
                } else if (hashtags.indexOf('votonoycorrijoacuerdos') > -1){
                    d.votonoycorrijoacuerdos = d.votonoycorrijoacuerdos + 1;
                } 
        }); // end v.forEach
    }); // new_data.forEach
    var arr = []
    new_data.forEach(function(d){
        arr.push({date:parseDate(d.key), freq:d.votono, hashtag:'votono'});
        arr.push({date:parseDate(d.key), freq:d.colombiavotano, hashtag:'colombiavotano'})
        arr.push({date:parseDate(d.key), freq:d.encartagenadecimosno, hashtag:'encartagenadecimosno'});
        arr.push({date:parseDate(d.key), freq:d.noalasfarc, hashtag:'noalasfarc'});
        arr.push({date:parseDate(d.key), freq:d.cartagenapitano, hashtag:'cartagenapitano'});
        arr.push({date:parseDate(d.key), freq:d.voteno, hashtag:'voteno'});
        arr.push({date:parseDate(d.key), freq:d.votonoalplebiscito, hashtag:'votonoalplebiscito'});
        arr.push({date:parseDate(d.key), freq:d.hagahistoriavoteno, hashtag:'hagahistoriavoteno'});
        arr.push({date:parseDate(d.key), freq:d.colombiaconelno, hashtag:'colombiaconelno'})
        arr.push({date:parseDate(d.key), freq:d.votonoycorrijoacuerdos, hashtag:'votonoycorrijoacuerdos'});
    }); // end new-data.forEach

    function sortByDateAscending(a,b){ // dates will be cast to numbers automatically
        return a.date-b.date;
    }
    arr = arr.sort(sortByDateAscending);
    // Scale the range of the data
    x.domain(d3.extent(arr, function(d) { return d.date; }));
    y.domain([0, d3.max(arr, function(d) { return d.freq; })]); 

    // Nest the entries by symbol
    var dataNest = d3.nest()
        .key(function(d) {return d.hashtag;})
        .entries(arr);
    legendSpace = width/dataNest.length;

    svg.select("#lineChart").transition();

    dataNest.forEach(function(d,i){
        svg.select('path#tag' + d.key.replace(/\s+/g, ''))
            .transition().duration(1000)
            .attr("d", priceline(d.values));
    });

    svg.select(".x.axis") // change the x axis
            .transition().duration(1000)
            .call(xAxis);
    svg.select(".y.axis") // change the y axis
            .transition().duration(1000)
            .call(yAxis);
});
} // end function updateData
