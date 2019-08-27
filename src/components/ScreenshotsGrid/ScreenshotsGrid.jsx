import React from 'react';
import debounce from 'lodash.debounce';
import ScreenshotItem from './ScreenshotItem';
import Loading from '../Loading/Loading';
import './ScreenshotsGrid.css';

export default class ScreenshotsGrid extends React.Component {
  constructor(props) {
    super(props);

    // Binds our scroll event handler
    window.onscroll = debounce(() => {
      const { hasMore, loadMore, error, isLoading } = this.props;

      // Bails early if:
      // * there's an error
      // * it's already loading
      // * there's nothing left to load
      if (error || isLoading || !hasMore) return;

      // Checks that the page has scrolled to the bottom
      if (
        window.innerHeight + document.documentElement.scrollTop ===
        document.documentElement.offsetHeight
      ) {
        alert('load');
        // loadMore();
      }
    }, 100);
  }

  render() {
    const {
      screenshots,
      noScreenshotSentence,
      canModerateScreenshots,
      canEditScreenshots,
      children,
      isLoading,
    } = this.props;

    if (isLoading || screenshots === null) {
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
}
