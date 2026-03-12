import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api/axios";
import { getApiErrorMessage } from "../utils/apiError";

export default function Consultation() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [visit, setVisit] = useState(null);
  const [bp, setBp] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchVisit = async () => {
      try {
        const res = await API.get(`visits/${id}/`);
        setVisit(res.data);
      } catch (err) {
        setError(getApiErrorMessage(err, "Unable to load consultation details."));
      }
    };

    fetchVisit();
  }, [id]);

  const finishConsultation = async () => {
    setError("");
    setIsSubmitting(true);

    try {
      await API.put(`visits/${id}/`, {
        blood_pressure: bp,
        weight,
        height,
      });

      navigate("/doctor");
    } catch (err) {
      setError(getApiErrorMessage(err, "Unable to finish the consultation."));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!visit) {
    return (
      <div className="page-shell">
        <div className="page-content">
          <section className="panel">{error || "Loading consultation details..."}</section>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="page-content">
        <section className="hero-panel">
          <p className="eyebrow">Consultation</p>
          <h1 className="page-title mt-4">Token #{visit.token_no}</h1>
          <p className="page-copy mt-4">Complete vitals and finish the visit for patient ID {visit.patient}.</p>
        </section>

        <section className="panel max-w-3xl">
          <div className="form-grid">
            <div className="field-group">
              <label className="field-label" htmlFor="blood-pressure">Blood Pressure</label>
              <input
                id="blood-pressure"
                className="input"
                placeholder="e.g. 120/80"
                value={bp}
                onChange={(e) => setBp(e.target.value)}
              />
            </div>

            <div className="field-group">
              <label className="field-label" htmlFor="weight">Weight</label>
              <input
                id="weight"
                className="input"
                placeholder="e.g. 68"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>

            <div className="field-group">
              <label className="field-label" htmlFor="height">Height</label>
              <input
                id="height"
                className="input"
                placeholder="e.g. 172"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
              />
            </div>
          </div>

          {error ? <div className="feedback-error mt-4">{error}</div> : null}

          <div className="actions mt-6">
            <button className="btn-primary" disabled={isSubmitting} onClick={finishConsultation}>
              {isSubmitting ? "Saving..." : "Finish Consultation"}
            </button>
            <button className="btn-secondary" onClick={() => navigate("/doctor")}>
              Back to Doctor Dashboard
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
