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
          Testez votre connaissance des jeux vidéos en trouvant le plus de jeux
          possibles à partir de screenshots postées par d&apos;autres
          joueurs&nbsp;!
        </p>
        <p>
          <button className="Homepage_playButton" onClick={this.playHandler}>
            C&apos;est parti&nbsp;!
          </button>
        </p>
        {this.state.lastScreenshot && (
          <div className="Homepage_lastAddedScreenshot">
            <h2 className="Homepage_lastAddedScreenshot_title">
              Dernier screenshot ajouté
            </h2>
            <p className="Homepage_lastAddedScreenshot_subtitle">
              Ajouté par <b>{this.state.lastScreenshot.addedBy}</b> -{` `}
              {this.state.lastScreenshot.stats.firstSolvedBy ? (
                <span>
                  Premier·ère à trouver&nbsp;:
                  <b> {this.state.lastScreenshot.stats.firstSolvedBy}</b>
                </span>
              ) : (
                'Soyez le premier ou la première à trouver !'
              )}
            </p>
            <div className="Homepage_lastAddedScreenshot_shot_container">
              <Link to={`/screenshot/${this.state.lastScreenshot.id}`}>
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
