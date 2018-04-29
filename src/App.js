import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";

class App extends Component {
  state = {
    loading: false,
    username: ""
  };

  handleUsernameChange = e => {
    this.setState({
      username: e.target.value
    });
  };

  handleSubmit = () => {
    this.setState({
      loading: true
    });
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <input
            onChange={this.handleUsernameChange}
            value={this.state.username}
          />
          <button onClick={this.handleSubmit}>Load</button>
        </header>
        {this.state.loading && <p className="App-intro">Loading</p>}
      </div>
    );
  }
}

export default App;
