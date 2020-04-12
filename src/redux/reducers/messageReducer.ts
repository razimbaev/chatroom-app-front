export const messageReducer = (
  state = {
    chatroomMessages: [],
  },
  action
) => {
  debugger;
  switch (action.type) {
    case "UPDATE_CHAT":
      // send message and return new version of state
      return {
        ...state,
        chatroomMessages: [
          ...state.chatroomMessages,
          { content: action.content, userId: action.userId },
        ],
      };
    default:
      return state;
  }
};
