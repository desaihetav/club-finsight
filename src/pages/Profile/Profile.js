import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useFirebase } from "../../context/FirebaseProvider";
import styles from "./Profile.module.css";

export default function Profile() {
  const { username } = useParams();
  const { user, db, auth } = useFirebase();
  const [currentUser, setCurrentUser] = useState(user);
  const [followers, setFollowers] = useState();
  const [following, setFollowing] = useState();
  const [name, setName] = useState();
  const [bio, setBio] = useState();
  const [website, setWebsite] = useState();
  const [twitterId, setTwitterId] = useState();
  const [instagramId, setInstagramId] = useState();
  const [isEditMode, setIsEditMode] = useState(false);
  const bioEl = useRef(null);

  const initialiseCurrentUser = async () => {
    const response = await db
      .collection("users")
      .where("username", "==", username)
      .get();
    const tempCurrentUser = [];
    response.forEach((doc) => tempCurrentUser.push(doc.data()));
    tempCurrentUser !== [] && setCurrentUser(tempCurrentUser[0]);
  };

  const handleEdit = () => {
    if (isEditMode) {
      db.collection("users").doc(user.uid).update({
        name: name,
        bio: bio,
        website: website,
        twitterId: twitterId,
        instagramId: instagramId,
      });
    }
    setIsEditMode((val) => !val);
  };

  useEffect(() => {
    db.collection("users")
      .doc(currentUser?.uid)
      .collection("followers")
      .onSnapshot((querySnapshot) => {
        let tempFollowers = [];
        querySnapshot.forEach((doc) => {
          tempFollowers.push(doc.data());
        });
        setFollowers(tempFollowers);
      });

    db.collection("users")
      .doc(currentUser?.uid)
      .collection("following")
      .onSnapshot((querySnapshot) => {
        let tempFollowing = [];
        querySnapshot.forEach((doc) => {
          tempFollowing.push(doc.data());
        });
        setFollowing(tempFollowing);
      });

    initialiseCurrentUser();
  }, [user]);

  useEffect(() => {
    setTwitterId(currentUser?.twitterId);
    setInstagramId(currentUser?.instagramId);
    setWebsite(currentUser?.website);
    setBio(currentUser?.bio || "No Bio");
    setName(currentUser?.name);
    bioEl.current.innerText = currentUser?.bio || "No Bio";
  }, [currentUser]);

  console.log({ user });

  return (
    <div className={`${styles.profilePage} container`}>
      <div className={`${styles.profileCard}`}>
        <div className={styles.header}>
          <div className={styles.avatarContainer}>
            {currentUser?.photoURL ? (
              <img
                className={styles.avatarImage}
                src={currentUser?.photoURL}
                alt="profile pic"
              />
            ) : (
              <span>{name?.[0]}</span>
            )}
          </div>
          <div className={styles.userDetails}>
            <input
              onChange={(e) => setName(e.target.value)}
              readOnly={!isEditMode}
              value={name}
              className={`${styles.name} ${styles.inputBox} ${
                isEditMode && styles.editInput
              }`}
            />
            <p className={styles.username}>@{currentUser?.username}</p>
          </div>
          {username === user?.username && (
            <div onClick={handleEdit} className={styles.editIconContainer}>
              <img
                className={isEditMode ? styles.checkIcon : styles.editIcon}
                src={`/icons/${isEditMode ? "check" : "edit"}.svg`}
                alt="edit-icon"
              />
            </div>
          )}
        </div>

        <div
          contentEditable={isEditMode}
          ref={bioEl}
          role="textbox"
          onInputCapture={(e) => setBio(e.target.innerText)}
          className={isEditMode ? styles.bioActive : styles.bio}
        ></div>

        {(website || isEditMode) && (
          <div className={styles.website}>
            <img
              className={styles.icon}
              src="/icons/link.svg"
              alt="link icon"
            />
            {isEditMode ? (
              <input
                placeholder="website_link"
                onChange={(e) => setWebsite(e.target.value)}
                readOnly={!isEditMode}
                value={website}
                className={`${styles.websiteInput} ${styles.inputBox} ${
                  isEditMode && styles.editInput
                }`}
              />
            ) : (
              <a href={website}>{website}</a>
            )}
          </div>
        )}
        <div className={styles.statsRow}>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>
              {following?.length ? following?.length : 0}
            </span>
            <span className={styles.statLabel}>Following</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>{followers?.length}</span>
            <span className={styles.statLabel}>Followers</span>
          </div>
        </div>
        <div className={styles.socialsRow}>
          {(twitterId || isEditMode) && (
            <div className={styles.socialItem}>
              <img
                className={styles.icon}
                src="/icons/twitter.svg"
                alt="instagram icon"
              />
              <p className={` ${isEditMode && styles.editInput}`}>
                @
                <input
                  placeholder="twitter_id"
                  onChange={(e) => setTwitterId(e.target.value)}
                  readOnly={!isEditMode}
                  className={styles.inputBox}
                  value={twitterId}
                />
              </p>
            </div>
          )}
          {(instagramId || isEditMode) && (
            <div className={styles.socialItem}>
              <img
                className={styles.icon}
                src="/icons/instagram.svg"
                alt="instagram icon"
              />
              <p className={` ${isEditMode && styles.editInput}`}>
                @
                <input
                  placeholder="instagram_id"
                  onChange={(e) => setInstagramId(e.target.value)}
                  readOnly={!isEditMode}
                  type="text"
                  className={styles.inputBox}
                  value={instagramId}
                />
              </p>
            </div>
          )}
        </div>
      </div>
      {auth.currentUser && (
        <button
          onClick={() => auth.signOut()}
          className={`btn btn-solid btn-small ${styles.logoutButton}`}
        >
          Logout
        </button>
      )}
    </div>
  );
}
