import React from "react";

import "./progress.css";

const LoadingBar = (progress) => {
  return (
    <div className="progress-container">
      <div className="progress-bar"  style={{width: `${progress}%`}}>
      </div>
    </div>
  );
};

export default LoadingBar;
