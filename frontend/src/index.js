import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import CandidateDashboard from './Dashboards';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
    <div>
        <CandidateDashboard candidate_id="S2MA00170"/>
    </div>
    , document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
