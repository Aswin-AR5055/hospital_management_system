import { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function DoctorDashboard() {

  const [queue, setQueue] = useState([]);

    const logout = () => {
        localStorage.clear();
        window.location.href = "/";
    };

    const navigate = useNavigate();

  useEffect(() => {
    fetchQueue();
  }, []);

  const fetchQueue = async () => {
    const res = await API.get("doctor-queue/");
    setQueue(res.data);
  };

  return (
    <div>

      <h1>Doctor Queue</h1>

      <button onClick={fetchQueue}>Refresh</button>
        <button onClick={logout}>Logout</button>

      <table border="1">
        <thead>
          <tr>
            <th>Token</th>
            <th>Patient ID</th>
            <th>Start</th>
          </tr>
        </thead>

        <tbody>
          {queue.map(v => (
            <tr key={v.id}>
              <td>{v.token_no}</td>
              <td>{v.patient}</td>
              <td>
                <button onClick={() => navigate(`/consult/${v.id}`)}>
                    Start Consultation
                </button>

                <button onClick={() => navigate(`/patient-history/${v.patient}`)}>
                    History
                </button>
              </td>
            </tr>
          ))}
        </tbody>

      </table>

    </div>
  );
}