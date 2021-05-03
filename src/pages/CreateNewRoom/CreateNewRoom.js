import { useState } from "react";
import Datetime from "react-datetime";
import moment from "moment";
import { v4 } from "uuid";
import slugify from "react-slugify";

import styles from "./CreateNewRoom.module.css";
import { useFirebase } from "../../context/FirebaseProvider";
import { useNavigate } from "react-router";

export default function CreateNewRoom() {
  const navigate = useNavigate();
  const [topic, setTopic] = useState("");
  const [date, setDate] = useState();
  const { db, user } = useFirebase();

  const checkValid = (current) => {
    const yesterday = moment().subtract(1, "day");
    return current.isAfter(yesterday);
  };

  const createNewRoom = () => {
    const roomId = slugify(topic) + v4();
    const newRoom = {
      id: roomId,
      title: topic,
      creatorId: user.uid,
      status: "scheduled",
      scheduledAt: new Date(date),
      createdAt: new Date(Date.now()),
      visibility: "private",
    };
    db.collection("rooms").doc(roomId).set(newRoom);
    db.collection("rooms").doc(roomId).collection("members").doc(user.uid).set({
      uid: user.uid,
      name: user.name,
      username: user.username,
      role: "creator",
      permissionStatus: "granted",
      status: "inactive",
    });
    db.collection("users")
      .doc(user.uid)
      .collection("attendedRooms")
      .doc(roomId)
      .set(newRoom);
    console.log("Room Created");
    setTopic("");
    setDate(null);
    navigate(`/room/${roomId}`, { replace: true });
  };

  return (
    <div className={`container ${styles.pageContainer}`}>
      <div className={styles.innerContainer}>
        <div className={styles.header}>
          <h1 className={styles.title}>Create New Room</h1>
        </div>
        <div className={styles.form}>
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Topic"
            className={`input-field`}
          />
          <Datetime
            inputProps={{
              placeholder: "Date and Time",
            }}
            value={date}
            onChange={(value) => setDate(value)}
            isValidDate={checkValid}
          />
          <button
            onClick={createNewRoom}
            className={`btn btn-solid btn-small ${styles.createButton}}`}
          >
            create
          </button>
        </div>
      </div>
    </div>
  );
}
