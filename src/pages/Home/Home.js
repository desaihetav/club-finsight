import { useFirebase } from "../../context/FirebaseProvider";
import { useState, useEffect } from "react";

export default function Home() {
  const { db, auth, user } = useFirebase();

  const [name, setName] = useState("");

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

  return (
    <div className="container">
      <h1>Hello, {name}</h1>
      <button onClick={handleLogOut}>Logout</button>
    </div>
  );
}
