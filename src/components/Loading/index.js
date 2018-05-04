import React from 'react';
import PropTypes from 'prop-types';
import loadingImage from "../../assets/img/loading.gif";

const Loading = props => {
  const { message, src, alt } = props;

  return (
    <div className="App-loading">
      <img src={src} alt={alt} width={200} />
      <p>{message}</p>
    </div>
  );
}

Loading.defaultProps = {
  message: `Please wait, I'm visiting your profile...`,
  src: loadingImage,
  alt: 'Loading...'
};

Loading.propTypes = {
  message: PropTypes.string,
  src: PropTypes.string,
  alt: PropTypes.string,
};

export default Loading;
