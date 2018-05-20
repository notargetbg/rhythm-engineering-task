import React from 'react';
import * as d3 from 'd3';
import { getColumnNames, formatColumnName, getDimensions, transformTableData  } from '../../store/helpers';
import ChartTitle from './ChartTitle';
import ChartSelect from './ChartSelect';

class PieChart extends React.Component {
	constructor(props) {
		super(props);
		const columns = getColumnNames(props.data.table[0], 'type');

		this.state = {
			activeColumn: columns[0]
		};
	}

  	componentDidMount() {
		const [ sizeW, sizeH ] = this.props.size;
		const dm = getDimensions(sizeW, sizeH);

		const svgContainer = d3.select(this.svgContainerEl)
			.append('g')
			.attr('class', 'chart-inner')
			.attr('width', dm.innerWidth)
			.attr('height', dm.innerHeight)
			.attr('transform', `translate(${sizeW / 2}, ${sizeH / 2})`);

		// Middle Text
		svgContainer.append('text')
			.attr('text-anchor', 'middle')
			.attr('dy', '-.2em')
			.attr('class', 'inner-text')
			.style('font-size', '24px')
			.text('count');

		svgContainer.append('text')
			.attr('text-anchor', 'middle')
			.attr('dy', '1.2em')
			.attr('class', 'inner-text2')
			.text('type');

		this.updateChart();
	}

	componentDidUpdate() {
        this.updateChart();
	}
	
	setActiveColumn = (activeColumn) => {
        this.setState({
            activeColumn
        });
    }

	updateChart = () => {
		const { data, activeCategory } = this.props;
		const svgContainer = d3.select(this.svgContainerEl);
		const dm = getDimensions(this.props.size[0], this.props.size[1]);		
		const tableData = transformTableData(data.table, activeCategory, this.state.activeColumn);

		const colorScale = d3.scaleLinear().domain([1,tableData.length])
			.interpolate(d3.interpolateHcl)
			.range([d3.rgb('#94bade'), d3.rgb('#dad44f')]);		

		// Arc and Pie generation
		const pie = d3.pie()
			.value(item => item.data)
			.sort(null)			
			.padAngle(.004)
			(tableData);

		const arcPath = d3.arc()
			.outerRadius(dm.innerWidth / 2.4)
			.innerRadius(dm.innerWidth / 3.4);	
		
		// Data binding
		const arcs = svgContainer
			.select('.chart-inner')
			.selectAll('g')
			.data(pie, d => d.value);

		arcs			
			.enter()
			.append('g')	
			.append('path')
			.on('mouseover', (item) => {
				d3.select('.inner-text').text(item.value);
				d3.select('.inner-text2').text(item.data.category);
			})
			.on('mouseout', () => {
				d3.select('.inner-text').text('count');
				d3.select('.inner-text2').text('type');
			})
			.attr('fill', (item, i) => colorScale(i))
			.attr('d', arcPath)
			.transition()
			.duration(800)
			.attrTween('d', this.pieChartTween);		

		arcs
			.exit()
			.remove();
	}

	pieChartTween = (b) => {
		b.innerRadius = 0;
		const dm = getDimensions(this.props.size[0], this.props.size[1]);
		const i = d3.interpolate({startAngle: 0, endAngle: 0}, b);
		return (t) => {
			return d3.arc()
			.outerRadius(dm.innerWidth / 2.4)
			.innerRadius(dm.innerWidth / 3.4)(i(t));
		};
	}

	render() {
		const [ sizeW, sizeH ] = this.props.size;
		const columns = getColumnNames(this.props.data.table[0], this.props.activeCategory);
	
		return (
		<div className='chart'>
			<ChartTitle title={this.props.chartTitle} />
			<ChartSelect columnsData={columns} handleSelection={this.setActiveColumn} {...this.props} />
			<svg ref={el => this.svgContainerEl = el}
				className='pie-chart'
				width={sizeW} height={sizeH}>
			</svg>
		</div>
		);
  	}
}

export default PieChart;