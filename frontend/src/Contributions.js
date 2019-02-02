import React, { Component } from 'react';

import './App.css';

const contribution_profile = (contribution) => {
    return(
    <div className="App">
        <div class="Contribution_Profile">
            <div class="Contribution_Item">${contribution.transaction_amt}</div>
            <div class="Contribution_Item">{contribution.transaction_dt}</div>
            <div class="Contribution_Item">{contribution.name}</div>
            <div class="Contribution_Item">{contribution.entity_tp}</div>
            <div class="Contribution_Item">{contribution.city}</div>
            <div class="Contribution_Item">{contribution.state}</div>
        </div>
    </div>
    )
}

const reducer = (accumulator, currentValue) => {
    currentValue.transaction_amt.replace('—','-')
    console.log(currentValue);
    currentValue = parseInt(currentValue.transaction_amt);
    console.log(currentValue);
    return accumulator + currentValue;
}


class ContributionList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            candidate_id: props.candidate_id
        };

    }
    componentDidMount() {
        window.fetch('http://127.0.0.1:3000/api/candidates/'+this.state.candidate_id+'/contributions').then((response) => {

        return response.json()
      }).then((json) => {
        this.setState({
            contributions: json.data
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
                <h1> Contributions by Source </h1>
                <div className="Contribution_List">
                    {this.state.contributions && this.state.contributions.map((contribution) => {
                    return contribution_profile(contribution)
                    })}
                </div>
            </header>
          </div>
        );
      }
    }
    

    class ContributionSummary extends Component {

        constructor(props) {
            super(props);
            this.state = {
                candidate_id: props.candidate_id
            };
        
        }
        componentDidMount() {
            window.fetch('http://127.0.0.1:3000/api/candidates/'+this.state.candidate_id+'/contributions').then((response) => {
    
            return response.json()
          }).then((json) => {
            this.setState({
                contribution_objects: json.data
            });
    
              console.log(json.data)
    
          }).catch(function(ex) {
            console.log('parsing failed', ex)
          })
    
        }
    
        render() {
            return (
              <div>
                {this.state.contribution_objects && this.state.contribution_objects.reduce(reducer, 0)}
              </div>
            );
          }
        }
    
export {
    ContributionList,
    ContributionSummary
}