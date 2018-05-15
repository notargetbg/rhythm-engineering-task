import React from 'react';
import BarChart from './BarChart';

import alcohol_related_crash_history from '../store/alcohol_related_crash_history.json';

class ReportingDashboard extends React.Component {
	render () {
		return (
			<div className='container'>
				<div className='text-center'>
					<h2>{alcohol_related_crash_history.name}</h2>
				</div>				
				<div>
					<BarChart data={alcohol_related_crash_history} size={[400,400]} />
				</div>
			</div>
		);
	}
}

export default ReportingDashboard;