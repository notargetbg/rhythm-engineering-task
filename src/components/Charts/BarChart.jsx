import React from 'react';
import * as d3 from 'd3';
import { getColumnNames, formatColumnName } from '../../store/helpers';
import ChartTitle from './ChartTitle';

class BarChart extends React.Component {
    constructor(props){
        super(props); 

        const columns = getColumnNames(this.props.data.table[0]);
        const tableData = props.data.table.map((x) => {
            return {
                category: x[props.activeCategory],
                data: x[columns[0]]
            };
        });

        this.state = {
            tableData,
            columns,
            activeColumn: columns[0],
            dm: {
                top: 30,
                right: 20,
                bottom: 20,
                left: 50,
                innerWidth: props.size[0] - 80,
                innerHeight: props.size[1] - 60
            }
        };
    }

    componentDidMount() {
        const { dm } = this.state;
        const { yAxis, xAxis } = this.getScalesAndAxes();
        this.svg = d3.select(this.svgContainerEl);

        this.svg.append('g')
        .attr('class', 'chart-inner')
        .attr('width', dm.innerWidth)
        .attr('height', dm.innerHeight)
        .attr('transform', `translate(${dm.left},${dm.top})`);

         this.svg
            .append('g')
            .attr('class', 'axis axis--y')
            .attr('transform', `translate(${dm.left},${dm.top})`)
            .call(yAxis);

        this.svg
            .append('g')
            .attr('class', 'axis axis--x')
            .attr('transform', `translate(${dm.left},${dm.top + dm.innerHeight})`)
            .call(xAxis);

        this.updateBarChart();
    }

    componentDidUpdate() {
        this.updateBarChart();
    }

    getScalesAndAxes = () => {
        const { dm, tableData } = this.state;

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(tableData.map((item) => item.data))])
            .range([dm.innerHeight, 0]);

        const xScale = d3.scaleBand()
            .domain(tableData.map(item => item.category))
            .range([0, dm.innerWidth]).padding(0.1);

        const yAxis = d3.axisLeft(yScale).ticks(15);
        const xAxis = d3.axisBottom(xScale);

        return {
            yScale,
            xScale,
            yAxis,
            xAxis
        };
    }

    setActiveColumn = (e) => {
        const tableData = this.props.data.table.map((x) => {
            return {
                category: x[this.props.activeCategory],
                data: x[e.target.value]
            };
        });
        
        this.setState({
            activeColumn: e.target.value,
            tableData
        });
    }

    updateBarChart = () => {
        const { dm, tableData } = this.state;
        const { yAxis, yScale, xAxis, xScale } = this.getScalesAndAxes();

        const bars = this.svg.select('.chart-inner')
            .selectAll('rect')
            .data(tableData, item => item.data);

        bars.enter()
            .append('rect')
            .transition(t)
            .style('fill', '#fe9922')
            .attr('class', 'bar')
            .attr('x', item => xScale(item.category))
            .attr('y', item => yScale(item.data))
            .attr('height', item => dm.innerHeight - yScale(item.data))
            .attr('width', xScale.bandwidth());

        bars.exit()
            .remove();

        const barLabels = this.svg.select('.chart-inner')
            .selectAll('text')
            .data(tableData, item => item.data);          

        barLabels
            .enter()
            .append('text')
            .transition(t)
            .attr('text-anchor', 'middle')
            .attr('x', item => xScale(item.category) + ( xScale.bandwidth() / 2 ))
            .attr('y', item => yScale(item.data) + 20)
            .attr('font-family', 'Roboto, sans-serif')
            .attr('font-size', '15px')
            .attr('fill', 'white')
            .text(item => item.data);

        barLabels
            .exit()
            .remove();
            
        var t = d3.transition().duration(300);        
        this.svg.select('.axis--x').transition(t).call(xAxis);
        this.svg.select('.axis--y').transition(t).call(yAxis);

    }        

    render() {
        const [ sizeW, sizeH ] = this.props.size;
        const columns = getColumnNames(this.props.data.table[0]);
        const chartTitle = `${formatColumnName(this.state.activeColumn)} by ${this.props.activeCategory}`;

        return (
            <div className='chart'>
                <ChartTitle title={chartTitle} />
                <div className='input-group'>
					<select onChange={this.setActiveColumn} className='form-control'>
						{columns.map((x,i) => (
							<option key={i} value={x}>{formatColumnName(x)}</option>
						))}
					</select>
				</div>
                <svg ref={el => this.svgContainerEl = el}
                    className='bar-chart'
                    width={sizeW} height={sizeH}>
                </svg>
            </div>
        );
    }
}

export default BarChart;