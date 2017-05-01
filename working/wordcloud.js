window.onload = function(){ 
          console.log("hi");
         var margin = {top: 20, right: 20, bottom: 40, left: 20},
            width = 600 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

          var hashObjs = [];
          var tweet_hashes = "";
          
          console.log("working..");

          d3.csv("twitter_data.csv", function(error, data) {

              data.forEach(function(d){
                var h = d.tweet_hashtag;
                h = h.replace(/,/g, " ");
               
                tweet_hashes += h;
                tweet_hashes += " ";
              });

                mydataisready();
                mywc = wordCloud('#wordcloudChart', hashObjs);
            });

        d3.select("#checkFemale").on("change", updateCloudData);
        d3.select("#checkMale").on("change", updateCloudData);
        d3.select("#checkAntioquia").on("change", updateCloudData);
        d3.select("#checkBogota").on("change", updateCloudData);
        d3.select("#checkCafetero").on("change", updateCloudData);
        d3.select("#checkCaribe").on("change", updateCloudData);
        d3.select("#checkCentro").on("change", updateCloudData);
        d3.select("#checkOriento").on("change", updateCloudData);
        d3.select("#checkOtres").on("change", updateCloudData);
        d3.select("#checkPacifica").on("change", updateCloudData);
        d3.select("#checkOtro").on("change", updateCloudData);

        function mydataisready(){

          processFilters(tweet_hashes, hashObjs);

        }

        function processFilters(data, newarray){
          var split_array = data.split(" ");
          split_array.forEach(function(d){
            var hashObj = {}
            hashObj.hashtag = d;
            newarray.push(hashObj);
          });  
        }

        function wordCloud(selector, data) {
          var wordCount = d3.nest()
                            .key(function(d) {return d.hashtag;})
                            .rollup(function(v) {return v.length;})
                            .entries(data);
            wordCount.sort(function(a,b){
            return b.values-a.values;
          });
          var tags = [];
          wordCount.forEach(function(d){
            tags.push([d.key, parseInt(d.values)]);
          });
          var max = wordCount[0].values + 1;
          var maxfontSize = 0;
          tags = tags.slice(0,100); // choose top 250 words
          var color = "#5e6472";
          var fontSize = d3.scale.pow().exponent(5).domain([0,1]).range([10,80]);
          var layout = d3.layout.cloud()
              .timeInterval(10)
              .size([width, height])
              .words(tags)
              .rotate(function(d) { return 0; })
              .font('Raleway')
              .fontSize(function(d,i) { 
                  if(fontSize(d[1]/max) > maxfontSize){
                    maxfontSize = fontSize(d[1]/max);
                  }
                  return fontSize(d[1]/max); })
              .text(function(d) { return d[0]; })
              .spiral("archimedean")
              .on("end", draw)
              .start();
          var svg = d3.select('#wordcloudChart').append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
            .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
          var wordcloud = svg.append("g")
              .attr('class','wordcloud')
              .attr("transform", "translate(" + width/2 + "," + height/2 + ")");
          svg.append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + height + ")")
            .selectAll('text')
              .style('font-size','20px')
              .style('fill',function(d) { return color(d); })
              .style('font','Serif');
          function draw(words) {
            wordcloud.selectAll("text")
                .data(words)
                .enter().append("text")
                .attr('class','word')
                .style("font-size", function(d) { return d.size + "px"; })
                .style("font-family", function(d) { return d.font; })
                .style("fill", color)
                .attr("text-anchor", "middle")
                .attr("transform", function(d) { return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")"; })
                .text(function(d) { return d.text; });

          };
        }

        function updateCloudData(){
            updateScatterData();
            var genders = [];
            var locations = [];

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

            console.log("updating");

            d3.csv("twitter_data.csv", function(error, data) {

              var new_hashes = "";
              var newObjs = [];

              data.forEach(function(d){
                  //console.log(h);
                  if(locations.indexOf(d.user_location) == -1){
                    return;
                  }
                  if(genders.indexOf(d.user_gender) == -1){
                    return;
                  }

                  var h = d.tweet_hashtag;
                  h = h.replace(/,/g, " ");

                  new_hashes += h;
                  new_hashes += " ";
                  

              });

              processFilters(new_hashes, newObjs);


              var wordCount = d3.nest()
                                  .key(function(d) {return d.hashtag;})
                                  .rollup(function(v) {return v.length;})
                                  .entries(newObjs);
                  wordCount.sort(function(a,b){
                  return b.values-a.values;
                });
                var tags = [];
                wordCount.forEach(function(d){
                  tags.push([d.key, parseInt(d.values)]);
                });

                var max = wordCount[0].values + 1;
                var maxfontSize = 0;
                tags = tags.slice(0,100); // choose top 250 words

                var color = "#5e6472";
                var fontSize = d3.scale.pow().exponent(5).domain([0,1]).range([10,80]);
                var layout = d3.layout.cloud()
                    .timeInterval(10)
                    .size([width, height])
                    .words(tags)
                    .rotate(function(d) { return 0; })
                    .font('Raleway')
                    .fontSize(function(d,i) { 
                        if(fontSize(d[1]/max) > maxfontSize){
                          maxfontSize = fontSize(d[1]/max);
                        }
                        return fontSize(d[1]/max); })
                    .text(function(d) { return d[0]; })
                    .spiral("archimedean")
                    .on("end", draw)
                    .start();

                function draw(words) {
                    var wordcloud = d3.selectAll('g.wordcloud').selectAll('text')
                        .data(words, function(d) { return d; });
                        
                    var svg = d3.select('#wordcloudChart').selectAll('svg')
                    .selectAll('text')
                    .style('font-size','20px')
                    .style('fill',function(d) { return "#5e6472"; })
                    .style('font','Serif');

                    wordcloud 
                        .enter()
                        .append("text")
                        .attr('class','word')
                        .style("font-size", function(d){ return 1+"px";})
                        .style("fill", "white")
                        .attr("text-anchor", "middle")
                        .attr("transform", function(d) { return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")"; })
                        .text(function(d) { return d.text; })

                    wordcloud
                        .transition()
                        .duration(2000)
                        .style("font-family", function(d) { return d.font; })
                        .style("font-size", function(d) { return d.size + "px"; })
                        .style("fill", "#5e6472")
                        .attr("transform", function(d) {
                            return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                        })
                        .style("fill-opacity", 1);

                    wordcloud
                        .exit()
                        .transition()
                        .duration(1000)
                        .style("fill-opacity", 0)
                        .style("fill", "white")
                        .attr("text-anchor", "middle")
                        .attr('font-size', function(d){ return 1+"px";})
                        .remove();
                  }; 
            });
        }

};
