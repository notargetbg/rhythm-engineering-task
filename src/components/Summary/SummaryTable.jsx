import React from 'react';
import SummaryItem from './SummaryItem';
import ChartSelect from '../Charts/ChartSelect';
import { formatColumnName } from '../../store/helpers';

class SummaryTable extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activeSummaryCategory: 0
        };
    }

    renderSummaryCategories = () => {
        const { summaryCategories, summaryDataKeys } = this.props.summary;
        const { activeSummaryCategory } = this.state;
        
        const summaryCategoryData = summaryCategories[activeSummaryCategory];
        const summaryCategoryKey = summaryDataKeys[activeSummaryCategory];

        return summaryCategoryData[summaryCategoryKey].map((item, i) => (
            <SummaryItem key={i} category={item.category} value={item.columnData} />
        ));
    }

    setActiveSummaryCategory = (activeSummaryCategory) => {
        this.setState({
            activeSummaryCategory: this.props.summary.summaryDataKeys.indexOf(activeSummaryCategory)
        });
    }

    render() {
        const { summary } = this.props;
        const { activeSummaryCategory } = this.state;

        return (
            <div className='chart-summary'>
                <strong>Summary</strong>
                <div className='summary-table'>
                    {summary && summary.summaryCategories &&
                        <ChartSelect columnsData={summary.summaryDataKeys} handleSelection={this.setActiveSummaryCategory} />
                    }

                    {summary &&
                    <ul className='list-group'>
                        {summary.summaryData &&
                            <SummaryItem category={summary.activeCategory} value={formatColumnName(summary.activeColumn)} />
                        }
                        {summary.summaryData && summary.summaryData.map((item, i) => (
                            <SummaryItem key={i} category={item.category} value={item.columnData} />
                        ))}

                        {summary.summaryCategories && summary.summaryDataKeys &&
                            <SummaryItem 
                                category={`${formatColumnName(summary.summaryDataKeys[activeSummaryCategory])} by ${summary.activeCategory}`} 
                                value={formatColumnName(summary.activeColumn)} />                   
                        }
                        {summary.summaryCategories && this.renderSummaryCategories()}
                    </ul>
                    }
                    {!summary &&
                        <p className='no-summary'>
                            Click on a chart in order to show it's summary
                        </p>
                    }
                </div>
            </div>
        );
    }
}
export default SummaryTable;