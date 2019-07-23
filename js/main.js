import { scaleBand, scaleLinear, scaleOrdinal } from 'd3-scale';
import { json } from 'd3-fetch';
import { select } from 'd3-selection';
import { axisBottom, axisLeft } from 'd3-axis';

// set the dimensions and margins of the graph
let margin = {top: 20, right: 20, bottom: 30, left: 60},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// set the ranges
//let y = d3.scaleBand()
let y = scaleBand()
          .range([height, 0])
          .padding(0.1);

//let x = d3.scaleLinear()
let x = scaleLinear()
          .range([0, width]);

//let color = d3.scaleOrdinal()
let color = scaleOrdinal()
              .range(["#37A3D6", "#FF9400"]);;

// append the svg object to the body of the page
// append a 'group' element to 'svg'
// moves the 'group' element to the top left margin
//let svg1 = d3.select("#area1").append("svg")
let svg1 = select("#area1").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");

json("data/predict-proba.json", function(data) {
  // format the data
  data.forEach(function(d) {
    d.predictProba = +d.predictProba;
  });

  // Scale the range of the data in the domains
  x.domain([0, 1]);
  y.domain(data.map(function(d) { return d.className; }));
  color.domain(data.map(function(d) { return d.className; }));

  // append the rectangles for the bar chart
  svg1.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("width", function(d) {return x(d.predictProba); } )
      .attr("y", function(d) { return y(d.className); })
      .attr("height", y.bandwidth())
      .style("fill", function(d) { return color(d.className); });

  // add the x Axis
  svg1.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(axisBottom(x));

  // add the y Axis
  svg1.append("g")
      .call(axisLeft(y));
})