import { useNavigate } from "react-router-dom";

export default function ReceptionDashboard() {

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    navigate("/");
  };

  return (
    <div>
      <h2>Reception Dashboard</h2>
      <button onClick={() => navigate("/register")}>Create Staff Account</button>
      <button onClick={() => navigate("/generate-token")}>Generate Token</button>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}