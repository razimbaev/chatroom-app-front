import {
  UPDATE_CHAT,
  SET_CHATROOM,
  SET_CHATROOM_USERS,
  SET_CHATROOMS,
} from "../constants";

export const updateChat = (content: string, userId: string) => {
  return { type: UPDATE_CHAT, content, userId };
};

export const setChatroom = (chatroom: string) => {
  return { type: SET_CHATROOM, chatroom };
};

export const setChatroomUsers = (users: string[]) => {
  return { type: SET_CHATROOM_USERS, users };
};

export const setChatrooms = (chatrooms: string[]) => {
  return { type: SET_CHATROOMS, chatrooms };
};
