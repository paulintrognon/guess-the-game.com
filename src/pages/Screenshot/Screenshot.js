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
    this.guessInputRef = React.createRef();

    if (props.match.params.id !== props.screenshot.id) {
      this.props.dispatch(
        screenshotActions.loadScreenshot(props.match.params.id)
      );
    }
  }

  handleChangeProposal = event => {
    this.props.dispatch(screenshotActions.resetGuess());
    this.setState({
      proposal: event.target.value,
    });
  };

  trySubmitHandler = event => {
    event.preventDefault();
    this.guessInputRef.current.focus();
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

  renderScreenshotBox = () => {
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
        {this.renderHeader()}
        <div className="ScreenshotPage_screenshot">
          <div
            className="ScreenshotPage_screenshot_image"
            style={{ backgroundImage: `url(${screenshot.url})` }}
          />
        </div>
        <div className="ScreenshotPage_footer">{this.renderFooter()}</div>
      </div>
    );
  };

  renderHeader = () => {
    const { screenshot, isProposalRight } = this.props;
    return (
      <div className="ScreenshotPage_header">
        <div className="ScreenshotPage_header_left">
          <h2
            className={`ScreenshotPage_header_title ${
              screenshot.isSolved || isProposalRight ? '-isSolved' : ''
            }`}
          >
            Shot #{screenshot.id}
          </h2>
          <h3 className="column ScreenshotPage_header_uploadedBy">
            Uploaded by <b>{screenshot.isOwn ? 'you!' : screenshot.username}</b>
          </h3>
        </div>
        <div className="ScreenshotPage_header_right">
          <p className="ScreenshotPage_header_solvedByCount">
            Solved by 42 people
          </p>
          <p className="ScreenshotPage_header_firstSolvedBy">
            1st solved by margot
          </p>
        </div>
      </div>
    );
  };

  renderScreenshot = () => {
    const { screenshot } = this.props;
    return (
      <div className="ScreenshotPage__screenshot__image__container">
        <img
          className="ScreenshotPage__screenshot__image"
          src={screenshot.url}
          alt={`Guess The Game Screenshot #${screenshot.id}`}
        />
      </div>
    );
  };

  renderFooter = () => {
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
      <form className="ScreenshotPage_form" onSubmit={this.trySubmitHandler}>
        <div
          className={`ScreenshotPage_form_input 
            ${isGuessing ? '-guessing' : ''}
            ${isProposalRight ? '-success' : ''}
            ${isProposalWrong ? '-error' : ''}
          `}
        >
          <input
            ref={this.guessInputRef}
            className="ScreenshotPage_form_input_text"
            type="text"
            placeholder="What is that game?"
            value={this.state.proposal}
            onChange={this.handleChangeProposal}
          />
          <button className="ScreenshotPage_form_input_valid" type="submit">
            {this.props.isGuessing ? (
              <Loading />
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z" />
              </svg>
            )}
          </button>
        </div>
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
      </form>
    );
  };

  render = () => (
    <section className="section">
      <div className="container">
        <div className="ScreenshotPage">{this.renderScreenshotBox()}</div>
      </div>
    </section>
  );
}
export default connect(mapStoreToProps)(ScreenshotPage);
