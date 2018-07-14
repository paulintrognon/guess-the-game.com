import React from 'react';
import { connect } from 'react-redux';

import screenshotService from '../../services/screenshotService';
import SmallContainer from '../../components/SmallContainer/SmallContainer';
import './addScreenshot.css';

function mapStoreToProps(store) {
  return {
    user: store.user,
  };
}
class AddScreenshotPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFileHover: false,
      fileError: null,
      uploadedImageUrl: null,
      uploadedImagePath: null,
      submitting: false,

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
    this.setState({
      file,
      isFileHover: false,
    });
    screenshotService.uploadImage(file).then(res => {
      this.setState({
        uploadedImageUrl: res.url,
        uploadedImagePath: res.localPath,
      });
    });
  };

  dragOverHandler = event => {
    event.preventDefault();
    this.setState({ isFileHover: true });
  };

  dragLeaveHandler = event => {
    event.preventDefault();
    this.setState({ isFileHover: false });
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

  render() {
    const valid = this.state.uploadedImagePath && this.state.name.trim();
    return (
      <SmallContainer>
        <form className="AddScreenshot">
          <h2 className="title is-5">Add new screenshot</h2>
          <div className="field">
            <p className="AddScreenshot__dropzoneLabel label">Screenshot</p>
            <div
              className={`AddScreenshot__dropzone ${
                this.state.isFileHover ? '-hover' : ''
              } ${this.state.uploadedImageUrl ? '-preview' : ''}`}
              onDrop={this.dropFileHandler}
              onDragOver={this.dragOverHandler}
              onDragLeave={this.dragLeaveHandler}
              style={{
                backgroundImage: `url(${this.state.uploadedImageUrl})`,
              }}
            >
              <p>{this.state.file ? null : 'Drag the screenshot...'}</p>
            </div>
          </div>
          {this.state.fileError && <p>{this.state.fileError}</p>}
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
            <p className="label">
              Optional: Alternative names{' '}
              <span className="additionnal-info">
                (latin numbering, shorter version of the name, ...)
              </span>
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
            </p>
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
                Submit
              </button>
            </div>
          </div>
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
