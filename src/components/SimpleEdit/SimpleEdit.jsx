import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Loading from '../Loading/Loading';

class SimpleEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      areWeEditing: false,
      value: this.props.value,
    };
  }

  handleStartEditing = () => {
    this.setState({
      areWeEditing: true,
    });
  };

  handleChange = event => {
    this.setState({ value: event.target.value });
  };

  handleSubmit = event => {
    event.preventDefault();
    this.setState({
      value: null,
      areWeEditing: false,
    });
    this.props.callback(this.state.value);
  };

  render() {
    const value = this.state.value || this.props.value;
    return (
      <div>
        {this.state.areWeEditing ? (
          <form onSubmit={this.handleSubmit}>
            <input value={value} onChange={this.handleChange} />{' '}
            <button type="submit">
              <FontAwesomeIcon icon="check" />
            </button>
          </form>
        ) : (
          <span>
            {value}{' '}
            {this.props.isLoading ? (
              <Loading small />
            ) : (
              <button type="button" onClick={this.handleStartEditing}>
                <FontAwesomeIcon icon="pencil-alt" />
              </button>
            )}
          </span>
        )}
      </div>
    );
  }
}
export default SimpleEdit;
