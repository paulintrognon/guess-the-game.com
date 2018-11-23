import React from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import screenshotActions from '../../actions/screenshotActions';
import Loading from '../../components/Loading/Loading';
import './screenshot.css';

function mapStoreToProps(store) {
  return {
    screenshot: store.screenshot,
    isTryAnotherButtonClicked: store.screenshot.isTryAnotherButtonClicked,
    allSolved: store.screenshot.allSolved,
    isGuessing: store.screenshot.isGuessing,
    isLoading: store.screenshot.isLoading,
    isProposalRight: store.screenshot.isProposalRight,
    isProposalWrong: store.screenshot.isProposalWrong,
    error: store.screenshot.error,
    lastViewedRandomScreenshots: store.user.lastViewedRandomScreenshots,
  };
}
class ScreenshotPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      proposal: '',
    };
    this.guessInputRef = React.createRef();
    this.touch = null;

    if (Number(props.match.params.id) !== props.screenshot.id) {
      this.props.dispatch(
        screenshotActions.loadScreenshot(props.match.params.id)
      );
    }
  }

  componentDidUpdate() {
    if (this.props.isLoading) {
      return;
    }
    if (
      !this.props.error &&
      Number(this.props.match.params.id) !== this.props.screenshot.id
    ) {
      this.props.dispatch(
        screenshotActions.loadScreenshot(this.props.match.params.id)
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

  handleTryAnother = () => {
    this.setState({ proposal: '' });
    this.props.dispatch(
      screenshotActions.getUnsolvedScreenshot(
        this.props.lastViewedRandomScreenshots
      )
    );
  };

  handleRemoveOwn = () => {
    if (!window.confirm('Are you sure to remove this screenshot?')) {
      return;
    }
    const { screenshot } = this.props;
    this.props.dispatch(screenshotActions.removeOwnScreenshot(screenshot.id));
  };

  renderScreenshotBox = () => {
    const {
      screenshot,
      isTryAnotherButtonClicked,
      isProposalRight,
    } = this.props;
    const isLoading = screenshot.isLoading || isTryAnotherButtonClicked;
    return (
      <div>
        {this.renderHeader()}
        <div
          className={`ScreenshotPage_screenshot ${
            screenshot.isSolved || isProposalRight ? '-success' : ''
          }`}
        >
          <div
            className="ScreenshotPage_screenshot_image"
            style={{
              backgroundImage: isLoading ? '' : `url(${screenshot.url})`,
            }}
          />
          <div className="ScreenshotPage_screenshot_success_banner">
            <p className="ScreenshotPage_screenshot_success_banner_text">
              SOLVED
            </p>
            <p className="ScreenshotPage_screenshot_success_banner_gameName">
              {screenshot.name}
              {screenshot.year ? ` (${screenshot.year})` : null}
            </p>
          </div>
        </div>
        <div className="ScreenshotPage_footer">{this.renderFooter()}</div>
      </div>
    );
  };

  renderHeader = () => {
    const { screenshot, isProposalRight, error } = this.props;
    if (error) {
      return (
        <div className="ScreenshotPage_header">
          <p className="ScreenshotPage_header_error">{error}</p>
        </div>
      );
    }
    return (
      <div className="ScreenshotPage_header">
        <div className="ScreenshotPage_header_left">
          <h1
            className={`ScreenshotPage_header_title ${
              screenshot.isSolved || isProposalRight ? '-isSolved' : ''
            }`}
          >
            Shot #{screenshot.id}{' '}
            <ApprovalStatus approvalStatus={screenshot.approvalStatus} />
          </h1>
          <div className="column ScreenshotPage_header_uploadedBy">
            By <b>{screenshot.isOwn ? 'you! — ' : screenshot.addedBy}</b>
            {screenshot.isOwn ? (
              <button
                className="ScreenshotPage_header_removeScreenshotLink"
                onClick={this.handleRemoveOwn}
              >
                ✖ Remove
                <span className="ScreenshotPage_header_removeScreenshotLink_hideMobile">
                  {' '}
                  this shot
                </span>
              </button>
            ) : null}
          </div>
        </div>
        <div className="ScreenshotPage_header_right">
          {screenshot.stats.solvedCount ? (
            <p className="ScreenshotPage_header_solvedByCount">
              Solved by {screenshot.stats.solvedCount} people
            </p>
          ) : null}
          <p className="ScreenshotPage_header_firstSolvedBy">
            {screenshot.stats.firstSolvedBy
              ? `First solved by ${screenshot.stats.firstSolvedBy}`
              : 'Be the first one to guess this screenshot!'}
          </p>
        </div>
      </div>
    );
  };

  renderFooter = () => {
    const {
      screenshot,
      isProposalRight,
      isProposalWrong,
      isGuessing,
      error,
    } = this.props;
    return (
      <form className="ScreenshotPage_form" onSubmit={this.trySubmitHandler}>
        <div className="ScreenshotPage_form_col" />
        <div className="ScreenshotPage_form_col">
          {screenshot.isSolved ? (
            <p>
              You have solved this screenshot on{' '}
              {screenshot.solvedAt.toDateString()}
            </p>
          ) : null}
          {screenshot.isOwn ? (
            <p>
              You have uploaded this screenshot the{' '}
              {screenshot.createdAt.toDateString()}
            </p>
          ) : null}
          {screenshot.approvalStatus === 0 ? (
            <p>
              This shot is <b>awaiting approval</b> from moderators.
            </p>
          ) : null}
          {screenshot.approvalStatus === -1 ? (
            <p>
              This shot has been <b>rejected</b> by the moderators.
            </p>
          ) : null}
          {!error &&
          !screenshot.isSolved &&
          !screenshot.isOwn &&
          screenshot.approvalStatus === 1 ? (
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
              <button
                className="ScreenshotPage_form_input_valid"
                type="submit"
                disabled={isGuessing}
              >
                {isGuessing ? (
                  <Loading />
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24">
                    <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z" />
                  </svg>
                )}
              </button>
            </div>
          ) : null}
        </div>
        <p className="ScreenshotPage_form_or -showOnlyOnSmartphones">or</p>
        <div className="ScreenshotPage_form_col -col3">
          <button
            type="button"
            className={`ScreenshotPage_form_next ${
              this.props.isTryAnotherButtonClicked ? '-isLoading' : ''
            }`}
            disabled={this.props.isTryAnotherButtonClicked}
            onClick={this.handleTryAnother}
          >
            Try another
            <span className="ScreenshotPage_form_next_icon">
              <img
                className="ScreenshotPage_form_next_icon-1"
                src="/icons/random-1.svg"
                alt="next"
              />
              <img
                className="ScreenshotPage_form_next_icon-2"
                src="/icons/random-2.svg"
                alt="screenshot"
              />
            </span>
          </button>
        </div>
      </form>
    );
  };

  render = () => (
    <section>
      <Helmet title={`Shot #${this.props.screenshot.id}`} />
      <div className="ScreenshotPage">{this.renderScreenshotBox()}</div>
    </section>
  );
}
export default connect(mapStoreToProps)(ScreenshotPage);

function ApprovalStatus({ approvalStatus }) {
  if (approvalStatus === 0) {
    return (
      <span className="Screenshot_ApprovalStatus -awaiting">
        {' '}
        - Awaiting Approval
      </span>
    );
  }
  if (approvalStatus === -1) {
    return (
      <span className="Screenshot_ApprovalStatus -rejected"> - Rejected</span>
    );
  }
  return null;
}
