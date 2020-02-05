import { scaleBand, scaleLinear, scaleOrdinal } from 'd3-scale';
import { axisBottom, axisLeft } from 'd3-axis';
import { select } from 'd3-selection';
import { transition } from 'd3-transition';

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

    this.element.innerHTML = '';
    this.plot = select(this.element)
      .append('svg')
        .attr('width', this.width + this.margin.left + this.margin.right)
        .attr('height', this.height + this.margin.top + this.margin.bottom)
      .append('g')
        .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

    this.createScales();
    this.addAxes();
    this.addBars();
  }

  createScales() {
    this.yScale = scaleBand()
        .domain(this.data.map(d => d.label))
        .range([this.height, 0])
        .padding(0.1);
    
    this.xScale = scaleLinear()
        .domain([0, 1])
        .range([0, this.width]);
    
    this.colorScale = scaleOrdinal()
        .domain(this.data.map(d => d.group))
        .range(['#37A3D6', '#FF9400']);
  }    
  
  addBars() {
    this.plot.selectAll('.bar')
        .data(this.data)
      .enter().append('rect')
        .attr('class', 'bar')
        .attr('width', d => this.xScale(d.proba))
        .attr('y', d => this.yScale(d.label))
        .attr('height', this.yScale.bandwidth())
        .style('fill', d => this.colorScale(d.group));
  }

  updateBars() {
    const t = transition()
      duration(750);

    let bar = this.plot.selectAll('g')
      .data(this.data);

    bar
      .exit()
        .remove();

    bar
      .transition(t)
      .attr('transform', (d, i) => `translate(${i * (BAR_WIDTH + BAR_GAP)},${y(d)})`);
  }

  addAxes() {
    this.plot.append('g')
        .attr('transform', `translate(0, ${this.height})`)
        .call(axisBottom(this.xScale));
    
    this.plot.append('g')
        .call(axisLeft(this.yScale));
  }

  setData(data) {
    this.data = data;
    this.draw();
  }
}

export default BarChart;