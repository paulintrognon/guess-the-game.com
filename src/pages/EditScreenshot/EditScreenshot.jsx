import React from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import queryString from 'qs';
import { apiUrl } from 'config';
import { ReCaptcha } from 'react-recaptcha-google';
import screenshotService from '../../services/screenshotService';
import screenshotActions from '../../actions/screenshotActions';
import loginActions from '../../actions/loginActions';
import Input from '../../components/Form/Input/Input';
import Button from '../../components/Form/Button/Button';
import SmallContainer from '../../components/SmallContainer/SmallContainer';
import Loading from '../../components/Loading/Loading';
import './EditScreenshot.css';

function mapStoreToProps(store) {
  return {
    user: store.user,
  };
}
class EditScreenshotPage extends React.Component {
  constructor(props) {
    super(props);
    const params = queryString.parse(this.props.location.search, {
      ignoreQueryPrefix: true,
    });
    let alternativeNames = ['', '', ''];
    if (params.alternativeNames) {
      if (params.alternativeNames.map) {
        alternativeNames = params.alternativeNames;
      } else {
        alternativeNames = [params.alternativeNames];
      }
    }
    this.state = {
      submitting: false,
      error: null,

      // File upload
      isFileHover: false,
      isFileUploading: false,
      fileError: null,
      uploadedImageUrl: params.url,
      uploadedImageName: null,

      // Fields values
      file: null,
      name: params.name || '',
      alternativeNames,
      year: params.year || '',
      recaptchaToken: null,
    };
    this.screenshotImageUploadInput = React.createRef();
  }

  componentDidMount = () => {
    if (!this.props.match.params.id && this.recaptchaElement) {
      this.recaptchaElement.reset();
    }
  };

  onLoadRecaptcha = () => {
    if (!this.props.match.params.id && this.recaptchaElement) {
      this.recaptchaElement.reset();
    }
  };

  onRecaptchaTokenRetrieved = recaptchaToken => {
    this.setState({ recaptchaToken });
  };

  onRecaptchaExpired = () => {
    this.setState({ recaptchaToken: null });
  };

  uploadScreenshotImage = file => {
    if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
      this.setState({ fileError: 'Image needs to be a png or a jpg / jpeg' });
      return;
    }
    if (file.size > 5000000) {
      this.setState({ fileError: 'File size limit is 5 Mo.' });
      return;
    }

    this.setState({
      file,
      isFileHover: false,
      isFileUploading: true,
      fileError: null,
    });

