import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { getApiErrorMessage } from "../utils/apiError";

export default function GenerateToken() {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patient, setPatient] = useState("");
  const [doctor, setDoctor] = useState("");
  const [token, setToken] = useState(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const fetchPatients = async () => {
      const res = await API.get("patients/");
      if (isMounted) {
        setPatients(res.data);
      }
    };

    const fetchDoctors = async () => {
      const res = await API.get("users/");
      if (isMounted) {
        setDoctors(res.data.filter((user) => user.role === "doctor"));
      }
    };

    fetchPatients();
    fetchDoctors();

    return () => {
      isMounted = false;
    };
  }, []);

  const generateToken = async () => {
    setError("");
    setToken(null);
    setIsSubmitting(true);

    try {
      const res = await API.post("visits/", {
        patient,
        doctor,
      });

      setToken(res.data.token_no);
    } catch (err) {
      setError(getApiErrorMessage(err, "Unable to generate a token."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-shell">
      <div className="page-content">
        <section className="hero-panel">
          <p className="eyebrow">Token Desk</p>
          <h1 className="page-title mt-4">Generate a patient token</h1>
          <p className="page-copy mt-4">
            Select a patient and assign the consultation to an available doctor.
          </p>
        </section>

        <section className="panel max-w-3xl">
          <div className="form-grid">
            <div className="field-group">
              <label className="field-label" htmlFor="patient">Patient</label>
              <select
                id="patient"
                className="select"
                value={patient}
                onChange={(e) => setPatient(e.target.value)}
              >
                <option value="">Select patient</option>
                {patients.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="field-group">
              <label className="field-label" htmlFor="doctor">Doctor</label>
              <select
                id="doctor"
                className="select"
                value={doctor}
                onChange={(e) => setDoctor(e.target.value)}
              >
                <option value="">Select doctor</option>
                {doctors.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.username}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error ? <div className="feedback-error mt-4">{error}</div> : null}
          {token ? <div className="feedback-success mt-4">Token generated successfully. Token number: {token}</div> : null}

          <div className="actions mt-6">
            <button className="btn-primary" disabled={isSubmitting} onClick={generateToken}>
              {isSubmitting ? "Generating..." : "Generate Token"}
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
