/*
   #  Attribute                     Domain
   -- -----------------------------------------
   1. Sample code number            id number
   2. Clump Thickness               1 - 10
   3. Uniformity of Cell Size       1 - 10
   4. Uniformity of Cell Shape      1 - 10
   5. Marginal Adhesion             1 - 10
   6. Single Epithelial Cell Size   1 - 10
   7. Bare Nuclei                   1 - 10
   8. Bland Chromatin               1 - 10
   9. Normal Nucleoli               1 - 10
  10. Mitoses                       1 - 10
  11. Class:                        (2 for benign, 4 for malignant)
*/
var cancerCount = 0;
var benignCount = 0;
var totalCancerCount;
var totalBenignCount;
var svg;
var barG;
var curClass = null;

	var margin = {top: 30, right: 10, bottom: 10, left: 10},
			barMargin = 10,
			barWidth = 120 - 2*barMargin,
		    width = 1060 - barWidth -barMargin*2- margin.left - margin.right,
		    height = 500 - margin.top - margin.bottom,
			barHeight = height-2*barMargin;

	var x = d3.scale.ordinal().rangePoints([0, width], 1),
	    y = {},
	    dragging = {};

	var line = d3.svg.line(),
	    axis = d3.svg.axis().orient("left"),
	    background,
	    foreground;

window.onload = function () {
	svg = d3.select("svg")
	    .attr("width", width + barWidth + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom);

	barG = svg.append("g")
		.attr("transform", "translate(" + (margin.left+width) + "," + margin.top + ")");

	barG.append("text")
		.attr("x", barWidth/2)
		.attr("y", 3)
		.style("text-anchor", "middle")
		.text("Cancerous Cells");

	barG.append("text")
		.attr("x", barWidth/2)
		.attr("y", barMargin+ barHeight+15)
		.style("text-anchor", "middle")
		.text("Benign Cells");

	barG = barG.append("g");

	svg = svg.append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	d3.csv("cancer_full.csv", function(error, cancer) {
   		cancer = processData(cancer);

		// Extract the list of dimensions and create a scale for each.
		x.domain(dimensions = d3.keys(cancer[0]).filter(function(d) {
		return d != "Sample code number" && d != "Class" && d != "weight" && (y[d] = d3.scale.linear()
		    .domain(d3.extent(cancer, function(p) { return +p[d]; }))
		    .range([height, 0]));
		}));

		// Add grey background lines for context.
		background = svg.append("g")
		  .attr("class", "background")
		.selectAll("path")
		  .data(cancer)
		.enter().append("path")
		  .attr("d", path);

		// Add blue foreground lines for focus.
		// Also count cancerous and benign
		foreground = svg.append("g")
		.selectAll("path")
		  .data(cancer)
		.enter().append("path")
		  .attr("class", function(d) { 
		  	if(d.Class=="4"){
		  		cancerCount+=d.weight;
		  		return "cancerous";
		  	} else {
		  		benignCount+=d.weight;
		  		return "benign";
		  	}
		  })
		  .attr("stroke-opacity", function(d) {
		  	return 0.15 + 0.85*Math.pow(d.weight/maxWeight, 2);
		  })
		  .attr("stroke-width", function(d) {
		  	return 1.2 + 3.8*Math.pow(d.weight/maxWeight, 3);
		  })
		  .attr("d", path);
		  totalCancerCount = cancerCount;
		  totalBenignCount = benignCount;

		// Add a group element for each dimension.
		var g = svg.selectAll(".dimension")
		  .data(dimensions)
		.enter().append("g")
		  .attr("class", "dimension")
		  .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
		  .call(d3.behavior.drag()
		    .origin(function(d) { return {x: x(d)}; })
		    .on("dragstart", function(d) {
		      dragging[d] = x(d);
		      background.attr("visibility", "hidden");
		    })
		    .on("drag", function(d) {
		      dragging[d] = Math.min(width, Math.max(0, d3.event.x));
		      foreground.attr("d", path);
		      dimensions.sort(function(a, b) { return position(a) - position(b); });
		      x.domain(dimensions);
		      g.attr("transform", function(d) { return "translate(" + position(d) + ")"; })
		    })
		    .on("dragend", function(d) {
		      delete dragging[d];
		      transition(d3.select(this)).attr("transform", "translate(" + x(d) + ")");
		      transition(foreground).attr("d", path);
		      background
		          .attr("d", path)
		        .transition()
		          .delay(500)
		          .duration(0)
		          .attr("visibility", null);
		    }));

			// Add an axis and title.
			g.append("g")
			  .attr("class", "axis")
			  .each(function(d) { d3.select(this).call(axis.scale(y[d])); })
			.append("text")
			  .style("text-anchor", "middle")
			  .attr("y", -9)
			  .text(function(d) { return d; });

			// Add and store a brush for each axis.
			g.append("g")
			  .attr("class", "brush")
			  .each(function(d) {
			    d3.select(this).call(y[d].brush = d3.svg.brush().y(y[d]).on("brushstart", brushstart).on("brush", filter));
			  })
			.selectAll("rect")
			  .attr("x", -8)
			  .attr("width", 16);

		 	//Draw bars
			drawBars();

		});
}
function position(d) {
	var v = dragging[d];
	return v == null ? x(d) : v;
}

