import React, { Component } from "react";
import { drawContributions } from "github-contributions-canvas";
import { download, uploadToTwitter, fetchData } from "./utils/export";
import loadingImage from "./loading.gif";
import "./App.css";

class App extends Component {
  canvas = null;
  inputRef = null;
  availableThemes = {
    standard: "GitHub",
    halloween: "Halloween",
    teal: "Teal",
    leftPad: "@left_pad",
    dracula: "Dracula",
    blue: "Blue",
    panda: "Panda 🐼",
    sunny: "Sunny",
    pink: "Pink",
    YlGnBu: "YlGnBu"
  };

  state = {
    loading: false,
    data: null,
    error: null,
    username: "",
    theme: "standard"
  };

  componentDidMount() {
    if (this.inputRef) {
      this.inputRef.focus();
    }
  }

  handleUsernameChange = e => {
    this.setState({
      username: e.target.value
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.setState({ loading: true, error: null });
    fetchData(this.state.username)
      .then(({ data }) => {
        if (data.years.length === 0) {
          return this.setState({
            error: "Could not find your profile",
            data: null,
            loading: false
          });
        }
        this.setState({ data, loading: false }, () => {
          this.draw();
          this.inputRef.blur();
        });
      })
      .catch(err => {
        this.setState({
          loading: false,
          error: "I could not check your profile successfully..."
        });
      });
  };

  handleChangeTheme = e => {
    this.setState({ theme: e.target.value }, () => {
      return this.canvas && this.draw();
    });
  };

  download = e => {
    e.preventDefault();
    download(this.canvas);
  };

  onShareTwitter = e => {
    e.preventDefault();
    uploadToTwitter(this.canvas);
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
      footerText: "Made by @sallar & friends - github-contributions.now.sh"
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>GitHub Contributions Chart Generator</h1>
          <h4>All your contributions in one image!</h4>
          {this._renderForm()}
          {this._renderThemes()}
          {this._renderGithubButton()}
        </header>
        <section className="App-content">
          {this.state.loading && this._renderLoading()}
          {this.state.data !== null &&
            !this.state.loading &&
            this._renderGraphs()}
          {this.state.error !== null && this._renderError()}
        </section>
      </div>
    );
  }

  _renderThemes = () => {
    return (
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
    );
  };

  _renderGithubButton = () => {
    return (
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
    );
  };

  _renderLoading = () => {
    return (
      <div className="App-loading">
        <img src={loadingImage} alt="Loading..." width={200} />
        <p>Please wait, I{`'`}m visiting your profile...</p>
      </div>
    );
  };

  _renderGraphs = () => {
    return (
      <div className="App-result">
        <p>Your chart is ready!</p>
        <div className="App-buttons">
          <button
            className="App-download-button"
            onClick={this.download}
            type="button"
          >
            Download the Image
          </button>
          or
          <button
            className="App-twitter-button"
            onClick={this.onShareTwitter}
            type="button"
          >
            Share on Twitter
          </button>
        </div>

        <canvas ref={el => (this.canvas = el)} />
      </div>
    );
  };

  _renderForm = () => {
    return (
      <form onSubmit={this.handleSubmit}>
        <input
          ref={(ref) => { this.inputRef = ref }}
          placeholder="Your GitHub Username"
          onChange={this.handleUsernameChange}
          value={this.state.username}
          id="username"
        />
        <button type="submit" disabled={this.state.username.length <= 0}>
          <span role="img" aria-label="Stars">
            ✨
          </span>{" "}
          Generate!
        </button>
      </form>
    );
  };

  _renderError = () => {
    return (
      <div className="App-error">
        <p>{this.state.error}</p>
      </div>
    );
  };
}

export default App;
