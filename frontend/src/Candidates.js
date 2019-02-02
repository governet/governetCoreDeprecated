import React, { Component } from 'react';

import './App.css';

let profile = (candidate) => {
    return(
    <div className="App">
        <div className="Candidate_Profile">
            <h2> {candidate.cand_name} </h2>
            <h3>{candidate.cand_pty_affiliation}</h3>
            <h3>
                {candidate.cand_st1} 
                {candidate.cand_st2} 
                {candidate.cand_city}  
                {candidate.cand_st} 
                {candidate.cand_zip} 
            </h3>
            <div>
                {candidate.cand_election_yr}
            </div>
            <div>
                Federal Election Commision Candidate ID: {candidate.cand_id} 
            </div>
            <div>
                Office: {candidate.cand_office} 
            </div>
            <div>
                Status: {candidate.cand_status} 
            </div>
        </div>
    </div>
    )
}

class CandidateProfile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            candidate_id: props.candidate_id
        };

    }
    componentDidMount() {
        window.fetch('http://127.0.0.1:3000/api/candidates/'+this.state.candidate_id).then((response) => {

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

export { 
    CandidateProfile 
};