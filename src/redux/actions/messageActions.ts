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

export const updateChat = (content: string, userId: string) => {
  return { type: UPDATE_CHAT, content, userId };
};

export const updateChatMessages = (messages) => {
  return { type: UPDATE_CHAT_MESSAGES, messages };
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

export const newUserJoin = (username: string) => {
  return { type: NEW_USER_JOIN, username };
};

export const userLeave = (username: string) => {
  return { type: USER_LEAVE, username };
};

export const usernameChange = (previousName: string, newName: string) => {
  return { type: USERNAME_CHANGE, previousName, newName };
};

export const setUsername = (
  username: string,
  nextTimeChangeAllowed: number
) => {
  return { type: SET_USERNAME, username, nextTimeChangeAllowed };
};

export const updateUsernameInMessages = (
  previousName: string,
  newName: string
) => {
  return { type: UPDATE_USERNAME_IN_MESSAGES, previousName, newName };
};
