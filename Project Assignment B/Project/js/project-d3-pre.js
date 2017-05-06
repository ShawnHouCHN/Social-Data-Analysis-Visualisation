var x = [], y = [], z=[];
var trace_injur={}, trace_died={};
var month_data, month_layout =[];
Plotly.d3.csv("data/injured.csv",function(injured){ 
    Plotly.d3.csv("data/killed.csv",function(killed){ 

        for (var i=0; i<injured.length; i++) {
          row = injured[i];
          x.push( row['Month'] );
          y.push( row['Number'] );
        }


        for (var i=0; i<killed.length; i++) {
          row = killed[i];
          z.push( row['Number'] );
        }

        trace_injur= {
          x: x,
          y: y,
          name: 'Injury every Month',
          type: 'bar'
        };

        trace_died = {
          x: x,
          y: z,
          name: ' Death every Month',
          type: 'bar'
        };

        data = [trace_injur, trace_died];

        layout = {title: 'Monthly Statistic of Casualty', barmode: 'stack', 
                  legend: {
                        x: 0,
                        y: 100,
                        traceorder: 'normal',
                        font: {
                          family: 'sans-serif',
                          size: 12,
                        },
                        "orientation": "h"
                      }
                  };

        Plotly.newPlot('month-plotly', data, layout);
    });
   //console.log(data);


});



var districts=['BRONX','BROOKLYN','STATEN ISLAND','MANHATTAN','QUEENS'];
var year_twl = {}, year_thrt={}, year_fort={}, year_fift={}, year_sixt={},year_sevt={};
var current_yearset={};
var donut_chart;
current_yearset=d3.csv("data/year-district.csv", function(years_districts) {
         for (var i=0; i<years_districts.length; i++) {
          row = years_districts[i];
          switch (row['YEAR']) {
            case '2012':
                  year_twl["BRONX"]=parseInt(row['BRONX']);
                  year_twl["BROOKLYN"]=parseInt(row['BROOKLYN']);
                  year_twl["STATEN ISLAND"]=parseInt(row['STATEN ISLAND']);
                  year_twl["MANHATTAN"]=parseInt(row['MANHATTAN']);
                  year_twl["QUEENS"]=parseInt(row['QUEENS']);
                  break;
            case '2013':
                  year_thrt['BRONX']=parseInt(row['BRONX']);
                  year_thrt['BROOKLYN']=parseInt(row['BROOKLYN']);
                  year_thrt['STATEN ISLAND']=parseInt(row['STATEN ISLAND']);
                  year_thrt['MANHATTAN']=parseInt(row['MANHATTAN']);
                  year_thrt['QUEENS']=parseInt(row['QUEENS']);
                  break;
            case '2014':
                  year_fort['BRONX']=parseInt(row['BRONX']);
                  year_fort['BROOKLYN']=parseInt(row['BROOKLYN']);
                  year_fort['STATEN ISLAND']=parseInt(row['STATEN ISLAND']);
                  year_fort['MANHATTAN']=parseInt(row['MANHATTAN']);
                  year_fort['QUEENS']=parseInt(row['QUEENS']);
                  break;
            case '2015':
                  year_fift['BRONX']=parseInt(row['BRONX']);
                  year_fift['BROOKLYN']=parseInt(row['BROOKLYN']);
                  year_fift['STATEN ISLAND']=parseInt(row['STATEN ISLAND']);
                  year_fift['MANHATTAN']=parseInt(row['MANHATTAN']);
                  year_fift['QUEENS']=parseInt(row['QUEENS']);
                  break;
            case '2016':
                  year_sixt['BRONX']=parseInt(row['BRONX']);
                  year_sixt['BROOKLYN']=parseInt(row['BROOKLYN']);
                  year_sixt['STATEN ISLAND']=parseInt(row['STATEN ISLAND']);
                  year_sixt['MANHATTAN']=parseInt(row['MANHATTAN']);
                  year_sixt['QUEENS']=parseInt(row['QUEENS']);
                  break;
            case '2017':
                  year_sevt['BRONX']=parseInt(row['BRONX']);
                  year_sevt['BROOKLYN']=parseInt(row['BROOKLYN']);
                  year_sevt['STATEN ISLAND']=parseInt(row['STATEN ISLAND']);
                  year_sevt['MANHATTAN']=parseInt(row['MANHATTAN']);
                  year_sevt['QUEENS']=parseInt(row['QUEENS']);
                  break;
            default:
          }
        }   

      donut_chart=  donut()
              .$el(d3.select("#donut-chart"))
              .data(year_twl)
              .render();

      d3.select(".range-slider__range").on("input", function() {
        //console.log(this.value);
        switch (this.value) {
          case '2012':
           donut_chart.data(year_twl).render();
           break;
          case '2013': 
           donut_chart.data(year_thrt).render();
           break;
          case '2014':
           donut_chart.data(year_fort).render();
           break;
          case '2015':
           donut_chart.data(year_fift).render();
           break;
          case '2016':
           donut_chart.data(year_sixt).render();
           break;
          case '2017':
           donut_chart.data(year_sevt).render();
           break;
        }
        //chart.data(getData()).render();
      });


  });



