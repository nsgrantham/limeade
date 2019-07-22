
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

var color = d3.scaleOrdinal()
              .range(["#37A3D6", "#FF9400"]);;
          
// append the svg object to the body of the page
// append a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg1 = d3.select("#area1").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");

d3.json("data/predict-proba.json", function(data) {
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
      .call(d3.axisBottom(x));

  // add the y Axis
  svg1.append("g")
      .call(d3.axisLeft(y));
})

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
  x.domain([0, d3.max(data, function(d){ return d.contribProba; })])
  y.domain(data.map(function(d) { return d.textWord; }));

  // append the rectangles for the bar chart
  svg2.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("width", function(d) {return x(d.contribProba); } )
      .attr("y", function(d) { return y(d.textWord); })
      .attr("height", y.bandwidth())
      .style("fill", function(d) { return color(d.className)});

  // add the x Axis
  svg2.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // add the y Axis
  svg2.append("g")
      .call(d3.axisLeft(y));
})