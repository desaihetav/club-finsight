import { useState, useEffect } from "react";
import { useFirebase } from "../../context/FirebaseProvider";
import { Link } from "react-router-dom";
import styles from "./RoomCard.module.css";

export default function RoomCard({ room }) {
  const { id, title, creatorId, status, scheduledAt } = room;
  const [creator, setCreator] = useState();
  const { db, user } = useFirebase();
  const [isInCalendar, setIsInCalendar] = useState(false);

  const pad = (n) => {
    return n < 10 ? "0" + n : n;
  };

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const fullDate = new Date(scheduledAt?.toDate());
  const scheduledTimestamp = ` ${pad(fullDate.getDate())} ${
    months[fullDate.getMonth()]
  } ${fullDate.getFullYear()}, ${pad(fullDate.getHours())}:${pad(
    fullDate.getMinutes()
  )}`;

  const initialiseCreator = async () => {
    try {
      await db
        .collection("rooms")
        .doc(id)
        .collection("members")
        .doc(creatorId)
        .onSnapshot((doc) => {
          setCreator(doc.data());
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    initialiseCreator();
    db.collection("users")
      .doc(user.uid)
      .collection("calendar")
      .doc(id)
      .onSnapshot((doc) => setIsInCalendar(doc.exists));
  }, []);

  const statusClass = {
    open: styles.open,
    scheduled: styles.scheduled,
    archieved: styles.archieved,
  };

  const addToCalendar = () => {
    db.collection("users")
      .doc(user.uid)
      .collection("calendar")
      .doc(id)
      .set(room);
  };

  const removeFromCalendar = () => {
    db.collection("users")
      .doc(user.uid)
      .collection("calendar")
      .doc(id)
      .delete();
  };

  return (
    <Link to={`/room/${id}`}>
      <div className={styles.card}>
        <div className={`${styles.header}`}>
          <div className={`${statusClass[status]} ${styles.badge}`}>
            {status.toUpperCase()}
          </div>
          {status !== "archieved" && (
            <button
              onClick={(e) => {
                e.preventDefault();
                isInCalendar ? removeFromCalendar() : addToCalendar();
              }}
              className={`btn btn-outlined btn-small ${styles.addToCalButton}`}
            >
              {isInCalendar ? "Remove" : "Add to Calendar"}
            </button>
          )}
        </div>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.subtitle}>
          by <span>{creator?.name}</span>
          {status === "scheduled" && (
            <>
              {" "}
              at <span>{scheduledTimestamp}</span>
            </>
          )}
        </p>
      </div>
    </Link>
  );
}
