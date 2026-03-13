import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { getApiErrorMessage } from "../utils/apiError";

export default function PatientRegister() {
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    whatsapp_no: "",
    age: "",
    temperature: "",
    address: "",
    dob: "",
  });
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [token, setToken] = useState(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await API.get("users/");
        setDoctors(res.data.filter((user) => user.role === "doctor"));
      } catch (err) {
        setError("Failed to load doctors");
      }
    };
    fetchDoctors();
  }, []);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const savePatientAndGenerateToken = async () => {
    setError("");
    setToken(null);
    setIsSubmitting(true);

    try {
      const patientRes = await API.post("patients/", form);
      const patientId = patientRes.data.id;

      const visitRes = await API.post("visits/", {
        patient: patientId,
        doctor: selectedDoctor,
      });

      setToken(visitRes.data.token_no);
      
      setForm({
        name: "",
        phone: "",
        whatsapp_no: "",
        age: "",
        temperature: "",
        address: "",
        dob: "",
      });
      setSelectedDoctor("");
    } catch (err) {
      setError(getApiErrorMessage(err, "Unable to register patient and generate token."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-shell">
      <div className="page-content">
        <section className="hero-panel">
          <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem"}}>
            <div>
              <h1 className="page-title">New Patient Registration</h1>
              <p className="page-copy mt-2">Register patient and assign to doctor</p>
            </div>
            <button className="btn-secondary" onClick={() => navigate("/reception")}>Back</button>
          </div>
        </section>

        <section className="panel max-w-5xl">
          <div className="form-grid">
            <div className="field-group">
              <label className="field-label" htmlFor="patient-name">Full Name</label>
              <input
                id="patient-name"
                className="input"
                name="name"
                placeholder="Enter patient name"
                value={form.name}
                onChange={handleChange}
              />
            </div>

            <div className="field-group">
              <label className="field-label" htmlFor="patient-age">Age</label>
              <input
                id="patient-age"
                className="input"
                name="age"
                placeholder="Age"
                type="number"
                value={form.age}
                onChange={handleChange}
              />
            </div>

            <div className="field-group">
              <label className="field-label" htmlFor="patient-phone">Phone</label>
              <input
                id="patient-phone"
                className="input"
                name="phone"
                placeholder="Phone number"
                value={form.phone}
                onChange={handleChange}
              />
            </div>

            <div className="field-group">
              <label className="field-label" htmlFor="patient-whatsapp">WhatsApp</label>
              <input
                id="patient-whatsapp"
                className="input"
                name="whatsapp_no"
                placeholder="WhatsApp number"
                value={form.whatsapp_no}
                onChange={handleChange}
              />
            </div>

            <div className="field-group">
              <label className="field-label" htmlFor="patient-dob">Date of Birth</label>
              <input
                id="patient-dob"
                className="input"
                name="dob"
                type="date"
                value={form.dob}
                onChange={handleChange}
              />
            </div>

            <div className="field-group">
              <label className="field-label" htmlFor="patient-temperature">Temperature (°C)</label>
              <input
                id="patient-temperature"
                className="input"
                name="temperature"
                placeholder="Temperature"
                type="number"
                step="0.1"
                value={form.temperature}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="field-group mt-4">
            <label className="field-label" htmlFor="patient-address">Address</label>
            <textarea
              id="patient-address"
              className="input min-h-24 resize-y"
              name="address"
              placeholder="Enter address"
              value={form.address}
              onChange={handleChange}
            />
          </div>

          <div className="mt-6 rounded-2xl border border-cyan-500/30 bg-cyan-500/5 p-6">
            <h3 className="text-lg font-semibold text-white">Assign Doctor</h3>
            <div className="field-group mt-4 max-w-md">
              <label className="field-label" htmlFor="doctor">Select Doctor</label>
              <select
                id="doctor"
                className="select"
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
              >
                <option value="">Choose a doctor</option>
                {doctors.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    Dr. {doc.username}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error ? <div className="feedback-error mt-4">{error}</div> : null}
          {token ? (
            <div className="feedback-success mt-4">
              ✅ Patient registered! Token #{token} generated
            </div>
          ) : null}

          <div className="actions mt-6">
            <button 
              className="btn-primary" 
              disabled={isSubmitting || !selectedDoctor} 
              onClick={savePatientAndGenerateToken}
            >
              {isSubmitting ? "Processing..." : "Register & Generate Token"}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
