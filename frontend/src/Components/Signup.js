import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Alert from "./Alert";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showSpinner, setShowSpinner] = useState(false);
  const navigate = useNavigate();

  // handle Signup method

  const handleSignup = async (event) => {
    event.preventDefault();
    if (!email || !password || !username) {
      Alert({ msg: "Please enter all fields", icon: "error" });
      return;
    } else if (password.length < 4) {
      Alert({ msg: "Password must be minimum 4 characters", icon: "error" });
      return;
    }
    const isValid = await loginTest(email, password);
    if (isValid) {
      try {
        const response = await axios.post("http://127.0.0.1:5000/signup", {
          username,
          email,
          password,
        });

        if (response.data.status === 201) {
          console.log(response.data.status);
          Alert({ msg: response.data.msg, icon: "error" });
        } else {
          Alert({ msg: response.data.msg, icon: "success" });
        }
      } catch (error) {
        Alert({ msg: error.message, icon: "error" });
      }
    }
  };

  // handle Login method

  const handleLogin = async (e) => {
    if (!email || !password) {
      Alert({ msg: "Please enter all fields", icon: "error" });
      return;
    }
    e.preventDefault();
    setShowSpinner(true);
    const isValid = await loginTest(email, password);
    if (isValid) {
      try {
        const response = await axios.post("http://127.0.0.1:5000/login", {
          email,
          password,
        });
        localStorage.setItem("id", response.data.id);
        if (response.data.email === "main@gmail.com") {
          navigate("/admin");
        } else {
          localStorage.setItem("email", response.data.email);
          if (response.data.id) {
            Alert({ msg: response.data.msg, icon: "success" });
            navigate("/HomeDashboard");
          } else {
            Alert({ msg: response.data.msg, icon: "error" });
          }
        }
      } catch (error) {
        Alert({ msg: error.message, icon: "error" });
        navigate("/error");
      }
    }
    setShowSpinner(false);
  };

  // login creadintials validation

  const loginTest = (email, password) => {
    if (email && password) {
      const re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!re.test(email.toLowerCase())) {
        fireErrorAlert(
          "Incorrect email format.",
          "Enter a correct email to login."
        );
        return false;
      }
    } else if (email && !password) {
      fireErrorAlert("Password required.", "Enter your password to login.");
      return false;
    } else if (password && !email) {
      fireErrorAlert("Email required.", "Enter your email to login.");
      return false;
    } else if (!email && !password) {
      fireErrorAlert("Fields required.", "Email and password are required.");
      return false;
    }

    return true;
  };

  // email verification
  const fireErrorAlert = (title, text) => {
    Swal.fire({
      title,
      icon: "error",
      text,
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false,
      heightAuto: false,
    });
  };

  return (
    <div>
      <div className="main">
        <input type="checkbox" id="chk" aria-hidden="true" />
        <div className="signup">
          <form onSubmit={handleSignup}>
            <label htmlFor="chk" aria-hidden="true">
              Sign up
            </label>
            <input
              type="text"
              name="txt"
              placeholder="User name"
              required=""
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="text"
              name="email"
              placeholder="Email"
              required=""
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              name="pswd"
              placeholder="Password"
              required=""
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">{showSpinner ? "Loading" : "Sign Up"}</button>
          </form>
        </div>

        <div className="login">
          <form onSubmit={handleLogin}>
            <label htmlFor="chk" aria-hidden="true">
              Login
            </label>
            <input
              type="text"
              name="email"
              placeholder="Email"
              required=""
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              name="pswd"
              placeholder="Password"
              required=""
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
