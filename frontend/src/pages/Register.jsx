import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Register() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("doctor");

  const navigate = useNavigate();

  const backToReception = () => {
    navigate("/reception")
  }

  const registerUser = async () => {

    try {

      await API.post("register/", {
        username,
        password,
        role
      });

      alert("User Created Successfully");

      navigate("/reception");

    } catch {

      alert("Error creating user");

    }
  };

  return (
    <div>

      <h2>Create Staff Account</h2>

      <input
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <select onChange={(e) => setRole(e.target.value)}>

        <option value="doctor">Doctor</option>
        <option value="reception">Reception</option>

      </select>

      <br /><br />

      <button onClick={registerUser}>
        Register
      </button>

      <button onClick={backToReception}>
        Back to reception
      </button>

    </div>
  );
}