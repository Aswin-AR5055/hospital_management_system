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
          <p className="eyebrow">Doctor Workspace</p>
          <h1 className="page-title mt-4">Today&apos;s queue for {username || "Doctor"}</h1>
          <p className="page-copy mt-4">
            Review waiting patients, start consultations, and open patient visit history.
          </p>
        </section>

        <section className="panel">
          <div className="actions">
            <button className="btn-primary" onClick={fetchQueue}>Refresh Queue</button>
            <button className="btn-danger" onClick={logout}>Logout</button>
          </div>
          {error ? <div className="feedback-error mt-4">{error}</div> : null}
        </section>

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
                    <td>{visit.token_no}</td>
                    <td>{visit.patient}</td>
                    <td>
                      <div className="actions">
                        <button className="btn-primary" onClick={() => navigate(`/consult/${visit.id}`)}>
                          Start Consultation
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
            <div className="empty-state m-5">No patients are queued for today yet.</div>
          ) : null}
        </section>
      </div>
    </div>
  );
}
