import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import { AuthContext } from '../context/AuthContext';
import './ChatPage.css';
import api from '../utils/api';


const socket = io('http://localhost:5000');

const ChatPage = () => {
  const { auth } = useContext(AuthContext);
  const { userId } = useParams();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const response = await api.get(`/users/${userId}`);
        setUsername(response.data.username);
      } catch (error) {
        console.error('Error fetching username:', error);
      }
    };

    fetchUsername();

    socket.on('chat message', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => socket.off('chat message');
  }, [userId]);

  const sendMessage = (e) => {
    e.preventDefault();
    const msg = {
      content: message,
      sender: auth.userId,
      receiver: userId,
    };
    socket.emit('chat message', msg);
    setMessage('');
  };

  return (
    <div className="chat-page-container">
      <div className="chat-header">
        <h1>Chat with {username}</h1>
      </div>
      <div className="chat-messages">
        <ul>
          {messages.map((msg, index) => (
            <li key={index} className={msg.sender === auth.userId ? 'sent' : 'received'}>
              <p>{msg.content}</p>
            </li>
          ))}
        </ul>
      </div>
      <form className="chat-form" onSubmit={sendMessage}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatPage;
