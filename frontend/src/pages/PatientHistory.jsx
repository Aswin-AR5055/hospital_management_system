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
          <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem"}}>
            <div>
              <h1 className="page-title">Patient #{id} History</h1>
              <p className="page-copy mt-2">Previous visits and prescriptions</p>
            </div>
            <button className="btn-secondary" onClick={() => navigate(-1)}>Back</button>
          </div>
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
                  <th>Medicines</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {visits.map((visit) => (
                  <tr key={visit.id}>
                    <td>
                      <span className="inline-flex items-center justify-center rounded-lg bg-cyan-500/20 px-2 py-1 text-sm font-bold text-cyan-400">
                        #{visit.token_no}
                      </span>
                    </td>
                    <td>{visit.blood_pressure || "-"}</td>
                    <td>{visit.weight ? `${visit.weight} kg` : "-"}</td>
                    <td>{visit.height ? `${visit.height} cm` : "-"}</td>
                    <td>
                      {visit.prescriptions?.length > 0 ? (
                        <div className="space-y-1">
                          {visit.prescriptions.map(p => (
                            <div key={p.id} className="text-sm">
                              {p.medicine_name} ({p.quantity})
                            </div>
                          ))}
                        </div>
                      ) : "-"}
                    </td>
                    <td className="text-slate-400">{new Date(visit.intime).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {!visits.length && !error ? (
            <div className="empty-state m-5">No visit history found</div>
          ) : null}
        </section>
      </div>
    </div>
  );
}
