import { useEffect, useReducer, useRef } from "react";
import { useParams } from "react-router-dom";
import firebase from "firebase";
import { v4 } from "uuid";
import { useFirebase } from "../../context/FirebaseProvider";
import { roomReducer, initialState } from "../../reducers/roomReducer";
import { MessageCard } from "../../components";
import styles from "./Room.module.css";

export default function Room() {
  const { roomId } = useParams();
  const { db, user } = useFirebase();
  const [state, dispatch] = useReducer(roomReducer, initialState);
  const contentEndEl = useRef(null);

  const createNewMessage = (e) => {
    e.preventDefault();
    const messageId = v4();
    db.collection("rooms")
      .doc(roomId)
      .collection("messages")
      .doc(messageId)
      .set({
        id: messageId,
        imageURL: "",
        senderId: user.uid,
        senderName: user.name,
        text: state.newMessage,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        deletedAt: "",
      });
    dispatch({ type: "CLEAR_NEW_MESSAGE" });
  };

  useEffect(() => {
    contentEndEl.current.scrollIntoView({ behaviour: "smooth" });
    const unsubscribeRooms = db
      .collection("rooms")
      .doc(roomId)
      .onSnapshot((doc) =>
        dispatch({ type: "INITIALIZE_ROOM", payload: doc.data() })
      );
    const unsubscribeMembers = db
      .collection("rooms")
      .doc(roomId)
      .collection("members")
      .orderBy("name")
      .onSnapshot((snapshot) => {
        const members = [];
        snapshot.forEach((doc) => members.push(doc.data()));
        dispatch({ type: "INITIALIZE_MEMBERS", payload: members });
      });
    const unsubscribeMessages = db
      .collection("rooms")
      .doc(roomId)
      .collection("messages")
      .orderBy("createdAt", "desc")
      .onSnapshot((snapshot) => {
        const messages = [];
        snapshot.forEach((doc) => messages.push(doc.data()));
        dispatch({ type: "INITIALIZE_MESSAGES", payload: messages });
      });

    return () => {
      unsubscribeRooms();
      unsubscribeMembers();
      unsubscribeMessages();
    };
  }, []);

  useEffect(() => {
    // add user to room members
    if (user.uid && user.name && user.username)
      db.collection("rooms")
        .doc(roomId)
        .collection("members")
        .doc(user?.uid)
        .set({
          uid: user?.uid,
          name: user?.name,
          username: user?.username,
          role: "audience",
          status: "active",
        });

    return () => {
      db.collection("rooms")
        .doc(roomId)
        .collection("members")
        .doc(user?.uid)
        .update({
          status: "inactive",
          role: user.uid !== state.room.creatorId ? "audience" : "creator",
        });
    };
  }, [user]);

  return (
    <div
      style={{ maxHeight: window.innerHeight }}
      className={`${styles.roomContainer}`}
    >
      <div className={`${styles.header}`}>
        <h1 className={`container ${styles.title}`}>{state.room.title}</h1>
      </div>
      <div className={`container ${styles.content}`}>
        {state.messages.map((message) => (
          <MessageCard message={message} />
        ))}
        <div ref={contentEndEl}></div>
      </div>
      <form
        onSubmit={(e) => createNewMessage(e)}
        className={`container ${styles.newMessage}`}
      >
        <input
          onChange={(e) =>
            dispatch({
              type: "UPDATE_NEW_MESSAGE",
              payload: e.target.value,
            })
          }
          className={`input-field`}
          value={state.newMessage}
        />
        <button
          onClick={(e) => createNewMessage(e)}
          className={`btn btn-solid btn-icon btn-small ${styles.sendButton}`}
        >
          <img src="/icons/send.svg" alt="send" />
        </button>
      </form>
    </div>
  );
}
