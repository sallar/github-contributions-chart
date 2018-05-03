import React, { Component } from "react";
import { drawContributions } from "github-contributions-canvas";
import { download } from "./utils/export";
import loading from "./loading.gif";
import "./App.css";

class App extends Component {
  canvas = null;
  availableThemes = {
    standard: "GitHub",
    halloween: "Halloween",
    teal: "Teal",
    leftPad: "@left_pad",
    dracula: "Dracula",
    blue: "Blue"
  };

  state = {
    loading: false,
    data: null,
    error: null,
    username: "",
    theme: "standard"
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

  handleChangeTheme = e => {
    this.setState({ theme: e.target.value });
  };

  download = e => {
    e.preventDefault();
    download(this.canvas);
  };

  draw() {
    if (!this.canvas) {
      return this.setState({
        error: "Something went wrong... Check back later."
      });
    }
    drawContributions(this.canvas, {
      data: this.state.data,
      username: this.state.username,
      themeName: this.state.theme,
      footerText: "Made by @sallar - github-contributions.now.sh"
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>GitHub Contributions Chart Generator</h1>
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
          <div className="App-themes">
            {Object.keys(this.availableThemes).map(themeName => (
              <label key={themeName}>
                <input
                  type="radio"
                  name="theme"
                  checked={this.state.theme === themeName}
                  value={themeName}
                  onChange={this.handleChangeTheme}
                />{" "}
                {this.availableThemes[themeName]}
              </label>
            ))}
          </div>
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
                  Image As..., or
                  <button
                    className="App-download-button"
                    onClick={this.download}
                    type="button"
                  >
                    Click here
                  </button>
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
