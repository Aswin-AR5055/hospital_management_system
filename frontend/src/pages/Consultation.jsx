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
  const [meds, setMeds] = useState([
    { name: "", type: "tablet", morning: false, afternoon: false, evening: false, qty: 1 }
  ]);
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

  const addRow = () => {
    setMeds([...meds, { name: "", type: "tablet", morning: false, afternoon: false, evening: false, qty: 1 }]);
  };

  const updateMed = (index, field, value) => {
    const newMeds = [...meds];
    newMeds[index][field] = value;
    setMeds(newMeds);
  };

  const finishConsultation = async () => {
    setError("");
    setIsSubmitting(true);

    try {
      await API.patch(`visits/${id}/`, {
        blood_pressure: bp,
        weight: weight,
        height: height,
      });

      const validMeds = meds.filter((medicine) => medicine.name.trim());

      for (const m of validMeds) {
        await API.post("prescriptions/", {
          visit: id,
          medicine_name: m.name,
          medicine_type: m.type,
          morning: m.morning,
          afternoon: m.afternoon,
          evening: m.evening,
          quantity: m.qty,
        });
      }

      alert("Consultation Completed")

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
          <section className="panel">{error || "Loading..."}</section>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="page-content">
        <section className="hero-panel">
          <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem"}}>
            <div>
              <h1 className="page-title">Token #{visit.token_no} - Patient #{visit.patient}</h1>
              <p className="page-copy mt-2">Record vitals and prescribe medicines</p>
            </div>
            <button className="btn-secondary" onClick={() => navigate("/doctor")}>Back</button>
          </div>
        </section>

        <section className="panel max-w-5xl">
          <h3 className="text-lg font-semibold text-white">Vitals</h3>
          <div className="form-grid mt-4">
            <div className="field-group">
              <label className="field-label" htmlFor="blood-pressure">Blood Pressure</label>
              <input
                id="blood-pressure"
                className="input"
                placeholder="120/80"
                value={bp}
                onChange={(e) => setBp(e.target.value)}
              />
            </div>

            <div className="field-group">
              <label className="field-label" htmlFor="weight">Weight (kg)</label>
              <input
                id="weight"
                className="input"
                placeholder="68"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>

            <div className="field-group">
              <label className="field-label" htmlFor="height">Height (cm)</label>
              <input
                id="height"
                className="input"
                placeholder="172"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
              />
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between gap-4">
            <h3 className="text-lg font-semibold text-white">Prescription</h3>
            <button className="btn-secondary" onClick={addRow} type="button">
              + Add Medicine
            </button>
          </div>

          {meds.map((m, i) => (
            <div key={i} className="mt-4 rounded-2xl border border-white/10 bg-slate-950/50 p-5">
              <div className="form-grid">
                <div className="field-group">
                  <label className="field-label" htmlFor={`meds-name-${i}`}>Medicine</label>
                  <input
                    id={`meds-name-${i}`}
                    className="input"
                    placeholder="Medicine name"
                    value={m.name}
                    onChange={(e) => updateMed(i, "name", e.target.value)}
                  />
                </div>

                <div className="field-group">
                  <label className="field-label" htmlFor={`meds-type-${i}`}>Type</label>
                  <select
                    id={`meds-type-${i}`}
                    className="select"
                    value={m.type}
                    onChange={(e) => updateMed(i, "type", e.target.value)}
                  >
                    <option value="tablet">Tablet</option>
                    <option value="syrup">Syrup</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-4">
                <label className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200">
                  <input
                    className="h-4 w-4 accent-cyan-400"
                    type="checkbox"
                    checked={m.morning}
                    onChange={(e) => updateMed(i, "morning", e.target.checked)}
                  />
                  Morning
                </label>

                <label className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200">
                  <input
                    className="h-4 w-4 accent-cyan-400"
                    type="checkbox"
                    checked={m.afternoon}
                    onChange={(e) => updateMed(i, "afternoon", e.target.checked)}
                  />
                  Afternoon
                </label>

                <label className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200">
                  <input
                    className="h-4 w-4 accent-cyan-400"
                    type="checkbox"
                    checked={m.evening}
                    onChange={(e) => updateMed(i, "evening", e.target.checked)}
                  />
                  Evening
                </label>

                <div className="field-group">
                  <input
                    id={`meds-qty-${i}`}
                    className="input"
                    type="number"
                    min="1"
                    placeholder="Qty"
                    value={m.qty}
                    onChange={(e) => updateMed(i, "qty", e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}

          {error ? <div className="feedback-error mt-4">{error}</div> : null}

          <div className="actions mt-6">
            <button className="btn-primary" disabled={isSubmitting} onClick={finishConsultation}>
              {isSubmitting ? "Saving..." : "Complete Consultation"}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
