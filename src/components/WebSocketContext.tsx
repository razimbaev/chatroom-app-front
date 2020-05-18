import React, { createContext } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { useDispatch } from "react-redux";
import {
  updateChat,
  setChatroomUsers,
  setHomepageData,
  updateChatMessages,
  setUsername,
  updateUsernameInMessages,
  updateHomepageUser,
  updateHomepageMessage,
  updateHomepageChatrooms,
  setMyChatrooms,
  setChatroom,
} from "../redux/actions/messageActions";

const WebSocketContext = createContext(null);

export { WebSocketContext };

const WebSocketProvider = ({ children }) => {
  // TODO - maybe refactor this to set whether user is in home or chatroom and then useEffect can handle all those changes
  let stompClient: Client;
  let ws;

  let currentSubscriptions = [];
  let subscriptionQueue = [];
  let reconnectQueue = [];
  let startingReconnectDelayTime = 500;

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

  const getChatroomSuggestions = (onSuccess) => {
    if (!stompClient || !stompClient.connected) {
      subscriptionQueue.push(() => {
        getChatroomSuggestions(onSuccess);
      });
    } else {
      const getChatroomSuggestionsSub = stompClient.subscribe(
        "/app/chatroomSuggestions",
        (result) => {
          const resultBody = JSON.parse(result.body);
          onSuccess(resultBody);
          getChatroomSuggestionsSub.unsubscribe();
        }
      );
    }
  };

  const sendMessage = (chatroomName, content, userId) => {
    stompClient.publish({
      destination: "/app/sendMessage/" + chatroomName,
      body: JSON.stringify({ content, userId }),
    });
  };

  // TODO - improve by just publishing to endpoint and have endpoint return back to new generic endpoint user subscribes to in order to receive one off messages
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
        }
        updateUsernameSub.unsubscribe();
      }
    );
  };

  const loadExplorePage = (fromMyChat?: boolean): void => {
    if (fromMyChat) {
      unsubscribeAll();
    }

    if (!stompClient || !stompClient.connected) {
      subscriptionQueue.push(loadExplorePage);
    } else {
      reconnectQueue = [loadExplorePage];
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

      currentSubscriptions.push(updateHomeMessageSub);
      currentSubscriptions.push(updateHomeUserSub);
      currentSubscriptions.push(updateHomeChatroomsSub);
    }
  };

  const loadMyChatsPage = (): void => {
    unsubscribeAll();

    if (!stompClient || !stompClient.connected) {
      subscriptionQueue.push(loadMyChatsPage);
    } else {
      reconnectQueue = [loadMyChatsPage];
      const getMyChatsSub = stompClient.subscribe(
        "/app/mychatrooms",
        (result) => {
          const resultBody = JSON.parse(result.body);
          dispatch(setMyChatrooms(resultBody));
          getMyChatsSub.unsubscribe();
        }
      );

      loadExplorePage(true);
    }
  };

  const loadChatroomPage = (chatroomName): void => {
    unsubscribeAll();

    dispatch(setChatroom(chatroomName));
    if (!stompClient || !stompClient.connected) {
      subscriptionQueue.push(() => loadChatroomPage(chatroomName));
    } else {
      reconnectQueue = [() => loadChatroomPage(chatroomName)];
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
          dispatch(setChatroomUsers(messageBody.users));

          if (messageBody.modifiedUsernames) {
            Object.keys(messageBody.modifiedUsernames).forEach(
              (previousName) => {
                const newName = messageBody.modifiedUsernames[previousName];
                dispatch(updateUsernameInMessages(previousName, newName));
              }
            );
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

      currentSubscriptions.push(messageSub);
      currentSubscriptions.push(userSub);
    }
  };

  const unsubscribeAll = (keepSubQueue?: boolean): void => {
    currentSubscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
    currentSubscriptions = [];
    if (!keepSubQueue) subscriptionQueue = [];
  };

  if (!stompClient) {
    const host =
      process.env.NODE_ENV === "production"
        ? "https://api.jibbrjabbr.com/websocket"
        : "http://localhost:8080/websocket";

    stompClient = new Client({
      reconnectDelay: startingReconnectDelayTime,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      webSocketFactory: () => new SockJS(host),
    });

    stompClient.onConnect = () => {
      unsubscribeAll(true);

      reconnectQueue.forEach((subscribe) => subscribe());

      subscriptionQueue.forEach((subscribe) => subscribe());
      subscriptionQueue = [];

      stompClient.reconnectDelay = startingReconnectDelayTime;
    };

    stompClient.onWebSocketClose = () => {
      stompClient.reconnectDelay = stompClient.reconnectDelay * 2;
    };

    stompClient.activate();

    ws = {
      sendMessage,
      updateUsername,
      createNewChatroom,
      getChatroomSuggestions,
      loadExplorePage,
      loadChatroomPage,
      loadMyChatsPage,
    };
  }

  return (
    <WebSocketContext.Provider value={ws}>{children}</WebSocketContext.Provider>
  );
};

export default WebSocketProvider;