function transition(g) {
	return g.transition().duration(500);
}

// Returns the path for a given data point.
function path(d) {
	return line(dimensions.map(function(p) { return [position(p), y[p](d[p])]; }));
}

function brushstart() {
	d3.event.sourceEvent.stopPropagation();
}

//Toggles showing a specific class of cells
function showClass(Class) {
	if(curClass == Class || Class == null) {
		curClass = null;
		document.getElementById("showall").style.visibility = "hidden";
	} else {
		curClass = Class;
		document.getElementById("showall").style.visibility = "visible";
		document.getElementById("showtext").innerHTML = (Class == "4" ? "Benign" : "Cancerous") + " cells hidden";
	}
	filter();
}

//Handles showing and hiding of lines
function filter() {
	benignCount = 0;
	cancerCount = 0;
	var actives = dimensions.filter(function(p) { return !y[p].brush.empty(); }),
	  extents = actives.map(function(p) { return y[p].brush.extent(); });
	foreground.style("display", function(d) {
		var shown = actives.every(function(p, i) {
			return extents[i][0] <= d[p] && d[p] <= extents[i][1];
		}) && (curClass == null || d.Class == curClass);
		if(shown) {
			if(d.Class=="4") {
				cancerCount+=d.weight;
			} else {
				benignCount+=d.weight;
			}
			return null;
		} else {
			return "none";
		}
	});
	drawBars();
}

//Draws the side bar chart
function drawBars() {
	var total = totalCancerCount + totalBenignCount;
	var data = [{ min: 0, max: totalCancerCount-cancerCount, Class:"4" }, 
				{ min: totalCancerCount-cancerCount, max: totalCancerCount, Class:"4" }, 
				{ min: totalCancerCount, max: totalCancerCount+benignCount, Class:"2" }, 
				{ min: totalCancerCount+benignCount, max: total, Class:"2" }];

	var textData = [{y: totalCancerCount-cancerCount, val: cancerCount }, {y: totalCancerCount+benignCount, val: benignCount}]
	var cScale = color = d3.scale.ordinal().range(["#dfb9b9", "#F08080", "#4682B4", "#b1c1cd"]).domain([0,1,2,3]);
	var bound = barG.selectAll("rect")
		.data(data)
	bound.enter()
		.append("rect")
		.attr("width", barWidth)
		.on("click", function(d) { showClass(d.Class); });
	bound.transition().attr("height", function(d) { 
			if(total == 0) { 
				return 0 
			} else { 
				return barHeight * (d.max-d.min)/total 
			}
		})
		.attr("y", function(d,i) {
			return d.min*barHeight/total + barMargin;
		})
		.attr("fill", function(d,i) { return cScale(i)})

	var text = barG.selectAll("text")
		.data(textData, function(d , i) {return i;})
	text.enter()
		.append("text")
		.attr("class", "numberlabel")
		.style("text-anchor", "middle")
		.attr("x", (barWidth/2))
	text.text(function(d) { if(d.val > 0) { return d.val}  else { return ""; } })
		.transition()
		.attr("y", function(d) { 
			if(d.y <= totalCancerCount) { 
				return Math.min(totalCancerCount*barHeight/total-5, d.y*barHeight/total + 10) + barMargin;
			} else { 
				return Math.max(totalCancerCount*barHeight/total+10, d.y*barHeight/total - 4) + barMargin;
			}
		})
}