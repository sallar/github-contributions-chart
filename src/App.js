import React, { Component } from "react";
import { Route, withRouter, Switch } from "react-router-dom";
import "./App.css";
import Contributions from "./Contributions";

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

  setUserName = username => {
    this.setState({ username });
  };

  handleUsernameChange = e => {
    this.setUserName(e.target.value);
  };

  handleSubmit = () => {
    this.props.history.push(`/${this.state.username}`);
  };

  handleChangeTheme = e => {
    this.setState({ theme: e.target.value }, () => {
      return this.canvas && this.draw();
    });
  };

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
        <Switch>
          <Route exact path="/:username">
            <Contributions
              theme={this.state.theme}
              setUserName={this.setUserName}
            />
          </Route>
        </Switch>
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

  _renderForm = () => {
    return (
      <div className="input-container">
        <input
          ref={ref => {
            this.inputRef = ref;
          }}
          placeholder="Your GitHub Username"
          onChange={this.handleUsernameChange}
          value={this.state.username}
          id="username"
        />
        <button
          type="button"
          disabled={this.state.username.length <= 0}
          onClick={this.handleSubmit}
        >
          <span role="img" aria-label="Stars">
            ✨
          </span>{" "}
          Generate!
        </button>
      </div>
    );
  };
}

export default withRouter(App);
