import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home, Login, Signup, Profile, Room } from "./pages";
import { PrivateRoute } from "./components";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/room/:roomId" element={<Room />} />
        <Route path="/profile/@:username" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <PrivateRoute path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
