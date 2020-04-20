import React, { createContext } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { useDispatch } from "react-redux";
import {
  updateChat,
  setChatroomUsers,
  setChatrooms,
  updateChatMessages,
} from "../redux/actions/messageActions";

const WebSocketContext = createContext(null);

export { WebSocketContext };

const WebSocketProvider = ({ children }) => {
  // TODO - maybe refactor this to set whether user is in home or chatroom and then useEffect can handle all those changes
  let stompClient;
  let ws;
  let toSubscribeList = [];
  let toUnsubscribeList = [];

  const dispatch = useDispatch();

  const sendMessage = (chatroomName, content, userId) => {
    console.log(stompClient);
    stompClient.send(
      "/app/sendMessage/" + chatroomName,
      {},
      JSON.stringify({ content, userId })
    );
  };

  const updateUsername = (username) => {
    const updateUsernameSub = stompClient.subscribe(
      "/app/setUsername/" + username,
      (result) => {
        // TODO - process whether username is taken or available
        console.log(result);
        updateUsernameSub.unsubscribe();
      }
    );
  };

  const loadChatroomList = () => {
    if (!stompClient || !stompClient.connected) {
      toSubscribeList.push(() => {
        loadChatroomList();
      });
    } else {
      const getAllChatroomsSub = stompClient.subscribe(
        "/app/chatrooms",
        (result) => {
          const body = JSON.parse(result.body);
          dispatch(setChatrooms(body));
          getAllChatroomsSub.unsubscribe();
        }
      );
    }
  };

  const subscribeChatroom = (chatroomName) => {
    // TODO - might need to validate chatroomName
    // TODO - use subscription
    if (!stompClient || !stompClient.connected) {
      toSubscribeList.push(() => {
        subscribeChatroom(chatroomName);
      });
    } else {
      // TODO - make sure order of messages displayed is correct
      const init = stompClient.subscribe(
        "/app/chatroom/" + chatroomName + "/init",
        (message) => {
          const messageBody = JSON.parse(message.body);
          dispatch(updateChatMessages(messageBody));
          dispatch(setChatroomUsers(messageBody.usernames));
          init.unsubscribe();
          if (localStorage.getItem("userId")) {
            updateUsername(localStorage.getItem("userId"));
          }
        }
      );

      const userSub = stompClient.subscribe(
        "/topic/chatroom/" + chatroomName + "/users",
        (message) => {
          const messageBody = JSON.parse(message.body);
          dispatch(setChatroomUsers(messageBody));
        }
      );

      const messageSub = stompClient.subscribe(
        "/topic/chatroom/" + chatroomName,
        (message) => {
          const messageBody = JSON.parse(message.body);
          dispatch(updateChat(messageBody.content, messageBody.userId));
        }
      );

      toUnsubscribeList.forEach((sub) => {
        sub.unsubscribe();
      });
      toUnsubscribeList = [messageSub, userSub];
    }
  };

  if (!stompClient) {
    const host = "http://localhost:8080/websocket";
    // "http://ec2-3-21-166-131.us-east-2.compute.amazonaws.com:8080/websocket"; // "http://localhost:8080/websocket"
    const sock = new SockJS(host);
    stompClient = Stomp.over(sock);
    stompClient.reconnect_delay = 5000; // enable automatic reconnecting after 5 sec
    // can configure heartbeat with stompClient.heartbeat.outgoing && stompClient.heartbeat.incoming
    stompClient.connect({}, () => {
      toSubscribeList.forEach((toSub) => {
        toSub();
      });
      toSubscribeList = [];
    });

    ws = {
      socket: stompClient,
      sendMessage,
      updateUsername,
      subscribeChatroom,
      loadChatroomList,
    };
  }

  React.useEffect(() => {
    return () => {
      if (stompClient !== null) stompClient.disconnect();
    };
  }, [stompClient]);

  return (
    <WebSocketContext.Provider value={ws}>{children}</WebSocketContext.Provider>
  );
};

export default WebSocketProvider;
