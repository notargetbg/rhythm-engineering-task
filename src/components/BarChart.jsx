import React from 'react';
import * as d3 from 'd3';

function getColumnNames(data) {
	return Object.keys(data).filter(x => x !== 'year');
}

function formatColumnNames(data) {
	return data.map(x => {
		return x.split('_').join(' ');
	});
}

class BarChart extends React.Component {
    constructor(props){
        super(props);
        this.updateBarChart = this.updateBarChart.bind(this);
        this.getMax = this.getMax.bind(this);
        this.setActiveColumn = this.setActiveColumn.bind(this);
        this.getScalesAndAxis = this.getScalesAndAxis.bind(this);
        const columns = getColumnNames(this.props.data.table[0]);

        const tableData = props.data.table.map((x) => {
            return {
                category: x.year,
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
                bottom: 40,
                left: 60,
                innerWidth: props.size[0] - 100,
                innerHeight: props.size[1] - 80
            }
        };
    }
    componentDidMount() {
        const { dm } = this.state;
        const { yAxis, xAxis } = this.getScalesAndAxis();
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

    getScalesAndAxis() {
        const { dm, tableData } = this.state;

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(this.getMax(tableData))])
            .range([dm.innerHeight, 0]);

        const xScale = d3.scaleBand()
            .range([0, dm.innerWidth]).padding(0.1)
            .domain(tableData.map(item => item.category));

        const yAxis = d3.axisLeft(yScale).ticks(20);
        const xAxis = d3.axisBottom(xScale);

        return {
            yScale,
            xScale,
            yAxis,
            xAxis
        };
    }

    getMax(data) {
        return data.map((item) => item.data);
    }

    setActiveColumn(e) {
        const tableData = this.props.data.table.map((x) => {
            return {
                category: x.year,
                data: x[e.target.value]
            };
        });
        
        this.setState({
            activeColumn: e.target.value,
            tableData
        });
    }

    updateBarChart() {
        const { dm, tableData } = this.state;
        const { yAxis, yScale, xAxis, xScale } = this.getScalesAndAxis();

        const bars = this.svg.select('.chart-inner')
            .selectAll('rect')
            .data(tableData, item => item.data);

        bars.enter()
            .append('rect')
            .transition(t)
            .style('fill', '#fe9922')
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

        return (
            <div className="chart">
                <h3 className="chart-title">
                    {this.state.activeColumn.split('_').join(' ')}
                </h3>
                <div className="input-group">
					<select onChange={this.setActiveColumn} className="form-control">
						{columns.map((x,i) => (
							<option key={i} value={x}>{x.split('_').join(' ')}</option>
						))}
					</select>
				</div>
                <svg ref={el => this.svgContainerEl = el}
                    className="bar-chart"
                    width={sizeW} height={sizeH}>
                </svg>
            </div>
        );
    }
     

}

export default BarChart;