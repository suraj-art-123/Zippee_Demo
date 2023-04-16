import "./App.css";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Signup from "./Components/Signup";
import { HomeDashboard } from "./Components/HomeDashboard";
import Admin from "./Components/Admin";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/Signup" element={<Signup />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/HomeDashboard" element={<HomeDashboard />} />
        <Route
          path="/*"
          element={
            localStorage.getItem("id") ? (
              <HomeDashboard />
            ) : (
              <Navigate to="/Signup" />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
