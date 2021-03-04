import React from "react";
import PropTypes from "prop-types";
import { themes } from "github-contributions-canvas";

const availableThemes = {
  standard: "GitHub",
  classic: "GitHub Classic",
  githubDark: "GitHub Dark",
  halloween: "Halloween",
  teal: "Teal",
  leftPad: "@left_pad",
  dracula: "Dracula",
  blue: "Blue",
  panda: "Panda 🐼",
  sunny: "Sunny",
  pink: "Pink",
  YlGnBu: "YlGnBu",
  solarizedDark: 'Solarized Dark',
  solarizedLight: 'Solarized Light'
};

const Preview = ({ themeName }) => (
  <div
    className="Theme-preview"
    style={{ backgroundColor: themes[themeName].background }}
  >
    <span style={{ backgroundColor: themes[themeName].grade1 }}></span>
    <span style={{ backgroundColor: themes[themeName].grade2 }}></span>
    <span style={{ backgroundColor: themes[themeName].grade3 }}></span>
    <span style={{ backgroundColor: themes[themeName].grade4 }}></span>
  </div>
);

const ThemeSelector = ({ currentTheme, onChangeTheme }) => (
  <div className="App-themes">
    <h6>
      <span>Select a theme:</span>
    </h6>
    <div className="App-themes-list">
      {Object.keys(availableThemes).map((themeName) => (
        <label key={themeName}>
          <input
            type="radio"
            name="theme"
            checked={currentTheme === themeName}
            value={themeName}
            onChange={() => onChangeTheme(themeName)}
          />
          <Preview themeName={themeName} />
          {availableThemes[themeName]}
        </label>
      ))}
    </div>
  </div>
);

ThemeSelector.propTypes = {
  onChangeTheme: PropTypes.func.isRequired,
  currentTheme: PropTypes.string.isRequired
};

export default ThemeSelector;
