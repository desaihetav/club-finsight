import { useState, useEffect } from "react";
import { useFirebase } from "../../context/FirebaseProvider";
import { useNavigate, Navigate } from "react-router-dom";
import styles from "./Signup.module.css";

export default function Signup() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signupStatus, setSignupStatus] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { db, auth, user } = useFirebase();
  const navigate = useNavigate();

  const usernameExists = async () => {
    const response = await db
      .collection("users")
      .where("username", "==", username)
      .get();
    const result = [];
    response.forEach((doc) => result.push(doc.data()));
    console.log(result);
    return result.length;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setSignupStatus("LOADING");
    const usernameInUse = await usernameExists();
    if (!usernameInUse) {
      try {
        const response = await auth.createUserWithEmailAndPassword(
          email,
          password
        );
        console.log(response);
        var user = response.user;
        console.log(user);
        console.log("Sign Up successful");
        const firestoreResponse = await db
          .collection("users")
          .doc(user.uid)
          .set({
            uid: user.uid,
            name: name,
            emailId: email,
            username: username,
            bio: "",
            photoURL: "",
            twitterId: "",
            instagramId: "",
            website: "",
          });
        console.log(firestoreResponse);
      } catch (error) {
        console.log(error.message);
        setErrorMessage(error.message);
        setSignupStatus("FAILED");
      }
    } else {
      setSignupStatus("USERNAME_FAILED");
      setErrorMessage(
        "The username is already in use by another account. Please try a different username."
      );
    }
  };

  return (
    <>
      {user ? (
        <Navigate to="/" replace />
      ) : (
        <>
          <div className={`flex ${styles.container}`}>
            <div className={`${styles.leftContainer}`}></div>
            <div className={`${styles.rightContainer}`}>
              <div className={`${styles.loginCard}`}>
                <h1 className={`${styles.title}`}>Signup to Club Finsight</h1>
                <p className={`${styles.subtitle}`}>
                  Get started with some awesome conversations with your network!
                </p>
                <div className="space-y-1"></div>
                {["FAILED", "USERNAME_FAILED"].includes(signupStatus) && (
                  <div className="alert alert-error">
                    <span className="material-icons-round alert-icon">
                      {" "}
                      error_outline{" "}
                    </span>
                    {errorMessage}
                  </div>
                )}
                <div className="space-y-1"></div>
                <form onSubmit={(e) => handleSignUp(e)}>
                  <input
                    placeholder="Name"
                    className={`input-field ${styles.input}`}
                    type="text"
                    value={name}
                    onChange={(e) => setName(() => e.target.value)}
                  />
                  <input
                    placeholder="Username"
                    className={`input-field ${styles.input} ${
                      signupStatus === "USERNAME_FAILED" && "input-error"
                    }`}
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(() => e.target.value)}
                  />
                  <input
                    placeholder="Email ID"
                    className={`input-field ${styles.input} ${
                      signupStatus === "FAILED" && "input-error"
                    }`}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(() => e.target.value)}
                  />
                  <input
                    placeholder="Password"
                    className={`input-field ${styles.input} ${
                      signupStatus === "FAILED" && "input-error"
                    }`}
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(() => e.target.value)}
                  />
                  <div className="space-y-1"></div>
                  <button
                    type="submit"
                    className={`btn btn-solid w-full btn-primary-gradient ${styles.submit}`}
                  >
                    {signupStatus === "LOADING" ? "Signing Up..." : "Signup"}
                  </button>
                </form>
                <div className="space-y-1"></div>
                <button
                  onClick={() => navigate("/login", { replace: "true" })}
                  className={`btn btn-ghost w-full ${styles.input}`}
                >
                  Already a member? Login instead
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
