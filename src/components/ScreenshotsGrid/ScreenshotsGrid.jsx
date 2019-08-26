import React from 'react';
import ScreenshotItem from './ScreenshotItem';
import Loading from '../Loading/Loading';
import './ScreenshotsGrid.css';

export default function ScreenshotsGrid({
  screenshots,
  noScreenshotSentence,
  canModerateScreenshots,
  canEditScreenshots,
  children,
}) {
  if (screenshots === null) {
    return (
      <p style={{ textAlign: 'center' }}>
        <Loading />
      </p>
    );
  }
  return (
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
}
