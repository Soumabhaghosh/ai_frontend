import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';


const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;                /* Full viewport height */
  background-color: #f4f4f4;
  font-family: Arial, sans-serif;
  overflow-y: auto;             /* Enable vertical scrolling */
  padding: 20px;                /* Padding for inner spacing */
  box-sizing: border-box;       /* Include padding in element's height */
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;                 /* Allow Content to grow and push other elements */
  width: 100%;
`;

// const ChatContainer = styled.div`
//   display: flex;
//   flex-direction: column;
//   justify-content: flex-end;
//   width: 60%;
//   height: 80%;
//   border: 1px solid #ccc;
//   background-color: #fff;
//   margin-top: 20px;
//   padding: 20px;
//   box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
//   overflow-y: auto; /* Allows vertical scrolling */
//   overflow-x: hidden; /* Prevents horizontal scrolling */
// `;
const MessageContainer = styled.div`
  margin-bottom: 10px;
`;

const UserMessage = styled.div`
  align-self: flex-end;
  background-color: #007bff;
  color: white;
  padding: 10px;
  border-radius: 10px;
  max-width: 70%;
  word-wrap: break-word;
`;

const BotMessage = styled.div`
    align-self: flex-start;
    background-color: #f5f5f5;   /* Lighter background for better readability */
    color: #333;                 /* Darker text color for contrast */
    padding: 20px;               /* More padding for better spacing */
    border-radius: 12px;         /* Rounded corners for a modern look */
    max-width: 80%;              /* Increased width to accommodate more content */
    word-wrap: break-word;       /* Ensure long text breaks within the box */
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15); /* Slightly more pronounced shadow */
    font-family: 'Courier New', Courier, monospace; /* Monospaced font for code-like text */
    font-size: 1rem;             /* Maintain good font size */
    line-height: 1.5;            /* Increase line height for better readability */
    margin: 10px 0;              /* Space out messages vertically */
    white-space: pre-wrap;       /* Preserve whitespace and line breaks */
    overflow-x: auto;            /* Allow horizontal scrolling for long lines of code */
`;

const FormContainer = styled.form`
  display: flex;
  width: 65%;
  margin-top: 20px;
`;

const TextInput = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-right: 10px;
`;

const SubmitButton = styled.button`
  padding: 10px 20px;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

function App() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setMessages([...messages, { type: 'user', text: inputValue }]);
      setInputValue('');
      // Simulate bot response
      // setTimeout(() => {
      //   setMessages((prevMessages) => [
      //     ...prevMessages,
      //     { type: 'bot', text: 'This is a bot response.'+inputValue },
      //   ]);
      // }, 1000);

       try {
        const data = await axios.post('http://13.235.61.218:11434/api/generate', {
  "model": "llama3.1",
  "prompt": inputValue,
  "stream":false
});

        
        setMessages((prevMessages) => [
          ...prevMessages,
          { type: 'bot', text: data.data.response },
        ]);
      } catch (error) {
        console.error('Error sending message:', error);
        setMessages((prevMessages) => [
          ...prevMessages,
          { type: 'bot', text: 'Error: Could not send message.' },
        ]);
      }


    }
  };

  return (
    <AppContainer>
      <Content>
        {messages.map((message, index) => (
          <MessageContainer key={index}>
            {message.type === 'user' ? (
              <UserMessage>{message.text}</UserMessage>
            ) : (
              <BotMessage>{message.text}</BotMessage>
            )}
          </MessageContainer>
        ))}
        </Content>
      
      <FormContainer onSubmit={handleSubmit}>
        <TextInput
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <SubmitButton type="submit">Send</SubmitButton>
      </FormContainer>
    </AppContainer>
  );
}

export default App;
