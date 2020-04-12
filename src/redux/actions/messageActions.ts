const UPDATE_CHAT = "UPDATE_CHAT";

export const updateChat = (content: string, userId: string) => {
  return { type: UPDATE_CHAT, content, userId };
};
