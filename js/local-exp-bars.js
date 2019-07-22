
// set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 30, left: 60},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// set the ranges
var y = d3.scaleBand()
          .range([height, 0])
          .padding(0.1);

var x = d3.scaleLinear()
          .range([0, width]);
          
// append the svg object to the body of the page
// append a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg2 = d3.select("#area2").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");

d3.json("data/local-exp.json", function(data) {
  // format the data
  data.forEach(function(d) {
    d.contribProba = +d.contribProba;
  });

  // Scale the range of the data in the domains
  x.domain([0, d3.max(data, function(d){ return Math.abs(d.contribProba); })])
  y.domain(data.map(function(d) { return d.textWord; }));

  // append the rectangles for the bar chart
  svg2.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("width", function(d) {return Math.abs(x(d.contribProba)); } )
      .attr("y", function(d) { return y(d.textWord); })
      .attr("height", y.bandwidth());

  // add the x Axis
  svg2.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // add the y Axis
  svg2.append("g")
      .call(d3.axisLeft(y));
})
