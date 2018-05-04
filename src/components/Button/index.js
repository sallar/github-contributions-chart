import React from 'react';
import PropTypes from 'prop-types';

const Button = props => {
  const { children } = props;

  return (
    <button {...props}>{children}</button>
  );
}

Button.defaultProps = {
  type: 'button',
};

Button.propTypes = {
  type: PropTypes.string,
};

export default Button;
