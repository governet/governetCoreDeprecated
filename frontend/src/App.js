import React, { Component } from 'react';
import logo from './logo.svg';



import './App.css';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        window.fetch('http://127.0.0.1:3000/api/candidates').then((response) => {

        return response.json()
      }).then((json) => {
        this.setState({
            candidates: json.data
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
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            GOVERN-TURD.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn about the government
          </a>
          {this.state.candidates && this.state.candidates.map((candidate) => {
            return <p>{candidate.cand_name}</p>
          })}
        </header>
      </div>
    );
  }
}

export default App;
