import React from 'react';

export default function SummaryItem(props) {
    return (
        <li className='list-group-item'>
            <span className='item-category'>
                {props.category}
            </span>
            <span className='item-value'>
                {props.value}
            </span>
        </li>
    );
};