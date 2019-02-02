import React, { Component } from 'react';

import './App.css';
import { ContributionList, ContributionSummary } from './Contributions';
import { CandidateProfile } from './Candidates';

class CandidateDashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            candidate_id: props.candidate_id
        };

    }

    render() {
        return (
          <div className="Dashboard">
              <CandidateProfile candidate_id={this.state.candidate_id}/>
              <ContributionSummary candidate_id={this.state.candidate_id}/>
              <ContributionList candidate_id={this.state.candidate_id}/>
          </div>
        );
      }
    }

export default CandidateDashboard;