import React from 'react';
import Username from './Components/Username.js'
import Chat from './Components/Chat.js';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      yourName: '',
      setUsername: true,
    }
  }

  onSubmit = (name) => {
    this.setState({
      yourName: name,
      setUsername: false,
     });
  };
  
  render() {
    return(
      <>
        { this.state.setUsername ?
            <Username onSubmit={this.onSubmit} /> :
            <Chat yourName={this.state.yourName} />
        }
    </>
    )
  }
}

export default App;