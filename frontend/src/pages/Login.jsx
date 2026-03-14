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
    <div className="page-shell flex justify-center items-center">
      <div className="page-content">
        <section className="panel mx-auto w-full max-w-md">
          <h2 className="page-title text-2xl text-center">Hospital Management</h2>
          <p className="page-copy mt-2 text-center">Sign in to continue</p>

          <form className="mt-6 space-y-4" onSubmit={handleLogin}>
            <div className="field-group">
              <label className="field-label" htmlFor="username">Username</label>
              <input
                id="username"
                className="input"
                placeholder="Enter username"
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
                placeholder="Enter password"
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
