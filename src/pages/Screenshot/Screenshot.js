import React from 'react';
import { connect } from 'react-redux';
import screenshotActions from '../../actions/screenshotActions';
import Loading from '../../components/Loading/Loading';
import './screenshot.css';

function mapStoreToProps(store) {
  return {
    screenshot: store.screenshot,
    isTryAnotherButtonClicked: store.screenshot.isTryAnotherButtonClicked,
    allFound: store.screenshot.allFound,
    isGuessing: store.screenshot.isGuessing,
    isProposalRight: store.screenshot.isProposalRight,
    isProposalWrong: store.screenshot.isProposalWrong,
  };
}
class ScreenshotPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      proposal: '',
    };

    if (props.match.params.id !== props.screenshot.id) {
      this.props.dispatch(
        screenshotActions.loadScreenshot(props.match.params.id)
      );
    }
  }

  changeProposalHandler = event => {
    this.setState({
      proposal: event.target.value,
    });
  };

  trySubmitHandler = event => {
    event.preventDefault();
    if (this.props.isProposalRight || !this.state.proposal.trim()) {
      return;
    }
    this.props.dispatch(
      screenshotActions.tryProposal(
        this.props.screenshot.id,
        this.state.proposal
      )
    );
  };

  tryAnotherHandler = () => {
    this.setState({ proposal: '' });
    this.props.dispatch({ type: 'SCREENSHOT_TRY_ANOTHER' });
    this.props.dispatch(
      screenshotActions.getUnsolvedScreenshot(this.props.match.params.id)
    );
  };

  render() {
    return (
      <section className="section">
        <div className="container">
          <div className="ScreenshotPage">{this.renderScreenshotBox()}</div>
        </div>
      </section>
    );
  }

  renderScreenshotBox() {
    const { screenshot } = this.props;
    if (screenshot.isLoading) {
      return (
        <div className="ScreenshotPage__header">
          <Loading />
        </div>
      );
    }
    return (
      <div>
        <div className="ScreenshotPage__header">{this.renderHeader()}</div>
        <div className="ScreenshotPage__screenshot">
          {this.renderScreenshot()}
          {screenshot.name ? (
            <p className="ScreenshotPage__screenshotName">
              {screenshot.name}{' '}
              {screenshot.year ? `(${screenshot.year})` : null}
            </p>
          ) : null}
          {this.renderFooter()}
        </div>
      </div>
    );
  }

  renderHeader() {
    const { screenshot, isProposalRight } = this.props;
    return (
      <div className="columns">
        <div className="column" />
        <h2
          className={`column ScreenshotPage__header__title ${
            screenshot.isSolved || isProposalRight ? '-isSolved' : ''
          }`}
        >
          Screenshot #{screenshot.id}
        </h2>
        <h3 className="column ScreenshotPage__header__username">
          Uploaded by <b>{screenshot.isOwn ? 'you!' : screenshot.username}</b>
        </h3>
      </div>
    );
  }

  renderScreenshot() {
    const { screenshot } = this.props;
    return (
      <div className="ScreenshotPage__screenshot__image__container">
        <img
          className="ScreenshotPage__screenshot__image"
          src={screenshot.url}
          alt={`Guess The Game Screenshot #${screenshot.id}`}
          onLoad={this.imageLoadedHandler}
        />
      </div>
    );
  }

  renderFooter() {
    const {
      screenshot,
      isProposalRight,
      isProposalWrong,
      isGuessing,
    } = this.props;
    if (screenshot.isSolved) {
      return (
        <p>
          You have solved this screenshot on{' '}
          {screenshot.solvedAt.toDateString()}
        </p>
      );
    }
    if (screenshot.isOwn) {
      return (
        <p>
          You have uploaded this screenshot the{' '}
          {screenshot.createdAt.toDateString()}
        </p>
      );
    }
    return (
      <form className="ScreenshotPage__form" onSubmit={this.trySubmitHandler}>
        <div className="columns is-tablet">
          <div className="column" />
          <div className="column is-two-thirds">
            <div className="field has-addons">
              <div className="control is-expanded">
                <input
                  className={`input 
                  ${isProposalRight ? 'is-success' : ''}
                  ${isProposalWrong ? 'is-danger' : ''}
                `}
                  type="text"
                  placeholder="What is that game?"
                  value={this.state.proposal}
                  onChange={this.changeProposalHandler}
                />
              </div>
              <div className="control">
                {isProposalRight ? (
                  <button type="button" className="button is-success">
                    <span className="icon is-small is-right">
                      <i className="fas fa-check fa-xs is-success" />
                    </span>
                  </button>
                ) : (
                  <button
                    type="submit"
                    className={`button is-info ${
                      isGuessing ? 'is-loading' : ''
                    }`}
                    disabled={isGuessing}
                  >
                    Guess
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="column ScreenshotPage__form__next__container">
            <button
              type="button"
              className={`ScreenshotPage__form__next button is-light ${
                this.props.isTryAnotherButtonClicked ? 'is-loading' : ''
              }`}
              disabled={this.props.isTryAnotherButtonClicked}
              onClick={this.tryAnotherHandler}
            >
              Try another
            </button>
          </div>
        </div>
      </form>
    );
  }
}
export default connect(mapStoreToProps)(ScreenshotPage);
