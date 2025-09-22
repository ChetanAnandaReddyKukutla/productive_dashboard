import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import DashboardWrapper from "./pages/Dashboard";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<DashboardWrapper />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
