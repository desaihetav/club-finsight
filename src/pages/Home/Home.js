import { useFirebase } from "../../context/FirebaseProvider";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Home.module.css";

export default function Home() {
  const { db, auth, user } = useFirebase();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [showCompleteProfile, setShowCompleteProfile] = useState(true);

  useEffect(() => {
    const unsubscribe = db
      .collection("users")
      .doc(user.uid)
      .onSnapshot((doc) => {
        setName(doc.data().firstName);
      });

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
      <button onClick={handleLogOut}>Logout</button>
    </div>
  );
}
