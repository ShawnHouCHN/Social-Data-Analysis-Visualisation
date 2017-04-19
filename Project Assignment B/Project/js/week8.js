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


// Initialize global data variables
var KM_data;			// to hold PR crimes
var json_data;    // to hold SF boundaries
var center_data;	// to hold cluster centers
var dist_data;		// to hold district names

// cluster stabilities
var stabs = [0.9918, 0.9927, 0.9075, 0.9154, 0.9014];

d3.json("data/dist_locs.json", function(centers) {

	dist_data = centers;

}); // end dist names

// load centers
d3.json("data/cluster_centers.json", function(centers) {

	center_data = centers;

}); 

d3.json("data/sfpddistricts.geojson", function(data1) {

			// plot the PR dots
			d3.json("data/kmeansPR-values.json", function(data2) {

				json_data = data1;
				KM_data = data2;

			// bind data and create one path per GeoJSON feature
				svg2.selectAll("path")
			   .data(json_data.features)
			   .enter()
			   .append("path")
				 // the location is a call to path, which takes the feature
				 // (coordinates) that we pass to it, and makes it into an svg
			   .attr("d", path)
				 .style("fill", "lightgray")
				 .attr("stroke", "rgba(0, 0, 0, 0.5)")
				 .attr("stroke-width", 0.5);

				 // plot district names (under dots)
				 svg2.selectAll(".dist_name")
					.data(dist_data)
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
					});

					 // plot default PR crimes for k2 (over names)
					 svg2.selectAll("circle")
						 .data(KM_data)
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

						 // plot cluster centers (over dots)
						 var curr_centers = center_data[0];
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
							.attr("r", 5.0)
							.attr("class", "center")
							// plot based on cluster
							.style("fill", function(d, i) {
								return "white";
							})
							.style("stroke", "black");

						 // add legend
						 var legend = svg2.selectAll(".legend")
								.data([1])
								.enter().append("g")
								.attr("class", "legend")
								.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

						// add cluster name
						legend.append("text")
								.attr("x", 0)
								.attr("y", 9)
								.attr("dy", ".35em")
								.attr("font-size", "14px")
								.attr("class", "k_num")
								.style("text-anchor", "start")
								.text(function (d) {
									return 'Showing K:2';
								});

						// add cluster stability
						legend.append("text")
								.attr("x", 0)
								.attr("y", 27)
								.attr("dy", ".35em")
								.attr("font-size", "14px")
								.attr("class", "k_stability")
								.style("text-anchor", "start")
								.text(function (d) {
									return 'Clustering stability: ' + String(stabs[0]);
								});
						});
		});


d3.selectAll(".tabk").on("click", function() {

	 // grab the element name
	 var K_neigh = String(d3.select(this).text()).slice(-1);
	  // plot points
	 svg2
	 svg2.selectAll("circle")
			 //.data(KM_data)
			 .transition()
			 .delay(function(d, i) { 
						   return i / KM_data.length * 2000;
			 })
			 .duration(1000) 
			 .style("fill", function(d) {
				 return colors(d[K_neigh]);
				 });

	  // dynamic plot the centers on click
		var curr_centers = center_data[K_neigh - 2];

		 // remove previous centers
		 svg2.selectAll(".center")
		 	.remove();

		 // plot new centres
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
			.attr("r", 5.0)
			.attr("class", "center")
			// plot based on cluster
			.style("fill", function(d, i) {
				return "white";
			})
			.style("stroke", "black");

			// update number of K in legend
			svg2.selectAll(".legend").remove();


			var legend = svg2.selectAll(".legend")
					.data([1])
					.enter().append("g")
					.attr("class", "legend")
					.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

			// add cluster name
			legend.append("text")
					.attr("x", 0)
					.attr("y", 9)
					.attr("dy", ".35em")
					.attr("font-size", "14px")
					.attr("class", "k_num")
					.style("text-anchor", "start")
					.text(function (d) {
						return 'Showing K:' + K_neigh;
					});

			// add cluster stability
			legend.append("text")
					.attr("x", 0)
					.attr("y", 27)
					.attr("dy", ".35em")
					.attr("font-size", "14px")
					.attr("class", "k_stability")
					.style("text-anchor", "start")
					.text(function (d) {
						return 'Clustering stability: ' + String(stabs[K_neigh-2])
					});

}); 