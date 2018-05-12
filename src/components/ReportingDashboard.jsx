import React from 'react';
import Chart from './Chart';

import ExampleData from '../store/data.json';

class ReportingDashboard extends React.Component {
		
	render() {
		return (
			<div className='container'>
					<div className='header'>
						<h2>d3 test chart</h2>
					</div>
					<div>
						<Chart data={ExampleData} size={[500,500]} />
					</div>
			</div>
		);
	}
}

export default ReportingDashboard;