import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api/axios";
import { getApiErrorMessage } from "../utils/apiError";

export default function PatientHistory() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [visits, setVisits] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await API.get(`patient-history/${id}/`);
        setVisits(res.data);
      } catch (err) {
        setError(getApiErrorMessage(err, "Unable to load the patient history."));
      }
    };

    fetchHistory();
  }, [id]);

  return (
    <div className="page-shell">
      <div className="page-content">
        <section className="hero-panel">
          <p className="eyebrow">Patient Record</p>
          <h1 className="page-title mt-4">Visit history for patient #{id}</h1>
          <p className="page-copy mt-4">Review previous vitals and consultation timestamps.</p>
        </section>

        {error ? <div className="feedback-error">{error}</div> : null}

        <section className="table-shell">
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Token</th>
                  <th>BP</th>
                  <th>Weight</th>
                  <th>Height</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {visits.map((visit) => (
                  <tr key={visit.id}>
                    <td>{visit.token_no}</td>
                    <td>{visit.blood_pressure || "-"}</td>
                    <td>{visit.weight || "-"}</td>
                    <td>{visit.height || "-"}</td>
                    <td>{new Date(visit.intime).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {!visits.length && !error ? (
            <div className="empty-state m-5">No historical visits were found for this patient.</div>
          ) : null}
        </section>

        <div className="actions">
          <button className="btn-secondary" onClick={() => navigate(-1)}>
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
