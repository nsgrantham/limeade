import { scaleBand, scaleLinear, scaleOrdinal } from 'd3-scale';
import { axisBottom, axisLeft } from 'd3-axis';

class BarChart {
  constructor(svg, data, height, width) {
    // set the ranges
    let y = scaleBand()
        .range([height, 0])
        .padding(0.1);
    
    let x = scaleLinear()
        .range([0, width]);
    
    let color = scaleOrdinal()
        .range(["#37A3D6", "#FF9400"]);
    
    // scale the range of the data in the domains
    x.domain([0, 1]);
    y.domain(data.map(function(d) { return d.className; }));
    color.domain(data.map(function(d) { return d.className; }));
    
    // append the rectangles for the bar chart
    svg.selectAll(".bar")
        .data(data)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("width", function(d) {return x(d.predictProba); } )
        .attr("y", function(d) { return y(d.className); })
        .attr("height", y.bandwidth())
        .style("fill", function(d) { return color(d.className); });
    
    // add the x axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(axisBottom(x));
    
    // add the y axis
    svg.append("g")
        .call(axisLeft(y));
    
  }
}

export default BarChart;