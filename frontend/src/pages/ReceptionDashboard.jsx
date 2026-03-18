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
          <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem"}}>
            <div>
              <h1 className="page-title">Welcome, {username || "Reception"}</h1>
              <p className="page-copy mt-2">Manage patients and staff</p>
            </div>
            <button className="btn-danger" onClick={handleLogout}>Logout</button>
          </div>
        </section>

        <section className="panel">
          <div className="grid gap-4 md:grid-cols-2">
            <button 
              className="flex flex-col items-start gap-3 rounded-2xl border border-cyan-500/30 bg-linear-to-br from-cyan-500/10 to-blue-500/10 p-6 text-left transition-all hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-500/20"
              onClick={() => navigate("/patient-register")}
            >
              <div className="rounded-xl bg-cyan-500/20 p-3">
                <svg className="h-6 w-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Register Patient</h3>
                <p className="mt-1 text-sm text-slate-400">Add new patient & generate token</p>
              </div>
            </button>

            <button 
              className="flex flex-col items-start gap-3 rounded-2xl border border-purple-500/30 bg-linear-to-br from-purple-500/10 to-pink-500/10 p-6 text-left transition-all hover:border-purple-400/50 hover:shadow-lg hover:shadow-purple-500/20"
              onClick={() => navigate("/register")}
            >
              <div className="rounded-xl bg-purple-500/20 p-3">
                <svg className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Create Staff</h3>
                <p className="mt-1 text-sm text-slate-400">Add doctors & reception staff</p>
              </div>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
