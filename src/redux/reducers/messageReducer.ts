import {
  UPDATE_CHAT,
  SET_CHATROOM,
  SET_CHATROOM_USERS,
  SET_CHATROOMS,
} from "../constants";

export const messageReducer = (
  state = {
    chatroomMessages: [],
    chatroom: "",
    chatrooms: [],
    users: [],
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
        users: action.users,
      };
    case SET_CHATROOMS:
      return {
        ...state,
        chatrooms: action.chatrooms,
      };
    default:
      return state;
  }
};
