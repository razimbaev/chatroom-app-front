import React, { createContext } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { useDispatch } from "react-redux";
import { updateChat } from "../redux/actions/messageActions";

const WebSocketContext = createContext(null);

export { WebSocketContext };

const WebSocketProvider = ({ children }) => {
  let stompClient;
  let ws;

  const dispatch = useDispatch();

  const sendMessage = (content, userId) => {
    stompClient.send(
      "/app/sendMessage",
      {},
      JSON.stringify({ content, userId })
    );
  };

  if (!stompClient) {
    const sock = new SockJS("http://localhost:8080/websocket");
    stompClient = Stomp.over(sock);
    stompClient.connect({}, () => {
      stompClient.subscribe("/topic/chatroom", (message) => {
        const messageBody = JSON.parse(message.body);
        dispatch(updateChat(messageBody.content, messageBody.userId));
      });
    });

    ws = {
      socket: stompClient,
      sendMessage,
    };
  }

  return (
    <WebSocketContext.Provider value={ws}>{children}</WebSocketContext.Provider>
  );
};

export default WebSocketProvider;
