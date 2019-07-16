import React from 'react';
import queryString from 'qs';
import { Link } from 'react-router-dom';
import Noty from 'noty';
import moderationService from '../../services/moderationService';
import helperService from '../../services/helperService';

class ScreenshotItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      approvalStatus: this.props.screenshot.approvalStatus,
    };
  }

  handleModeration = (screenshotId, newApprovalStatus) => async () => {
    await moderationService.moderate({ screenshotId, newApprovalStatus });
    this.setState({ approvalStatus: newApprovalStatus });
    new Noty({
      text:
        newApprovalStatus === 1
          ? 'Le screenshot a bien été approuvé.'
          : 'Le screenshot a bien été rejeté.',
      type: 'success',
    }).show();
  };

  render() {
    const {
      screenshot,
      canModerateScreenshots,
      canEditScreenshots,
    } = this.props;
    const { approvalStatus } = this.state;
    return (
      <div
        className="ScreenshotsGrid_item"
        to={`/screenshot/${screenshot.id}`}
        title={screenshot.name}
      >
        <Link to={`/screenshot/${screenshot.id}`}>
          <div
            style={{
              backgroundImage: `url(${screenshot.imageUrl})`,
            }}
            className="ScreenshotsGrid_item_image"
          />
        </Link>
        <div className="ScreenshotsGrid_item_legend">
          {canEditScreenshots ? (
            <div style={{ float: 'right' }}>
              <EditScreenshotLink screenshot={screenshot} />
            </div>
          ) : null}
          <p className="ScreenshotsGrid_item_legend_name">
            #{screenshot.id} - {screenshot.gameCanonicalName}{' '}
            {screenshot.year ? `(${screenshot.year})` : null}
          </p>
          {(screenshot.alternativeNames || []).map(name => (
            <p key={name}>
              ou{' '}
              <span className="ScreenshotsGrid_item_legend_alternativeName">
                {name}
              </span>
            </p>
          ))}
          {!canModerateScreenshots && screenshot.solvedAt ? (
            <p>Résolu le {helperService.formatDate(screenshot.solvedAt)}</p>
          ) : (
            <p>Ajouté le {helperService.formatDate(screenshot.createdAt)}</p>
          )}
          {canModerateScreenshots ? (
            <div className="ScreenshotsGrid_item_legend_moderate">
              <p className="ScreenshotsGrid_item_legend_moderate_verify">
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
              <ApprovalBox
                screenshot={screenshot}
                approvalStatus={approvalStatus}
                handleModeration={this.handleModeration}
              />
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}
export default ScreenshotItem;

function ApprovalBox({ screenshot, approvalStatus, handleModeration }) {
  if (approvalStatus === 1) {
    return (
      <p>
        <b>Le screen est approuvé.</b>
        <button
          className="ScreenshotsGrid_item_legend_moderate_button -reject"
          onClick={handleModeration(screenshot.id, -1)}
        >
          Rejeter
        </button>
        -
        <EditScreenshotLink screenshot={screenshot} />
      </p>
    );
  }
  if (approvalStatus === -1) {
    return (
      <p>
        <b>✖ Le screen est rejeté.</b>
        <button
          className="ScreenshotsGrid_item_legend_moderate_button -approve"
          onClick={handleModeration(screenshot.id, 1)}
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
        className="ScreenshotsGrid_item_legend_moderate_button -approve"
        onClick={handleModeration(screenshot.id, 1)}
      >
        <span>Approuver</span>
      </button>
      -
      <button
        className="ScreenshotsGrid_item_legend_moderate_button -reject"
        onClick={handleModeration(screenshot.id, -1)}
      >
        Rejeter
      </button>
      -
      <EditScreenshotLink screenshot={screenshot} />
    </p>
  );
}

function EditScreenshotLink({ screenshot }) {
  return (
    <a
      className="ScreenshotsGrid_item_legend_moderate_button"
      href={generateEditLink(screenshot)}
    >
      Modifier
    </a>
  );
}

function generateEditLink(screenshot) {
  return `/modifier/${screenshot.id}?${queryString.stringify({
    name: screenshot.gameCanonicalName,
    alternativeNames: screenshot.alternativeNames,
    year: screenshot.year || '',
    url: screenshot.imageUrl,
  })}`;
}
