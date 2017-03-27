var dataDicts,dataSecond; 

var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 1160 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var xScale, yScale, rScale, yAxis, xAxis, cValue,cValue2, legend, legend2;
//load data
dataDicts = d3.json("data/crime_2003.json", function(error, data) {
  //console.log(data);

  yScale = d3.scaleLinear()
			  .domain([0,d3.max(data,function(d){return d.VT;})])
			  .range([height,0])
			  .nice();

	yAxis = d3.axisLeft(yScale);

	xScale = d3.scaleLinear()
			   .domain([0, d3.max(data,function(d){return d.PR;})])
			   .range([0,width])
			   .nice();

	xAxis = d3.axisBottom(xScale).ticks(5);

	rScale= d3.scaleSqrt()
				  .domain([0,d3.max(data,function(d){return d.TOT;})])
				  .range([0,20]);

	// setup fill color
	// setup fill color
	cValue = function(d) { return d.TOT;}, color = d3.scaleOrdinal(d3.schemeCategory10);


  svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 3))
        .attr("text-anchor", "middle")
        .attr("class", "title") 
        .style("font-size", "16px")  
        .text("Prostitution VS Vehicle Theft 2003");
	// x-axis
	svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .append("text")
      .text("PROSTITUTION")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .style("text-anchor", "end");

  svg.append("text")      // text label for the x axis
      .attr("x", width / 2 )
      .attr("y",  height + margin.bottom)
      .style("text-anchor", "middle")
      .text("Prostitution");

  	// y-axis
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .text("VEHICLE THEFT")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end");

  svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Vehicle Theft");


   	svg.selectAll('circle')
   	   .data(data)
   	   .enter()
   	   .append('circle')
   	   .attr('cx',function(d){
   	   	return xScale(d.PR);
   	   })
   	   .attr('cy',function(d){
   	   	return yScale(d.VT);
   	   })
   	   .attr('r',function(d){
   	   	return rScale(d.TOT);
   	   })
   	   .style('fill-opacity',0.7)
   	   .style('fill', function(d) { return color(cValue(d));})
   	   .on("mouseover", function(d) {
          tooltip.transition()
               .duration(200)
               .style("opacity", 0.8);
          tooltip.html(d.DST + "<br/> (" + d.PR
	        + ", " + d.VT + ")")
               .style("left", (d3.event.pageX + 5) + "px")
               .style("top", (d3.event.pageY - 28) + "px");
      })
      .on("mouseout", function(d) {
          tooltip.transition()
               .duration(500)
               .style("opacity", 0);
      });

    
      // draw legend
  legend = svg.selectAll(".legend")
      .data(color.domain())
      .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  // draw legend colored rectangles
  	legend.append("rect")
      .attr("x", width - 2)
      .attr("y", height/2)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color)
      .style('fill-opacity',0.7);

  	// draw legend text
  	legend.append("text")
      .attr("x", width - 8)
      .attr("y", height/2+10)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .style("font-size","50%")
      .text(function(d) { return d;});


    legend.append("text")
      .attr("x", width - 30)
      .attr("y", height/2+10)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .style("font-size","50%")
      .text(function(d,i) { return data[i].DST+": ";});

});


