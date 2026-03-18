import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { getApiErrorMessage } from "../utils/apiError";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("doctor");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const registerUser = async () => {
    setError("");
    setIsSubmitting(true);

    try {
      await API.post("register/", {
        username: username.trim(),
        password,
        role,
      });

      navigate("/reception");
    } catch (err) {
      setError(getApiErrorMessage(err, "Unable to create the user."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-shell">
      <div className="page-content">
        <section className="hero-panel">
          <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem"}}>
            <div>
              <h1 className="page-title">Create Staff Account</h1>
              <p className="page-copy mt-2">Add new doctor or reception staff</p>
            </div>
            <button className="btn-secondary" onClick={() => navigate("/reception")}>Back</button>
          </div>
        </section>

        <section className="panel max-w-3sm">
          <div className="form-grid">
            <div className="field-group">
              <label className="field-label" htmlFor="register-username">Username</label>
              <input
                id="register-username"
                className="input"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="field-group">
              <label className="field-label" htmlFor="register-password">Password</label>
              <input
                id="register-password"
                className="input"
                type="password"
                placeholder="Create password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="field-group">
              <label className="field-label" htmlFor="register-role">Role</label>
              <select
                id="register-role"
                className="select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="doctor">Doctor</option>
                <option value="reception">Reception</option>
              </select>
            </div>
          </div>

          {error ? <div className="feedback-error mt-4">{error}</div> : null}

          <div className="actions mt-6">
            <button className="btn-primary" disabled={isSubmitting} onClick={registerUser}>
              {isSubmitting ? "Creating..." : "Create Account"}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}