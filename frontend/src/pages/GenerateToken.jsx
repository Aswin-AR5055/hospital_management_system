import { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function GenerateToken() {

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [patient, setPatient] = useState("");
  const [doctor, setDoctor] = useState("");

  const [token, setToken] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchPatients = async () => {
      const res = await API.get("patients/");
      if (isMounted) setPatients(res.data);
    };

    const fetchDoctors = async () => {
      const res = await API.get("users/"); // we will build this API next
      if (isMounted) setDoctors(res.data.filter(u => u.role === "doctor"));
    };

    fetchPatients();
    fetchDoctors();

    return () => {
      isMounted = false;
    };
  }, []);

  const navigate = useNavigate();

  const backToReception = () => {
    navigate("/reception")
  };

  const generateToken = async () => {

    try {

      const res = await API.post("visits/", {
        patient,
        doctor,
      });

      setToken(res.data.token_no);

    } catch {
      alert("Error generating token");
    }
  };

  return (
    <div>

      <h2>Generate Token</h2>

      <select onChange={(e) => setPatient(e.target.value)}>
        <option>Select Patient</option>
        {patients.map(p => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>

      <br /><br />

      <select onChange={(e) => setDoctor(e.target.value)}>
        <option>Select Doctor</option>
        {doctors.map(d => (
          <option key={d.id} value={d.id}>
            {d.username}
          </option>
        ))}
      </select>

      <br /><br />

      <button onClick={generateToken}>
        Generate Token
      </button>

      <button onClick={backToReception}>
        Back to reception
      </button>

      {token && (
        <h1>Token Number: {token}</h1>
      )}

    </div>
  );
}