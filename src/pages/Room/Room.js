import { useState, useEffect, useReducer, useRef } from "react";
import { useParams } from "react-router-dom";
import firebase from "firebase";
import { v4 } from "uuid";
import { useFirebase } from "../../context/FirebaseProvider";
import { MessageCard, Requests } from "../../components";
import styles from "./Room.module.css";
import { useRoomData } from "../../context/RoomDataProvider";

export default function Room() {
  const { roomId } = useParams();
  const { db, user } = useFirebase();
  const contentEndEl = useRef(null);
  const [showRequests, setShowRequests] = useState(false);
  const {
    room,
    members,
    messages,
    newMessage,
    currentUser,
    dispatch,
  } = useRoomData();
  const [isCreator, setIsCreator] = useState(room?.creatorId === user?.uid);
  const [pendingRequests, setPendingRequests] = useState(false);

  const toggleShowRequests = () => setShowRequests((val) => !val);

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
        text: newMessage,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        deletedAt: "",
      });
    dispatch({ type: "CLEAR_NEW_MESSAGE" });
  };

  useEffect(() => {
    contentEndEl?.current?.scrollIntoView({ behaviour: "smooth" });
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

    db.collection("rooms")
      .doc(roomId)
      .collection("members")
      .where("permissionStatus", "==", "requested")
      .onSnapshot((snapshot) => {
        console.log("Notif check", snapshot.size);
        setPendingRequests(() => snapshot.size);
      });

    return () => {
      unsubscribeRooms();
      unsubscribeMembers();
      unsubscribeMessages();
    };
  }, []);

  useEffect(() => {
    // add user to room members
    let userExists = false;
    if (user.uid && user.name && user.username) {
      const unsubscribeCurrentMember = db
        .collection("rooms")
        .doc(roomId)
        .collection("members")
        .doc(user?.uid)
        .onSnapshot((doc) => {
          userExists = doc.exists;
          if (doc.exists)
            dispatch({ type: "INITIALIZE_CURRENT_USER", payload: doc.data() });
        });

      if (!userExists) {
        db.collection("rooms")
          .doc(roomId)
          .collection("members")
          .doc(user?.uid)
          .set({
            uid: user?.uid,
            name: user?.name,
            username: user?.username,
            role: room?.creatorId === user?.uid ? "creator" : "audience",
            status: "active",
            permissionStatus: "none",
          });
      } else {
        db.collection("rooms")
          .doc(roomId)
          .collection("members")
          .doc(user?.uid)
          .update({
            role: room?.creatorId === user?.uid ? "creator" : "audience",
            status: "active",
          });
      }
    }

    return () => {
      db.collection("rooms")
        .doc(roomId)
        .collection("members")
        .doc(user?.uid)
        .update({
          status: "inactive",
          permissionStatus: "none",
        });
    };
  }, [user, room]);

  const handleRequest = () => {
    db.collection("rooms")
      .doc(roomId)
      .collection("members")
      .doc(user?.uid)
      .update({
        permissionStatus: "requested",
      });
  };

  const handleOpenRoom = () => {
    db.collection("rooms").doc(roomId).update({
      status: "open",
    });
  };

  return (
    <div>
      {showRequests ? (
        <Requests user={user} toggleShowRequests={toggleShowRequests} />
      ) : (
        <div
          style={{ height: window.innerHeight }}
          className={`${styles.roomContainer}`}
        >
          <div className={`${styles.header}`}>
            <div className={`container ${styles.headerContent}`}>
              <h1 className={`${styles.title}`}>{room.title}</h1>
              {
                <button
                  onClick={toggleShowRequests}
                  className={`btn btn-ghost btn-icon btn-small ${styles.menuButton}`}
                >
                  {pendingRequests ? (
                    <div className={styles.notificationDot}></div>
                  ) : (
                    <></>
                  )}
                  <img src="/icons/menu.svg" alt="menu" />
                </button>
              }
            </div>
          </div>
          {room.status === "scheduled" ? (
            <div className={styles.notOpenText}>
              <h2>Room not opened by creator</h2>
            </div>
          ) : (
            <div className={`container ${styles.content}`}>
              {messages.map((message) => (
                <MessageCard key={message.id} message={message} />
              ))}
              <div ref={contentEndEl}></div>
            </div>
          )}
          {room.status !== "scheduled" && (
            <>
              {currentUser?.role !== "audience" ? (
                <div
                  // onSubmit={(e) => createNewMessage(e)}
                  className={`container ${styles.newMessage}`}
                >
                  <textarea
                    placeholder="Type your message..."
                    rows="1"
                    onChange={(e) =>
                      dispatch({
                        type: "UPDATE_NEW_MESSAGE",
                        payload: e.target.value,
                      })
                    }
                    className={`${styles.inputTextArea}`}
                    value={newMessage}
                  />
                  <button
                    onClick={(e) => createNewMessage(e)}
                    className={`btn btn-solid btn-icon btn-small ${styles.sendButton}`}
                  >
                    <img src="/icons/send.svg" alt="send" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleRequest}
                  className={`btn btn-solid btn-small btn-primary-gradient ${styles.requestToChatButton}`}
                >
                  {currentUser.permissionStatus === "none"
                    ? "Request to Chat"
                    : "Permission Requested"}
                </button>
              )}
            </>
          )}
          {room.status === "scheduled" && currentUser?.role !== "audience" && (
            <button
              onClick={handleOpenRoom}
              className={`btn btn-solid btn-small btn-primary-gradient ${styles.requestToChatButton}`}
            >
              Open Room
            </button>
          )}
        </div>
      )}
    </div>
  );
}
