import { useEffect, useState } from "react";
import { RoomCard } from "../../components";
import { useFirebase } from "../../context/FirebaseProvider";
import styles from "./Calendar.module.css";

export default function Calendar() {
  const [rooms, setRooms] = useState();
  const { db, user } = useFirebase();

  useEffect(() => {
    const unsubscribeTempRooms = db
      .collection("users")
      .doc(user.uid)
      .collection("calendar")
      .onSnapshot((snapshot) => {
        const tempRooms = [];
        snapshot.forEach((doc) => tempRooms.push(doc.data()));
        setRooms(tempRooms);
      });

    return () => {
      unsubscribeTempRooms();
    };
  }, []);

  return (
    <div className="container">
      <h1 className={styles.title}>Calendar</h1>
      {rooms && rooms.map((room) => <RoomCard room={room} />)}
    </div>
  );
}
