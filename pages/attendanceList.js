import { useState, useEffect } from "react";
import axios from "axios";

export default function AttendanceList() {
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ✅ Filter States
    const [filters, setFilters] = useState({
        courseId: "",
        batch_no: "",
        student_name: ""
    });

    // ✅ Fetch Attendance Records (Triggered on Component Mount & Filter Change)
    useEffect(() => {
        fetchAttendanceRecords();
    }, []); // ✅ Fetch data only on mount

    // ✅ Function to Fetch Attendance Records
    const fetchAttendanceRecords = async (appliedFilters = filters) => {
        setLoading(true);
        setError("");
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/students/list/attendance`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    params: appliedFilters, // ✅ Send filters dynamically
                }
            );
            setAttendanceRecords(response.data.attendanceRecords);
        } catch (err) {
            console.error("Error fetching attendance records:", err);
            setError("Failed to load attendance records.");
        } finally {
            setLoading(false);
        }
    };

    // ✅ Handle Input Changes for Filters
    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    // ✅ Apply Filters (Trigger API Request)
    const applyFilters = () => {
        fetchAttendanceRecords(filters);
    };

    return (
        <div className="container mt-4">
            <h2 className="text-primary fw-bold text-center">Attendance Records</h2>

            {error && <p className="text-danger text-center">{error}</p>}

            {/* ✅ Filter Section */}
            <div className="card p-3 mb-4">
                <div className="row">
                    <div className="col-md-4">
                        <label>Course ID</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            name="courseId" 
                            value={filters.courseId} 
                            onChange={handleFilterChange} 
                        />
                    </div>
                    <div className="col-md-4">
                        <label>Batch No</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            name="batch_no" 
                            value={filters.batch_no} 
                            onChange={handleFilterChange} 
                        />
                    </div>
                    <div className="col-md-4">
                        <label>Student Name</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            name="student_name" 
                            value={filters.student_name} 
                            onChange={handleFilterChange} 
                        />
                    </div>
                </div>
                <button className="btn btn-primary mt-3" onClick={applyFilters}>Apply Filters</button>
            </div>

            {/* ✅ Attendance Table */}
            {loading ? (
                <p className="text-center">Loading attendance data...</p>
            ) : (
                <table className="table table-bordered table-hover">
                    <thead className="table-dark">
                        <tr>
                            <th>Course ID</th>
                            <th>Course Title</th>
                            <th>Batch No</th>
                            <th>Student ID</th>
                            <th>Student Name</th>
                            <th>Classes Attended</th>
                            <th>Attendance %</th>
                        </tr>
                    </thead>
                    <tbody>
                        {attendanceRecords.length > 0 ? (
                            attendanceRecords.map((record, index) => (
                                <tr key={index}>
                                    <td>{record.courseId}</td>
                                    <td>{record.courseTitle}</td>
                                    <td>{record.batch_no}</td>
                                    <td>{record.StudentId}</td>
                                    <td>{record.student_name}</td>
                                    <td>{record.totalClicks}</td>
                                    <td>{record.attendancePercentage}%</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center text-muted">
                                    No attendance records found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
}
