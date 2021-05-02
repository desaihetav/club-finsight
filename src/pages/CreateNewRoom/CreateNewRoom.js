import { useState } from "react";
import Datetime from "react-datetime";
import moment from "moment";
import { v4 } from "uuid";
import slugify from "react-slugify";

import styles from "./CreateNewRoom.module.css";
import { useFirebase } from "../../context/FirebaseProvider";

export default function CreateNewRoom() {
  const [topic, setTopic] = useState("");
  const [date, setDate] = useState();
  const { db, user } = useFirebase();

  const checkValid = (current) => {
    const yesterday = moment().subtract(1, "day");
    return current.isAfter(yesterday);
  };

  const createNewRoom = () => {
    const roomId = slugify(topic);
    db.collection("rooms")
      .doc(roomId)
      .set({
        id: roomId,
        title: topic,
        creatorId: user.uid,
        status: "scheduled",
        scheduledAt: new Date(date),
      });
    db.collection("rooms").doc(roomId).collection("members").doc(user.uid).set({
      uid: user.uid,
      name: user.name,
      username: user.username,
      role: "creator",
      permissionStatus: "granted",
      status: "inactive",
      visibility: "private",
    });
    console.log("Room Created");
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
