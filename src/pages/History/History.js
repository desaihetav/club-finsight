import { useEffect, useState } from "react";
import { RoomCard } from "../../components";
import { useFirebase } from "../../context/FirebaseProvider";
import { useRoomData } from "../../context/RoomDataProvider";
import styles from "./History.module.css";

export default function History() {
  const { user, db } = useFirebase();
  const { allRooms } = useRoomData();
  const [rooms, setRooms] = useState();
  const [attendedRoomIds, setAttendedRoomIds] = useState([]);

  useEffect(() => {
    // const unsubscribeHistoryRooms = db
    //   .collection("rooms")
    //   .doc(user?.uid)
    //   .collection("attendedRooms")
    //   .onSnapshot((snapshot) => {
    //     const tempRooms = [];
    //     snapshot.forEach((doc) => {
    //       doc.data().id && tempRooms.push(doc.data());
    //     });
    //     setRooms(tempRooms);
    //   });
    const tempRoomIds = [];
    db.collection("users")
      .doc(user?.uid)
      .collection("attendedRooms")
      .onSnapshot((snapshot) => {
        snapshot.forEach((doc) => tempRoomIds.push(doc.data().id));
        setAttendedRoomIds(tempRoomIds);
      });
    return () => {};
  }, []);

  return (
    <div className="container">
      <h1>History</h1>
      {allRooms &&
        allRooms.map((room) => {
          if (
            room.status === "archieved" &&
            room.visibility === "public" &&
            attendedRoomIds.includes(room.id)
          ) {
            return <RoomCard room={room} />;
          } else {
            return <></>;
          }
        })}
    </div>
  );
}