    screenshotService.uploadImage(file).then(
      res => {
        this.setState({
          isFileUploading: false,
          uploadedImageUrl: `${apiUrl}${res.imagePath}`,
          uploadedImageName: res.localImageName,
        });
      },
      () => {
        this.setState({
          isFileUploading: false,
          fileError: 'An error occured.',
        });
      }
    );
  };

  dropFileHandler = event => {
    event.preventDefault();

    const file = event.dataTransfer.files[0];

    this.uploadScreenshotImage(file);
  };

  changeFileFromButtonHandler = event => {
    event.preventDefault();

    const file = this.screenshotImageUploadInput.current.files[0];

    this.uploadScreenshotImage(file);
  };

  dragOverHandler = event => {
    event.preventDefault();
    this.setState({ isFileHover: true });
  };

  dragLeaveHandler = event => {
    event.preventDefault();
    this.setState({ isFileHover: false });
  };

  resetFileHandler = () => {
    this.setState({
      file: null,
      fileError: null,
      uploadedImageUrl: null,
      uploadedImageName: null,
    });
  };

  handleNameChange = event => {
    this.setState({ name: event.target.value });
  };

  handleChangeYear = event => {
    this.setState({ year: event.target.value });
  };

  onAlternativeNameChange = index => event => {
    const { value } = event.target;
    this.setState(prevState => {
      const alternativeNames = [...prevState.alternativeNames];
      alternativeNames[index] = value;
      return {
        ...prevState,
        alternativeNames,
      };
    });
  };

  handleAddAlternativeName = () => {
    this.setState(prevState => {
      const alternativeNames = [...prevState.alternativeNames];
      alternativeNames.push('');
      return {
        ...prevState,
        alternativeNames,
      };
    });
  };

  submitHandler = screenshotId => event => {
    event.preventDefault();
    this.setState({
      submitting: true,
      error: null,
    });
    if (!screenshotId) {
      screenshotService
        .addScreenshot({
          name: this.state.name,
          alternativeNames: this.state.alternativeNames,
          year: this.state.year,
          localImageName: this.state.uploadedImageName,
          recaptchaToken: this.state.recaptchaToken,
        })
        .then(res => {
          if (res.error) {
            this.recaptchaElement.reset();
            this.setState({
              submitting: false,
              error: res.message,
            });
          } else {
            this.props.dispatch(screenshotActions.goToScreenshot(res));
          }
        });
    } else {
      screenshotService
        .editScreenshot({
          id: screenshotId,
          name: this.state.name,
          alternativeNames: this.state.alternativeNames,
          year: this.state.year,
          localImageName: this.state.uploadedImageName,
        })
        .then(res => {
          this.setState({ submitting: false });
          if (res.error) {
            this.setState({
              error: res.message,
            });
          } else if (
            window.history &&
            window.document.referrer &&
            (window.document.referrer.indexOf('guess-the-game') !== -1 ||
              window.document.referrer.indexOf('localhost') !== -1)
          ) {
            window.history.back();
          } else {
            this.props.dispatch(screenshotActions.goToScreenshot(res));
          }
        });
    }
  };

  renderNeedToConnect = () => <p>nned to connect</p>;

  render() {
    const { user } = this.props;
    if (!user.username) {
      this.props.dispatch(loginActions.needToRegister());
      return null;
    }

    const screenshotId = this.props.match.params.id;
    const valid =
      (screenshotId || this.state.uploadedImageName) &&
      (screenshotId || this.state.recaptchaToken) &&
      this.state.name.trim();
    const title = `${screenshotId ? 'Modifier le' : 'Nouveau'} Screenshot ${
      screenshotId ? `#${screenshotId}` : ''
    }`;
    return (
      <section className="EditScreenshotPage">
        <Helmet title={title} />
        <SmallContainer title={title}>
          <form onSubmit={this.submitHandler(screenshotId)}>
            <div
              className="field"
              onDrop={this.dropFileHandler}
              onDragOver={this.dragOverHandler}
              onDragLeave={this.dragLeaveHandler}
            >
              <div className="EditScreenshotPage_form_screenshot_label">
                <b>Règles à lire avant de poster</b>
                <ul>
                  <li>
                    Le jeu doit <b>avoir une fiche sur jeuxvideo.com</b>
                  </li>
                  <li>
                    La screenshot doit être de <b>bonne qualité</b>
                  </li>
                  <li>
                    Il est interdit de ne montrer qu&apos;une partie du
                    screenshot, ce dernier doit montrer{' '}
                    <b>la totalité de l&apos;écran</b>
                  </li>
                  <li>
                    La screenshot ne doit <b>pas provenir de Google Image</b>{' '}
                    (vous pouvez la prendre depuis votre jeu, ou depuis un{' '}
                    <a
                      style={{ textDecoration: 'underline' }}
                      href="https://www.youtube.com/watch?v=TtVSPilTy2k"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Long Play
                    </a>{' '}
                    de Youtube par exemple)
                  </li>
                </ul>
              </div>
              <p className="EditScreenshotPage_form_screenshot_label">
                Screenshot
              </p>
              <div
                className={`EditScreenshotPage_form_screenshot_dropzone ${
                  this.state.isFileHover ? '-hover' : ''
                } ${
                  !this.state.isFileUploading && this.state.uploadedImageUrl
                    ? '-preview'
                    : ''
                }`}
                style={{
                  backgroundImage:
                    !this.state.isFileUploading &&
                    `url(${this.state.uploadedImageUrl})`,
                }}
              >
                <div>
                  {this.state.isFileUploading ? (
                    <div>
                      <div className="EditScreenshotPage_form_screenshot_loading">
                        <Loading />
                      </div>
                      <p>Ça charge...</p>
                    </div>
                  ) : null}
                  {!this.state.file && !screenshotId ? (
                    <div>
                      <p className="EditScreenshotPage_form_screenshot_dropzone_dropText">
                        Glissez l&apos;image, ou
                      </p>
                      <div>
                        <label htmlFor="uploadScreenshotImageButton">
                          <input
                            id="uploadScreenshotImageButton"
                            type="file"
                            ref={this.screenshotImageUploadInput}
                            onChange={this.changeFileFromButtonHandler}
                          />
                        </label>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
              {this.state.uploadedImageUrl && this.state.file && (
                <p className="EditScreenshotPage_form_screenshot_name_container">
                  <span className="EditScreenshotPage_form_screenshot_name">
                    {this.state.file.name}
                    <button
                      className="EditScreenshotPage_form_screenshot_name_reset"
                      type="button"
                      onClick={this.resetFileHandler}
                    >
                      ✖
                    </button>
                  </span>
                </p>
              )}
            </div>
            <p>
              <span role="img" aria-label="warning">
                ⚠️
              </span>{' '}
              Assurez vous que votre image{' '}
              <strong>ne provienne pas de Google Image&nbsp;!</strong>
            </p>
            {this.state.fileError && (
              <p className="EditScreenshotPage_form_error">
                {this.state.fileError}
              </p>
            )}
            <Input
              id="name"
              label="Nom complet du jeu (tel qu'on le voit sur wikipedia par exemple)"
              placeholder="Ex: Grand Theft Auto V"
              value={
                this.state.name ||
                (this.state.screenshot && this.state.screenshot.name) ||
                ''
              }
              onChange={this.handleNameChange}
            />
            <div className="EditScreenshotPage_form_alternativeNames">
              <p>Noms alternatifs</p>
              <p className="EditScreenshotPage_form_alternativeNames_extra">
                Les joueurs pourront valider la screen avec soit le nom complet
                exact, soit une des variantes proposée ici.
                <br />
                Il n&apos;est pas nécéssaire de mettre les variantes majuscules
                / non majuscules (le jeu gère déjà ces variantes).
              </p>
              {this.state.alternativeNames.map((alternativeName, i) => (
                <input
                  key={`alternativeName-${i}`}
                  type="text"
                  className="EditScreenshotPage_form_alternativeNames_input"
                  placeholder={getAlternativeNameExample(i)}
                  onChange={this.onAlternativeNameChange(i)}
                  value={this.state.alternativeNames[i]}
                />
              ))}
              <button
                type="button"
                onClick={this.handleAddAlternativeName}
                className="EditScreenshotPage_form_alternativeNames_add"
              >
                <b>+</b> Ajouter une alternative
              </button>
            </div>
            <Input
              id="year"
              label="Année de sortie du jeu"
              placeholder="Ex: 2017"
              value={this.state.year}
              onChange={this.handleChangeYear}
              type="number"
              min={1900}
              max={2100}
            />
            {!screenshotId && (
              <ReCaptcha
                ref={el => {
                  this.recaptchaElement = el;
                }}
                size="normal"
                render="explicit"
                sitekey="6LcQbmQUAAAAACyOdZhhEsUfUAO3TmUGqMMClngr"
                onloadCallback={this.onLoadRecaptcha}
                verifyCallback={this.onRecaptchaTokenRetrieved}
                expiredCallback={this.onRecaptchaExpired}
              />
            )}

            {this.state.error && (
              <p className="EditScreenshotPage_form_error">
                {this.state.error}
              </p>
            )}
            <Button
              loading={this.state.submitting}
              disabled={!valid}
              color="dark && this.state.recaptchaToken"
              type="submit"
            >
              {screenshotId
                ? 'Enregistrer les modifications'
                : 'Ajouter le screenshot'}
            </Button>
          </form>
        </SmallContainer>
      </section>
    );
  }
}
export default connect(mapStoreToProps)(EditScreenshotPage);

function getAlternativeNameExample(index) {
  const alternativeNames = ['Ex: GTA V', 'Ex: Grand Theft Auto 5', 'Ex: GTA 5'];
  if (alternativeNames[index]) {
    return alternativeNames[index];
  }
  return '';
}
