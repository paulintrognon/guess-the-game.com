import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import screenshotActions from '../../store/screenshot/screenshotActions';
import helperService from '../../services/helperService';
import Loading from '../../components/Loading/Loading';
import ScreenshotRating from './ScreenshotRating';
import './screenshot.css';

function mapStoreToProps(store) {
  return {
    screenshot: store.screenshot,
    isUserLoggedIn: Boolean(store.user.username),
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

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
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

  handleKeyDown = e => {
    const isGuessingElementFocused =
      document.activeElement === this.guessInputRef.current;

    if (isGuessingElementFocused) {
      if (e.key === 'Escape') {
        this.guessInputRef.current.blur();
      }
      return;
    }

    if (e.key === 'j') {
      e.preventDefault();
      this.handleTryAnother();
    } else if (e.key === 'k') {
      e.preventDefault();
      window.history.back();
    } else if (e.key === 'Enter') {
      this.guessInputRef.current.focus();
    }
  };

  handleProposalChange = event => {
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
      screenshotActions.tryProposal(this.props.screenshot, this.state.proposal)
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
    if (!window.confirm('Êtes vous sûr de vouloir supprimer ce screenshot ?')) {
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
              RESOLU !
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
        <div
          className={
            screenshot.approvalStatus === 'approved'
              ? 'ScreenshotPage_header_left'
              : ''
          }
        >
          <h1
            className={`ScreenshotPage_header_title ${
              screenshot.isSolved || isProposalRight ? '-isSolved' : ''
            }`}
          >
            {screenshot.prevScreenshotId ? (
              <Link
                to={`/screenshot/${screenshot.prevScreenshotId}`}
                className="ScreenshotPage_prevNext_link -prev"
              >
                ‹
              </Link>
            ) : (
              <span className="ScreenshotPage_prevNext_link -prev -disabled">
                ‹
              </span>
            )}
            #{screenshot.id}
            {screenshot.nextScreenshotId ? (
              <Link
                to={`/screenshot/${screenshot.nextScreenshotId}`}
                className="ScreenshotPage_prevNext_link -next"
              >
                ›
              </Link>
            ) : (
              <span className="ScreenshotPage_prevNext_link -next -disabled">
                ›
              </span>
            )}{' '}
            <ApprovalStatus approvalStatus={screenshot.approvalStatus} />
          </h1>
          <div className="ScreenshotPage_header_uploadedBy">
            Par <b>{screenshot.isOwn ? 'vous !' : screenshot.addedBy}</b>
            {screenshot.isOwn && screenshot.approvalStatus !== 'approved' ? (
              <button
                className="ScreenshotPage_header_removeScreenshotLink"
                onClick={this.handleRemoveOwn}
              >
                ✖ Supprimer
                <span className="ScreenshotPage_header_removeScreenshotLink_hideMobile">
                  {' '}
                  le screen
                </span>
              </button>
            ) : null}
          </div>
        </div>
        {screenshot.approvalStatus === 'approved' && (
          <div className="ScreenshotPage_header_right">
            {screenshot.stats.solvedCount ? (
              <p className="ScreenshotPage_header_solvedByCount">
                Résolu par {screenshot.stats.solvedCount} personne
                {screenshot.stats.solvedCount >= 2 ? 's' : null}
              </p>
            ) : null}
            <p className="ScreenshotPage_header_firstSolvedBy">
              {screenshot.stats.firstSolvedBy ? (
                <span>
                  Premier·ère à trouver :{' '}
                  <b>{screenshot.stats.firstSolvedBy}</b>
                </span>
              ) : (
                "Personne n'a trouvé!"
              )}
            </p>
          </div>
        )}
      </div>
    );
  };

  renderFooter = () => {
    const {
      screenshot,
      isUserLoggedIn,
      isProposalRight,
      isProposalWrong,
      isGuessing,
      error,
    } = this.props;
    return (
      <div>
        <ScreenshotRating screenshot={screenshot} canRate={isUserLoggedIn} />
        <form className="ScreenshotPage_form" onSubmit={this.trySubmitHandler}>
          <div className="ScreenshotPage_form_col -left">
            {window.history ? (
              <button
                type="button"
                className="ScreenshotPage_form_prev -hideOnSmartphones"
                onClick={() => window.history.back()}
              >
                &lt; Retour
              </button>
            ) : null}
          </div>
          <div className="ScreenshotPage_form_col">
            {screenshot.isSolved ? (
              <p>
                Vous avez résolu ce screen le{' '}
                {helperService.formatDate(screenshot.solvedAt)}
              </p>
            ) : null}
            {screenshot.isOwn ? (
              <p>
                Vous avez ajouté ce screen le{' '}
                {helperService.formatDate(screenshot.createdAt)}
              </p>
            ) : null}
            {screenshot.approvalStatus === 'waiting' ? (
              <p>
                Ce screen est <b>en attente de validation</b>.
              </p>
            ) : null}
            {screenshot.approvalStatus === 'refused' ? (
              <p>
                Ce screen a été <b>rejeté</b> par les modérateurs.
              </p>
            ) : null}
            {!error &&
            !screenshot.isSolved &&
            !screenshot.isOwn &&
            screenshot.approvalStatus === 'approved' ? (
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
                  placeholder="Quel est ce jeu ?"
                  value={this.state.proposal}
                  onChange={this.handleProposalChange}
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
          <p className="ScreenshotPage_form_or -onlyOnSmartphones">ou</p>
          <div className="ScreenshotPage_form_col -right">
            <button
              type="button"
              className={`ScreenshotPage_form_next ${
                this.props.isTryAnotherButtonClicked ? '-isLoading' : ''
              }`}
              disabled={this.props.isTryAnotherButtonClicked}
              onClick={this.handleTryAnother}
            >
              Une autre&nbsp;!
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
      </div>
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
  if (approvalStatus === 'waiting') {
    return (
      <span className="Screenshot_ApprovalStatus -awaiting">
        {' '}
        - En attente<span className="-hideOnSmartphones"> de validation</span>
      </span>
    );
  }
  if (approvalStatus === 'refused') {
    return (
      <span className="Screenshot_ApprovalStatus -rejected"> - Rejete</span>
    );
  }
  return null;
}
