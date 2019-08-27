import React from 'react';
import debounce from 'lodash.debounce';
import ScreenshotItem from './ScreenshotItem';
import Loading from '../Loading/Loading';
import './ScreenshotsGrid.css';

export default class ScreenshotsGrid extends React.Component {
  componentDidMount = () => {
    window.addEventListener('scroll', debounce(this.handleScroll, 100));
  };

  componentWillUnmount = () => {
    window.removeEventListener('scroll', this.handleScroll);
  };

  handleScroll = () => {
    const { hasMore, handleLoadMore, error, isLoading } = this.props;

    // Bails early if:
    // * there's an error
    // * it's already loading
    // * there's nothing left to load
    // * if handleLoadMore is not defined
    if (error || isLoading || !hasMore || !handleLoadMore) return;

    // Checks that the page has scrolled to the bottom
    if (
      window.innerHeight + document.documentElement.scrollTop ===
      document.documentElement.offsetHeight
    ) {
      handleLoadMore();
    }
  };

  render() {
    const {
      screenshots,
      noScreenshotSentence,
      canModerateScreenshots,
      canEditScreenshots,
      children,
      isLoading,
    } = this.props;

    if (!isLoading) {
      this.handleScroll();
    }

    if (screenshots === null) {
      return (
        <p style={{ textAlign: 'center' }}>
          <Loading />
        </p>
      );
    }

    return (
      <div>
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
        {isLoading && (
          <p style={{ textAlign: 'center' }}>
            <Loading />
          </p>
        )}
      </div>
    );
  }
}
