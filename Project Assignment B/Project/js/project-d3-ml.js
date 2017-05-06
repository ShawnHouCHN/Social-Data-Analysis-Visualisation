var width=660, height=300;


var svg = d3.select('#perform-plot')
            .append("svg")
            .attr("width", width)
            .attr("height", height),
    margin = {top: 20, right: 50, bottom: 30, left: 130},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;
  
var tooltip = d3.select("body").append("div").attr("class", "toolTip");
  
var x_ml = d3.scaleLinear().range([0, width]);
var y_ml = d3.scaleBand().range([height, 0]);

var g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
d3.csv("data/ml_acc_data.csv", function(error, data) {
    if (error) throw error;
  
    data.sort(function(a, b) { return a.acc - b.acc; });
  
    x_ml.domain([0, d3.max(data, function(d) { return d.acc; })]);
    y_ml.domain(data.map(function(d) { return d.model; })).padding(0.5);

    g.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x_ml).ticks(5).tickFormat(function(d) { return parseInt(d*100); }).tickSizeInner([-height]));

    g.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(y_ml));

    g.selectAll(".bar")
        .data(data)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", 0)
        .attr("height", y_ml.bandwidth())
        .attr("y", function(d) { return y_ml(d.model); })
        .attr("width", function(d) { return x_ml(d.acc); })
        .on("mousemove", function(d){
      // Replace hard coded vals (50, 90) with 50% of the tooltip wioth and height + a top buffer
            tooltip
              .style("left", d3.event.pageX - 50 + "px")
              .style("top", d3.event.pageY - 90 + "px")
              .style("display", "inline-block")
              .html((d.model) + "<br><span>"  + (d.acc)*100 + " %" + "</span>");
        })
            .on("mouseout", function(d){ tooltip.style("display", "none");});
});