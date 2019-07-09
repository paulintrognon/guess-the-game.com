import React from 'react';
import Loading from '../Loading/Loading';
import IconButton from '../IconButton/IconButton';

class SimpleEdit extends React.Component {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
    this.state = {
      areWeEditing: false,
      value: this.props.value,
    };
  }

  handleStartEditing = () => {
    this.setState(
      {
        areWeEditing: true,
        value: this.props.value,
      },
      () => {
        this.inputRef.current.focus();
      }
    );
  };

  handleChange = event => {
    this.setState({ value: event.target.value });
  };

  handleSubmit = event => {
    event.preventDefault();
    if (this.props.isLoading) {
      return;
    }
    if (this.state.value) {
      this.props.callback(this.state.value);
    }
    this.setState({
      value: null,
      areWeEditing: false,
    });
  };

  render() {
    const value = this.state.areWeEditing ? this.state.value : this.props.value;
    return (
      <div>
        {this.state.areWeEditing ? (
          <form onSubmit={this.handleSubmit}>
            <input
              ref={this.inputRef}
              value={value}
              onInput={this.handleChange}
              autoComplete="false"
            />{' '}
            <IconButton type="submit" icon="check" />
          </form>
        ) : (
          <span>
            {value}{' '}
            {this.props.isLoading ? (
              <Loading small />
            ) : (
              <IconButton icon="pencil-alt" onClick={this.handleStartEditing} />
            )}
          </span>
        )}
      </div>
    );
  }
}
export default SimpleEdit;
