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

        donut()
              .$el(d3.select("#yearly-all"))
              .data(year_twl)
              .render();

  });


function donut(){  
      // Default settings
      var $el = d3.select("body")
      var data = {};
      // var showTitle = true;
      var width = 960,
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
            console.log(obj)
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
          .transition().duration(200)
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





