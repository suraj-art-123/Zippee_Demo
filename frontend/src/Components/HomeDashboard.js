import { React, useState } from "react";
import { useNavigate } from "react-router-dom";

export const HomeDashboard = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("id"));

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    navigate("/signup");
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h1 style={{ color: "#ffff" }}>HomeDashboard</h1>
      <button className="button-home" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default HomeDashboard;
