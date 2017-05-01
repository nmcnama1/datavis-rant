var scatterPlot = ScatterPlot();
var usedIDs = [];
var globalData = {};
globalData["Otro_Male"] = [];
globalData["Otro_Female"] = [];
globalData["Antioquia_Male"] = [];
globalData["Antioquia_Female"] = [];
globalData["Bogota_Male"] = [];
globalData["Bogota_Female"] = [];
globalData["Cafetero_Male"] = [];
globalData["Cafetero_Female"] = [];
globalData["Caribe_Male"] = [];
globalData["Caribe_Female"] = [];
globalData["Centro_Male"] = [];
globalData["Centro_Female"] = [];
globalData["Oriento_Male"] = [];
globalData["Oriento_Female"] = [];
globalData["Pacifica_Male"] = [];
globalData["Pacifica_Female"] = [];
globalData["Otres_Male"] = [];
globalData["Otres_Female"] = [];
var thisWillDie = {Antioquia:true, Bogota:true, Cafetero:true, Caribe:true, Centro:true, Oriento:true, Otres:true, Pacifica:true, Otro:true, Male:true, Female:true};

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
  if (d.user_location == "-1") {
    d.user_location = "Otro";
  }
  return removeDuplicates(d);
}

function removeDuplicates(d) {
  if (usedIDs.indexOf(d.user_id) != -1) {
    return null;
  } else {
    usedIDs.push(d.user_id);
    if (d.user_location == "-1") {
      d.user_location = "Otro";
    }
    return d;
  }
}

function processData(entry) {
  keyString = entry.user_location + "_"+entry.user_gender;
  if(keyString != "undefined_undefined") {
    globalData[keyString].push(entry);
  }
}


d3.csv("twitter_data.csv", numberify, function (data){
  data.forEach(processData);
  d3.select("#scatterplotChart")
    .datum(data)
    .call(scatterPlot);
  processData(data);
});

function updateScatterData() {
    updateLineData();
    data = [];
    if (d3.select("#checkMale").property("checked")) {
      data = addLocations("Male", data)
    }
    if (d3.select("#checkFemale").property("checked")) {
      data = addLocations("Female", data)
    }
    d3.select("#scatterplotChart")
      .datum(data)
      .call(scatterPlot);
}

function addLocations(gender, data) {
  if (d3.select("#checkAntioquia").property("checked")) {
    data = data.concat(globalData["Antioquia_"+gender]);
  }
  if (d3.select("#checkBogota").property("checked")) {
    data = data.concat(globalData["Bogota_"+gender]);
  }
  if (d3.select("#checkCafetero").property("checked")) {
    data = data.concat(globalData["Cafetero_"+gender]);
  }
  if (d3.select("#checkCaribe").property("checked")) {
    data = data.concat(globalData["Caribe_"+gender]);
  }
  if (d3.select("#checkCentro").property("checked")) {
    data = data.concat(globalData["Centro_"+gender]);
  }
  if (d3.select("#checkOriento").property("checked")) {
    data = data.concat(globalData["Oriento_"+gender]);
  }
  if (d3.select("#checkOtres").property("checked")) {
    data = data.concat(globalData["Otres_"+gender]);
  }
  if (d3.select("#checkPacifica").property("checked")) {
    data = data.concat(globalData["Pacifica_"+gender]);
  }
  if (d3.select("#checkOtro").property("checked")) {
    data = data.concat(globalData["Otro_"+gender]);
  }
  return data;
}


/*Antioquia a 97
Bogota b 98
Cafetero c 99
Caribe d 100
Centro e 101
Oriento f 102
Otres g 103
Pacifica h 104
Otro i 105

Female j 106
Male k 107
*/