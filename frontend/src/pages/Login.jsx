import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Login() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

const handleLogin = async () => {

  try {

    const res = await API.post("login/", {
      username,
      password
    });

    localStorage.setItem("token", res.data.access);
    localStorage.setItem("role", res.data.role);
    localStorage.setItem("username", res.data.username);

    if (res.data.role === "doctor") {
      navigate("/doctor");
    } else {
      navigate("/reception");
    }

  } catch {
    alert("Invalid Login");
  }
};

  return (
    <div>
      <h2>Hospital Login</h2>

      <input
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>
        Login
      </button>

    </div>
  );
}