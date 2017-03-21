var dataDicts; 
var disDicts,disTotalDicts;
var disCleanDict = {};
var disArray=[], pos03=[], pos15=[], theft03=[],theft15=[],totalcrime03=[],totalcrime15=[];
var data03=[],data15=[];
var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 1160 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;





//load data
dataDicts = d3.csv("data/SFPD_Incidents_-_from_1_January_2003.csv", function(data) {
  //console.log(data);
  disDicts=aggregateDistricts(data);
  disTotalDicts=aggregateCrimePerDistrict(data);

  //12 is the index of 2015, 0 is 2013 in the array
  theft03=disDicts[0].values[1];
  theft15=disDicts[12].values[1];
  pos03=disDicts[0].values[2];
  pos15=disDicts[12].values[2];

  totalcrime03=disTotalDicts[0];
  totalcrime15=disTotalDicts[12];

  for (index=0; index < totalcrime03.values.length; index++){
  	data03.push({'POS':pos03.values[index].value,'THE':theft03.values[index].value,'TOTAL':totalcrime03.values[index].value, 'DIS': totalcrime03.values[index].key})
  }

  for (index=0; index < totalcrime15.values.length; index++){
  	data15.push({'POS':pos15.values[index].value,'THE':theft15.values[index].value,'TOTAL':totalcrime15.values[index].value, 'DIS': totalcrime15.values[index].key})
  }


  	var yScale = d3.scaleLinear()
			  .domain(d3.extent(theft03.values,function(d){return d.value;}))
			  .range([height,0])
			  .nice();

	var yAxis = d3.axisLeft(yScale);
//svg.call(yAxis);

	var xScale = d3.scaleLinear()
			   .domain(d3.extent(pos03.values,function(d){return d.value;}))
			   .range([0,width])
			   .nice();

	var xAxis = d3.axisBottom(xScale).ticks(5);

	var rScale= d3.scaleSqrt()
				  .domain([0,d3.max(totalcrime03.values,function(d){return d.value;})])
				  .range([0,20]);

	// setup fill color
	// setup fill color
	var cValue = function(d) { return d.TOTAL;}, color = d3.scaleOrdinal(d3.schemeCategory10);

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
      


   	svg.selectAll('circle')
   	   .data(data03)
   	   .enter()
   	   .append('circle')
   	   .attr('cx',function(d){
   	   	return xScale(d.POS);
   	   })
   	   .attr('cy',function(d){
   	   	return yScale(d.THE);
   	   })
   	   .attr('r',function(d){
   	   	return rScale(d.TOTAL);
   	   })
   	   .style('fill-opacity',0.7)
   	   .style('fill', function(d) { return color(cValue(d));})
   	   .on("mouseover", function(d) {
          tooltip.transition()
               .duration(200)
               .style("opacity", 0.8);
          tooltip.html(d.DIS + "<br/> (" + d.POS
	        + ", " + d.THE + ")")
               .style("left", (d3.event.pageX + 5) + "px")
               .style("top", (d3.event.pageY - 28) + "px");
      })
      .on("mouseout", function(d) {
          tooltip.transition()
               .duration(500)
               .style("opacity", 0);
      });;

    
      // draw legend
  var legend = svg.selectAll(".legend")
      .data(color.domain())
      .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  // draw legend colored rectangles
  	legend.append("rect")
      .attr("x", width - 5)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color)
      .style('fill-opacity',0.7);

  	// draw legend text
  	legend.append("text")
      .attr("x", width - 10)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .style("font-size","50%")
      .text(function(d) { return d;})

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





function aggregateDistricts(data){
	disDicts=d3.nest().key(function(d) { 
 		return d.Date.slice(-4);
 	}).sortKeys(d3.ascending)
 	.key(function(d) {
 		if(d.Category=="PROSTITUTION" || d.Category=="VEHICLE THEFT"){
 			return d.Category;
 		}else{
 			return "Others";
 		}
 	}).key(function(d) { 
 		return d.PdDistrict;
 	}).sortKeys(d3.ascending)
 	.rollup(function(leaves) { 
 		return leaves.length; })
 	.entries(data);

 	return disDicts;
}

function aggregateCrimePerDistrict(data){
	dislengthArray=d3.nest().key(function(d) { 
 		return d.Date.slice(-4);
 	}).sortKeys(d3.ascending)
 	.key(function(d) { 
 		return d.PdDistrict;
 	}).sortKeys(d3.ascending)
 	.rollup(function(leaves) { 
 		return leaves.length; })
 	.entries(data);
 	return dislengthArray;
}


