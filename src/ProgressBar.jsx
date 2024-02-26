import React from 'react';

function ProgressBar({ progressPercentage, progressBarColor, progressBarDoneColor, labelColor }) {
  return (
    <>
    <div className="progress-bar" style={{backgroundColor: progressBarColor}}>
      <div className="progress-bar-done" style={{width: `${progressPercentage}%`, backgroundColor: progressBarDoneColor}}></div>
    </div>
    <div className='label-right' style={{color: labelColor}}>
      {Math.round(progressPercentage)}%
    </div>
    </>
  );
}

export default ProgressBar;