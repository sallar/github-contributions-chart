import React from 'react';

const ErrorResponse = props => {
  return (
    <div className="App-error">
      <p>{props.error}</p>
    </div>
  )
};

export default ErrorResponse;
