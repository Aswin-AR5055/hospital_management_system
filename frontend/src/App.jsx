import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import DoctorDashboard from "./pages/DoctorDashboard";
import ReceptionDashboard from "./pages/ReceptionDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {

  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Login />} />

        <Route path="/doctor" element={<DoctorDashboard />} />

        <Route path="/reception" element={<ReceptionDashboard />} />

        <Route path="/doctor" element={<ProtectedRoute role="doctor"><DoctorDashboard /></ProtectedRoute>} />

        <Route path="/reception" element={<ProtectedRoute role="reception"><ReceptionDashboard /></ProtectedRoute>} />

      </Routes>

    </BrowserRouter>
  );
}

export default App;