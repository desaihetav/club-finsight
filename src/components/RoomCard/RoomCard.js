import { useState, useEffect } from "react";
import { useFirebase } from "../../context/FirebaseProvider";
import { Link } from "react-router-dom";
import styles from "./RoomCard.module.css";

export default function RoomCard({ room }) {
  const { id, title, creatorId, status, scheduledAt } = room;
  const [creator, setCreator] = useState();
  const { db } = useFirebase();

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
  }, []);

  const statusClass = {
    open: styles.open,
    scheduled: styles.scheduled,
    archieved: styles.archieved,
  };

  return (
    <Link to={`/room/${id}`}>
      <div className={styles.card}>
        <div className={`${statusClass[status]} ${styles.badge}`}>
          {status.toUpperCase()}
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
