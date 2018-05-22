import React from 'react';
import * as d3 from 'd3';
import BarChart from './BarChart';
import PieChart from './PieChart';
import LineChart from './LineChart';

import alcohol_related_crash_history from '../../store/crash-data/alcohol_related_crash_history.json';
import weather_conditions from '../../store/crash-data/weather_conditions.json';
import crashes_by_day_of_week from '../../store/crash-data/crashes_by_day_of_week.json';
import crash_history from '../../store/crash-data/crash_history.json';
import lighting_conditions from '../../store/crash-data/lighting_conditions.json';
import mv_registrations from '../../store/crash-data/mv_registrations.json';
import BarChartVertical from './BarChartVertical';

class ChartDataTransformer extends React.Component {

    componentDidMount() {
        
    }

    parseShortWeekDay = (day) => {
        const parseDate = d3.timeParse('%a %V %Y');
        return parseDate(`${day.toLowerCase()} 01 2016`);        
    }

    parseYear = (year) => {
        const parseDate = d3.timeParse('%Y');
        return parseDate(year);
    }

    render() {

        // Transforming years to dates
        Object.keys(crash_history.table).forEach((key, i) => {
            crash_history.table[key] = crash_history.table[key].map(x => {
                x.year = this.parseYear(x.year);
                return x;
            });
        });

        // Transforming days to dates
        Object.keys(crashes_by_day_of_week.table).forEach((key, i) => {
            crashes_by_day_of_week.table[key] = crashes_by_day_of_week.table[key].map(x => {
                x.day = this.parseShortWeekDay(x.day);
                return x;
            });
        });

        return (
            <div className='charts-container'>
                <BarChart data={alcohol_related_crash_history} activeCategory='year' size={[350,300]} />
                <PieChart data={weather_conditions} chartTitle='Total Crashes by Weather Condition' activeCategory='type' size={[350,300]} />
                <LineChart data={crashes_by_day_of_week}
                    chartTitle={crashes_by_day_of_week.name}
                    activeCategory='day'
                    activeColumn='count'
                    size={[350,300]}
                />
                <div className='chart-summary'>
                    Summary
                </div>
                <PieChart data={lighting_conditions} chartTitle='Total Crashes by Lighting Condition' activeCategory='type' size={[350,300]} />
                <BarChartVertical data={mv_registrations} activeCategory='type' size={[350,250]} />
                <LineChart data={crash_history} chartTitle={crash_history.name} activeCategory='year' activeColumn='count' size={[750,300]} />
            </div>
        );
    }
}
export default ChartDataTransformer;