function ScatterPlot(){
  var outerWidth = 100;
  var outerHeight = 100;

  var margin = { left: 60, top: 5, right: 10, bottom: 60 };

  var xColumn = "No X column configured";
  var yColumn = "No Y column configured";
  var rColumn = "No radius column configured";
  var colorColumn = "No color column configured";
  var colorRange = d3.scale.category10().range();
  var shapeRange = d3.scale.category10().range();


  var xAxisLabel = "No X axis label configured";
  var xAxisLabelOffset = 40;

  var yAxisLabel = "No Y axis label configured";
  var yAxisLabelOffset = 30;

  var xScale = d3.scale.linear();
  var yScale = d3.scale.linear();
  var rScale = d3.scale.linear();
  var colorScale = d3.scale.ordinal();
  var shapeScale = d3.scale.ordinal();


  var xAxis = d3.svg.axis().scale(xScale).orient("bottom")
    .tickFormat(d3.format("s"))
    .outerTickSize(0);
//  var xTicks = 5;

  var yAxis = d3.svg.axis().scale(yScale).orient("right")
    .tickFormat(d3.format("s"))
    .outerTickSize(0);
  //var yTicks = 5;


  function chart(selection){
    var innerWidth  = outerWidth  - margin.left - margin.right;
    var innerHeight = outerHeight - margin.top  - margin.bottom;

    colorScale.range(colorRange);
    shapeScale.range(shapeRange);
    xScale.range([0, innerWidth]);
    yScale.range([innerHeight, 0]);

    xAxis.ticks(xTicks);
    yAxis.ticks(yTicks);

    selection.each(function (data) {

      var svg = d3.select(this).selectAll("svg").data([data]);
      var gEnter = svg.enter().append("svg").append("g");
      var g = svg.select("g");
      var points = g.selectAll(".point").data(data);

      gEnter
        .append("g")
          .attr("class", "x axis")
        .append("text")
          .attr("class", "label")
          .style("text-anchor", "middle");

      svg
        .append("text")
          .attr("id", "agLabel")
          .attr("class", "axislabel")
          .text("Against");
      svg
        .select("#agLabel")
        .attr("transform", "translate(" + (innerWidth/2+margin.left-elWidth("agLabel")/2) +", " + (innerHeight+margin.top+10+elHeight("agLabel")/2) + ")")

      svg
        .append("text")
          .attr("id", "negLabel")
          .attr("class", "axislabel")
          .text("Negative");
      svg
        .select("#negLabel")
        .attr("transform", "translate(" + (margin.left-elHeight("negLabel")/2) +", " + (margin.top+innerHeight/2+elWidth("negLabel")/2) + ") rotate(-90)")

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

      points.enter().append("path");

      points
        .attr("class", "point")
        .attr("transform", function(d) { return "translate(" + xScale(d[xColumn]) + "," + yScale(d[yColumn]) + ")"; })
        .attr("fill", function (d){ return   colorScale(d[colorColumn]); })
        .attr("d", d3.svg.symbol().type(function (d){ return  shapeScale(d[shapeColumn]); }))

//////////////////THIS IS THE TOOLTIP STUFF//////////////////
        .on("mouseover", function(d) {
            gEnter.append("text")
					   .attr("class", "tooltip")
					   .attr("x", xScale(d.user_sentiment_score))
					   .attr("y", yScale(d.user_polarity_score))
					   .attr("text-anchor", "end")
					   .attr("font-size", "15px")
					   .attr("fill", "black")
					   .text("Gender: "+d.user_gender);
            gEnter.append("text")
					   .attr("class", "tooltip")
					   .attr("x", xScale(d.user_sentiment_score))
					   .attr("y", yScale(d.user_polarity_score)+20)
					   .attr("text-anchor", "end")
					   .attr("font-size", "15px")
					   .attr("fill", "black")
					   .text("Region: "+d.user_location);
            gEnter.append("text")
					   .attr("class", "tooltip")
					   .attr("x", xScale(d.user_sentiment_score))
					   .attr("y", yScale(d.user_polarity_score)+40)
					   .attr("text-anchor", "end")
					   .attr("font-size", "15px")
					   .attr("fill", "black")
					   .text("Sentiment: "+d.user_sentiment_score);
             gEnter.append("text")
					   .attr("class", "tooltip")
					   .attr("x", xScale(d.user_sentiment_score))
					   .attr("y", yScale(d.user_polarity_score)+60)
					   .attr("text-anchor", "end")
					   .attr("font-size", "15px")
					   .attr("fill", "black")
					   .text("Polarity: "+d.user_polarity_score);
             gEnter.append("line")
             .attr("class", "crosshair")
             .attr("x1", 0)
             .attr("x2", innerWidth)
             .attr("y1", yScale(d.user_polarity_score))
             .attr("y2", yScale(d.user_polarity_score))
             .attr("stroke-width", 2)
             .attr("stroke", "#d3d3d3");
             gEnter.append("line")
             .attr("class", "crosshair")
             .attr("x1", xScale(d.user_sentiment_score))
             .attr("x2", xScale(d.user_sentiment_score))
             .attr("y1", 0)
             .attr("y2", innerHeight)
             .attr("stroke-width", 2)
             .attr("stroke", "#d3d3d3");
        })
        .on("mouseout", function() {
					d3.selectAll(".tooltip").remove();
          d3.selectAll(".crosshair").remove();
        })
////////////////////////////////////////////////////////////////////////
        .on("click", function(d) {
          console.log(d.user_location);
          var filtered = data.filter(function(e){return e.user_location == d.user_location;});
          var points2 = g.selectAll(".point").data(filtered);
          console.log(points2);
          //points2.enter().append("path");
          //points2.attr("fill",    "white");

                  
		    });


      points.exit().remove();
      
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

  chart.rColumn = function(_) {
    if (!arguments.length) return rColumn;
    rColumn = _;
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