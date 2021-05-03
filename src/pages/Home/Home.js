import { useFirebase } from "../../context/FirebaseProvider";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./Home.module.css";
import { v4 } from "uuid";
import { RoomCard, Navbar } from "../../components";
import { useRoomData } from "../../context/RoomDataProvider";

export default function Home() {
  const { db, auth, user } = useFirebase();
  const { allRooms, dispatch } = useRoomData();
  const [showCompleteProfile, setShowCompleteProfile] = useState(true);

  const initialiseRooms = () => {
    return db
      .collection("rooms")
      .orderBy("scheduledAt")
      .onSnapshot((snapshot) => {
        const tempRooms = [];
        snapshot.forEach((doc) => tempRooms.push(doc.data()));
        dispatch({ type: "INITIALIZE_ALL_ROOMS", payload: tempRooms });
      });
  };

  useEffect(() => {
    const unsubscribe = initialiseRooms();

    return () => {
      unsubscribe();
    };
  }, []);

  const isProfileIncomplete =
    user.bio === "" || user.twitterId === "" || user.instagramId === "";

  return (
    <div className="section">
      {isProfileIncomplete && showCompleteProfile && (
        <Link
          to={`/profile/@${user.username}`}
          className="block pointer w-full btn-primary-gradient py-1"
        >
          <div
            className={`container flex justify-center items-center w-full ${styles.completeProfileContainer}`}
          >
            <p className="flex-grow">
              Complete your profile and help your friends recognize you better
            </p>
            <button
              onClick={(e) => {
                e.preventDefault();
                setShowCompleteProfile(false);
              }}
              className="btn btn-icon btn-ghost btn-small"
            >
              <span className="material-icons">close</span>
            </button>
          </div>
        </Link>
      )}
      <Navbar />
      <div className={`container ${styles.homeHeader}`}>
        <h1 className={styles.welcomeMessage}>Welcome, {user?.name}</h1>
        <div className={styles.createRoomButtonContainer}>
          <Link
            to="/create-new-room"
            className={`btn btn-solid btn-small ${styles.createRoomButton}`}
          >
            <img src="/icons/add.svg" className="btn-icon-left" alt="add" />
            Create New Room
          </Link>
        </div>
      </div>
      <div className={`container ${styles.roomsContainer}`}>
        {allRooms
          ?.filter((room) => room.status !== "archieved")
          .sort((a, b) => a.status > b.status)
          .map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
      </div>
    </div>
  );
}
