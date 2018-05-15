import React from 'react';
import BarChart from './BarChart';

import alcohol_related_crash_history from '../store/alcohol_related_crash_history.json';

// function getColumnNames(data) {
// 	return Object.keys(data).filter(x => x !== 'year');
// }

// function formatColumnNames(data) {
// 	return data.map(x => {
// 		return x.split("_").join(" ");
// 	});
// }

// const columns = getColumnNames(alcohol_related_crash_history.table[0]);

class ReportingDashboard extends React.Component {
		
	render() {
		return (
			<div className='container'>
				<div className='text-center'>
					<h2>{alcohol_related_crash_history.name}</h2>
				</div>				
				<div>
					<BarChart data={alcohol_related_crash_history} size={[480,480]} />
				</div>
			</div>
		);
	}
}

export default ReportingDashboard;