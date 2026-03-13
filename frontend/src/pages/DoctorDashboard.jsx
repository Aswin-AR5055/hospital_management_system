import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { getApiErrorMessage } from "../utils/apiError";

export default function DoctorDashboard() {
  const [queue, setQueue] = useState([]);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const fetchQueue = async () => {
    try {
      setError("");
      const res = await API.get("doctor-queue/");
      setQueue(res.data);
    } catch (err) {
      setError(getApiErrorMessage(err, "Unable to load the doctor queue."));
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadQueue = async () => {
      try {
        setError("");
        const res = await API.get("doctor-queue/");
        if (isMounted) {
          setQueue(res.data);
        }
      } catch (err) {
        if (isMounted) {
          setError(getApiErrorMessage(err, "Unable to load the doctor queue."));
        }
      }
    };

    loadQueue();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="page-shell">
      <div className="page-content">
        <section className="hero-panel">
          <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem"}}>
            <div>
              <h1 className="page-title">Dr. {username || "Doctor"}</h1>
              <p className="page-copy mt-2">Today's patient queue</p>
            </div>
            <div style={{display: "flex", gap: "0.5rem"}}>
              <button className="btn-secondary" onClick={fetchQueue}>Refresh</button>
              <button className="btn-danger" onClick={logout}>Logout</button>
            </div>
          </div>
        </section>

        {error ? <div className="feedback-error">{error}</div> : null}

        <section className="table-shell">
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Token</th>
                  <th>Patient ID</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {queue.map((visit) => (
                  <tr key={visit.id}>
                    <td>
                      <span className="inline-flex items-center justify-center rounded-lg bg-cyan-500/20 px-3 py-1 text-lg font-bold text-cyan-400">
                        #{visit.token_no}
                      </span>
                    </td>
                    <td className="text-slate-300">Patient #{visit.patient}</td>
                    <td>
                      <div className="actions">
                        <button className="btn-primary" onClick={() => navigate(`/consult/${visit.id}`)}>
                          Consult
                        </button>
                        <button className="btn-secondary" onClick={() => navigate(`/patient-history/${visit.patient}`)}>
                          History
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {!queue.length && !error ? (
            <div className="empty-state m-5">No patients in queue</div>
          ) : null}
        </section>
      </div>
    </div>
  );
}
