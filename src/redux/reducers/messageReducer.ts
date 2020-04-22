import {
  UPDATE_CHAT,
  UPDATE_CHAT_MESSAGES,
  SET_CHATROOM,
  SET_CHATROOM_USERS,
  SET_CHATROOMS,
  NEW_USER_JOIN,
  USER_LEAVE,
  USERNAME_CHANGE,
  SET_USERNAME,
  UPDATE_USERNAME_IN_MESSAGES,
} from "../constants";

export const messageReducer = (
  state = {
    chatroomMessages: [],
    chatroom: "",
    chatrooms: [],
    users: [],
    username: "",
    nextTimeUserNameChangeAllowed: 0,
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
      if (state.chatroom === action.chatroom) return state;
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
    case SET_CHATROOMS:
      return {
        ...state,
        chatrooms: action.chatrooms,
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
    default:
      return state;
  }
};
