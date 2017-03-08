var dataArray = [23, 13, 21, 14, 37, 15, 18, 34, 30];
var w=960;
var h=900;
var svg = d3.select("#chart1")
			.append("svg")
			.attr("width","100%")
			.attr("height","100%");

svg.selectAll("rect")
    .data(dataArray)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("height", function(d, i) {return (d * 10)})
    .attr("width","40")
	.attr("x", function(d, i) {return (i * 60) + 25})
    .attr("y", function(d, i) {return 400 - (d * 10)})
    .attr("fill",function(d) {
					if (d > 24) {	//Threshold of 24
						return "red";
					} else {
						return "black";
		
					}
    });
