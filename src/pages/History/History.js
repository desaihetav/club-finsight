import { useEffect, useState } from "react";
import { RoomCard } from "../../components";
import { useFirebase } from "../../context/FirebaseProvider";
import { useRoomData } from "../../context/RoomDataProvider";
import styles from "./History.module.css";

export default function History() {
  const { user, db } = useFirebase();
  const { allRooms } = useRoomData();
  const [rooms, setRooms] = useState();

  useEffect(() => {
    const unsubscribeHistoryRooms = db
      .collection("users")
      .doc(user?.uid)
      .collection("attendedRooms")
      .onSnapshot((snapshot) => {
        const tempRooms = [];
        snapshot.forEach((doc) => {
          doc.data().id &&
            doc.data().status === "archieved" &&
            doc.data().visibility === "public" &&
            tempRooms.push(doc.data());
        });
        setRooms(tempRooms);
      });
    return () => {};
  }, []);

  return (
    <div className="container">
      <h1>History</h1>
      {rooms && rooms.map((room) => <RoomCard room={room} />)}
    </div>
  );
}
