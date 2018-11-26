import React from 'react';
import queryString from 'qs';
import { Link } from 'react-router-dom';
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
  };

  render() {
    const { screenshot, canModerateScreenshots } = this.props;
    const { approvalStatus } = this.state;
    return (
      <div
        className="ScreenshotsGrid_item"
        to={`/screen/${screenshot.id}`}
        title={screenshot.name}
      >
        <Link to={`/screen/${screenshot.id}`}>
          <div
            style={{
              backgroundImage: `url(${screenshot.imageUrl})`,
            }}
            className="ScreenshotsGrid_item_image"
          />
        </Link>
        <div className="ScreenshotsGrid_item_legend">
          <p className="ScreenshotsGrid_item_legend_name">
            {screenshot.gameCanonicalName}{' '}
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
            <div className="ScreenshotsGrid_item_legend_approve">
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
          className="ScreenshotsGrid_item_legend_approve_button -reject"
          onClick={handleModeration(screenshot.id, -1)}
        >
          <span>Désapprouver</span>
        </button>
        -
        <EditScreenshotLink screenshot={screenshot} />
      </p>
    );
  }
  if (approvalStatus === -1) {
    return (
      <p>
        <b>✖ Le screen est désapprouvé.</b>
        <button
          className="ScreenshotsGrid_item_legend_approve_button -approve"
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
        className="ScreenshotsGrid_item_legend_approve_button -approve"
        onClick={handleModeration(screenshot.id, 1)}
      >
        <span>Approuver</span>
      </button>
      -
      <button
        className="ScreenshotsGrid_item_legend_approve_button -reject"
        onClick={handleModeration(screenshot.id, -1)}
      >
        <span>Désapprouver</span>
      </button>
      -
      <EditScreenshotLink screenshot={screenshot} />
    </p>
  );
}

function EditScreenshotLink({ screenshot }) {
  return (
    <a
      className="ScreenshotsGrid_item_legend_approve_button"
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
