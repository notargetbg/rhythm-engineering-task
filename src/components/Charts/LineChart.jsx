import React from 'react';
import * as d3 from 'd3';
import { getColumnNames, getDimensions, transformTableData, getMaxFromMultipleCategories } from '../../store/helpers';
import ChartTitle from './ChartTitle';
import ChartLegend from './ChartLegend';

class LineChart extends React.Component {
    constructor(props) {
        super(props);
        const tableKeys = Object.keys(props.data.table);
        const columnNames = getColumnNames(props.data.table[tableKeys[0]][0], props.activeCategory, props.activeColumn);

        this.state = {
            colors : ['#d63031','#94bade','#00b894','#fdcb6e','#636e72','#e17055'],
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
        const { data, activeCategory, activeColumn } = this.props;
		const svgContainer = d3.select(this.svgContainerEl);
        const { xScale, yScale } = this.getScalesAndAxes();

        // Line generation
        const line = d3.line()
        .x(item => xScale(item.category))
        .y(item => yScale(item.data));

        Object.keys(data.table).forEach((key, i) => {
            const tableData = transformTableData(data.table[key], activeCategory, activeColumn);

            svgContainer.select('.chart-inner')
            .append('path')
            .datum(tableData)
            .attr('class', 'chart-line')
            .attr('stroke', this.state.colors[i] )
            .attr('d', line);

        });
    }

    getScalesAndAxes = () => {
        const { data, activeCategory } = this.props;
        const { dm } = this.state;

        const firstItem = data.table[Object.keys(data.table)[0]];

        const timeTickFormat = {
            year: '%Y',
            day: '%A'
        };

        const yScale = d3.scaleLinear()
            .domain([0, getMaxFromMultipleCategories(data.table)])
            .rangeRound([dm.innerHeight, 0]);

        const xScale = d3.scaleTime()
            .domain(d3.extent(firstItem, (item => item[activeCategory])))
            .rangeRound([0, dm.innerWidth]);

        const yAxis = d3.axisLeft(yScale);
        const xAxis = d3.axisBottom(xScale).ticks(firstItem.length, timeTickFormat[activeCategory]);

        return {
            yScale,
            xScale,
            yAxis,
            xAxis
        };
    }

    addSummaryData = () => {
        const { data, activeCategory } = this.props;
        const summaryDataKeys = Object.keys(data.table);
        const timeTickFormat = {
            year: '%Y',
            day: '%A'
        };
        const dateFormat = d3.timeFormat(timeTickFormat[activeCategory]);      

        const summaryCategories = summaryDataKeys.map(key => {
            const summaryData = data.table[key].map(item => {                       
                return {
                    category: dateFormat(item[activeCategory]),
                    columnData: item[this.state.activeColumn]
                }; 
            });

            return {
                [key]: summaryData
            };
        });

        const summary = {
            activeCategory,
            activeColumn: this.state.activeColumn,
            summaryCategories,
            summaryDataKeys
        };

        this.props.handleAddSummary(summary);
    }

    render() {
        const [ sizeW, sizeH ] = this.props.size;

        const legend = Object.keys(this.props.data.table).map((key, i) => {
            return {
                category: key,
                color: this.state.colors[i]
            };
        });

        return (
            <div className='chart' onClick={this.addSummaryData}>
                <ChartTitle title={this.props.chartTitle} />
                <ChartLegend legend={legend} />
                <svg ref={el => this.svgContainerEl = el}
                    className='bar-chart'
                    width={sizeW} height={sizeH}>
                </svg>
            </div>
        );
    }
}
export default LineChart;