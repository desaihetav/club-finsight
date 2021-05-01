import { useState, useEffect, useContext, createContext } from "react";
import { firebase } from "../config/firebase";

const FirebaseContext = createContext(null);

export const useFirebase = () => useContext(FirebaseContext);

export const FirebaseProvider = ({ children }) => {
  const auth = firebase.auth();
  const db = firebase.firestore();

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("authUser"))
  );

  useEffect(() => {
    const listener = authListener();
    return () => listener;
  }, []);

  const authListener = async () => {
    return firebase.auth().onAuthStateChanged((authUser) => {
      if (authUser) {
        localStorage.setItem("authUser", JSON.stringify(authUser));
        db.collection("users")
          .doc(authUser.uid)
          .onSnapshot((doc) => {
            setUser(doc.data());
          });
      } else {
        localStorage.removeItem("authUser");
        setUser(null);
      }
    });
  };

  return (
    <FirebaseContext.Provider
      value={{
        user: user,
        firebase: firebase,
        auth: auth,
        db: db,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};
