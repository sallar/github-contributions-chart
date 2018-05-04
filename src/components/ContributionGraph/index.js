import React from 'react';
import Button from '../Button';

const ContributionGraph = props => {
  const { download, canvas } = props;

  return (
    <div className="App-result">
      <p>
        <span role="img" aria-label="Scream">
          😱
        </span>{" "}
        Your chart is ready!<br />Right click on it and choose "Save Image
        As...", or
        <Button
          className="App-download-button"
          onClick={download}
        >
          Click here
        </Button>
      </p>
      <canvas ref={canvas} />
    </div>
  );
}

export default ContributionGraph;
