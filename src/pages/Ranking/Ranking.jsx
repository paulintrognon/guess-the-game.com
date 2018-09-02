import React from 'react';
import { connect } from 'react-redux';
import Loading from '../../components/Loading/Loading';
import userService from '../../services/userService';
import screenshotActions from '../../actions/screenshotActions';
import './Ranking.css';

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

  renderScores() {
    const { scores } = this.state;
    const { user } = this.props;

    if (this.state.isLoading) {
      return <Loading />;
    }

    return (
      <div className="RankingPage_ranking">
        <div className="RankingPage_ranking_row">
          <div className="RankingPage_ranking_col -name" />
          <div className="RankingPage_ranking_col -solved">Solved</div>
          <div className="RankingPage_ranking_col -posted">Posted</div>
        </div>
        {scores.map((score, i) => (
          <div className="RankingPage_ranking_row">
            <div className="RankingPage_ranking_col -name">
              <span className="RankingPage_ranking_nb">#{i + 6}</span>{' '}
              <span className="RankingPage_ranking_username">
                {score.username}
              </span>
            </div>
            <div className="RankingPage_ranking_col -solved">
              {score.screenshotsFound}
            </div>
            <div className="RankingPage_ranking_col -posted">
              {score.screenshotsAdded}
            </div>
          </div>
        ))}
      </div>
    );
  }

  render() {
    return <section className="RankingPage">{this.renderScores()}</section>;
  }
}
export default connect(mapStoreToProps)(Homepage);
