import React from 'react';
import * as d3 from 'd3';
import { getColumnNames, formatColumnName, getDimensions, transformTableData } from '../../store/helpers';
import ChartTitle from './ChartTitle';
import ChartSelect from './ChartSelect';

class BarChart extends React.Component {
    constructor(props){
        super(props);
        const columnNames = getColumnNames(props.data.table[0], props.activeCategory);

        this.state = {
            activeColumn: columnNames[0],
            dm: getDimensions(props.size[0], props.size[1])
        };
    }

    componentDidMount() {
        const { dm } = this.state;
        const { yAxis, xAxis } = this.getScalesAndAxes();
        const svgContainer = d3.select(this.svgContainerEl);

        svgContainer.append('g')
        .attr('class', 'chart-inner')
        .attr('width', dm.innerWidth)
        .attr('height', dm.innerHeight)
        .attr('transform', `translate(${dm.left},${dm.top})`);

        svgContainer
            .append('g')
            .attr('class', 'axis axis--y')
            .attr('transform', `translate(${dm.left},${dm.top})`)
            .call(yAxis);

        svgContainer
            .append('g')
            .attr('class', 'axis axis--x')
            .attr('transform', `translate(${dm.left},${dm.top + dm.innerHeight})`)
            .call(xAxis);

        this.updateChart();
    }

    componentDidUpdate() {
        this.updateChart();
    }

    getScalesAndAxes = () => {
        const { data, activeCategory } = this.props;
        const { dm, activeColumn } = this.state;

        const tableData = data.table;

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(tableData.map((item) => item[activeColumn]))])
            .range([dm.innerHeight, 0]);

        const xScale = d3.scaleBand()
            .domain(tableData.map(item => item[activeCategory]))
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

    setActiveColumn = (activeColumn) => {
        this.setState({
            activeColumn
        });
    }

    addSummaryData = () => {
        const { data, activeCategory } = this.props;
        const summaryData = data.table.map(item => {
            return {
                category: item[activeCategory],
                columnData: item[this.state.activeColumn]
            }; 
        });

        const summary = {
            activeCategory: activeCategory,
            activeColumn: this.state.activeColumn,
            summaryData
        };

        this.props.handleAddSummary(summary);
    }

    updateChart = () => {
        const { dm, activeColumn } = this.state;
        const { data, activeCategory } = this.props;
        const { yAxis, yScale, xAxis, xScale } = this.getScalesAndAxes();
        const svgContainer = d3.select(this.svgContainerEl);
        
        const tableData = transformTableData(data.table, activeCategory, activeColumn);

        const bars = svgContainer.select('.chart-inner')
            .selectAll('rect')
            .data(tableData, item => item.data);

        bars.enter()
            .append('rect')
            // Todo move this, add proper logic
            .on('mouseover', (d) => {
                console.log(d);
            })
            .transition(t)
            .attr('class', 'bar')
            .attr('x', item => xScale(item.category))
            .attr('y', item => yScale(item.data))
            .attr('height', item => dm.innerHeight - yScale(item.data))
            .attr('width', xScale.bandwidth());

        bars.exit()
            .remove();

        const barLabels = svgContainer.select('.chart-inner')
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

        const t = d3.transition().duration(300);
        svgContainer.select('.axis--x').transition(t).call(xAxis);
        svgContainer.select('.axis--y').transition(t).call(yAxis);
    }

    render() {
        const [ sizeW, sizeH ] = this.props.size;
        const columns = getColumnNames(this.props.data.table[0], this.props.activeCategory);
        const chartTitle = `${formatColumnName(this.state.activeColumn)} by ${this.props.activeCategory}`;

        return (
            <div className='chart' onClick={this.addSummaryData}>
                <ChartTitle title={chartTitle} />
                <ChartSelect columnsData={columns} handleSelection={this.setActiveColumn} />
                <svg ref={el => this.svgContainerEl = el}
                    className='bar-chart'
                    width={sizeW} height={sizeH}>
                </svg>
            </div>
        );
    }
}

export default BarChart;