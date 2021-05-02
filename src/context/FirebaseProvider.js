import { useState, useEffect, useContext, createContext } from "react";
import { firebaseApp } from "../config/firebase";

const FirebaseContext = createContext(null);

export const useFirebase = () => useContext(FirebaseContext);

export const FirebaseProvider = ({ children }) => {
  const auth = firebaseApp.auth();
  const db = firebaseApp.firestore();

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("authUser"))
  );

  useEffect(() => {
    const listener = authListener();
    return () => listener;
  }, []);

  const authListener = async () => {
    return auth.onAuthStateChanged((authUser) => {
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
        auth: auth,
        db: db,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};
