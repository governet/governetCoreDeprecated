import React, { Component } from 'react';

import './App.css';

let profile = (candidate) => {
    return(
    <div className="App">
        <div>
            <h2> Candidate Overview </h2>
            Name: {candidate.cand_name}
            Party: {candidate.cand_pty_affiliation}
            ID: {candidate.cand_id}
            Election Year: {candidate.cand_election_yr}
            Office: {candidate.cand_office}
            Address: {candidate.cand_st1} {candidate.cand_st2} {candidate.cand_city} {candidate.cand_st} {candidate.cand_zip}
            Status: {candidate.cand_status}
        </div>
    </div>
    )
}

class CandidateProfile extends Component {

    constructor(props) {
        super(props);
        this.state = {};

    }
    componentDidMount() {
        window.fetch('http://127.0.0.1:3000/api/candidates/H0AL02087').then((response) => {

        return response.json()
      }).then((json) => {
        this.setState({
            candidate: json.data
        });

          console.log(json.data)


      }).catch(function(ex) {
        console.log('parsing failed', ex)
      })

    }

    render() {
        return (
          <div className="App">
            <header className="App-header">
            {this.state.candidate && profile(this.state.candidate)} 
            </header>
          </div>
        );
      }
    }

export default CandidateProfile;