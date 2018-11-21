import React from 'react';
import { Link } from 'react-router-dom';
import screenshotService from '../../services/screenshotService';

class ScreenshotItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      approvementStatus: null,
    };
  }

  handleModeration = (screenshotId, approve) => async () => {
    await screenshotService.moderate({ screenshotId, approve });
    this.setState({ approvementStatus: approve });
  };

  handleCancel = () => {
    this.setState({ approvementStatus: null });
  };

  render() {
    const { screenshot } = this.props;
    const { approvementStatus } = this.state;
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
            {screenshot.name} {screenshot.year ? `(${screenshot.year})` : null}
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
          {screenshot.awaitingApproval ? (
            <div className="ScreenshotsGrid_item_legend_approve">
              {approvementStatus === null ? (
                <p>
                  <button
                    className="ScreenshotsGrid_item_legend_approve_button -approve"
                    onClick={this.handleModeration(screenshot.id, true)}
                  >
                    <span>Approve</span>
                  </button>
                  -
                  <button
                    className="ScreenshotsGrid_item_legend_approve_button -reject"
                    onClick={this.handleModeration(screenshot.id, false)}
                  >
                    <span>Reject</span>
                  </button>
                </p>
              ) : (
                <p>
                  Screenshot{' '}
                  <b>{approvementStatus ? 'approved' : 'rejected'}</b>&nbsp;! -{' '}
                  <button onClick={this.handleCancel}>Undo</button>
                </p>
              )}
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}
export default ScreenshotItem;
