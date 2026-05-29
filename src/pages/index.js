import { TbBrandTwitter, TbShare, TbDownload, TbCopy, TbChevronDown } from "react-icons/tb";
import React, { useRef, useState, useEffect } from "react";
import {
  download,
  fetchData,
  downloadJSON,
  downloadSVG,
  cleanUsername,
  share,
  copyToClipboard
} from "../utils/export";
import ThemeSelector from "../components/themes";

const App = () => {
  const inputRef = useRef();
  const canvasRef = useRef();
  const contentRef = useRef();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [theme, setTheme] = useState("standard");
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const downloadMenuRef = useRef();

  useEffect(() => {
    if (!data) return;
    draw();
  }, [data, theme]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (downloadMenuRef.current && !downloadMenuRef.current.contains(e.target)) {
        setShowDownloadMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setUsername(cleanUsername(username));
    setLoading(true);
    setError(null);
    setData(null);

    fetchData(cleanUsername(username))
      .then((data) => {
        setLoading(false);

        if (data.years.length === 0) {
          setError("Could not find your profile");
        } else {
          setData(data);
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        setError("I could not check your profile successfully...");
      });
  };

  const onDownloadPNG = (e) => {
    e.preventDefault();
    download(canvasRef.current);
    setShowDownloadMenu(false);
  };

  const onDownloadSVG = (e) => {
    e.preventDefault();
    downloadSVG(canvasRef.current);
    setShowDownloadMenu(false);
  };

  const onCopy = (e) => {
    e.preventDefault();
    copyToClipboard(canvasRef.current);
  };

  const onDownloadJson = (e) => {
    e.preventDefault();
    if (data != null) downloadJSON(data);
  };

  const onShare = (e) => {
    e.preventDefault();
    share(canvasRef.current);
  };

  const draw = async () => {
    if (!canvasRef.current || !data) {
      setError("Something went wrong... Check back later.");
      return;
    }
    const { drawContributions } = await import("github-contributions-canvas");
    drawContributions(canvasRef.current, {
      data,
      username: username,
      themeName: theme,
      footerText: "Made by @sallar & friends - github-contributions.vercel.app"
    });
    contentRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const _renderGithubButton = () => (
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

  const _renderLoading = () => (
    <div className="App-centered">
      <div className="App-loading">
        <img src={"/loading.gif"} alt="Loading..." width={202} height={125} />
        <p>Please wait, I'm visiting your profile...</p>
      </div>
    </div>
  );

  const _renderGraphs = () => (
    <div
      className="App-result"
      style={{ display: data !== null && !loading ? "block" : "none" }}
    >
      <p>Your chart is ready!</p>
      {data !== null && (
        <>
          <div className="App-buttons">
            <button className="App-download-button" onClick={onCopy} type="button">
              <TbCopy size={18} />
              Copy
            </button>

            <div className="App-download-split" ref={downloadMenuRef}>
              <button
                className="App-download-button App-download-button--main"
                onClick={onDownloadPNG}
                type="button"
              >
                <TbDownload size={18} />
                Download PNG
              </button>
              <button
                className="App-download-button App-download-button--caret"
                onClick={() => setShowDownloadMenu((v) => !v)}
                type="button"
                aria-label="More download options"
              >
                <TbChevronDown size={16} />
              </button>
              {showDownloadMenu && (
                <div className="App-download-menu">
                  <button onClick={onDownloadPNG} type="button">
                    <TbDownload size={15} />
                    Download as PNG
                  </button>
                  <button onClick={onDownloadSVG} type="button">
                    <TbDownload size={15} />
                    Download as SVG
                  </button>
                </div>
              )}
            </div>

            {global.navigator && "share" in navigator && (
              <button className="App-download-button" onClick={onShare} type="button">
                <TbShare size={18} />
                Share
              </button>
            )}
          </div>
          <canvas ref={canvasRef} />
        </>
      )}
    </div>
  );

  const _renderForm = () => (
    <form onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        placeholder="Your GitHub Username"
        onChange={(e) => setUsername(e.target.value)}
        value={username}
        id="username"
        autoCorrect="off"
        autoCapitalize="none"
        autoFocus
      />
      <button type="submit" disabled={username.length <= 0 || loading}>
        <span role="img" aria-label="Stars">✨</span>{" "}
        {loading ? "Generating..." : "Generate!"}
      </button>
    </form>
  );

  const _renderError = () => (
    <div className="App-error App-centered">
      <p>{error}</p>
    </div>
  );

  const _renderDownloadAsJSON = () => {
    if (data === null) return;
    return (
      <a href="#" onClick={onDownloadJson}>
        <span role="img" aria-label="Bar Chart">📊</span>{" "}
        Download data as JSON for your own visualizations
      </a>
    );
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="App-logo">
          <img src="/topguntocat.png" width={224} height={111} alt="Topguntocat" />
          <h1>GitHub Contributions Chart Generator</h1>
          <h4>All your contributions in one image!</h4>
        </div>
        {_renderForm()}
        <ThemeSelector
          currentTheme={theme}
          onChangeTheme={(themeName) => setTheme(themeName)}
        />
        {_renderGithubButton()}
        <footer>
          <p>
            Not affiliated with GitHub Inc. Octocat illustration from{" "}
            <a href="https://octodex.github.com/topguntocat/" target="_blank">
              GitHub Octodex
            </a>.
          </p>
          {_renderDownloadAsJSON()}
          <div className="App-powered">
            <a
              href="https://vercel.com/?utm_source=github-contributions-chart&utm_campaign=oss"
              target="_blank"
            >
              <img src="/powered-by-vercel.svg" alt="Powered by Vercel" />
            </a>
          </div>
        </footer>
      </header>
      <section className="App-content" ref={contentRef}>
        {loading && _renderLoading()}
        {error !== null && _renderError()}
        {_renderGraphs()}
      </section>
    </div>
  );
};

export default App;