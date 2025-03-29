import { useState, useEffect } from "react";
import axios from "axios";
import { CSVLink } from "react-csv";

export default function AttendanceList() {
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [courses, setCourses] = useState([]);
    const [exportData, setExportData] = useState([]);

    const [filters, setFilters] = useState({
        courseId: "",
        batch_no: "",
        student_name: ""
    });

    useEffect(() => {
        fetchCourses();
        fetchAttendanceRecords();
        fetchExportData();
    }, [filters]);

    const fetchCourses = async () => {
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/courses/list`);
            setCourses(res.data.courses);
        } catch (err) {
            console.error("Failed to fetch courses", err);
        }
    };

    const fetchAttendanceRecords = async () => {
        setLoading(true);
        setError("");
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/students/list/attendance`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    params: filters,
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

    const fetchExportData = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/students/list/attendance`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    params: filters,
                }
            );
            setExportData(response.data.attendanceRecords || []);
        } catch (err) {
            console.error("Failed to fetch export data");
        }
    };

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const exportHeaders = [
        { label: "Course ID", key: "courseId" },
        { label: "Course Title", key: "courseTitle" },
        { label: "Batch No", key: "batch_no" },
        { label: "Student ID", key: "StudentId" },
        { label: "Student Name", key: "student_name" },
        { label: "Classes Attended", key: "totalClicks" },
        { label: "Attendance %", key: "attendancePercentage" }
    ];

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="text-primary fw-bold">Attendance Records</h2>
                <CSVLink
                    data={exportData}
                    headers={exportHeaders}
                    filename={`attendance_export_${new Date().toISOString()}.csv`}
                    className="btn btn-success"
                >
                    Export to Excel
                </CSVLink>
            </div>

            {error && <p className="text-danger text-center">{error}</p>}

            {/* Filter Section */}
            <div className="card p-3 mb-4">
                <div className="row">
                    <div className="col-md-4">
                        <label>Course ID</label>
                        <select
                            className="form-control"
                            name="courseId"
                            value={filters.courseId}
                            onChange={handleFilterChange}
                        >
                            <option value="">Select Course</option>
                            {courses
                                .slice()
                                .sort((a, b) => parseInt(b.batch_no) - parseInt(a.batch_no)) // ✅ Sort descending
                                .map(course => (
                                    <option key={course.courseId} value={course.courseId}>
                                        {course.courseId} - Batch-{course.batch_no}
                                    </option>
                                ))
                            }

                        </select>
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
                <button className="btn btn-primary mt-3" onClick={fetchAttendanceRecords}>Apply Filters</button>
            </div>

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
