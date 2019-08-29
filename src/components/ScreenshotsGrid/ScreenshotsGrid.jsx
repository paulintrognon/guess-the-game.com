import React from 'react';
import debounce from 'awesome-debounce-promise';
import ScreenshotItem from './ScreenshotItem';
import Loading from '../Loading/Loading';
import './ScreenshotsGrid.css';

export default class ScreenshotsGrid extends React.Component {
  componentDidMount = () => {
    window.addEventListener('scroll', debounce(this.handleScroll, 200));
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

    // This timeout is to make sure react has loaded the next row before we compute the height
    setTimeout(() => {
      const needsToTrigger =
        window.innerHeight + document.documentElement.scrollTop + 100 >
        document.documentElement.offsetHeight;

      // Checks that the page has scrolled to the bottom
      if (needsToTrigger) {
        handleLoadMore();
      }
    }, 200);
  };

  handleSearchInput = event => {
    this.props.handleSearch(event.target.value);
  };

  render() {
    const {
      screenshots,
      noScreenshotSentence,
      canModerateScreenshots,
      canEditScreenshots,
      children,
      isLoading,
      handleSearch,
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
      <div className="ScreenshotsGrid">
        {handleSearch && (
          <div className="ScreenshotsGrid_searchContainer">
            <input
              type="text"
              onInput={this.handleSearchInput}
              className="ScreenshotsGrid_searchContainer_textInput"
              placeholder="Rechercher par numéro ou par nom"
            />
          </div>
        )}
        <div className="ScreenshotsGrid_items">
          {children}
          {!isLoading && screenshots.length === 0 ? (
            <p>{noScreenshotSentence}</p>
          ) : (
            screenshots.map(screenshot => (
              <ScreenshotItem
                key={screenshot.id}
                screenshot={screenshot}
                canModerateScreenshots={canModerateScreenshots}
                canEditScreenshots={
                  canModerateScreenshots ||
                  (canEditScreenshots &&
                    screenshot.approvalStatus !== 'approved')
                }
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
