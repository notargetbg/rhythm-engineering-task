import React from 'react';
import BarChart from './Charts/BarChart';
import PieChart from './Charts/PieChart';
import NavBar from './Nav/NavBar';

import alcohol_related_crash_history from '../store/crash-data/alcohol_related_crash_history.json';
import weather_conditions from '../store/crash-data/weather_conditions.json';

class ReportingDashboard extends React.Component {
	render () {
		return (
			<div>
				<NavBar />
				<div className='text-center'>
					<h2>{alcohol_related_crash_history.name}</h2>
				</div>
				<div className='charts-container'>
					<BarChart data={alcohol_related_crash_history} activeCategory='year' size={[400,300]} />
					<PieChart data={weather_conditions} chartTitle='Total Crashes by Weather Condition' size={[400,300]} />
				</div>
			</div>
		);
	}
}

export default ReportingDashboard;