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
          <p className="eyebrow">Staff Onboarding</p>
          <h1 className="page-title mt-4">Create a new staff account</h1>
          <p className="page-copy mt-4">
            Reception can create new doctor and reception users directly from this dashboard.
          </p>
        </section>

        <section className="panel max-w-3xl">
          <div className="form-grid">
            <div className="field-group">
              <label className="field-label" htmlFor="register-username">Username</label>
              <input
                id="register-username"
                className="input"
                placeholder="Enter a username"
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
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="field-group mt-4 max-w-sm">
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

          {error ? <div className="feedback-error mt-4">{error}</div> : null}

          <div className="actions mt-6">
            <button className="btn-primary" disabled={isSubmitting} onClick={registerUser}>
              {isSubmitting ? "Creating..." : "Register"}
            </button>
            <button className="btn-secondary" onClick={() => navigate("/reception")}>
              Back to Reception
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
