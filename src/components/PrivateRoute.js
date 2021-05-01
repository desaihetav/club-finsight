import { Route, Navigate } from "react-router-dom";

import { useFirebase } from "../context/FirebaseProvider";

export function PrivateRoute({ path, ...props }) {
  const { user } = useFirebase();
  return user ? (
    <Route {...props} path={path} />
  ) : (
    <Navigate replace to="/login" />
  );
}
