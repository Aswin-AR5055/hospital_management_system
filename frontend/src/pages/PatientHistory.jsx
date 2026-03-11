import { useEffect, useState } from "react";
import API from "../api/axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function PatientHistory() {

  const { id } = useParams();

  const [visits, setVisits] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
    const res = await API.get(`patient-history/${id}/`);
    setVisits(res.data);
  };
    fetchHistory();
  }, [id]);

  return (
    <div>

      <h2>Patient History</h2>

      <table border="1">
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
          {visits.map(v => (
            <tr key={v.id}>
              <td>{v.token_no}</td>
              <td>{v.blood_pressure}</td>
              <td>{v.weight}</td>
              <td>{v.height}</td>
              <td>{v.intime}</td>
            </tr>
          ))}
        </tbody>

      </table>

      <br />

      <button onClick={() => navigate(-1)}>
        Back
      </button>

    </div>
  );
}