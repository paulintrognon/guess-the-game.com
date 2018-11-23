import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import screenshotActions from '../../actions/screenshotActions';
import screenshotService from '../../services/screenshotService';
import './Homepage.css';

class Homepage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lastScreenshot: null,
    };
    screenshotService.getLast().then(lastScreenshot => {
      if (!lastScreenshot.error) {
        this.setState({ lastScreenshot });
      }
    });
  }

  playHandler = () => {
    this.props.dispatch(screenshotActions.getUnsolvedScreenshot());
  };

  render() {
    return (
      <section className="Homepage">
        <p className="Homepage_subtitle">
          Guess as many games as possible from screenshots added by people
        </p>
        <p>
          <button className="Homepage_playButton" onClick={this.playHandler}>
            play!
          </button>
        </p>
        {this.state.lastScreenshot && (
          <div className="Homepage_lastAddedScreenshot">
            <h2 className="Homepage_lastAddedScreenshot_title">
              Last added screenshot
            </h2>
            <p className="Homepage_lastAddedScreenshot_subtitle">
              Uploaded by <b>{this.state.lastScreenshot.addedBy}</b> -{` `}
              {this.state.lastScreenshot.stats.firstSolvedBy ? (
                <span>
                  First solved by{' '}
                  <b>{this.state.lastScreenshot.stats.firstSolvedBy}</b>
                </span>
              ) : (
                'Be the first one to guess this screenshot!'
              )}
            </p>
            <div className="Homepage_lastAddedScreenshot_shot_container">
              <Link to={`/shot/${this.state.lastScreenshot.id}`}>
                <div
                  className="Homepage_lastAddedScreenshot_shot"
                  style={{
                    backgroundImage: `url(${
                      this.state.lastScreenshot.imageUrl
                    })`,
                  }}
                />
              </Link>
            </div>
          </div>
        )}
      </section>
    );
  }
}
export default connect()(Homepage);
