import React from 'react';
import { formatColumnName } from '../store/helpers';

class SummaryTable extends React.Component {

    render() {
        const { summary } = this.props;
        
        if (!summary) {
            return null;
        }

        return (
            <div className='chart-summary'>
                Summary
                <div className='summary-table'>
                <ul className='list-group'>
                    <li className='list-group-item'>
                        <span className='item-category'>
                            {summary.activeCategory}
                        </span>
                        :
                        <span className='item-value'>
                            {formatColumnName(summary.activeColumn)}
                        </span>
                    </li>
                    {summary.summaryData.map(item => (                        
                        <li className='list-group-item'>
                            <span className='item-category'>
                                {item.category}
                            </span>
                            :
                            <span className='item-value'>
                                {item.columnData}
                            </span>
                        </li>
                    ))}
                </ul>
                </div>
            </div>
        );
    }
}
export default SummaryTable;