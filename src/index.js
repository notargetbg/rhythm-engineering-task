import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import mainReducer from './Store/reducers/index';
import '../node_modules/bootstrap/dist/css/bootstrap.css';
import './assets/styles/main.scss';

import ReportingDashboard from './components/ReportingDashboard';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
    mainReducer, 
    composeEnhancers()
);

ReactDOM.render(
    <Provider store={store}>
        <ReportingDashboard />
    </Provider>, document.getElementById('reporting-dashboard')
);