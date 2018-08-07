import React from 'react';
import { connect } from 'react-redux';
import Loading from '../../components/Loading/Loading';
import userService from '../../services/userService';
import screenshotActions from '../../actions/screenshotActions';

function mapStoreToProps(store) {
  return {
    user: store.user,
  };
}
class Homepage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      scores: [],
    };
    userService.fetchScores().then(scores => {
      this.setState({ scores, isLoading: false });
    });
  }

  playHandler = () => {
    this.props.dispatch(screenshotActions.getUnsolvedScreenshot());
  };

  renderScores() {
    const { scores } = this.state;
    const { user } = this.props;

    if (this.state.isLoading) {
      return (
        <div style={{ textAlign: 'center' }}>
          <Loading />
        </div>
      );
    }

    return [
      <h2 className="title is-5">Players Ranking</h2>,
      <table className="table is-fullwidth is-striped is-hoverable">
        <thead>
          <tr>
            <th>
              Pos<span className="is-hidden-mobile">ition</span>
            </th>
            <th>Username</th>
            <th>
              <span className="is-hidden-mobile">Screenshots</span> Resolved
            </th>
          </tr>
        </thead>
        <tbody>
          {scores.map((score, i) => (
            <tr
              style={{
                fontWeight: score.username === user.username ? 'bold' : '',
              }}
            >
              <th>{i + 1}</th>
              <td>{score.username}</td>
              <td>{score.screenshotsFound}</td>
            </tr>
          ))}
        </tbody>
      </table>,
    ];
  }

  render() {
    return (
      <section className="section">
        <div className="container">
          <div className="content" style={{ textAlign: 'center' }}>
            <p>
              Welcome to Guess the Game, where you try to guess as many games as
              possible!
            </p>
            <p>
              <button
                type="button"
                className="button is-medium is-primary"
                onClick={this.playHandler}
              >
                Start playing!
              </button>
            </p>
          </div>
          <div className="Homepage_ranking">{this.renderScores()}</div>
        </div>
      </section>
    );
  }
}
export default connect(mapStoreToProps)(Homepage);
