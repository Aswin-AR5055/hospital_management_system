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
      // Step 1: Register patient
      const patientRes = await API.post("patients/", form);
      const patientId = patientRes.data.id;

      // Step 2: Generate token
      const visitRes = await API.post("visits/", {
        patient: patientId,
        doctor: selectedDoctor,
      });

      setToken(visitRes.data.token_no);
      
      // Reset form
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
          <p className="eyebrow">Patient Registration & Token</p>
          <h1 className="page-title mt-4">Register Patient & Generate Token</h1>
          <p className="page-copy mt-4">
            Register a new patient and assign them to a doctor in one step.
          </p>
        </section>

        <section className="panel max-w-5xl">
          <div>
            <p className="eyebrow">Step 1</p>
            <h2 className="page-title mt-2 text-2xl">Patient Details</h2>
          </div>

          <div className="form-grid mt-4">
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
              <label className="field-label" htmlFor="patient-phone">Phone</label>
              <input
                id="patient-phone"
                className="input"
                name="phone"
                placeholder="Enter phone number"
                value={form.phone}
                onChange={handleChange}
              />
            </div>

            <div className="field-group">
              <label className="field-label" htmlFor="patient-whatsapp">WhatsApp Number</label>
              <input
                id="patient-whatsapp"
                className="input"
                name="whatsapp_no"
                placeholder="Enter WhatsApp number"
                value={form.whatsapp_no}
                onChange={handleChange}
              />
            </div>

            <div className="field-group">
              <label className="field-label" htmlFor="patient-age">Age</label>
              <input
                id="patient-age"
                className="input"
                name="age"
                placeholder="Enter age"
                type="number"
                value={form.age}
                onChange={handleChange}
              />
            </div>

            <div className="field-group">
              <label className="field-label" htmlFor="patient-temperature">Temperature (°C)</label>
              <input
                id="patient-temperature"
                className="input"
                name="temperature"
                placeholder="Enter temperature"
                type="number"
                step="0.1"
                value={form.temperature}
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
          </div>

          <div className="field-group mt-4">
            <label className="field-label" htmlFor="patient-address">Address</label>
            <textarea
              id="patient-address"
              className="input min-h-28 resize-y"
              name="address"
              placeholder="Enter address"
              value={form.address}
              onChange={handleChange}
            />
          </div>

          <div className="mt-8">
            <p className="eyebrow">Step 2</p>
            <h2 className="page-title mt-2 text-2xl">Assign Doctor</h2>
          </div>

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

          {error ? <div className="feedback-error mt-4">{error}</div> : null}
          {token ? (
            <div className="feedback-success mt-4">
              ✅ Patient registered successfully! Token #{token} generated for the selected doctor.
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
            <button className="btn-secondary" onClick={() => navigate("/reception")}>
              Back to Reception
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
