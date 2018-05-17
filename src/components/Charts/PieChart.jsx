import React from 'react';
import * as d3 from 'd3';
import ChartTitle from './ChartTitle';
import { getColumnNames, formatColumnName, getDimensions } from '../../store/helpers';

class PieChart extends React.Component {
	constructor(props) {
		super(props);
		const columns = getColumnNames(props.data.table.types_of_weather[0], 'type');

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
		svgContainer
			.append('text')
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
	
	setActiveColumn = (e) => {
        this.setState({
            activeColumn: e.target.value
        });
    }

	updateChart = () => {
		const { data } = this.props;
		const svgContainer = d3.select(this.svgContainerEl);
		const dm = getDimensions(this.props.size[0], this.props.size[1]);
		const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

		// Arc and Pie generation
		const pie = d3.pie()
			.sort(null)
			.value((item) => +item[this.state.activeColumn])
			.padAngle(.004);
		const arc = d3.arc()
			.outerRadius(dm.innerWidth / 2.4)
			.innerRadius(dm.innerWidth / 3.4);
		const arcsWithData = pie(data.table.types_of_weather);
		
		// Data binding
		const gContainer = svgContainer
			.select('.chart-inner')
			.selectAll('path')
			.data(arcsWithData)
			.enter()		
			.append('g')
			.on('mouseover', (item) => {
				d3.select('.inner-text').text(item.data[this.state.activeColumn]);
				d3.select('.inner-text2').text(item.data.type);
			})
			.on('mouseout', () => {
				d3.select('.inner-text').text('count');
				d3.select('.inner-text2').text('type');
			});

		gContainer
			.append('path')
			.attr('fill', (item, i) => colorScale(i))
			.attr('d', arc);
	}

	render() {
		const [ sizeW, sizeH ] = this.props.size;
		const columns = getColumnNames(this.props.data.table.types_of_weather[0], 'type');
	
		return (
		<div className='chart'>
			<ChartTitle title={this.props.chartTitle} />
			<div className='input-group'>
				<select onChange={this.setActiveColumn} className='form-control'>
					{columns.map((x,i) => (
						<option key={i} value={x}>{formatColumnName(x)}</option>
					))}
				</select>
			</div>
			<svg ref={el => this.svgContainerEl = el}
				className='pie-chart'
				width={sizeW} height={sizeH}>
			</svg>
		</div>
		);
  	}
}

export default PieChart;