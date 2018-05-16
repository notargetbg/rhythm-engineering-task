import React from 'react';
import NavDropdown from './NavDropdown';
import thumbSrc from '../../assets/img/user-thumb.png';

class NavBar extends React.Component {

    render() {


        return (
            <nav className='navbar navbar-default'>
                <div className='container-fluid'>
                    
                    <div className='navbar-header'>                   
                        <a className='navbar-brand' href='#'>AC Reporting</a>
                    </div>
                    
                    <div className='collapse navbar-collapse'>
                        <ul className='nav navbar-nav navbar-right'>
                            <li className='active'><a href='#'>Reporting</a></li>
                            <li><a href='#'>About</a></li>
                            <NavDropdown label='Administrator' imageThumb={thumbSrc}>
                                <li><a href='#'>Account</a></li>
                                <li><a href='#'>Help</a></li>
                                <li role='separator' className='divider'></li>
                                <li><a href='#'>Logout</a></li>
                            </NavDropdown>
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }

}

export default NavBar;