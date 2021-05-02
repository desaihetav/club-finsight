export const initialState = {
  room: {},
  members: [],
  messages: [],
  newMessage: "",
};

export const roomReducer = (state, { type, payload }) => {
  switch (type) {
    case "INITIALIZE_ROOM":
      return { ...state, room: payload };
    case "INITIALIZE_MEMBERS":
      return { ...state, members: payload };
    case "INITIALIZE_MESSAGES":
      return { ...state, messages: payload };
    case "UPDATE_NEW_MESSAGE":
      return { ...state, newMessage: payload };
    case "CLEAR_NEW_MESSAGE":
      return { ...state, newMessage: "" };
    default:
      return state;
  }
};
