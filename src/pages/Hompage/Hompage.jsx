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
      this.setState({ lastScreenshot });
    });
  }

  playHandler = () => {
    this.props.dispatch(screenshotActions.getUnsolvedScreenshot());
  };

  render() {
    return (
      <section className="Homepage">
        <h1 className="Homepage_title">Welcome to Guess&nbsp;The&nbsp;Game</h1>
        <p className="Homepage_subtitle">
          Guess as many games as possible from screenshots posted by people
        </p>
        <p>
          <button className="Homepage_playButton" onClick={this.playHandler}>
            play!
          </button>
        </p>
        {this.state.lastScreenshot && (
          <Link
            to={`/shot/${this.state.lastScreenshot.id}`}
            className="Homepage_lastPostedScreenshot"
          >
            <h2 className="Homepage_lastPostedScreenshot_title">
              Last posted screenshot
            </h2>
            <p className="Homepage_lastPostedScreenshot_subtitle">
              {this.state.lastScreenshot.postedBy}
              {this.state.lastScreenshot.stats.firstSolvedBy
                ? `First solved by ${
                    this.state.lastScreenshot.stats.firstSolvedBy
                  }`
                : 'Be the first one to guess this screenshot!'}
            </p>
            <div className="Homepage_lastPostedScreenshot_shot_container">
              <div
                className="Homepage_lastPostedScreenshot_shot"
                style={{
                  backgroundImage: `url(${this.state.lastScreenshot.imageUrl})`,
                }}
              />
            </div>
          </Link>
        )}
      </section>
    );
  }
}
export default connect()(Homepage);
