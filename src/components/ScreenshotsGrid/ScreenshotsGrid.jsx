import React from 'react';
import { Link } from 'react-router-dom';
import './ScreenshotsGrid.css';

const ScreenshotsGrid = ({ screenshots, children }) => (
  <div className="ScreenshotsGrid">
    {children}
    {screenshots.map(screenshot => (
      <Link
        key={screenshot.id}
        className="ScreenshotsGrid_item"
        to={`/shot/${screenshot.id}`}
      >
        <div
          style={{
            backgroundImage: `url(${screenshot.imageUrl})`,
          }}
          className="ScreenshotsGrid_item_image"
        />
        <div className="ScreenshotsGrid_item_legend">
          <p className="ScreenshotsGrid_item_legend_name">
            {screenshot.name} {screenshot.year ? `(${screenshot.year})` : null}
          </p>
          {screenshot.solvedAt ? (
            <p className="ScreenshotsGrid_item_legend_text">
              Solved the {screenshot.solvedAt.toLocaleDateString()} at{' '}
              {screenshot.solvedAt.toLocaleTimeString()}
            </p>
          ) : (
            <p className="ScreenshotsGrid_item_legend_text">
              Added the {screenshot.createdAt.toLocaleDateString()} at{' '}
              {screenshot.createdAt.toLocaleTimeString()}
            </p>
          )}
        </div>
      </Link>
    ))}
  </div>
);
export default ScreenshotsGrid;
