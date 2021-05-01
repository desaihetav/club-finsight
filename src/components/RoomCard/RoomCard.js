import { useState, useEffect } from "react";
import { useFirebase } from "../../context/FirebaseProvider";
import { Link } from "react-router-dom";
import styles from "./RoomCard.module.css";

export default function RoomCard({ id, title, creatorId }) {
  const [creator, setCreator] = useState();
  const { db } = useFirebase();

  const initialiseCreator = async () => {
    try {
      await db
        .collection("rooms")
        .doc(id)
        .collection("members")
        .doc(creatorId)
        .onSnapshot((doc) => {
          console.log(doc.data());
          setCreator(doc.data());
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    console.log("here");
    initialiseCreator();
  }, []);

  return (
    <Link to={`/room/${id}`}>
      <div className={styles.card}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.subtitle}>
          by <span>{creator?.name}</span>
        </p>
      </div>
    </Link>
  );
}
