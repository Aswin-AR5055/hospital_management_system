import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { getApiErrorMessage } from "../utils/apiError";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("doctor");
  const [phoneNumber, setPhoneNumber] = useState("");
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
        phone_number: phoneNumber.trim(),
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

          <div className="form-grid mt-4">
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

            <div className="field-group">
              <label className="field-label" htmlFor="register-phone">
                WhatsApp Number {role === "doctor" && <span className="text-blue-600">(for notifications)</span>}
              </label>
              <input
                id="register-phone"
                className="input"
                type="tel"
                placeholder="+919876543210"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              <small className="text-gray-500 text-sm mt-1">
                Include country code (e.g., +91 for India)
              </small>
            </div>
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