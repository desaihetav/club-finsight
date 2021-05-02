import { useFirebase } from "../../context/FirebaseProvider";
import styles from "./MessageCard.module.css";

export default function MessageCard({ message }) {
  const { senderId, senderName, text, createdAt } = message;
  const { user } = useFirebase();

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

  const fullDate = new Date(createdAt?.toDate());
  const date = ` ${pad(fullDate.getDate())} ${
    months[fullDate.getMonth()]
  } ${fullDate.getFullYear()}, ${pad(fullDate.getHours())}:${pad(
    fullDate.getMinutes()
  )}`;

  return (
    <div
      className={`${styles.container} ${
        user.uid === senderId && styles.alignRight
      }`}
    >
      {text.split("\n").map((textItem) => (
        <p className={`${styles.text}`}>{textItem}</p>
      ))}
      <div className={`${styles.metadata}`}>
        <p className={`${styles.name}`}>{senderName}</p>
        <p className={styles.seperator}>|</p>
        <p className={`${styles.timestamp}`}>{date}</p>
      </div>
    </div>
  );
}
