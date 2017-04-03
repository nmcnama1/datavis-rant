var scatterPlot = ScatterPlot();

scatterPlot
  .outerWidth(960)
  .outerHeight(500)
  .margin({ left: 95, top: 5, right: 10, bottom: 85 })
  .xColumn("sepal_length")
  .xAxisLabel("Sentiment")
  .xAxisLabelOffset(0)
  .xTicks(20)
  .yColumn("petal_length")
  .yAxisLabel("Polarity")
  .yAxisLabelOffset(0)
  .yTicks(20)
  .colorColumn("species")
  .rColumn("sepal_width")// "r" stands for radius
  .rMin(2)
  .rMax(13)
  .colorRange(["#ffa69e", "#896978", "#b8f2e6", "#62a87c", "#9DB4E0", "#E9D985"]);

function type(d){
  //the one below is the one i messed with
  d.sepal_length = +d.petal_width;
  d.sepal_width  = +d.sepal_width;
  d.petal_length = +d.petal_length;
  d.petal_width  = +d.petal_width;
  return d;
}

/*d3.json("short.json", type, function(data) {
  //console.log(data.user_gender);
  d3.select("#chart")
    .datum(data)
    .call(scatterPlot);
});*/


d3.csv("iris.csv", type, function (data){
  console.log(data);
  d3.select("#chart")
    .datum(data)
    .call(scatterPlot);
});