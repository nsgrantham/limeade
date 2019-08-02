import { scaleBand, scaleLinear, scaleOrdinal } from 'd3-scale';
import { axisBottom, axisLeft } from 'd3-axis';
import { select } from 'd3-selection';

class BarChart {
  constructor(opts) {
    this.element = opts.element;
    this.data = opts.data;

    this.draw();
  }

  draw() {
    this.margin = {top: 20, right: 20, bottom: 30, left: 60};
    this.width = 960 - this.margin.left - this.margin.right;
    this.height = 240 - this.margin.top - this.margin.bottom;

    // set up parent element and SVG
    this.element.innerHTML = '';
    const svg = select(this.element)
      .append('svg')
        .attr('width', this.width + this.margin.left + this.margin.right)
        .attr('height', this.height + this.margin.top + this.margin.bottom)
      .append('g')
        .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

    // set the ranges
    let y = scaleBand()
        .range([this.height, 0])
        .padding(0.1);
    
    let x = scaleLinear()
        .range([0, this.width]);
    
    let color = scaleOrdinal()
        .range(['#37A3D6', '#FF9400']);
    
    // scale the range of the data in the domains
    x.domain([0, 1]);
    y.domain(this.data.map(function(d) { return d.label; }));
    color.domain(this.data.map(function(d) { return d.group; }));
    
    // set up parent element and SVG
    svg.selectAll('.bar')
        .data(this.data)
      .enter().append('rect')
        .attr('class', 'bar')
        .attr('width', function(d) {return x(d.proba); } )
        .attr('y', function(d) { return y(d.label); })
        .attr('height', y.bandwidth())
        .style('fill', function(d) { return color(d.group); });
    
    // add the x axis
    svg.append('g')
        .attr('transform', `translate(0, ${this.height})`)
        .call(axisBottom(x));
    
    // add the y axis
    svg.append('g')
        .call(axisLeft(y));
    
  }

  //drawButton() {
  //  document.getElementById('update').addEventListener('click', () => {
  //    console.log('pressed');
  //  })
  //}
}

export default BarChart;