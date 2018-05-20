import React from 'react';
import * as d3 from 'd3';
import { getColumnNames, formatColumnName, getDimensions, transformTableData } from '../../store/helpers';
import ChartTitle from './ChartTitle';
import ChartLegend from './ChartLegend';

class LineChart extends React.Component {
    constructor(props) {
        super(props);
        const columnNames = getColumnNames(props.data.table.urban[0], props.activeCategory);       
        
        props.data.table.urban.forEach(x => {
            x.day = this.parseShortWeekDay(x.day);
        });

        props.data.table.rural.forEach(x => {
            x.day = this.parseShortWeekDay(x.day);
        });

        this.state = {
            activeColumn: columnNames[0],
            dm: getDimensions(props.size[0], props.size[1])
        };
    }
    
    componentDidMount() {
        const [ sizeW, sizeH ] = this.props.size;
        const { yAxis, xAxis } = this.getScalesAndAxes();
        const dm = getDimensions(sizeW, sizeH);
        
        const svgContainer = d3.select(this.svgContainerEl)
			.append('g')
			.attr('class', 'chart-inner')
			.attr('width', dm.innerWidth)
            .attr('height', dm.innerHeight)
            .attr('transform', `translate(${dm.left},${dm.top})`);

        svgContainer
            .append('g')
            .attr('class', 'axis axis--y')
            .call(yAxis);

        svgContainer
            .append('g')
            .attr('class', 'axis axis--x')
            .attr('transform', `translate(0,${dm.innerHeight})`)
            .call(xAxis);
            
        this.updateChart();
    }

    componentDidUpdate() {
        this.updateChart();
    }

    updateChart() {
        const { data, activeCategory } = this.props;
		const svgContainer = d3.select(this.svgContainerEl);
		const dm = getDimensions(this.props.size[0], this.props.size[1]);		
        const tableData = transformTableData(data.table.urban, activeCategory, this.state.activeColumn);
        const { xScale, yScale } = this.getScalesAndAxes();

        // Line generation
        const line = d3.line()
        .x(item => xScale(item.category))
        .y(item => yScale(item.data));

        svgContainer.select('.chart-inner')
            .append('path')
            .datum(tableData)
            .attr('class', 'chart-line')
            .attr('stroke', '#94BADE')
            .attr('d', line);

        const tableData2 = transformTableData(data.table.rural, activeCategory, this.state.activeColumn);

        svgContainer.select('.chart-inner')
            .append('path')
            .datum(tableData2)
            .attr('class', 'chart-line')
            .attr('stroke', 'red')
            .attr('d', line);
    }

    parseShortWeekDay = (day) => {
        const parseDate = d3.timeParse('%a %V %Y');
        return parseDate(`${day.toLowerCase()} 01 2016`);        
    }

    getScalesAndAxes = () => {
        const { data, activeCategory } = this.props;
        const { dm, activeColumn } = this.state;

        const tableData = data.table.urban;

        const yScale = d3.scaleLinear()
            .domain([0, 20000])
            .rangeRound([dm.innerHeight, 0]);

        const xScale = d3.scaleTime()
            .domain(d3.extent(tableData, (item => item[activeCategory])))
            .rangeRound([0, dm.innerWidth]);

        const yAxis = d3.axisLeft(yScale);
        const xAxis = d3.axisBottom(xScale).ticks(7, '%A');

        return {
            yScale,
            xScale,
            yAxis,
            xAxis
        };
    }

    render() {
        const [ sizeW, sizeH ] = this.props.size;

        return (
            <div className='chart'>
                <ChartTitle title={this.props.chartTitle} />
                <ChartLegend />
                <svg ref={el => this.svgContainerEl = el}
                    className='bar-chart'
                    width={sizeW} height={sizeH}>
                </svg>
            </div>
        );
    }
}
export default LineChart;