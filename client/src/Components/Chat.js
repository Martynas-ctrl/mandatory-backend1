import React from 'react';
import io from 'socket.io-client';
import '../Css/Chat.css';

class Chat extends React.Component {
  constructor(props){
    super(props);

    this.socket = io('http://localhost:3001');

    this.state = {
      rooms: [],
      chats: [],
      chosenRoom: true,
      room: '',
      newRoom: '',
      chatMsg: '',
    }
  }

componentDidMount(){

this.socket.on('connect', () => {
    this.socket.emit('joinRoom');
});

this.socket.on('chatRooms', (data) => {
    this.setState({
        rooms: data, 
    });
});

this.socket.on('messages', (data) => {
    this.setState({
        chats: data,
    });
});

this.socket.on('message', (msg) => {
    let newMsg = {username: msg.username, content: msg.content};
    this.setState( prevState => ({ 
      chats: [...prevState.chats, newMsg]
    }));
  });
};

componentWillUnmount(){
    this.socket.disconnect();
};

onChange = (e) => {
    let value = e.target.value;
    this.setState({
      ...this.state,
      [e.target.name]: value,
    });
};

addChatRoom = (e) => {
    e.preventDefault();
    this.socket.emit('add-room', this.state.newRoom);
    this.setState({ 
        newRoom: '', 
   });
};

joinChatRoom = (e) => {
    e.preventDefault();
    this.setState({ 
        chosenRoom: false, 
    });
    this.socket.emit('join', this.state.room);
};

deleteChatRoom = (e) => {
    e.preventDefault();
    this.socket.emit('delete', this.state.room)
};

submitChatMessage =(e) => {
    e.preventDefault();
    let messageObj = {
      room: this.state.room,
      username: this.props.yourName,
      content: this.state.chatMsg,
};

    this.socket.on(this.state.room).emit('new_message', messageObj);
    this.setState( prevState => ({
      chats: [...prevState.chats, messageObj],
      chatMsg: '',
    }));
};

exitChatRoom = () => {
    this.setState({
        chosenRoom: true,
    });
};


render(){
  if(this.state.chosenRoom) {
    return (
      <>
        <form id='addChatRoom' onSubmit={this.addChatRoom}>
          <label id='roomName'>Room:</label>
          <input type='text' className='message-input' id='newRoom' name='newRoom' value={ this.state.newRoom } onChange={this.onChange} />
          <button type='submit'>Add ChatRoom</button>
        </form>
        <form onChange={this.onChange} onSubmit={this.joinChatRoom}>
          {this.state.rooms.map((value, index) => {
            return(
              <div className='chatRoomList'>
                <input type='radio' id={ value } value={ value } name='room' />
                <label For={ value }>{ value }</label>
                <button onClick={this.deleteChatRoom}>Delete Room</button>
              </div>
              )
            })}
                <button type='submit'>Enter Room</button>
        </form>
            </>
      )
    }else {
      return <>
        <div id='message-container'>
          <div id='title'>
            <h1>{this.state.room}</h1>
        </div>
        <div>{ this.state.chats.map((value, index) => {
          return <li key={ index }>{ value.username }: { value.content }</li>
          })}
        </div>
      </div>
      <div id='formContainer'>
        <form id='send-container' onSubmit={this.submitChatMessage}>
          <input type='text' id='message-input' name='chatMsg' placeholder='Send a message ...' value={this.state.chatMsg} onChange={this.onChange} />
        </form>
      </div>
      <button onClick={this.exitChatRoom}>Exit</button>
    </>
    }
  }
}

export default Chat;