function donut(){  
      // Default settings
      var $el = d3.select("body")
      var data = {};
      // var showTitle = true;
      var width = 600,
          height = 400,
          radius = Math.min(width, height) / 2;

      var currentVal;
      var color = d3.scaleOrdinal(d3.schemeCategory10);
      var pie = d3.pie()
        .sort(null)
        .value(function(d) { return d.value; });

      var svg, g, arc; 


      var object = {};


      // Method for render/refresh graph
      object.render = function(){
        if(!svg){
          arc = d3.arc()
          .outerRadius(radius)
          .innerRadius(radius - (radius/2.5));

          svg = $el.append("svg")
            .attr("width", width)
            .attr("height", height)
          .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

          g = svg.selectAll(".arc")
            .data(pie(d3.entries(data)))
          .enter().append("g")
          .attr("class", "arc");

          g.append("path")
            // Attach current value to g so that we can use it for animation
            .each(function(d) { this._current = d; })
            .attr("d", arc)
            .style("fill", function(d) { return color(d.data.key); });
          g.append("text")
              .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
              .attr("dy", "-0.35em")
              .style("text-anchor", "middle")
              .style("font-size", "10px");
          g.select("text").text(function(d) { return d.data.key; });

          svg.append("text")
              .datum(data)
              .attr("x", 0 )
              .attr("y", 0 + radius/10 )
              .attr("class", "text-tooltip")        
              .style("text-anchor", "middle")
              .attr("font-weight", "bold")
              .style("font-size", radius/5+"px");

          g.on("mouseover", function(obj){
           // console.log(obj)
            svg.select("text.text-tooltip")
            .attr("fill", function(d) { return color(obj.data.key); })
            .text(function(d){
              return d[obj.data.key];
            });
          });

          g.on("mouseout", function(obj){
            svg.select("text.text-tooltip").text("");
          });

        }else{
          g.data(pie(d3.entries(data))).exit().remove();

          g.select("path")
          .transition().duration(1000)
          .attrTween("d", function(a){
            var i = d3.interpolate(this._current, a);
            this._current = i(0);
            return function(t) {
                return arc(i(t));
            };
          })

          g.select("text")
          .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; });

          svg.select("text.text-tooltip").datum(data);
        }      
        return object;
      };

      // Getter and setter methods
      object.data = function(value){
        if (!arguments.length) return data;
        data = value;
        return object;
      };

      object.$el = function(value){
        if (!arguments.length) return $el;
        $el = value;
        return object;
      };

      object.width = function(value){
        if (!arguments.length) return width;
        width = value;
        radius = Math.min(width, height) / 2;
        return object;
      };

      object.height = function(value){
        if (!arguments.length) return height;
        height = value;
        radius = Math.min(width, height) / 2;
        return object;
      };

      return object;
};


 var frequency_list = [
        {"text":"TIME","size":25.09},
        {"text":"Average_Humidity","size":9.20},
        {"text":"Mean_Temperature","size":8.25},
        {"text":"Max_Gust_Speed","size":7.42},
        {"text":"Wind_Speed","size":6.32},
        {"text":"Max_Wind_Speed","size":5.63},
        {"text":"Month","size":5.26},
        {"text":"VTC2_two_wheeler","size":4.74},
        {"text":"Visibility","size":3.10},
        {"text":"VTC2_other","size":3.08},
        {"text":"Precipitation","size":2.91},
        {"text":"street_SL","size":2.74},
        {"text":"VTC2_small","size":2.08},
        {"text":"VTC2_medium","size":1.93},
        {"text":"MANHATTAN","size":1.69},
        {"text":"BROOKLYN","size":1.31},
        {"text":"QUEENS","size":1.29},
        {"text":"BRONX","size":1.07},
        {"text":"VTC1_small","size":1.06},
        {"text":"VTC1_medium","size":1.03},
        {"text":"Snow_Depth","size":0.90},
        {"text":"VTC1_two_wheeler","size":0.62},
        {"text":"Rain_EV","size":0.62},
        {"text":"VTC2_large","size":0.58},
        {"text":"STATEN_ISLAND","size":0.56},
        {"text":"VTC1_other","size":0.44},
        {"text":"Fog_EV","size":0.35},
        {"text":"VTC1_large","size":0.34},
        {"text":"Snow","size":0.29},
        {"text":"Snow_EV","size":0.12}
    ];

var color = d3.scaleLinear()
            .domain([0, 30])
            .range(["#EBC944", "#DC143C"]);

d3.layout.cloud().size([800, 300])
            .words(frequency_list)
            .rotate(0)
            .fontSize(function(d) { return 10+(d.size*5); })
            .on("end", draw)
            .start();

function draw(words) {
        d3.select("#word-cloud").append("svg")
                .attr("width", 1050)
                .attr("height", 350)
                .attr("class", "wordcloud")
                .append("g")
                // without the transform, words words would get cutoff to the left and top, they would
                // appear outside of the SVG area
                .attr("transform", "translate(320,200)")
                .selectAll("text")
                .data(words)
                .enter().append("text")
                .style("font-size", function(d) { return d.size + "px"; })
                .style("fill", function(d, i) { return color(i); })
                .style("fill-opacity", function(d,i) {return (1/30)*(30-i);})
                .style("font-weight", "bold")
                .attr("transform", function(d) {
                    return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                })
                .text(function(d) { return d.text; });
};
