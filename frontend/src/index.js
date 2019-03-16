import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import ContributionTimeline from './Graphs'
import CandidateDashboard from './Dashboards';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
    <div>
        <CandidateDashboard candidate_id="S2MA00170"/>
        <ContributionTimeline candidate_id="S2MA00170" api_uri="http://127.0.0.1:3000/api/candidates/"/>
    </div>
    , document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();

//