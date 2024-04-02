import React, { useContext, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import "./style.css";
import { UserErrors } from "../../models/errors";
import { ShopContext } from "../../context/shop-context";

export const AuthPage = () => {
  const [isRegistering, setIsRegistering] = useState(true);

  return (
    <div className="auth">
      {isRegistering ? (
        <Register onLoginClick={() => setIsRegistering(false)} />
      ) : (
        <Login onRegisterClick={() => setIsRegistering(true)} />
      )}
    </div>
  );
};

const Login = ({ onRegisterClick }) => {
  const [_, setCookies] = useCookies(["access_token"]);
  const { setIsAuthenticated } = useContext(ShopContext);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const result = await axios.post("http://localhost:3000/user/login", {
        username,
        password,
      });

      setCookies("access_token", result.data.token);
      window.localStorage.setItem("userID", result.data.userID);
      setIsAuthenticated(true);
      navigate("/");
    } catch (err) {
      let errorMessage = "";
      switch (err.response.data.type) {
        case UserErrors.USERNAME_ALREADY_EXISTS:
          errorMessage = "User already exists";
          break;
        case UserErrors.WRONG_CREDENTIALS:
          errorMessage = "Wrong username/password combination";
          break;
        default:
          errorMessage = "Something went wrong";
      }

      alert("ERROR: " + errorMessage);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <button type="submit" className="submit">
          Login
        </button>
      </form>
      <p>
        New user?{" "}
        <span
          style={{ textDecoration: "underline", cursor: "pointer", fontWeight: "bold" }}
          onClick={onRegisterClick}
        >
          Please register
        </span>
      </p>
    </div>
  );
};

const Register = ({ onLoginClick }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post("http://localhost:3000/user/register", {
        username,
        password,
      });
      alert("Registration Completed! Now login.");
    } catch (err) {
      if (err.response.data.type === UserErrors.NO_USER_FOUND) {
        alert("ERROR: No user found");
      } else {
        alert("ERROR: Something went wrong");
      }
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit}>
        <h2>Register</h2>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <button type="submit" className="submit">
          Register
        </button>
      </form>
      <p>
        Already a user?{" "}
        <span
          style={{ textDecoration: "underline", cursor: "pointer", fontWeight: "bold" }}
          onClick={onLoginClick}
        >
          Please login
        </span>
      </p>
    </div>
  );
};
