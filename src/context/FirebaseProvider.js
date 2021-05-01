import { useState, useEffect, useContext, createContext } from "react";
import { firebase } from "../config/firebase";

const FirebaseContext = createContext(null);

export const useFirebase = () => useContext(FirebaseContext);

export const FirebaseProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("authUser"))
  );

  useEffect(() => {
    const listener = authListener();
    return () => listener;
  }, []);

  const authListener = () => {
    return firebase.auth().onAuthStateChanged((authUser) => {
      if (authUser) {
        localStorage.setItem("authUser", JSON.stringify(authUser));
        setUser(authUser);
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
        auth: firebase.auth(),
        db: firebase.firestore(),
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};
