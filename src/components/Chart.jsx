import React from 'react';
import * as d3 from "d3";

class Chart extends React.Component {    
        constructor(props){
           super(props);
           this.createBarChart = this.createBarChart.bind(this);
           this.getMax = this.getMax.bind(this);
        }
        componentDidMount() {
           this.createBarChart();
        }
        componentDidUpdate() {
           this.createBarChart();
        }

        getMax(data) {
            return data.map((dataItem) => dataItem.alcohol_related_crashes);
        }

        createBarChart() {
            const { table } = this.props.data;
            const [ sizeW, sizeH ] = this.props.size;

            const node = this.node;
            const dataMax = d3.max(this.getMax(table));
            const yScale = d3.scaleLinear()
                .domain([0, dataMax])
                .range([0, sizeH]);

            const itemW = sizeW / table.length;
                
            d3.select(node)
                .selectAll('rect')
                .data(table)
                .enter()
                .append('rect');
            
            d3.select(node)
                .selectAll('rect')
                .data(table)
                .style('fill', '#fe9922')
                .attr('x', (d,i) => i * 100)
                .attr('y', d => sizeH - yScale(d.alcohol_related_crashes))
                .attr('height', d => yScale(d.alcohol_related_crashes))
                .attr('width', itemW - 10);

            d3.select(node)
                .selectAll('text')
                .data(table)
                .enter()
                .append('text')
                .attr('text-anchor', 'middle')
                .attr('x', (d,i) => (i * 100) + 45)
                .attr('y', d => sizeH - yScale(d.alcohol_related_crashes) + 20)
                .attr("font-family", "Roboto, sans-serif")
                .attr("font-size", "15px")
                .attr("fill", "white")
                .text( (item) => { 
                    return item.year;
                })
        }
     render() {
           return (
            <div>
                <h3 className="chart-title">
                    Alcohol Related Crashes
                </h3>
                <svg ref={node => this.node = node}
                    width={500} height={500}>
                </svg>
            </div>
           )
        }
     

}

export default Chart;