import React, { Component } from "react";
import loading from "./loading.gif";
import "./App.css";
import { drawContributions } from "./utils/draw";

class App extends Component {
  canvas = null;

  state = {
    loading: false,
    data: null,
    error: null,
    username: ""
  };

  handleUsernameChange = e => {
    this.setState({
      username: e.target.value
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.setState({ loading: true, error: null });
    fetch(`https://github-contributions-api.now.sh/v1/${this.state.username}`)
      .then(res => res.json())
      .then(res => {
        if (res.years.length === 0) {
          return this.setState({
            error: "Could not find your profile",
            data: null,
            loading: false
          });
        }
        this.setState({ data: res, loading: false }, () => this.draw());
      })
      .catch(err => {
        this.setState({
          loading: false,
          error: "I could not check your profile successfully..."
        });
      });
  };

  draw() {
    if (!this.canvas) {
      return this.setState({
        error: "Something went wrong... Check back later."
      });
    }
    drawContributions(this.canvas, this.state.data, this.state.username);
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Github Contributions Chart Generator</h1>
          <h4>All your contributions in one image!</h4>
          <form onSubmit={this.handleSubmit}>
            <input
              placeholder="Your github username"
              onChange={this.handleUsernameChange}
              value={this.state.username}
            />
            <button type="submit">
              <span role="img" aria-label="Stars">
                ✨
              </span>{" "}
              Generate!
            </button>
          </form>
          <div className="App-github-button">
            <a
              className="github-button"
              href="https://github.com/sallar/github-contributions-chart"
              data-size="large"
              data-show-count="true"
              aria-label="Star sallar/github-contribution-chart on GitHub"
            >
              Star
            </a>
          </div>
        </header>
        <section className="App-content">
          {this.state.loading && (
            <div className="App-loading">
              <img src={loading} alt="Loading..." width={200} />
              <p>Please wait, I'm visiting your profile...</p>
            </div>
          )}
          {this.state.data !== null &&
            !this.state.loading && (
              <div className="App-result">
                <p>
                  <span role="img" aria-label="Scream">
                    😱
                  </span>{" "}
                  Your chart is ready!<br />Right click on it and choose "Save
                  Image As..."
                </p>
                <canvas ref={el => (this.canvas = el)} />
              </div>
            )}
          {this.state.error !== null && (
            <div className="App-error">
              <p>{this.state.error}</p>
            </div>
          )}
        </section>
      </div>
    );
  }
}

export default App;
