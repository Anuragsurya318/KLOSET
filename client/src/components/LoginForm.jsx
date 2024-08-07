import React, { useState } from "react";
import { useAuth } from "@/Context/AuthContext";
import { useNavigate } from "react-router-dom";

const LoginForm = ({ switchToRegister, setShowDialog, setLoginError, redirectPath }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = await login(username, password);
    if (error) {
      setLoginError(error);
    } else {
      setShowDialog(false); // Close the dialog on successful login
      navigate(redirectPath || "/"); // Redirect to the previous location or home page
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="login-username" className="block text-sm font-medium mb-1">
          Username:
        </label>
        <input
          type="text"
          id="login-username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label htmlFor="login-password" className="block text-sm font-medium mb-1">
          Password:
        </label>
        <input
          type="password"
          id="login-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Login
      </button>
      <p className="text-sm text-gray-600">
        New user?{" "}
        <a href="#" onClick={switchToRegister} className="text-blue-500 hover:underline">
          Register here
        </a>
      </p>
    </form>
  );
};

export default LoginForm;
