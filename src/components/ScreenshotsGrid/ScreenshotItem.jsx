import React from 'react';
import { Link } from 'react-router-dom';
import moderationService from '../../services/moderationService';

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
        to={`/shot/${screenshot.id}`}
        title={screenshot.name}
      >
        <Link to={`/shot/${screenshot.id}`}>
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
          {screenshot.solvedAt ? (
            <p>
              Solved the {screenshot.solvedAt.toLocaleDateString()} at{' '}
              {screenshot.solvedAt.toLocaleTimeString()}
            </p>
          ) : (
            <p>
              Added the {screenshot.createdAt.toLocaleDateString()} at{' '}
              {screenshot.createdAt.toLocaleTimeString()}
            </p>
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
        <b>Screenshot is approved.</b>
        <button
          className="ScreenshotsGrid_item_legend_approve_button -reject"
          onClick={handleModeration(screenshot.id, -1)}
        >
          <span>Reject</span>
        </button>
      </p>
    );
  }
  if (approvalStatus === -1) {
    return (
      <p>
        <b>Screenshot is rejected.</b>
        <button
          className="ScreenshotsGrid_item_legend_approve_button -approve"
          onClick={handleModeration(screenshot.id, 1)}
        >
          <span>Approve</span>
        </button>
      </p>
    );
  }
  return (
    <p>
      <button
        className="ScreenshotsGrid_item_legend_approve_button -approve"
        onClick={handleModeration(screenshot.id, 1)}
      >
        <span>Approve</span>
      </button>
      -
      <button
        className="ScreenshotsGrid_item_legend_approve_button -reject"
        onClick={handleModeration(screenshot.id, -1)}
      >
        <span>Reject</span>
      </button>
    </p>
  );
}
