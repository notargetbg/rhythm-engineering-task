import React from 'react';
import classnames from 'classnames';
import { formatColumnName } from '../../store/helpers';

class ChartLegend extends React.Component {
    render() {
        const { isVertical } = this.props;
        const legendClass = classnames('legend', {'legend-vertical': isVertical});        

        return(
            <div className={legendClass}>
                {this.props.legend.map((legendItem, i) => (
                    <div key={i} className='legend-block'>                
                        <span className='legend-square' style={{backgroundColor: legendItem.color}}></span>
                        <span className='legend-category'>{formatColumnName(legendItem.category)}</span>
                    </div>
                ))}
            </div>
        );
    }
}
export default ChartLegend;