import { useState, useEffect } from "react";
import API from "../api/axios";
import { useParams, useNavigate } from "react-router-dom";

export default function Consultation() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [visit, setVisit] = useState(null);
  const [bp, setBp] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");

  useEffect(() => {
    fetchVisit();
  }, []);

  const fetchVisit = async () => {
    const res = await API.get(`visits/${id}/`);
    setVisit(res.data);
  };

  const finishConsultation = async () => {

    await API.put(`visits/${id}/`, {
      blood_pressure: bp,
      weight: weight,
      height: height
    });

    alert("Consultation completed");

    navigate("/doctor");
  };

  if (!visit) return <div>Loading...</div>;

  return (
    <div>

      <h2>Consultation</h2>

      <p>Token: {visit.token_no}</p>
      <p>Patient ID: {visit.patient}</p>

      <input
        placeholder="Blood Pressure"
        onChange={(e) => setBp(e.target.value)}
      />

      <input
        placeholder="Weight"
        onChange={(e) => setWeight(e.target.value)}
      />

      <input
        placeholder="Height"
        onChange={(e) => setHeight(e.target.value)}
      />

      <br /><br />

      <button onClick={finishConsultation}>
        Finish Consultation
      </button>

      <button onClick={() => navigate("/doctor")}>
      Back to Doctor Dashboard
      </button>

    </div>
  );
}