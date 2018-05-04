import React from 'react';
import PropTypes from 'prop-types';
import Link from '../Link';

const GithubStarLink = props => {
  const { children } = props;

  return (
    <div className="App-github-button">
      <Link
        className="github-button"
        href="https://github.com/sallar/github-contributions-chart"
        data-size="large"
        data-show-count="true"
        aria-label="Star sallar/github-contribution-chart on GitHub"
      >
        {children}
      </Link>
    </div>
  );
}

GithubStarLink.defaultProps = {
  children: 'Star',
};

GithubStarLink.propTypes = {
  children: PropTypes.string,
};

export default GithubStarLink;
