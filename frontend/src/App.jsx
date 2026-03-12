import { BrowserRouter, Routes, Route } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import DoctorDashboard from "./pages/DoctorDashboard";
import ReceptionDashboard from "./pages/ReceptionDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import GenerateToken from "./pages/GenerateToken";
import Consultation from "./pages/Consultation";
import PatientHistory from "./pages/PatientHistory";
import Unauthorized from "./pages/Unauthorized";
import PatientRegister from "./pages/PatientRegister";

function App() {

  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Login />} />

        <Route path="/register" element={<ProtectedRoute role="reception"><Register /></ProtectedRoute>} />

        <Route path="/doctor" element={<ProtectedRoute role="doctor"><DoctorDashboard /></ProtectedRoute>} />

        <Route path="/reception" element={<ProtectedRoute role="reception"><ReceptionDashboard /></ProtectedRoute>} />

        <Route path="/generate-token" element={<ProtectedRoute role="reception"><GenerateToken /></ProtectedRoute>} />

        <Route path="/consult/:id" element={<ProtectedRoute role="doctor"><Consultation /></ProtectedRoute>} />

        <Route path="/patient-history/:id" element={<ProtectedRoute role="doctor"><PatientHistory /></ProtectedRoute>} />

        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route path="/patient-register" element={<ProtectedRoute role="reception"><PatientRegister /></ProtectedRoute>} />

      </Routes>

    </BrowserRouter>
  );
}

export default App;
