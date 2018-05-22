import React from 'react';
import * as d3 from 'd3';
import { connect } from 'react-redux';
import * as actions from '../../store/actions';

import BarChart from './BarChart';
import PieChart from './PieChart';
import LineChart from './LineChart';
import SummaryTable from '../SummaryTable';
import { transformFromStrToDate } from '../../store/helpers';

import alcohol_related_crash_history from '../../store/crash-data/alcohol_related_crash_history.json';
import weather_conditions from '../../store/crash-data/weather_conditions.json';
import crashes_by_day_of_week from '../../store/crash-data/crashes_by_day_of_week.json';
import crash_history from '../../store/crash-data/crash_history.json';
import lighting_conditions from '../../store/crash-data/lighting_conditions.json';
import mv_registrations from '../../store/crash-data/mv_registrations.json';
import BarChartVertical from './BarChartVertical';

class ChartDataTransformer extends React.Component {
    constructor(props) {
        super(props);
        // Transforming and mutating years to dates
        transformFromStrToDate(crash_history.table, 'year', this.parseYear);
        // Transforming and mutating days to dates
        transformFromStrToDate(crashes_by_day_of_week.table, 'day', this.parseShortWeekDay);
    }

    parseShortWeekDay = (day) => {
        const parseDate = d3.timeParse('%a %V %Y');
        return parseDate(`${day.toLowerCase()} 01 2016`);        
    }

    parseYear = (year) => {
        const parseDate = d3.timeParse('%Y');
        return parseDate(year);
    }

    addSummary = (data) => {
        this.props.dispatch(actions.addSummaryData(data));
    }

    render() {
        return (
            <div className='charts-container'>
                <BarChart handleAddSummary={this.addSummary} data={alcohol_related_crash_history} activeCategory='year' size={[350,300]} />
                <PieChart data={weather_conditions} chartTitle='Total Crashes by Weather Condition' activeCategory='type' size={[350,300]} />
                <LineChart data={crashes_by_day_of_week}
                    chartTitle={crashes_by_day_of_week.name}
                    activeCategory='day'
                    activeColumn='count'
                    size={[350,300]}
                />
                <SummaryTable summary={this.props.summary} />
                <PieChart data={lighting_conditions} chartTitle='Total Crashes by Lighting Condition' activeCategory='type' size={[350,300]} />
                <BarChartVertical data={mv_registrations} activeCategory='type' size={[350,250]} />
                <LineChart data={crash_history} chartTitle={crash_history.name} activeCategory='year' activeColumn='count' size={[750,300]} />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return { 
		summary: state.summary.data
    };
};

export default connect(mapStateToProps)(ChartDataTransformer);