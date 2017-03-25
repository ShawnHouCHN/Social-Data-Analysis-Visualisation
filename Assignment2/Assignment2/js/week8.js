//Width and height
var w = 500;
var h = 500;

var colors = d3.scaleOrdinal(d3.schemeCategory10);

//Define a projection to project 3D space to 2D
var projection = d3.geoMercator()
	 .center([-122.433701, 37.767683])
	 .translate([w/2, h/2]) 	// translate projection to center
	 .scale([175000]); 				// 1000 is default, smaller is zoom out

//Define default path generator
var path = d3.geoPath()
	.projection(projection);

//Create SVG element
var svg2 = d3.select("#maintwo")
			.append("svg")
			.attr("width", w)
			.attr("height", h)
			.style("display","block")
			.style("margin","auto");


//Load in GeoJSON data


d3.json("data/sfpddistricts.geojson", function(json) {

	//Bind data and create one path per GeoJSON feature
	svg2.selectAll("path")
	   .data(json.features)
	   .enter()
	   .append("path")
		 // the location is a call to path, which takes the feature
		 // (coordinates) that we pass to it, and makes it into an svg
	   .attr("d", path)
		.style("fill", "lightgray")
		 .attr("stroke", "rgba(0, 0, 0, 0.5)")
		 .attr("stroke-width", 0.5);

		 // plot the PR dots
		 d3.json("data/kmeansPR-values.json", function(data) {

			 svg2.selectAll("circle")
				 .data(data)
				 .enter()
				 .append("circle")
				 .attr("cx", function(d) {
								 return projection([d[0], d[1]])[0];
				 })
				 .attr("cy", function(d) {
								 return projection([d[0], d[1]])[1];
				 })
				 .attr("r", 1.8)
				 .style("fill", function(d) {
					 return colors(d[2]);
				 })
				 .style("opacity", 0.75);

				 // plot original centers for k2
				 d3.json("data/cluster_centers.json", function(centers) {

					 var curr_centers = centers[0];

					 svg2.selectAll(".center")
					 	.data(curr_centers)
						.enter()
						.append("circle")
						.attr("cx", function(d) {
										return projection([d[0], d[1]])[0];
						})
						.attr("cy", function(d) {
										return projection([d[0], d[1]])[1];
						})
						.attr("r", 2.8)
						.attr("class", "center")
						.style("fill", 'black');

				 }) // end orig centers, keep wrapped in dots so dot's don't overlap

				 // plot neighbourhood names
				 d3.json("data/dist_locs.json", function(centers) {

					 console.log(centers);

					 svg2.selectAll(".dist_name")
						.data(centers)
						.enter()
						.append("text")
						.attr("x", function(d) {
										return projection(d.loc)[0];
						})
						.attr("y", function(d) {
										return projection(d.loc)[1];
						})
						.attr("class", "dist_name")
						.text(function(d) {
							return d.dist;
						})

				 }) // end orig centers, keep wrapped in dots so dot's don't overlap

	}) // end orig kmeans json



		 // ## For interactivity ##
d3.selectAll("button")
 .on("click", function() {

				 // grab the element name
				 var K_neigh = String(d3.select(this).text()).slice(-1);

				 // plot points
				 d3.json("data/kmeansPR-values.json", function(data) {

					 svg2.selectAll("circle")
						 .data(data)
						 .transition()
						 .style("fill", function(d) {
							 return colors(d[K_neigh]);
						 })


						 // dynamic plot the centers on click
						 d3.json("cluster_centers.json", function(centers) {

							 curr_centers = centers[K_neigh - 2];

							 svg2.selectAll(".center")
							 	.remove();

							 svg2.selectAll(".center")
								.data(curr_centers)
								.enter()
								.append("circle")
								.attr("cx", function(d) {
												return projection([d[0], d[1]])[0];
								})
								.attr("cy", function(d) {
												return projection([d[0], d[1]])[1];
								})
								.attr("r", 2.8)
								.attr("class", "center")
								.style("fill", 'black');


						 }) // end click cluster centers load

				 }) // end click kmeans json load

 }) // end on click

			 .on("mouseover", function() {

				 // grab the element name
				var K_neigh = String(d3.select(this).text()).slice(-1);
				console.log(K_neigh);

				 // dynamic plot the centers on click
				 d3.json("data/cluster_centers.json", function(centers) {

					 curr_centers = centers[K_neigh - 2];
					 console.log(curr_centers);

					 svg2.selectAll(".hov_center")
						.data(curr_centers)
						.enter()
						.append("circle")
						.attr("cx", function(d) {
										return projection([d[0], d[1]])[0];
						})
						.attr("cy", function(d) {
										return projection([d[0], d[1]])[1];
						})
						.attr("r", 2.8)
						.attr("class", "hov_center")
						.style("fill", 'red');


				 }) // end click cluster centers load

			 });

}); // end spfd.geojson load

// add district names
// add