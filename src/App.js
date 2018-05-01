import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import { drawContributions } from "./utils/draw";

class App extends Component {
  canvas = null;

  state = {
    loading: false,
    data: null,
    username: "sallar"
  };

  handleUsernameChange = e => {
    this.setState({
      username: e.target.value
    });
  };

  handleSubmit = () => {
    this.setState({ loading: true });
    fetch(`https://github-contributions-api.now.sh/v1/${this.state.username}`)
      .then(res => res.json())
      .then(res =>
        this.setState({ data: res, loading: false }, () => this.draw())
      );
  };

  draw() {
    drawContributions(this.canvas, this.state.data, this.state.username);
  }

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
        {this.state.data !== null &&
          !this.state.loading && <canvas ref={el => (this.canvas = el)} />}
      </div>
    );
  }
}

export default App;
