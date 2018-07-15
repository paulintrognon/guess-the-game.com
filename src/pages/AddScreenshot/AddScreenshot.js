import React from 'react';
import { connect } from 'react-redux';

import screenshotService from '../../services/screenshotService';
import screenshotActions from '../../actions/screenshotActions';
import SmallContainer from '../../components/SmallContainer/SmallContainer';
import './addScreenshot.css';

function mapStoreToProps() {
  return {};
}
class AddScreenshotPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      submitting: false,
      error: null,

      // File upload
      isFileHover: false,
      isFileUploading: false,
      fileError: null,
      uploadedImageUrl: null,
      uploadedImageName: null,

      // Fields values
      file: null,
      name: '',
      alternativeNames: ['', '', ''],
    };
  }

  dropFileHandler = event => {
    event.preventDefault();

    // Use DataTransfer interface to access the file(s)
    const file = event.dataTransfer.files[0];

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
          uploadedImageUrl: res.url,
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

  changeNameHandler = event => {
    this.setState({ name: event.target.value });
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

  addAlternativeNameHandler = () => {
    this.setState(prevState => {
      const alternativeNames = [...prevState.alternativeNames];
      alternativeNames.push('');
      return {
        ...prevState,
        alternativeNames,
      };
    });
  };

  submitHandler = event => {
    event.preventDefault();
    this.setState({
      submitting: true,
      error: null,
    });
    screenshotService
      .addScreenshot({
        name: this.state.name,
        alternativeNames: this.state.alternativeNames,
        localImageName: this.state.uploadedImageName,
      })
      .then(res => {
        if (res.error) {
          this.setState({
            submitting: false,
            error: res.message,
          });
        } else {
          this.props.dispatch(screenshotActions.addScreenshotAction(res));
        }
      });
  };

  render() {
    const valid = this.state.uploadedImageName && this.state.name.trim();
    return (
      <SmallContainer>
        <form className="AddScreenshot" onSubmit={this.submitHandler}>
          <h2 className="title is-5">Add new screenshot</h2>
          <div
            className="field"
            onDrop={this.dropFileHandler}
            onDragOver={this.dragOverHandler}
            onDragLeave={this.dragLeaveHandler}
          >
            <p className="AddScreenshot__dropzoneLabel label">Screenshot</p>
            <div
              className={`AddScreenshot__dropzone ${
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
              <p>
                {this.state.isFileUploading
                  ? 'Uploading, please wait...'
                  : null}
                {!this.state.file ? 'Drag the screenshot...' : null}
              </p>
            </div>
            {this.state.uploadedImageUrl && (
              <p className="AddScreenshot__dropzone__reset">
                <span className="tag is-success">
                  {this.state.file.name}
                  <button
                    type="button"
                    className="delete is-small"
                    onClick={this.resetFileHandler}
                  />
                </span>
              </p>
            )}
          </div>
          {this.state.fileError && (
            <p className="notification is-danger">{this.state.fileError}</p>
          )}
          <div className="field">
            <label className="label" htmlFor="name">
              Full name of the game
              <input
                id="name"
                type="text"
                className="input"
                placeholder="Ex: Grand Theft Auto V"
                onChange={this.changeNameHandler}
                value={this.state.name}
              />
            </label>
          </div>
          <div className="field AddScreenshot__alternativeNames">
            <div className="label">
              <p>Alternative names</p>
              <p className="additionnal-info">
                The players will find the game by typing the full name or any of
                the alternatives.
              </p>
              {this.state.alternativeNames.map((alternativeName, i) => (
                <input
                  key={`alternativeName-${i}`}
                  type="text"
                  className="input"
                  placeholder={getAlternativeNameExample(i)}
                  onChange={this.onAlternativeNameChange(i)}
                  value={this.state.alternativeNames[i]}
                />
              ))}
              <button
                type="button"
                onClick={this.addAlternativeNameHandler}
                className="button"
              >
                <span className="icon">
                  <i className="fas fa-plus" />
                </span>
                <span>Add an alternative</span>
              </button>
            </div>
          </div>
          <div className="field">
            <div className="control">
              <button
                type="submit"
                className={`button is-link ${
                  this.state.submitting ? 'is-loading' : ''
                }`}
                disabled={!valid || this.state.submitting}
              >
                Submit the screenshot
              </button>
            </div>
          </div>
          {this.state.error && (
            <p className="notification is-danger">{this.state.error}</p>
          )}
        </form>
      </SmallContainer>
    );
  }
}
export default connect(mapStoreToProps)(AddScreenshotPage);

function getAlternativeNameExample(index) {
  const alternativeNames = ['Ex: GTA V', 'Ex: Grand Theft Auto 5', 'Ex: GTA 5'];
  if (alternativeNames[index]) {
    return alternativeNames[index];
  }
  return '';
}
