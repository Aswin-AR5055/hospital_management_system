import { useNavigate } from "react-router-dom";

export default function ReceptionDashboard() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    navigate("/");
  };

  return (
    <div className="page-shell">
      <div className="page-content">
        <section className="hero-panel">
          <div style={{display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem"}}>
            <div style={{flex: "1", minWidth: "250px"}}>
              <p className="eyebrow">Reception Desk</p>
              <h1 className="page-title mt-4">Welcome, {username || "Reception Staff"}</h1>
              <p className="page-copy mt-4">
                Manage user onboarding and create patient visit tokens from one place.
              </p>
            </div>
            <button className="btn-danger" onClick={handleLogout}>Logout</button>
          </div>
        </section>

        <section className="stat-grid">
          <div className="stat-card">
            <p className="stat-label">Staff Accounts</p>
            <p className="stat-value">Create doctor and reception logins</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Visit Tokens</p>
            <p className="stat-value">Assign patient-doctor pairs for today</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Session</p>
            <p className="stat-value">Secure JWT-based access for staff workflows</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Patient</p>
            <p className="stat-value">Register Patients as needed using the Register Patient button</p>
          </div>
        </section>

        <section className="panel">
          <div className="actions">
            <button className="btn-primary" onClick={() => navigate("/register")}>Create Staff Account</button>
            <button className="btn-primary" onClick={() => navigate("/patient-register")}>Register Patient</button>
            <button className="btn-secondary" onClick={() => navigate("/generate-token")}>Generate Token</button>
          </div>
        </section>
      </div>
    </div>
  );
}
