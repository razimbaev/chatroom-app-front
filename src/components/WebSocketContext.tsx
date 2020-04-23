import React, { createContext } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { useDispatch } from "react-redux";
import {
  updateChat,
  setChatroomUsers,
  setHomepageData,
  updateChatMessages,
  newUserJoin,
  usernameChange,
  userLeave,
  setUsername,
  updateUsernameInMessages,
  updateHomepageUser,
  updateHomepageMessage,
  updateHomepageChatrooms,
  setMyChatrooms,
} from "../redux/actions/messageActions";

const WebSocketContext = createContext(null);

export { WebSocketContext };

const WebSocketProvider = ({ children }) => {
  // TODO - maybe refactor this to set whether user is in home or chatroom and then useEffect can handle all those changes
  let stompClient;
  let ws;
  let toSubscribeList = [];
  let toUnsubscribeList = [];
  let homepageSub = [];

  const dispatch = useDispatch();

  const createNewChatroom = (chatroomName, onError, onSuccess) => {
    const createNewChatroomSub = stompClient.subscribe(
      "/app/chatroom/create/" + chatroomName,
      (result) => {
        const resultBody = JSON.parse(result.body);
        if (resultBody.reasonChangeNotAllowed) {
          onError(resultBody.reasonChangeNotAllowed);
        } else {
          onSuccess();
        }
        createNewChatroomSub.unsubscribe();
      }
    );
  };

  const getMyChats = () => {
    if (!stompClient || !stompClient.connected) {
      toSubscribeList.push(() => {
        getMyChats();
      });
    } else {
      const getMyChatsSub = stompClient.subscribe(
        "/app/mychatrooms",
        (result) => {
          const resultBody = JSON.parse(result.body);
          dispatch(setMyChatrooms(resultBody));
          getMyChatsSub.unsubscribe();
        }
      );
    }
  };

  const sendMessage = (chatroomName, content, userId) => {
    stompClient.send(
      "/app/sendMessage/" + chatroomName,
      {},
      JSON.stringify({ content, userId })
    );
  };

  const updateUsername = (username, onError) => {
    const updateUsernameSub = stompClient.subscribe(
      "/app/setUsername/" + username,
      (result) => {
        const resultBody = JSON.parse(result.body);
        if (resultBody.reasonChangeNotAllowed) {
          onError(resultBody.reasonChangeNotAllowed);
        } else {
          dispatch(
            setUsername(resultBody.newName, resultBody.timeNextChangeAllowed)
          );
          dispatch(
            updateUsernameInMessages(
              resultBody.previousName,
              resultBody.newName
            )
          );
        }
        updateUsernameSub.unsubscribe();
      }
    );
  };

  const loadHomepageData = () => {
    if (!stompClient || !stompClient.connected) {
      toSubscribeList.push(() => {
        loadHomepageData();
      });
    } else {
      unsubscribeHome();

      const getAllChatroomsSub = stompClient.subscribe(
        "/app/home/init",
        (result) => {
          const body = JSON.parse(result.body);
          dispatch(setHomepageData(body));
          getAllChatroomsSub.unsubscribe();
        }
      );

      const updateHomeMessageSub = stompClient.subscribe(
        "/topic/home/message",
        (result) => {
          const messageBody = JSON.parse(result.body);
          dispatch(updateHomepageMessage(messageBody));
        }
      );

      const updateHomeUserSub = stompClient.subscribe(
        "/topic/home/user",
        (result) => {
          const messageBody = JSON.parse(result.body);
          dispatch(
            updateHomepageUser(messageBody.chatroom, messageBody.numUsers)
          );
        }
      );

      const updateHomeChatroomsSub = stompClient.subscribe(
        "/topic/home/chatroom",
        (result) => {
          const messageBody = JSON.parse(result.body);
          dispatch(
            updateHomepageChatrooms(
              messageBody.chatroom,
              messageBody.numUsers,
              messageBody.mostRecentMessages
            )
          );
        }
      );

      homepageSub = [
        updateHomeMessageSub,
        updateHomeUserSub,
        updateHomeChatroomsSub,
      ];
    }

    return unsubscribeHome;
  };

  const unsubscribeHome = () => {
    homepageSub.forEach((sub) => {
      sub.unsubscribe();
    });
    homepageSub = [];
  };

  const subscribeChatroom = (chatroomName) => {
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
          dispatch(
            setUsername(
              messageBody.myUsername,
              messageBody.nextUsernameChangeAllowed
            )
          );
          init.unsubscribe();
        }
      );

      const userSub = stompClient.subscribe(
        "/topic/chatroom/" + chatroomName + "/users",
        (message) => {
          const messageBody = JSON.parse(message.body);
          switch (messageBody.event) {
            case "JOIN":
              dispatch(newUserJoin(messageBody.currentName));
              break;
            case "LEAVE":
              dispatch(userLeave(messageBody.currentName));
              break;
            case "CHANGE_USERNAME":
              dispatch(
                usernameChange(
                  messageBody.previousName,
                  messageBody.currentName
                )
              );
              dispatch(
                updateUsernameInMessages(
                  messageBody.previousName,
                  messageBody.currentName
                )
              );
              break;
          }
        }
      );

      const messageSub = stompClient.subscribe(
        "/topic/chatroom/" + chatroomName,
        (message) => {
          const messageBody = JSON.parse(message.body);
          dispatch(updateChat(messageBody.content, messageBody.userId));
        }
      );

      unsubscribeExistingChatroom();
      toUnsubscribeList = [messageSub, userSub];
    }

    return unsubscribeExistingChatroom;
  };

  const unsubscribeExistingChatroom = () => {
    toUnsubscribeList.forEach((sub) => {
      sub.unsubscribe();
    });
    toUnsubscribeList = [];
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
      loadHomepageData,
      createNewChatroom,
      getMyChats,
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
