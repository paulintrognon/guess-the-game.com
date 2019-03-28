import React from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import Loading from '../../components/Loading/Loading';
import userService from '../../services/userService';
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
      totalNbScreenshots: 0,
    };
    userService.fetchScores().then(res => {
      this.setState({
        scores: res.scores,
        totalNbScreenshots: res.totalNbScreenshots,
        isLoading: false,
      });
    });
  }

  renderScores() {
    const { scores, totalNbScreenshots } = this.state;

    if (this.state.isLoading) {
      return <Loading />;
    }

    return (
      <div className="RankingPage_ranking">
        <p className="RankingPage_ranking_total">
          Nombre total de screenshots: <b>{totalNbScreenshots}</b>
        </p>
        <div className="RankingPage_ranking_row">
          <div className="RankingPage_ranking_col -name" />
          <div className="RankingPage_ranking_col -centered">
            <span className="-onlyOnSmartphones">Prog</span>
            <span className="-hideOnSmartphones">Progression</span>
          </div>
          <div className="RankingPage_ranking_col -centered">Résolus</div>
          <div className="RankingPage_ranking_col -centered -hideOnSmartphones">
            Ajoutés
          </div>
          <div className="RankingPage_ranking_col -centered -hideOnSmartphones">
            Score des ajouts
          </div>
        </div>
        {scores.map((score, i) => (
          <div className="RankingPage_ranking_row" key={`rank-${i}`}>
            <div className="RankingPage_ranking_col -name">
              <span className="RankingPage_ranking_nb">
                {i + 1}
                <span className="RankingPage_ranking_nb_suffix">
                  {rankToText(i)}
                </span>
              </span>{' '}
              <span className="RankingPage_ranking_username">
                {score.username}
              </span>
            </div>
            <div
              className="RankingPage_ranking_col -centered"
              title={`= ${
                score.nbSolvedScreenshots
              } résolus / (${totalNbScreenshots} total - ${
                score.nbAddedScreenshots
              } ajoutés)`}
            >
              {(score.completeness * 100).toFixed(2)}&nbsp;%
            </div>
            <div className="RankingPage_ranking_col -centered">
              {score.nbSolvedScreenshots}
            </div>
            <div className="RankingPage_ranking_col -centered -hideOnSmartphones">
              {score.nbAddedScreenshots}
            </div>
            <div className="RankingPage_ranking_col -centered -hideOnSmartphones">
              {score.averageUploadScore
                ? score.averageUploadScore.toFixed(2)
                : 0}
            </div>
          </div>
        ))}
      </div>
    );
  }

  render() {
    return (
      <section className="RankingPage">
        <Helmet title="Ranking">
          <meta
            name="description"
            content="Ranking of all players. View the best gamers who solved the most screenshots!"
          />
        </Helmet>
        {this.renderScores()}
      </section>
    );
  }
}
export default connect(mapStoreToProps)(Homepage);

function rankToText(rank) {
  if (rank === 0) {
    return 'er';
  }
  return 'ème';
}
