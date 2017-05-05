function ScatterPlot(){
  var outerWidth = 100;
  var outerHeight = 100;

  var margin = { left: 60, top: 5, right: 10, bottom: 60 };

  var xColumn = "No X column configured";
  var yColumn = "No Y column configured";
  var colorColumn = "No color column configured";
  var colorRange = d3.scale.category10().range();
  var shapeRange = d3.scale.category10().range();


  var xAxisLabel = "No X axis label configured";
  var xAxisLabelOffset = 40;

  var yAxisLabel = "No Y axis label configured";
  var yAxisLabelOffset = 30;

  var xScale = d3.scale.linear();
  var yScale = d3.scale.linear();
  var shapeScale = d3.scale.ordinal();
  function colorScale(user_location) {
    switch(user_location) {
      case "Antioquia":
        return "#ffa69e";
      case "Bogota":
        return "#896978";
      case "Cafetero":
        return "#b8f2e6";
      case "Caribe":
        return "#62a87c";
      case "Centro":
        return "#9db4e0";
      case "Oriento":
        return "#e9d985";
      case "Otres":
        return "#084c61";
      case "Pacifica":
        return "#db504a";
      case "Otro":
        return "#c4a9d8";
    }
  }


  var xAxis = d3.svg.axis().scale(xScale).orient("bottom")
 //   .tickFormat(d3.format("s"))
    .outerTickSize(0);
//  var xTicks = 5;

  var yAxis = d3.svg.axis().scale(yScale).orient("right")
  //  .tickFormat(d3.format("s"))
    .outerTickSize(0);
  //var yTicks = 5;


  function chart(selection){
    var innerWidth  = outerWidth  - margin.left - margin.right;
    var innerHeight = outerHeight - margin.top  - margin.bottom;

    shapeScale.range(shapeRange);
    xScale.range([0, innerWidth]);
    yScale.range([innerHeight, 0]);

    xAxis.ticks(xTicks);
    yAxis.ticks(yTicks);

    selection.each(function (data) {
      console.log(this);
      var svg = d3.select(this).selectAll("svg").data([data]);
      console.log(svg);
      var gEnter = svg.enter().append("svg").append("g");
      console.log(gEnter);
      var g = svg.select("g");
      var points = g.selectAll(".point").data(data);
      var tooltip_div = d3.select("body").append("div")	
        .attr("id", "tooltipBox")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style("top", 200+"px");

      gEnter
        .append("g")
          .attr("class", "x axis")
        .append("text")
          .attr("class", "label")
          .style("text-anchor", "middle");

      svg
              .append("g")
          .attr("class", "y axis")
        .append("text")
          .attr("id", "agLabel")
          .attr("class", "axislabel")
          .style("text-anchor", "middle")
          .text("Against");
      svg
        .select("#agLabel")
        .attr("transform", "translate(" + (innerWidth/2+margin.left) +", " + (innerHeight+margin.top+10+elHeight("agLabel")/2) + ")")

      gEnter
                    .append("g")
          .attr("class", "x axis")
        .append("text")
          .attr("id", "negLabel")
          .attr("class", "axis")
          .style("text-anchor", "middle")
          .text("Negative");
      gEnter 
        .select("#negLabel")
        .attr("transform", "translate(" + (-elHeight("negLabel")/2) +", " + (innerHeight/2) + ") rotate(-90)")

      function elWidth(elID) {
        return document.getElementById(elID).getBoundingClientRect().width;
      }

      function elHeight(elID) {
        return document.getElementById(elID).getBoundingClientRect().height;
      }

      gEnter
        .append("g")
          .attr("class", "y axis")
        .append("text")
          .attr("class", "label")
          .style("text-anchor", "middle");
      
      xScale.domain([-1,1]);
      yScale.domain([-1,1]);

      svg 
        .attr("width", outerWidth)
        .attr("height", outerHeight);

      g.attr("transform", "translate(" + margin.left + "," + margin.top + ")")

      g
        .select(".x.axis")
          .attr("transform", "translate(0," + innerHeight/2 + ")")
          .call(xAxis)
        .select("text")
          .attr("transform", "translate(" + 450 +", " + xAxisLabelOffset + ") rotate(90)")
          .text(xAxisLabel);

      g
        .select(".text")
          .attr("transform", "translate(0," + innerHeight/2 + ")")
          .call(xAxis)

      g
        .select(".y.axis")
          .attr("transform", "translate(" + innerWidth/2 + ",0)")
          .call(yAxis)
        .select("text")
          .attr("transform", "translate(-" + yAxisLabelOffset + ",-10)")
          .text(yAxisLabel);

      points.enter().append("path")/*.style("opacity", 0).transition().duration(1000).style("opacity", 1)*/;

      points
        .attr("class", "point")
        .attr("transform", function(d) { return "translate(" + xScale(d[xColumn]) + "," + yScale(d[yColumn]) + ")"; })
        .attr("fill", function (d){ return   colorScale(d[colorColumn]); })
        .attr("d", d3.svg.symbol().type(function (d){ return  shapeScale(d[shapeColumn]); }))

        .on("mouseover", function(d) {
            console.log(gEnter);
            tooltip_div.style("opacity", .9);
            tooltip_div	.html("User Profile Info:<br/>User ID: "+d.user_id+"<br/>Gender: "+d.user_gender+ "<br/>Region: "+d.user_location+"<br/>Sentiment: "+parseFloat(Math.round(d.user_sentiment_score * 100) / 100).toFixed(4)+"<br/>Polarity: "+parseFloat(Math.round(d.user_polarity_score * 100) / 100).toFixed(4)+"<br/>Followers: "+d.user_follower_count+"<br/>Following: "+d.user_friends_count)	
                .style("left", (d3.event.pageX) + "px")		
                .style("top", (d3.event.pageY - 28) + "px");	
             svg.append("line")
             .attr("class", "crosshair")
             .attr("x1", margin.left)
             .attr("x2", innerWidth+margin.left)
             .attr("y1", yScale(d.user_polarity_score)+margin.top)
             .attr("y2", yScale(d.user_polarity_score)+margin.top)
             .attr("stroke-width", 2)
             .attr("stroke", "#d3d3d3");
             svg.append("line")
             .attr("class", "crosshair")
             .attr("x1", xScale(d.user_sentiment_score)+margin.left)
             .attr("x2", xScale(d.user_sentiment_score)+margin.left)
             .attr("y1", margin.top)
             .attr("y2", innerHeight+margin.top)
             .attr("stroke-width", 2)
             .attr("stroke", "#d3d3d3");
        })
        .on("mouseout", function() {
            tooltip_div.style("opacity", 0);	
            d3.selectAll(".crosshair").remove();
		    });
      points.exit()/*.transition().duration(1000).style("opacity", 0)*/.remove();
      
    });

    
  }

  chart.outerWidth = function(_) {
    if (!arguments.length) return outerWidth;
    outerWidth = _;
    return chart;
  };

  chart.outerHeight = function(_) {
    if (!arguments.length) return outerHeight;
    outerHeight = _;
    return chart;
  };

  chart.xColumn = function(_) {
    if (!arguments.length) return xColumn;
    xColumn = _;
    return chart;
  };

  chart.yColumn = function(_) {
    if (!arguments.length) return yColumn;
    yColumn = _;
    return chart;
  };


  chart.colorRange = function(_) {
    if (!arguments.length) return colorRange;
    colorRange = _;
    return chart;
  };

  chart.shapeRange = function(_) {
    if (!arguments.length) return shapeRange;
    shapeRange = _;
    return chart;
  };

  chart.colorColumn = function(_) {
    if (!arguments.length) return colorColumn;
    colorColumn = _;
    return chart;
  };

  chart.shapeColumn = function(_) {
    if (!arguments.length) return shapeColumn;
    shapeColumn = _;
    return chart;
  };

  chart.xAxisLabel = function(_) {
    if (!arguments.length) return xAxisLabel;
    xAxisLabel = _;
    return chart;
  };

  chart.yAxisLabel = function(_) {
    if (!arguments.length) return yAxisLabel;
    yAxisLabel = _;
    return chart;
  };

  chart.xAxisLabelOffset = function(_) {
    if (!arguments.length) return xAxisLabelOffset;
    xAxisLabelOffset = _;
    return chart;
  };

  chart.yAxisLabelOffset = function(_) {
    if (!arguments.length) return yAxisLabelOffset;
    yAxisLabelOffset = _;
    return chart;
  };

  chart.xTicks = function(_) {
    if (!arguments.length) return xTicks;
    xTicks = _;
    return chart;
  };

  chart.yTicks = function(_) {
    if (!arguments.length) return yTicks;
    yTicks = _;
    return chart;
  };

  chart.margin = function(_) {
    if (!arguments.length) return margin;
    margin = _;
    return chart;
  };

  return chart;
}