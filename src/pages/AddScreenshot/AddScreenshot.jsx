import React from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { apiUrl } from 'config';
import screenshotService from '../../services/screenshotService';
import screenshotActions from '../../actions/screenshotActions';
import Input from '../../components/Form/Input/Input';
import Button from '../../components/Form/Button/Button';
import SmallContainer from '../../components/SmallContainer/SmallContainer';
import Loading from '../../components/Loading/Loading';
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
      year: '',
    };
    this.screenshotImageUploadInput = React.createRef();
  }

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
        year: this.state.year,
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
      <section className="AddScreenshotPage">
        <Helmet title="Add Screenshot" />
        <SmallContainer title="Add Screenshot">
          <form onSubmit={this.submitHandler}>
            <div
              className="field"
              onDrop={this.dropFileHandler}
              onDragOver={this.dragOverHandler}
              onDragLeave={this.dragLeaveHandler}
            >
              <p className="AddScreenshotPage_form_screenshot_label">
                Screenshot
              </p>
              <div
                className={`AddScreenshotPage_form_screenshot_dropzone ${
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
                      <div className="AddScreenshotPage_form_screenshot_loading">
                        <Loading />
                      </div>
                      <p>Uploading, please wait...</p>
                    </div>
                  ) : null}
                  {!this.state.file ? (
                    <div>
                      <p className="AddScreenshotPage_form_screenshot_dropzone_dropText">
                        Drag the screenshot, or
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
              {this.state.uploadedImageUrl && (
                <p className="AddScreenshotPage_form_screenshot_name_container">
                  <span className="AddScreenshotPage_form_screenshot_name">
                    {this.state.file.name}
                    <button
                      className="AddScreenshotPage_form_screenshot_name_reset"
                      type="button"
                      onClick={this.resetFileHandler}
                    >
                      ✖
                    </button>
                  </span>
                </p>
              )}
            </div>
            {this.state.fileError && (
              <p className="AddScreenshotPage_form_error">
                {this.state.fileError}
              </p>
            )}
            <Input
              id="name"
              label="Full name of the game"
              placeholder="Ex: Grand Theft Auto V"
              value={this.state.name}
              onChange={this.handleNameChange}
            />
            <div className="AddScreenshotPage_form_alternativeNames">
              <p>Alternative names</p>
              <p className="AddScreenshotPage_form_alternativeNames_extra">
                Players will solve that screenshot by typing the full name or
                any of the alternatives.
              </p>
              {this.state.alternativeNames.map((alternativeName, i) => (
                <input
                  key={`alternativeName-${i}`}
                  type="text"
                  className="AddScreenshotPage_form_alternativeNames_input"
                  placeholder={getAlternativeNameExample(i)}
                  onChange={this.onAlternativeNameChange(i)}
                  value={this.state.alternativeNames[i]}
                />
              ))}
              <button
                type="button"
                onClick={this.handleAddAlternativeName}
                className="AddScreenshotPage_form_alternativeNames_add"
              >
                <b>+</b> Add an alternative
              </button>
            </div>
            <Input
              id="year"
              label="Year when it came out"
              placeholder="Ex: 2017"
              value={this.state.year}
              onChange={this.handleChangeYear}
              type="number"
              min={1900}
              max={2100}
            />
            {this.state.error && (
              <p className="AddScreenshotPage_form_error">{this.state.error}</p>
            )}
            <Button
              loading={this.state.submitting}
              disabled={!valid}
              color="dark"
              type="submit"
            >
              Submit the screenshot
            </Button>
          </form>
        </SmallContainer>
      </section>
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
