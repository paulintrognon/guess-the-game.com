import React from 'react';
import ScreenshotItem from './ScreenshotItem';
import './ScreenshotsGrid.css';

const ScreenshotsGrid = ({
  screenshots,
  noScreenshotSentence,
  canModerateScreenshots,
  canEditScreenshots,
  children,
}) => (
  <div className="ScreenshotsGrid">
    {children}
    {screenshots.length === 0 ? (
      <p>{noScreenshotSentence}</p>
    ) : (
      screenshots.map(screenshot => (
        <ScreenshotItem
          key={screenshot.id}
          screenshot={screenshot}
          canModerateScreenshots={canModerateScreenshots}
          canEditScreenshots={canEditScreenshots}
        />
      ))
    )}
  </div>
);
export default ScreenshotsGrid;
