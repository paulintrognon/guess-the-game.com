import React from 'react';
import { connect } from 'react-redux';
import screenshotActions from '../../actions/screenshotActions';
import './Homepage.css';

class Homepage extends React.Component {
  playHandler = () => {
    this.props.dispatch(screenshotActions.getUnsolvedScreenshot());
  };

  render() {
    return (
      <section className="Homepage">
        <h1 className="Homepage_title">Welcome to Guess&nbsp;The&nbsp;Game</h1>
        <p className="Homepage_subtitle">
          Guess as many games as possible from screenshots posted by people like
          you
        </p>
        <p>
          <button className="Homepage_playButton" onClick={this.playHandler}>
            play!
          </button>
        </p>
      </section>
    );
  }
}
export default connect()(Homepage);
