import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { getApiErrorMessage } from "../utils/apiError";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const res = await API.post("login/", {
        username: username.trim(),
        password,
      });

      localStorage.setItem("token", res.data.access);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("username", res.data.username);

      if (res.data.role === "doctor") {
        navigate("/doctor");
      } else {
        navigate("/reception");
      }
    } catch (err) {
      setError(getApiErrorMessage(err, "Unable to log in."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-shell">
      <div className="page-content lg:grid lg:max-w-7xl lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <section className="hero-panel">
          <p className="eyebrow">Hospital Management System</p>
          <h1 className="page-title mt-4">Run reception and consultation workflows from one dashboard.</h1>
          <p className="page-copy mt-4">
            Sign in with your staff account to manage registrations, issue visit tokens,
            and access the doctor consultation queue.
          </p>
          <div className="stat-grid mt-8">
            <div className="stat-card">
              <p className="stat-label">Reception</p>
              <p className="stat-value">Create staff and generate daily tokens</p>
            </div>
            <div className="stat-card">
              <p className="stat-label">Doctor</p>
              <p className="stat-value">Review queue and complete consultations</p>
            </div>
            <div className="stat-card">
              <p className="stat-label">Records</p>
              <p className="stat-value">Access patient history in one place</p>
            </div>
          </div>
        </section>

        <section className="panel mx-auto w-full max-w-xl">
          <p className="eyebrow">Staff Login</p>
          <h2 className="page-title mt-3 text-2xl">Welcome back</h2>
          <p className="page-copy mt-3">Use the same username and password that was created for your staff account.</p>

          <form className="mt-8 space-y-4" onSubmit={handleLogin}>
            <div className="field-group">
              <label className="field-label" htmlFor="username">Username</label>
              <input
                id="username"
                className="input"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="field-group">
              <label className="field-label" htmlFor="password">Password</label>
              <input
                id="password"
                className="input"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error ? <div className="feedback-error">{error}</div> : null}

            <button className="btn-primary w-full" disabled={isSubmitting} type="submit">
              {isSubmitting ? "Signing in..." : "Login"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
