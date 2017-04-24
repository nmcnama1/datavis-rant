var scatterPlot = ScatterPlot();
var usedIDs = [];

scatterPlot
  .outerWidth(960)
  .outerHeight(500)
  .margin({ left: 95, top: 5, right: 10, bottom: 85 })
  .xColumn("user_sentiment_score")
  .xAxisLabel("Sentiment")
  .xAxisLabelOffset(0)
  .xTicks(20)
  .yColumn("user_polarity_score")
  .yAxisLabel("Polarity")
  .yAxisLabelOffset(0)
  .yTicks(20)
  .colorColumn("user_location")
  .shapeColumn("user_gender")
//  .rColumn("sepal_width")// "r" stands for radius
 // .rMin(2)
//  .rMax(13);
  .shapeRange(["circle", "square"])
  .colorRange(["#ffa69e", "#896978", "#b8f2e6", "#62a87c", "#9DB4E0", "#E9D985", "#EDB897", "#EA68A1", "#F44410"]);

/*function type(d){
  //the one below is the one i messed with
  d.sepal_length = +d.petal_width;
  d.sepal_width  = +d.sepal_width;
  d.petal_length = +d.petal_length;
  d.petal_width  = +d.petal_width;
  return d;
}*/

function numberify(d){
  //the one below is the one i messed with
  d.tweet_polarity_score = +d.tweet_polarity_score;
  d.tweet_sentiment_score = +d.tweet_sentiment_score;
  d.user_follower_count = +d.user_follower_count;
  d.user_friends_count = +d.user_friends_count;
  d.user_polarity_score = +d.user_polarity_score;
  d.user_sentiment_score = +d.user_sentiment_score;
  d.user_retweet_count = +d.user_retweet_count;
  //return d;
  if (usedIDs.indexOf(d.user_id) != -1) {
    return null;
  } else {
    usedIDs.push(d.user_id);
    return d;
  }
 // var test = d3.nest().key(function(d) { return d.user_id;}).entries(d);
 // console.log(test);
}



d3.csv("plzwork.csv", numberify, function (data){
  d3.select("#chart")
    .datum(data)
    .call(scatterPlot);

});

/*d3.csv("iris.csv", type, function (data){
  //console.log(data);
  d3.select("#chart")
    .datum(data)
    .call(scatterPlot);
});*/