d3.selectAll(".tabften").on('click',function() {

    dataSecond = d3.json("data/crime_2015.json", function(error, data) {
      //console.log(data);
      cValue = function(d) { return d.TOT;}, color = d3.scaleOrdinal(d3.schemeCategory10);
      svg.selectAll("circle")
        .data(data)  // Update with new data
        .transition()  // Transition from old to new
        .duration(1000)  // Length of animation
        //.ease('circle')
        .on("start", function() {  // Start animation  (d3 v4 uses on, d3 v3 uses each keyword!!!!!)
            d3.select(this)  // 'this' means the current element
                .attr("fill", "red")  // Change color
                .attr("r", 5);  // Change size
        })
        .delay(function(d, i) {
            return i / data.length * 500;  // Dynamic delay (i.e. each item delays a little longer)
        })
       .attr('cx',function(d){
        return xScale(d.PR);
       })
       .attr('cy',function(d){
        return yScale(d.VT);
       })
       .attr('r',function(d){
        return rScale(d.TOT);
       })
       .style('fill-opacity',0.7)
       .style('fill', function(d) { return color(cValue(d));})
       .on("end", function() {  // End animation
            d3.select(this)  // 'this' means the current element
                .transition()
                .duration(500)
        });




  svg.selectAll(".legend").remove();
  svg.selectAll(".title").remove();

  svg.append("text")
      .attr("x", (width / 2))             
      .attr("y", 0 - (margin.top / 3))
      .attr("text-anchor", "middle")  
      .attr("class", "title")  
      .style("font-size", "16px")  
      .text("Prostitution VS Vehicle Theft 2015");  

    svg.append("text")      // text label for the x axis
      .attr("x", width / 2 )
      .attr("y",  height + margin.bottom)
      .style("text-anchor", "middle")
      .text("Prostitution");

  svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Vehicle Theft");
             // draw legend
  legend = svg.selectAll(".legend")
      .data(color.domain())
      .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  // draw legend colored rectangles
    legend.append("rect")
      .attr("x", width - 2)
      .attr("y", height/2)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color)
      .style('fill-opacity',0.7);

    // draw legend text
    legend.append("text")
      .attr("x", width - 8)
      .attr("y", height/2+10)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .style("font-size","50%")
      .text(function(d) { return d;});

    legend.append("text")
      .attr("x", width - 30)
      .attr("y", height/2+10)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .style("font-size","50%")
      .text(function(d,i) { return data[i].DST+": ";});

      });

 });


d3.selectAll(".tabthree").on('click',function() {

dataDicts = d3.json("data/crime_2003.json", function(error, data) {
 cValue = function(d) { return d.TOT;}, color = d3.scaleOrdinal(d3.schemeCategory10);
      svg.selectAll("circle")
        .data(data)  // Update with new data
        .transition()  // Transition from old to new
        .duration(1000)  // Length of animation
        //.ease('circle')
        .on("start", function() {  // Start animation  (d3 v4 uses on, d3 v3 uses each keyword!!!!!)
            d3.select(this)  // 'this' means the current element
                .attr("fill", "red")  // Change color
                .attr("r", 5);  // Change size
        })
        .delay(function(d, i) {
            return i / data.length * 500;  // Dynamic delay (i.e. each item delays a little longer)
        })
       .attr('cx',function(d){
        return xScale(d.PR);
       })
       .attr('cy',function(d){
        return yScale(d.VT);
       })
       .attr('r',function(d){
        return rScale(d.TOT);
       })
       .style('fill-opacity',0.7)
       .style('fill', function(d) { return color(cValue(d));})
       .on("end", function() {  // End animation
            d3.select(this)  // 'this' means the current element
                .transition()
                .duration(500)
        });



  svg.selectAll(".legend").remove();
  svg.selectAll(".title").remove();

  svg.append("text")
      .attr("x", (width / 2))             
      .attr("y", 0 - (margin.top / 3))
      .attr("text-anchor", "middle")  
      .attr("class", "title")  
      .style("font-size", "16px")  
      .text("Prostitution VS Vehicle Theft 2003");  


  svg.append("text")      // text label for the x axis
      .attr("x", width / 2 )
      .attr("y",  height + margin.bottom)
      .style("text-anchor", "middle")
      .text("Prostitution");

  svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Vehicle Theft");
             // draw legend
  legend = svg.selectAll(".legend")
      .data(color.domain())
      .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  // draw legend colored rectangles
    legend.append("rect")
      .attr("x", width - 2)
      .attr("y", height/2)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color)
      .style('fill-opacity',0.7);

    // draw legend text
    legend.append("text")
      .attr("x", width - 8)
      .attr("y", height/2+10)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .style("font-size","50%")
      .text(function(d) { return d;});

    legend.append("text")
      .attr("x", width - 30)
      .attr("y", height/2+10)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .style("font-size","50%")
      .text(function(d,i) { return data[i].DST+": ";});

      });

});

//add svg canvas
var svg = d3.select("#main")
			.append("svg")
    		.attr("width", width + margin.left + margin.right)
    		.attr("height", height + margin.top + margin.bottom)
    		.append("g")
    		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// add the tooltip area to the webpage
var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

