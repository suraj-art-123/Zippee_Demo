import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Admin = () => {
  const navigate = useNavigate();
  const [emailData, setEmailData] = useState([]);

  useEffect(() => {
    const fetchEmailData = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:5000/get_email_openstatus"
        );
        setEmailData(response.data.users);
      } catch (error) {
        console.error(error);
      }
    };

    fetchEmailData();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/signup");
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h1 style={{ color: "#ffff" }}>Admin page</h1>
      <table className="fl-table">
        <thead>
          <tr>
            <th>MailID</th>
            <th>Name</th>
            <th>Delivered At</th>
            <th>Opened At</th>
          </tr>
        </thead>
        <tbody>
          {emailData.map((email) => (
            <tr key={email.id}>
              <td>{email.id}</td>
              <td>{email.username}</td>
              <td>{email.delivered_at}</td>
              <td>{email.opened_at}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="button-home" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Admin;
