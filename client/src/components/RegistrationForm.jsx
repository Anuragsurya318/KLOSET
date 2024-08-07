// components/modals/RegistrationForm.jsx

import React, { useState } from "react";
import axios from "axios";

const RegistrationForm = ({ switchToLogin, setShowDialog }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://kloset.onrender.com/user/register", { username, password });
      switchToLogin();
    } catch (err) {
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="register-username" className="block text-sm font-medium mb-1">
          Username:
        </label>
        <input
          type="text"
          id="register-username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label htmlFor="register-password" className="block text-sm font-medium mb-1">
          Password:
        </label>
        <input
          type="password"
          id="register-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <button
        type="submit"
        className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Register
      </button>
      <p className="text-sm text-gray-600">
        Already a user?{" "}
        <a href="#" onClick={switchToLogin} className="text-blue-500 hover:underline">
          Login here
        </a>
      </p>
    </form>
  );
};

export default RegistrationForm;
