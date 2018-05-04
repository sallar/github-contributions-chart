import React from 'react';
import PropTypes from 'prop-types';

const InputField = props => {
  return (
    <input {...props} />
  );
}

InputField.defaultProps = {
  type: 'text',
};

InputField.propTypes = {
  type: PropTypes.string,
};

export default InputField;
