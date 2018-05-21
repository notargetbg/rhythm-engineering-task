import React from 'react';

class ChartLegend extends React.Component {

    render() {
        return(
            <div className='legend'>
                {this.props.legend.map((legendItem, i) => (
                    <div key={i} className='legend-block'>                
                        <span className='legend-square' style={{backgroundColor: legendItem.color}}></span>
                        <span className='legend-category'>{legendItem.category}</span>
                    </div>
                ))}
            </div>
        );
    }
}
export default ChartLegend;