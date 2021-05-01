import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home, Login, Signup } from "./pages";
import { PrivateRoute } from "./components/PrivateRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <PrivateRoute path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
