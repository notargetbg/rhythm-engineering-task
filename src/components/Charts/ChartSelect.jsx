import React from 'react';
import { formatColumnName } from '../../store/helpers';

class ChartSelect extends React.Component {

    handleSelection = (e) => {
        this.props.handleSelection(e.target.value);
    }

    render() {
        const { columnsData } = this.props;

        return (
            <div className='input-group'>
                <select onChange={this.handleSelection} className='form-control'>
                    {columnsData.map((x,i) => (
                        <option key={i} value={x}>{formatColumnName(x)}</option>
                    ))}
                </select>
            </div>
        );
    }
}
export default ChartSelect;