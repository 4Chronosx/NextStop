import { useState } from "react";
import "./Chatbox.css";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
  Avatar,
  ConversationHeader,
} from "@chatscope/chat-ui-kit-react";

import { postUserData } from "../../api/hostOneApi";

// Define a type for the messages
type MessageType = {
  message: string;
  sender: string;
  sentTime: string;
  direction: "incoming" | "outgoing";
  position: "single" | "first" | "normal" | "last" | 0 | 1 | 2 | 3;
};

const Chatbox = () => {
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState<MessageType[]>([
    {
      direction: "incoming",
      message: "Hello, I am WanderMap AI. How can I help you?",
      position: "single",
      sender: "ChatGPT",
      sentTime: "15 mins ago",
    },
  ]);

  const handleSend = async (message: string) => {
    const newMessage: MessageType = {
      direction: "outgoing",
      message: message,
      position: "single",
      sender: "user",
      sentTime: "just now",
    };

    const newMessages = [...messages, newMessage];
    // Update the state with the new message
    setMessages(newMessages);
    setTyping(true);

    await processMessageToChatGPT(newMessages);
  };

  async function processMessageToChatGPT(chatMessages: MessageType[]) {
    let apiMessages = chatMessages.map((messageObject: MessageType) => {
      let role = "";
      if (messageObject.sender === "ChatGPT") {
        role = "assistant";
      } else {
        role = "user";
      }
      return { role: role, content: messageObject.message };
    });

    const systemMessage = {
      role: "system",
      content: "Explain all concepts like I am 10 years old.",
    };

    const apiRequestBody = {
      model: "gpt-3.5-turbo",
      messages: [systemMessage, ...apiMessages],
    };

    postUserData(apiRequestBody).then((data) => {
      console.log(data.choices[0].message.content);
      setMessages([
        ...chatMessages,
        {
          direction: "incoming",
          message: data.choices[0].message.content,
          position: "single",
          sender: "chatGPT",
          sentTime: "just now",
        },
      ]);
      setTyping(false);
    });
  }

  return (
    <>
      <div className="chat-container">
        <MainContainer>
          <ChatContainer>
            <ConversationHeader>
              <Avatar
                name="Emily"
                src="https://chatscope.io/storybook/react/assets/emily-xzL8sDL2.svg"
              />
              <ConversationHeader.Content
                info="Active now"
                userName="WanderMap AI"
              />
            </ConversationHeader>
            <MessageList
              typingIndicator={
                typing ? (
                  <TypingIndicator content="WanderMapAI is typing" />
                ) : null
              }
            >
              {messages.map((message, index) => {
                const avatarSrc =
                  message.sender === "user"
                    ? "https://chatscope.io/storybook/react/assets/joe-v8Vy3KOS.svg"
                    : "https://chatscope.io/storybook/react/assets/emily-xzL8sDL2.svg";
                return (
                  <Message
                    key={index}
                    model={{
                      direction: message.direction,
                      message: message.message,
                      position: message.position,
                      sender: message.sender,
                      sentTime: message.sentTime,
                    }}
                  >
                    <Avatar name={message.sender} src={avatarSrc}></Avatar>
                  </Message>
                );
              })}
            </MessageList>
            <MessageInput placeholder="Type message here" onSend={handleSend} />
          </ChatContainer>
        </MainContainer>
      </div>
    </>
  );
};

export default Chatbox;
