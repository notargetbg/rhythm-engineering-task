import React from  'react';
import classnames from 'classnames';

class NavDropdown extends React.Component {
    state = {
        isDropdownOpen: false
    }

    openDropdown = (e) => {
        e.preventDefault();
        
        this.setState({
            isDropdownOpen: true
        });
    }

    handleClickOutside = (e) => {
        if (this.dropdownRef && !this.dropdownRef.contains(e.target)) {
            this.setState({
                isDropdownOpen: false
            });
        }
    }

    componentDidMount() {
        document.addEventListener('click', this.handleClickOutside);
    }
    
    componentWillUnmount() {
        document.removeEventListener('click', this.handleClickOutside);
    }

    render() {
        const { isDropdownOpen } = this.state;
        const { imageThumb } = this.props;

        const dropdownClass = classnames(['dropdown', {'open': isDropdownOpen}, {'has-thumbnail': imageThumb}]);

        return (
            <li className={dropdownClass} ref={(el) => this.dropdownRef = el}>
                <a href='#' className='dropdown-toggle' onClick={this.openDropdown}>
                    {imageThumb &&
                        <img className='image-thumbnail' src={imageThumb} alt='User thumbnail image' />
                    }
                    {this.props.label} 
                    <span className='caret'></span>
                </a>
                <ul className='dropdown-menu'>
                    {this.props.children}
                </ul>
            </li>
        );
    }
};

export default NavDropdown;