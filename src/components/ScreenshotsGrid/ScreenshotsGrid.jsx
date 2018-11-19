import React from 'react';
import ScreenshotItem from './ScreenshotItem';
import './ScreenshotsGrid.css';

const ScreenshotsGrid = ({ screenshots, children }) => (
  <div className="ScreenshotsGrid">
    {children}
    {screenshots.length === 0 ? (
      <p>No screenshot to moderate.</p>
    ) : (
      screenshots.map(screenshot => <ScreenshotItem screenshot={screenshot} />)
    )}
  </div>
);
export default ScreenshotsGrid;
