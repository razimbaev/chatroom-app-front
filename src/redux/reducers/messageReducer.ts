import {
  UPDATE_CHAT,
  UPDATE_CHAT_MESSAGES,
  SET_CHATROOM,
  SET_CHATROOM_USERS,
  SET_HOMEPAGE_DATA,
  NEW_USER_JOIN,
  USER_LEAVE,
  USERNAME_CHANGE,
  SET_USERNAME,
  UPDATE_USERNAME_IN_MESSAGES,
  UPDATE_HOMEPAGE_MESSAGE,
  UPDATE_HOMEPAGE_USER,
  UPDATE_HOMEPAGE_CHATROOMS,
  SET_MY_CHATROOMS,
} from "../constants";

export const messageReducer = (
  state = {
    chatroomMessages: [],
    chatroom: "",
    homepageData: {},
    users: [],
    username: "",
    nextTimeUserNameChangeAllowed: 0,
    myChatrooms: [],
  },
  action
) => {
  switch (action.type) {
    case UPDATE_CHAT:
      // send message and return new version of state
      return {
        ...state,
        chatroomMessages: [
          ...state.chatroomMessages,
          { content: action.content, userId: action.userId },
        ],
      };
    case UPDATE_CHAT_MESSAGES:
      return {
        ...state,
        chatroomMessages: state.chatroomMessages.concat(
          action.messages.messages
        ),
      };
    case SET_CHATROOM:
      if (action.chatroom == state.chatroom) return state;
      return {
        ...state,
        chatroomMessages: [],
        chatroom: action.chatroom,
      };
    case SET_CHATROOM_USERS:
      return {
        ...state,
        users: action.users.map((username) => {
          return { oldName: "", currentName: username };
        }),
      };
    case SET_HOMEPAGE_DATA: {
      const homepageData = {};
      action.homepageData.map((chatroom) => {
        homepageData[chatroom.chatroom] = {
          numUsers: chatroom.numUsers,
          mostRecentMessages: chatroom.mostRecentMessages,
        };
      });

      return {
        ...state,
        homepageData,
      };
    }
    case UPDATE_HOMEPAGE_MESSAGE: {
      let newMessages;
      const prevMessages =
        state.homepageData[action.message.chatroom].mostRecentMessages;
      if (prevMessages.length < 3) {
        newMessages = [...prevMessages, action.message];
      } else {
        newMessages = prevMessages.slice(1, 3);
        newMessages.push(action.message);
      }
      return {
        ...state,
        homepageData: {
          ...state.homepageData,
          [action.message.chatroom]: {
            ...state.homepageData[action.message.chatroom],
            mostRecentMessages: newMessages,
          },
        },
      };
    }
    case UPDATE_HOMEPAGE_USER:
      return {
        ...state,
        homepageData: {
          ...state.homepageData,
          [action.chatroom]: {
            ...state.homepageData[action.chatroom],
            numUsers: action.numUsers,
          },
        },
      };
    case UPDATE_HOMEPAGE_CHATROOMS:
      return {
        ...state,
        homepageData: {
          ...state.homepageData,
          [action.chatroom]: {
            numUsers: action.numUsers,
            mostRecentMessages: action.mostRecentMessages,
          },
        },
      };
    case NEW_USER_JOIN:
      return {
        ...state,
        users: [...state.users, { oldName: "", currentName: action.username }],
      };
    case USER_LEAVE:
      return {
        ...state,
        users: state.users.filter(
          (user) => user.currentName !== action.username
        ),
      };
    case USERNAME_CHANGE: {
      const newUserList = [
        { oldName: action.previousName, currentName: action.newName },
      ];
      let foundFirst = false;
      const remainingUsers = state.users.filter((user) => {
        if (foundFirst) return true;
        if (user.currentName !== action.previousName) return true;
        foundFirst = true;
        return false;
      });

      newUserList.push(...remainingUsers);
      return {
        ...state,
        users: newUserList,
      };
    }
    case SET_USERNAME:
      return {
        ...state,
        username: action.username,
        nextTimeUserNameChangeAllowed: action.nextTimeChangeAllowed,
      };
    case UPDATE_USERNAME_IN_MESSAGES:
      return {
        ...state,
        chatroomMessages: state.chatroomMessages.map((message) => {
          return message.userId === action.previousName
            ? { ...message, userId: action.newName }
            : message;
        }),
      };
    case SET_MY_CHATROOMS:
      return {
        ...state,
        myChatrooms: action.myChatrooms.reverse(),
      };
    default:
      return state;
  }
};
