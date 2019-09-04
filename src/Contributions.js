import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import loadingImage from "./loading.gif";
import { fetchData } from "./utils/export";
import { download, uploadToTwitter } from "./utils/export";
import { drawContributions } from "github-contributions-canvas";

class Contributions extends Component {
  state = {
    loading: false,
    data: null,
    error: null
  };

  componentDidMount() {
    const username = this.getUserName();
    this.props.setUserName(username);
    this.fetchContributions();
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.username !== prevProps.match.params.username) {
      this.fetchContributions();

      return;
    }

    if (this.props.theme !== prevProps.theme) {
      this.draw();
    }
  }

  getUserName = () => {
    return (this.props.match &&
        this.props.match.params &&
        this.props.match.params.username) ||
        "";
  }

  draw() {
    if (!this.canvas) {
      return this.setState({
        error: "Something went wrong... Check back later."
      });
    }
    drawContributions(this.canvas, {
      data: this.state.data,
      username: this.getUserName(),
      themeName: this.props.theme,
      footerText: "Made by @sallar & friends - github-contributions.now.sh"
    });
  }

  fetchContributions() {
    this.setState({ loading: true, error: null });
    const username = this.getUserName();

    fetchData(username)
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
        });
      })
      .catch(err => {
        this.setState({
          loading: false,
          error: "I could not check your profile successfully..."
        });
      });
  }

  render() {
    return (
      <section className="App-content">
        {this.state.loading && this._renderLoading()}
        {this.state.data !== null &&
          !this.state.loading &&
          this._renderGraphs()}
        {this.state.error !== null && this._renderError()}
      </section>
    );
  }

  _renderLoading = () => {
    return (
      <div className="App-loading">
        <img src={loadingImage} alt="Loading..." width={200} />
        <p>Please wait, I{`'`}m visiting your profile...</p>
      </div>
    );
  };

  download = e => {
    e.preventDefault();
    download(this.canvas);
  };

  onShareTwitter = e => {
    e.preventDefault();
    uploadToTwitter(this.canvas);
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

  _renderError = () => {
    return (
      <div className="App-error">
        <p>{this.state.error}</p>
      </div>
    );
  };
}

export default withRouter(Contributions);
