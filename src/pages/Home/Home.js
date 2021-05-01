import { useFirebase } from "../../context/FirebaseProvider";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Home.module.css";
import { v4 } from "uuid";
import { RoomCard } from "../../components";

export default function Home() {
  const { db, auth, user } = useFirebase();
  const [showCompleteProfile, setShowCompleteProfile] = useState(true);

  const [rooms, setRooms] = useState([]);

  const createNewRoom = () => {
    const roomId = v4();
    db.collection("rooms").doc(roomId).set({
      id: roomId,
      title: "How is NextJS framework better as compared to others?",
      creatorId: user.uid,
    });
    db.collection("rooms").doc(roomId).collection("members").doc(user.uid).set({
      uid: user.uid,
      name: user.name,
      username: user.username,
      role: "creator",
    });
    console.log("Room Created");
  };

  const initialiseRooms = () => {
    return db.collection("rooms").onSnapshot((snapshot) => {
      const tempRooms = [];
      snapshot.forEach((doc) => tempRooms.push(doc.data()));
      console.log(tempRooms);
      setRooms(tempRooms);
    });
  };

  useEffect(() => {
    const unsubscribe = initialiseRooms();

    return () => {
      unsubscribe();
    };
  }, []);

  const handleLogOut = () => {
    auth.signOut();
  };

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
      <h1>{user?.name}</h1>
      <button onClick={handleLogOut}>Logout</button>
      <button onClick={createNewRoom}>Create New Room</button>
      <div className="container">
        {rooms?.map(({ id, title, creatorId }) => (
          <RoomCard key={id} id={id} title={title} creatorId={creatorId} />
        ))}
      </div>
    </div>
  );
}
