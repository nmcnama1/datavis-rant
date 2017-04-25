var scatterPlot = ScatterPlot();
var usedIDs = [];

scatterPlot
  .outerWidth(600)
  .outerHeight(600)
  .margin({ left: 80, top: 80, right: 80, bottom: 80 })
  .xColumn("user_sentiment_score")
  .xAxisLabel("Positive")
  .xAxisLabelOffset(0)
  .xTicks(10)
  .yColumn("user_polarity_score")
  .yAxisLabel("For")
  .yAxisLabelOffset(0)
  .yTicks(10)
  .colorColumn("user_location")
  .shapeColumn("user_gender")
  .shapeRange(["circle", "cross"])
  .colorRange(["#ffa69e", "#896978", "#b8f2e6", "#62a87c", "#9DB4E0", "#E9D985", "#EDB897", "#EA68A1", "#F44410"]);


function numberify(d){
  d.tweet_polarity_score = +d.tweet_polarity_score;
  d.tweet_sentiment_score = +d.tweet_sentiment_score;
  d.user_follower_count = +d.user_follower_count;
  d.user_friends_count = +d.user_friends_count;
  d.user_polarity_score = +d.user_polarity_score;
  d.user_sentiment_score = +d.user_sentiment_score;
  d.user_retweet_count = +d.user_retweet_count;
  if (usedIDs.indexOf(d.user_id) != -1) {
    return null;
  } else {
    usedIDs.push(d.user_id);
    return d;
  }
 // var test = d3.nest().key(function(d) { return d.user_id;}).entries(d);
 // console.log(test);
}



d3.csv("twitter_data_small.csv", numberify, function (data){
  d3.select("#chart")
    .datum(data)
    .call(scatterPlot);

});

