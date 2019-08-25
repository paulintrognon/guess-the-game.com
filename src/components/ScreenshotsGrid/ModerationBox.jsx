import React from 'react';
import EditScreenshotLink from './EditScreenshotLink';
import moderationService from '../../services/moderationService';
import notificationService from '../../services/notificationService';
import './ModerationBox.css';

export default class ApprovalBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      approvalStatus: this.props.screenshot.approvalStatus,
      refusalReason: 'other',
      showRefusalReasons: false,
    };
  }

  handleRefusalReasonChange = e => {
    this.setState({ refusalReason: e.target.value });
  };

  handleRefuse = () => {
    this.setState({
      showRefusalReasons: true,
    });
  };

  handleAccept = () => {
    this.handleModeration(this.props.screenshot.id, 'approved')();
  };

  handleModeration = (screenshotId, newApprovalStatus) => async () => {
    await moderationService.moderate({
      screenshotId,
      newApprovalStatus,
      refusalReason: this.state.refusalReason,
    });
    this.setState({ approvalStatus: newApprovalStatus });
    notificationService.create({
      slug: 'moderationBox-moderationAction',
      text:
        newApprovalStatus === 'approved'
          ? 'Le screenshot a bien été approuvé.'
          : 'Le screenshot a bien été rejeté.',
      type: 'success',
    });
    this.setState({
      showRefusalReasons: false,
    });
  };

  render() {
    const { screenshot } = this.props;
    const { approvalStatus, refusalReason, showRefusalReasons } = this.state;
    return (
      <div className="ModerationBox">
        <p className="ModerationBox_verify">
          <a
            href={`http://www.jeuxvideo.com/recherche.php?m=9&q=${screenshot.gameCanonicalName}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Vérifier sur jv.com
          </a>{' '}
          -{' '}
          <a
            href={`https://www.google.com/searchbyimage?image_url=${screenshot.imageUrl}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Vérifier sur google
          </a>
        </p>
        <ApprovalLinks
          screenshot={screenshot}
          approvalStatus={approvalStatus}
          handleRefuse={this.handleRefuse}
          handleAccept={this.handleAccept}
        />
        {showRefusalReasons && (
          <div className="ModerationBox_refusalReasons">
            <select
              value={refusalReason}
              onChange={this.handleRefusalReasonChange}
            >
              <option value="existsInGoogleImage">Existe dans GoogleImg</option>
              <option value="badQuality">Qualité mauvaise</option>
              <option value="gameNotFamousEnough">Jeu pas connu</option>
              <option value="alreadySubmitted">Déjà soumise</option>
              <option value="spam">Spam</option>
              <option value="notAGame">Pas un jeu</option>
              <option value="tooMuchOfThisGame">Jeu déjà trop présent</option>
              <option value="other">Autre</option>
            </select>
            <button
              className="ModerationBox_refusalReasons_btn"
              type="button"
              onClick={this.handleModeration(screenshot.id, 'refused')}
            >
              Valider
            </button>
          </div>
        )}
      </div>
    );
  }
}

function ApprovalLinks({
  screenshot,
  approvalStatus,
  handleAccept,
  handleRefuse,
}) {
  if (approvalStatus === 'approved') {
    return (
      <p>
        <b>Le screen est approuvé.</b>
        <button
          className="ModerationBox_actionLink -reject"
          onClick={handleRefuse}
        >
          Rejeter
        </button>
        -
        <EditScreenshotLink screenshot={screenshot} />
      </p>
    );
  }
  if (approvalStatus === 'refused') {
    return (
      <p>
        <b>✖ Le screen est rejeté ({screenshot.refusalReason}).</b>
        <button
          className="ModerationBox_actionLink -approve"
          onClick={handleAccept}
        >
          <span>Approuver</span>
        </button>
        -
        <EditScreenshotLink screenshot={screenshot} />
      </p>
    );
  }
  return (
    <p>
      <button
        className="ModerationBox_actionLink -approve"
        onClick={handleAccept}
      >
        <span>Approuver</span>
      </button>
      -
      <button
        onClick={handleRefuse}
        className="ModerationBox_actionLink -reject"
      >
        Rejeter
      </button>
      - <EditScreenshotLink screenshot={screenshot} />
    </p>
  );
}
