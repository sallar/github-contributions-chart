import React, { Component } from "react";
import { drawContributions } from "github-contributions-canvas";
import { download } from "../../utils/export";
import GithubContribution from "../../services/github-contribution";
import InputField from "../InputField";
import Button from "../Button";
import GithubStarLink from "../GithubStarLink";
import ErrorResponse from "../ErrorResponse";
import Loading from "../Loading";
import ContributionGraph from "../ContributionGraph";

class App extends Component {
  constructor (props) {
    super();

    this.canvas = null;

    this.availableThemes = {
      standard: "GitHub",
      halloween: "Halloween",
      teal: "Teal",
      leftPad: "@left_pad",
      dracula: "Dracula",
      blue: "Blue",
      panda: "Panda 🐼"
    };
  
    this.state = {
      loading: false,
      data: null,
      error: null,
      username: "",
      theme: "standard"
    };

    this.handleChangeTheme = this.handleChangeTheme.bind(this);
  }

  handleUsernameChange = e => {
    this.setState({
      username: e.target.value
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    this.setState({ loading: true, error: null });

    GithubContribution.getByUsername(this.state.username)
      .then(res => res.json())
      .then(res => {
        if (GithubContribution.emptyYears(res.years)) {
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
  }

  handleChangeTheme = e => {
    this.setState({ theme: e.target.value }, () => {
      return this.canvas && this.draw();
    });
  }

  download = e => {
    e.preventDefault();
    download(this.canvas);
  }

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
  
  _renderThemes = () => {
    return (
      <div className="App-themes">
        {Object.keys(this.availableThemes).map(themeName => (
          <label key={themeName}>
            <InputField
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
  }

  _renderForm = () => {
    return (
      <form onSubmit={this.handleSubmit}>
        <InputField
          placeholder="Your GitHub Username"
          onChange={this.handleUsernameChange}
          value={this.state.username}
        />

        <Button
          type="submit"
          disabled={this.state.username.length <= 0}
        >
          <span role="img" aria-label="Stars">
            ✨
          </span>{" "}
          Generate!
        </Button>
      </form>
    );
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>GitHub Contributions Chart Generator</h1>
          <h4>All your contributions in one image!</h4>
          {this._renderForm()}
          {this._renderThemes()}
          <GithubStarLink />
        </header>
        <section className="App-content">
          {this.state.loading && <Loading />}
          {this.state.data !== null &&
            !this.state.loading &&
            <ContributionGraph 
              canvas={el => (this.canvas = el)}
              download={this.download}
            />}
          {this.state.error !== null && <ErrorResponse error={this.state.error} />}
        </section>
      </div>
    );
  }
}

export default App;
