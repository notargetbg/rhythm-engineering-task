import React from 'react';
import NavBar from './Nav/NavBar';
import ChartContainer from './Charts/ChartContainer';

class ReportingDashboard extends React.Component {
	render () {
		return (
			<div>
				<NavBar />
				<div className='text-center'>
					<h2>Arizona State Crashes</h2>
				</div>
				<ChartContainer />
			</div>
		);
	}
}

export default ReportingDashboard;