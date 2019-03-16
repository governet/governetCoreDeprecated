import React, { Component } from 'react';
import './App.css';
import { scaleBand, scaleLinear } from 'd3-scale';
import { max } from 'd3-array';
import { axisBottom, axisLeft } from 'd3-axis';
import { select } from 'd3-selection';

// Sets of helper functions to reduce the contribution lists

// reducer function for summing contributions
const reducer = (accumulator, currentValue) => {
    return accumulator + currentValue;
}

//Generate a list of unique committee IDs among all contributions
const cmteList = (contributions) => {
    return [...new Set(contributions.map(item => item.cmte_id))]
}

//Sum the total contributions given by a committee, based on the contribution list
const cmteContributionSums = (cmte_ids, contributionList) => {
        return(
            cmte_ids.map(cmte_id => {
                return {
                    'cmte_id': cmte_id, 
                    'transaction_amt': (
                        contributionList.filter(contribution => contribution.cmte_id === cmte_id)
                        .map(item => parseFloat(item.transaction_amt))
                        .reduce(reducer)
                        )}
            })
        )
}

class ContributionTimeline extends Component {

    constructor(props) {
        super(props);
        this.state = {
            candidate_id: props.candidate_id,
            contributionMinimum: 1000,
            contributionMaximum: 1000000000,
            api_uri: props.api_uri,
            svgWidth: 960,
            svgHeight: 500,
        };
    }
    componentDidMount() {
        window.fetch(this.state.api_uri+this.state.candidate_id+'/contributions').then((response) => {

        return response.json()
      }).then((json) => {
        this.setState({
            contributions: json.data,
            contributionsSum: cmteContributionSums(cmteList(json.data),json.data)
                .filter(item => item.transaction_amt >= this.state.contributionMinimum)
                .filter(item => item.transaction_amt <= this.state.contributionMaximum)
        });

      }).catch(function(ex) {
        console.log('parsing failed', ex)
      })

    }

    render() {
        let margin = { top: 20, right: 20, bottom: 30, left: 40 };
        let height = this.state.svgHeight - margin.top - margin.bottom;
        let width = this.state.svgWidth - margin.left - margin.right;
        let x = scaleBand().rangeRound([0, width]).padding(0.1);
        let y = scaleLinear().rangeRound([height, 0]);
        return (
        <div className="App">
            <div className="Graph">
                <svg width={this.state.svgWidth} height={this.state.svgHeight}>
                    <g transform={`translate(${margin.left}, ${margin.top})`}>
                        <g
                            className="axis axis--x"
                            transform={`translate(0, ${height})`}
                            ref={node => select(node).call(axisBottom(x))}
                        />
                        <g className="axis axis--y">
                            <g ref={node => select(node).call(axisLeft(y).ticks(5, '$'))} />
                            <text transform="rotate(-90)" y="6" dy="0.71em" textAnchor="end">
                            Contribution in Dollars
                            </text>
                        </g>
                        {this.state.contributionsSum &&         
                            x.domain(this.state.contributionsSum.map(d => d['cmte_id'])) &&
                            y.domain([0, max(this.state.contributionsSum, d => d['transaction_amt'])]) &&
                            this.state.contributionsSum
                            .map(d => (
                            <rect
                            key={d['cmte_id']}
                            className="bar"
                            x={x(d['cmte_id'])}
                            y={y(d['transaction_amt'])}
                            width={x.bandwidth()}
                            height={height - y(d['transaction_amt'])}
                            />
                        ))}
                    </g>
                </svg>
            </div> 
        </div>
        );
      }
    }

export default ContributionTimeline;