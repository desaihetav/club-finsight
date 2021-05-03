import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  Home,
  Login,
  Signup,
  Profile,
  Room,
  CreateNewRoom,
  Calendar,
  History,
} from "./pages";
import { PrivateRoute } from "./components";

function App() {
  return (
    <Router>
      <Routes>
        <PrivateRoute path="/history" element={<History />} />
        <PrivateRoute path="/calendar" element={<Calendar />} />
        <PrivateRoute path="/create-new-room" element={<CreateNewRoom />} />
        <PrivateRoute path="/room/:roomId" element={<Room />} />
        <Route path="/profile/@:username" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <PrivateRoute path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
