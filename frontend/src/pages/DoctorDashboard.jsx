export default function DoctorDashboard() {
    const logout = () => {
        localStorage.clear();
        window.location.href = "/";
    };
    return (
        <div>
            <h1>Doctor Dashboard</h1>
            <button onClick={logout}>Logout</button>
        </div>
    );
}