import React from 'react';
import PropTypes from 'prop-types';

const Link = props => {
  const { children } = props;

  return (
    <a {...props}>{children}</a>
  );
}

Link.defaultProps = {
  href: 'javascript:void(0)',
};

Link.propTypes = {
  href: PropTypes.string.isRequired,
};

export default Link;
