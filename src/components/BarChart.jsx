import React from 'react';
import * as d3 from "d3";

function getColumnNames(data) {
	return Object.keys(data).filter(x => x !== 'year');
}

function formatColumnNames(data) {
	return data.map(x => {
		return x.split("_").join(" ");
	});
}

class BarChart extends React.Component {
    constructor(props){
        super(props);
        this.updateBarChart = this.updateBarChart.bind(this);
        this.getMax = this.getMax.bind(this);
        this.setActiveColumn = this.setActiveColumn.bind(this);
        const columns = getColumnNames(this.props.data.table[0]);

        this.state = {
            columns,
            activeColumn: columns[0],
            dm: {
                top: 30,
                right: 20,
                bottom: 40,
                left: 60,
                innerWidth: props.size[0] - 100,
                innerHeight: props.size[1] - 80
            }
        }
    }
    componentDidMount() {        
        this.svg = d3.select(this.svgContainerEl);       
        const { dm } = this.state;

        this.svg.append("g")
        .attr('class', 'chart-inner')
        .attr("width", dm.innerWidth)
        .attr("height", dm.innerHeight)
        .attr("transform", `translate(${dm.left},${dm.top})`);
 
        this.updateBarChart();
    }
    componentDidUpdate() {
        this.updateBarChart();
    }

    getMax(data) {
        return data.map((dataItem) => dataItem[this.state.activeColumn]);
    }

    setActiveColumn(e) {        
        this.setState({activeColumn: e.target.value});
    }

    updateBarChart() {
        const { table } = this.props.data;
        const activeColumn = this.state.activeColumn;
        const [ sizeW, sizeH ] = this.props.size;
        const dataMax = d3.max(this.getMax(table));
        const { dm } = this.state;        
        
        const yScale = d3.scaleLinear()
            .domain([0, dataMax])
            .range([dm.innerHeight, 0]);

        const xScale = d3.scaleBand()
            .range([0, dm.innerWidth]).padding(0.1)
            .domain(table.map(item => item.year));

        const yAxis = d3.axisLeft(yScale).ticks(20);
        const xAxis = d3.axisBottom(xScale);

        const bars = this.svg.select('.chart-inner')
            .selectAll('rect')
            .data(table, item => item[activeColumn]);

        bars.enter()
            .append('rect')
            .style('fill', '#fe9922')
            .attr('x', item => xScale(item.year))
            .attr('y', item => yScale(item[activeColumn]))
            .attr('height', item => dm.innerHeight - yScale(item[activeColumn]))
            .attr('width', xScale.bandwidth())
            .exit()
            .remove()

        this.svg.select('.chart-inner')
            .selectAll('text')
            .data(table)
            .enter()
            .append('text')
            .attr('text-anchor', 'middle')
            .attr('x', item => xScale(item.year) + ( xScale.bandwidth() / 2 ))
            .attr('y', item => yScale(item[activeColumn]) + 20)
            .attr("font-family", "Roboto, sans-serif")
            .attr("font-size", "15px")
            .attr("fill", "white")
            .text(item => item[activeColumn])

        this.svg.select('.chart-inner')
            .append('g')
            .call(yAxis)

        this.svg.select('.chart-inner')
            .append('g')
            .attr("class", "axis axis--x")
            .attr('transform', `translate(0, ${dm.innerHeight})`)
            .call(xAxis)

        bars.exit()
            .remove()
        
        }        
    
    render() {
        const [ sizeW, sizeH ] = this.props.size;
        const columns = getColumnNames(this.props.data.table[0]);

        console.log(this.state)

        return (
            <div className="chart">
                <h3 className="chart-title">
                    Alcohol Related Crashes
                </h3>
                <div className="input-group">
					<select onChange={this.setActiveColumn} className="form-control">
						{columns.map((x,i) => (
							<option key={i} value={x}>{x.split("_").join(" ")}</option>
						))}
					</select>
				</div>
                <svg ref={el => this.svgContainerEl = el}
                    className="bar-chart"
                    width={sizeW} height={sizeH}>
                </svg>
            </div>
        )
    }
     

}

export default BarChart;