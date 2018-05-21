import React from 'react';
import * as d3 from 'd3';
import { getColumnNames, getDimensions, transformTableData } from '../../store/helpers';
import ChartTitle from './ChartTitle';
import ChartLegend from './ChartLegend';

class LineChart extends React.Component {
    constructor(props) {
        super(props);        

        if (Array.isArray(props.data.table)) {
            return;
        };

        const colors = ['#d63031','#94bade','#00b894','#fdcb6e','#636e72','#e17055'];
        
        const dataWithColors =  Object.keys(props.data.table).map((key, i) => {
            props.data.table[key].forEach(x => x.day = this.parseShortWeekDay(x.day));
            return {
                items: props.data.table[key],
                legend: {
                    category: key,
                    color: colors[i]
                }
            };
        });

        const columnNames = getColumnNames(dataWithColors[0].items[0], props.activeCategory);

        this.state = {
            legend: dataWithColors.map(x => x.legend),
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
        const { xScale, yScale } = this.getScalesAndAxes();

        // Line generation
        const line = d3.line()
        .x(item => xScale(item.category))
        .y(item => yScale(item.data));
        
        // Todo: handle simple data
        if (Array.isArray(data.table)) {
            return;
        };

        Object.keys(data.table).map((key, i) => {
            const tableData = transformTableData(data.table[key], activeCategory, this.state.activeColumn);

            svgContainer.select('.chart-inner')
            .append('path')
            .datum(tableData)
            .attr('class', 'chart-line')
            .attr('stroke', this.state.legend[i].color)
            .attr('d', line);
           
        });
    }

    parseShortWeekDay = (day) => {
        const parseDate = d3.timeParse('%a %V %Y');
        return parseDate(`${day.toLowerCase()} 01 2016`);        
    }

    getScalesAndAxes = () => {
        const { data, activeCategory } = this.props;
        const { dm } = this.state;

        if (Array.isArray(data.table)) {
            return;
        };

        const firstItem = data.table[Object.keys(data.table)[0]];
        
        // Todo: calculate max domain dynamically
        const yScale = d3.scaleLinear()
            .domain([0, 20000])
            .rangeRound([dm.innerHeight, 0]);

        const xScale = d3.scaleTime()
            .domain(d3.extent(firstItem, (item => item[activeCategory])))
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
                <ChartLegend legend={this.state.legend} />
                <svg ref={el => this.svgContainerEl = el}
                    className='bar-chart'
                    width={sizeW} height={sizeH}>
                </svg>
            </div>
        );
    }
}
export default LineChart;