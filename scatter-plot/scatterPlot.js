function ScatterPlot(){

  var outerWidth = 100;
  var outerHeight = 100;

  var margin = { left: 60, top: 5, right: 10, bottom: 60 };

  var rMin = 2; // "r" stands for radius
  var rMax = 300;
  var xColumn = "No X column configured";
  var yColumn = "No Y column configured";
  var rColumn = "No radius column configured";
  var colorColumn = "No color column configured";
  var colorRange = d3.scale.category10().range();

  var xAxisLabel = "No X axis label configured";
  var xAxisLabelOffset = 40;

  var yAxisLabel = "No Y axis label configured";
  var yAxisLabelOffset = 30;

  var xScale = d3.scale.linear();
  var yScale = d3.scale.linear();
  var rScale = d3.scale.linear();
  var colorScale = d3.scale.ordinal();

  var xAxis = d3.svg.axis().scale(xScale).orient("bottom")
    .tickFormat(d3.format("s"))
    .outerTickSize(0);
  var xTicks = 5;

  var yAxis = d3.svg.axis().scale(yScale).orient("left")
    .tickFormat(d3.format("s"))
    .outerTickSize(0);
  var yTicks = 5;

  function chart(selection){

    var innerWidth  = outerWidth  - margin.left - margin.right;
    var innerHeight = outerHeight - margin.top  - margin.bottom;

    colorScale.range(colorRange);
    xScale.range([0, innerWidth]);
    yScale.range([innerHeight, 0]);
    rScale.range([rMin, rMax]);

    xAxis.ticks(xTicks);
    yAxis.ticks(yTicks);

    selection.each(function (data) {

      var svg = d3.select(this).selectAll("svg").data([data]);
      var gEnter = svg.enter().append("svg").append("g");
      var g = svg.select("g");
      var circles = g.selectAll("circle").data(data);

      gEnter
        .append("g")
          .attr("class", "x axis")
        .append("text")
          .attr("class", "label")
          .style("text-anchor", "middle");

      gEnter
        .append("g")
          .attr("class", "y axis")
        .append("text")
          .attr("class", "label")
          .style("text-anchor", "middle");

      xScale.domain(d3.extent(data, function (d){ return d[xColumn]; }));
      yScale.domain(d3.extent(data, function (d){ return d[yColumn]; }));
      rScale.domain(d3.extent(data, function (d){ return d[rColumn]; }));

      svg 
        .attr("width", outerWidth)
        .attr("height", outerHeight);

      g.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      g
        .select(".x.axis")
          .attr("transform", "translate(0," + innerHeight + ")")
          .call(xAxis)
        .select("text")
          .attr("x", innerWidth / 2)
          .attr("y", xAxisLabelOffset)
          .text(xAxisLabel);

      g
        .select(".y.axis")
          .call(yAxis)
        .select("text")
          .attr("transform", "translate(-" + yAxisLabelOffset + "," + (innerHeight / 2) + ") rotate(-90)")
          .text(yAxisLabel);

    //  console.log(yScale(d[yColumn]));
      circles.enter().append("circle");
      circles
        .attr("cx",      function (d){ return       xScale(d[xColumn]);     })
        .attr("cy",      function (d){ return       yScale(d[yColumn]);     })
        .attr("r",       function (d){ return       rScale(d[rColumn]);     })
        .attr("fill",    function (d){ return   colorScale(d[colorColumn]); });

      circles.exit().remove();

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

  chart.rMin = function(_) {
    if (!arguments.length) return rMin;
    rMin = _;
    return chart;
  };

  chart.rMax = function(_) {
    if (!arguments.length) return rMax;
    rMax = _;
    return chart;
  };

  chart.colorRange = function(_) {
    if (!arguments.length) return colorRange;
    colorRange = _;
    return chart;
  };

  chart.colorColumn = function(_) {
    if (!arguments.length) return colorColumn;
    colorColumn = _;
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