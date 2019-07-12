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
      return (
        <p style={{ textAlign: 'center' }}>
          <Loading />
        </p>
      );
    }

    return (
      <div className="RankingPage_ranking">
        <p className="RankingPage_ranking_total">
          Nombre total de screenshots: <b>{totalNbScreenshots}</b>
        </p>
        <p className="-hideOnSmartphones">
          Le score est la somme du nombre de screenshots trouvés et du nombre de
          screenshots ajoutés. Ainsi, pour monter dans le classement, en plus de
          trouver des screenshots, vous pouvez aussi en soumettre de nouveaux.
        </p>
        <div className="RankingPage_ranking_row">
          <div className="RankingPage_ranking_col -name" />
          <div
            className="RankingPage_ranking_col -centered"
            title="Calcul = (nb screenshots résolus + nb screenshots ajoutés)"
          >
            Score
          </div>
          <div className="RankingPage_ranking_col -centered">Rés. / Ajo.</div>
          <div
            className="RankingPage_ranking_col -centered -hideOnSmartphones"
            title="Calcul = (nb screenshots résolus + nb screenshots ajoutés) / nb total"
          >
            <span className="-onlyOnSmartphones">Prog</span>
            <span className="-hideOnSmartphones">Progression</span>
          </div>
          <div className="RankingPage_ranking_col -centered -hideOnSmartphones -hideOnTablets">
            Note des ajouts
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
              <span
                className="RankingPage_ranking_username"
                title={score.username}
              >
                {score.username}
              </span>
            </div>
            <div
              className="RankingPage_ranking_col -centered"
              title={`${score.score} = ${score.nbSolvedScreenshots} + ${score.nbAddedScreenshots}`}
            >
              {score.score}
            </div>
            <div className="RankingPage_ranking_col -centered">
              {score.nbSolvedScreenshots} / {score.nbAddedScreenshots}
            </div>
            <div
              className="RankingPage_ranking_col -centered -hideOnSmartphones"
              title={`${(score.completeness * 100).toFixed(2)} = ${
                score.score
              } / ${totalNbScreenshots} x 100`}
            >
              {(score.completeness * 100).toFixed(2)} %
            </div>
            <div
              className="RankingPage_ranking_col -centered -hideOnSmartphones -hideOnTablets"
              title={
                score.nbRatedScreenshots >= 3
                  ? `${score.averageUploadScore.toFixed(
                      2
                    )} est la note moyenne de ${
                      score.nbRatedScreenshots
                    } screenshots notés.`
                  : 'Il faut avoir au moins 3 screenshots notés pour apparaître dans les scores.'
              }
            >
              {score.nbRatedScreenshots >= 3
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
        <Helmet title="Classement des joueurs">
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
