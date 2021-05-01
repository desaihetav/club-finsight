import { useState, useEffect } from "react";
import { useFirebase } from "../../context/FirebaseProvider";
import { useNavigate, Navigate } from "react-router-dom";
import styles from "./Login.module.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginStatus, setLoginStatus] = useState("Login");
  const [errorMessage, setErrorMessage] = useState("");
  const { firebase, user } = useFirebase();
  const db = firebase.firestore();
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoginStatus("LOADING");
    try {
      const response = await firebase
        .auth()
        .signInWithEmailAndPassword(email, password);
      console.log(response.user);
      const firestoreResponse = await db
        .collection("users")
        .doc(response.user.uid)
        .update({
          lastLoggedInAt: Date.now(),
        });
    } catch (error) {
      console.log(error);
      setErrorMessage(error.message);
      setLoginStatus("FAILED");
    }
  };

  return (
    <>
      {user ? (
        <Navigate to="/" replace />
      ) : (
        <>
          <div className={`${styles.container}`}>
            <div className={`${styles.leftContainer}`}>
              {/* <div className={`${styles.leftContainerTint}`}>
                <h1 className={`${styles.leftContainerText}`}>Club Finsight</h1>
              </div> */}
            </div>
            <div className={`${styles.rightContainer}`}>
              <div className={`${styles.loginCard}`}>
                <h1 className={`${styles.title}`}>Login to Club Finsight</h1>
                <p className={`${styles.subtitle}`}>
                  Welcome back to awesome conversations with your network!
                </p>
                <div className="space-y-1"></div>
                {loginStatus === "FAILED" && (
                  <div className="alert alert-error">
                    <span className="material-icons-round alert-icon">
                      {" "}
                      error_outline{" "}
                    </span>
                    {errorMessage}
                  </div>
                )}
                <div className="space-y-1"></div>
                <form onSubmit={(e) => handleSignIn(e)}>
                  <input
                    placeholder="Enter Email"
                    className={`input-field ${styles.input} ${
                      loginStatus === "FAILED" && "input-error"
                    }`}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(() => e.target.value)}
                  />

                  <input
                    placeholder="Enter Password"
                    className={`input-field ${styles.input} ${
                      loginStatus === "FAILED" && "input-error"
                    }`}
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(() => e.target.value)}
                  />
                  <button
                    type="submit"
                    className={`btn btn-solid w-full btn-primary-gradient ${styles.submit}`}
                  >
                    {loginStatus === "Loading" ? "Loggin In..." : "Login"}
                  </button>
                </form>
                <button
                  onClick={() => navigate("/signup", { replace: "true" })}
                  className={`btn btn-ghost w-full ${styles.input}`}
                >
                  Not A Member Yet? Sign Up
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
