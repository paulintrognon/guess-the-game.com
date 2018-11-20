import React from 'react';
import ScreenshotItem from './ScreenshotItem';
import './ScreenshotsGrid.css';

const ScreenshotsGrid = ({ screenshots, noScreenshotSentence, children }) => (
  <div className="ScreenshotsGrid">
    {children}
    {screenshots.length === 0 ? (
      <p>{noScreenshotSentence}</p>
    ) : (
      screenshots.map(screenshot => <ScreenshotItem screenshot={screenshot} />)
    )}
  </div>
);
export default ScreenshotsGrid;
