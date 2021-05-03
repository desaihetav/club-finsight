import { NavLink } from "react-router-dom";
import { useFirebase } from "../../context/FirebaseProvider";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const { user } = useFirebase();

  return (
    <div className={`container ${styles.container}`}>
      <div className={`linksLeft`}>
        <NavLink className={styles.navLink} to="/search">
          <img src="/icons/search.svg" alt="search" />
        </NavLink>
      </div>
      <div className={`${styles.linksRight}`}>
        <NavLink className={styles.navLink} to="/history">
          <img src="/icons/history.svg" alt="history" />
        </NavLink>
        <NavLink className={styles.navLink} to="/calendar">
          <img src="/icons/calendar.svg" alt="calendar" />
        </NavLink>
        <NavLink className={styles.navLink} to={`/profile/@${user.username}`}>
          <div className={styles.avatarContainer}>
            {user?.photoURL ? (
              <img
                className={styles.avatarImage}
                src={user?.photoURL}
                alt="profile pic"
              />
            ) : (
              <span>{user?.name?.[0]}</span>
            )}
          </div>
        </NavLink>
      </div>
    </div>
  );
}
