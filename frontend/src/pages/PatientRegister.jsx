import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { getApiErrorMessage } from "../utils/apiError";

export default function PatientRegister() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    whatsapp_no: "",
    age: "",
    temperature: "",
    address: "",
    dob: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const savePatient = async () => {
    setError("");
    setIsSubmitting(true);

    try {
      await API.post("patients/", form);
      navigate("/generate-token");
    } catch (err) {
      setError(getApiErrorMessage(err, "Unable to register the patient."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-shell">
      <div className="page-content">
        <section className="hero-panel">
          <p className="eyebrow">Patient Intake</p>
          <h1 className="page-title mt-4">Register a new patient</h1>
          <p className="page-copy mt-4">
            Capture the basic intake details here, then continue directly to token generation.
          </p>
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
              <label className="field-label" htmlFor="patient-temperature">Temperature</label>
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

          {error ? <div className="feedback-error mt-4">{error}</div> : null}

          <div className="actions mt-6">
            <button className="btn-primary" disabled={isSubmitting} onClick={savePatient}>
              {isSubmitting ? "Saving..." : "Save Patient"}
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
