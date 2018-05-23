import React from 'react';
import * as d3 from 'd3';
import { getColumnNames, formatColumnName, getDimensions, transformTableData } from '../../store/helpers';
import ChartTitle from './ChartTitle';
import ChartLegend from './ChartLegend';

class BarChartVertical extends React.Component {
    constructor(props){
        super(props);
        const columnNames = getColumnNames(props.data.table[0], props.activeCategory);

        this.state = {
            colors : ['#e17055','#94bade','#00b894','#fdcb6e','#636e72','#d63031'],
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

        const yScale = d3.scaleBand()
            .domain(tableData.map(item => item[activeCategory]))
            .range([0, dm.innerHeight]).padding(0.1);

        const xScale = d3.scaleLinear()
            .domain([0, d3.max(tableData.map((item) => item[activeColumn]))])
            .range([0, dm.innerWidth]);

        const yAxis = d3.axisLeft(yScale);
        const xAxis = d3.axisBottom(xScale).ticks(4);

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

    updateChart = () => {
        const { activeColumn } = this.state;
        const { data, activeCategory } = this.props;
        const { yAxis, yScale, xAxis, xScale } = this.getScalesAndAxes();
        const svgContainer = d3.select(this.svgContainerEl);
        
        const tableData = transformTableData(data.table, activeCategory, activeColumn);

        const bars = svgContainer.select('.chart-inner')
            .selectAll('rect')
            .data(tableData, item => item.data);

        bars.enter()
            .append('rect')
            .on('mouseover', (d) => {
                console.log(d);
            })
            .transition(t)
            .attr('class', 'bar')
            .attr('x', 0)
            .attr('fill', (_, i) => this.state.colors[i])
            .attr('y', item => yScale(item.category))
            .attr('height', yScale.bandwidth())
            .attr('width', item => xScale(item.data));

        bars.exit()
            .remove();

        const t = d3.transition().duration(300);
        svgContainer.select('.axis--x').transition(t).call(xAxis);
        svgContainer.select('.axis--y').transition(t).call(yAxis)
            .selectAll('text')	
            .style('text-anchor', 'start')
            .attr('transform', 'translate(20, 0)');
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

    render() {
        const [ sizeW, sizeH ] = this.props.size;
        const chartTitle = `${formatColumnName(this.state.activeColumn)} by ${this.props.activeCategory}`;

        const legend = this.props.data.table.map((item, i) => {       
            return {
                category: `${item[this.props.activeCategory]}`,
                color: this.state.colors[i]
            };
        });

        return (
            <div className='chart' onClick={this.addSummaryData}>
                <ChartTitle title={chartTitle} />
                <ChartLegend legend={legend} isVertical={true} />
                <svg ref={el => this.svgContainerEl = el}
                    className='bar-chart-vertical'
                    width={sizeW} height={sizeH}>
                </svg>
            </div>
        );
    }
}

export default BarChartVertical;