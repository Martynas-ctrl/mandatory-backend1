import React from 'react';

class Username extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      yourName: '',
    }
  }

  change = (e) => {
    this.setState({
      yourName: e.target.value
    });
  };

  submit = (e) => {
    e.preventDefault();
    this.props.onSubmit(this.state.yourName)
  };

  render() {
    return(
      <>
        <form onSubmit={this.submit}>
          <label>Your Name:</label>
          <input type='text' value={this.state.yourName} onChange={this.change}/>
          <input type='submit' value='Send'/>
        </form>
      </>
    )
  }
}

export default Username;