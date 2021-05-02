import { createContext, useContext, useReducer } from "react";
import { roomReducer, initialState } from "../reducers/roomReducer";

const RoomDataContext = createContext();

export const useRoomData = () => useContext(RoomDataContext);

export const RoomDataProvider = ({ children }) => {
  const [state, dispatch] = useReducer(roomReducer, initialState);
  return (
    <RoomDataContext.Provider
      value={{
        allRooms: state.allRooms,
        room: state.room,
        members: state.members,
        messages: state.messages,
        newMessage: state.newMessage,
        currentUser: state.currentUser,
        dispatch,
      }}
    >
      {children}
    </RoomDataContext.Provider>
  );
};
