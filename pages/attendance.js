import { useState, useEffect } from "react";
import axios from "axios";

export default function AttendancePage() {
    const [studentId, setStudentId] = useState(null);
    const [attendanceList, setAttendanceList] = useState([]);
    const [attendancePercentage, setAttendancePercentage] = useState(0);
    const [totalClicks, setTotalClicks] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [lastAttendanceTime, setLastAttendanceTime] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");

        if (!storedUser) {
            setError("User not found. Please log in again.");
            return;
        }

        try {
            const parsedUser = JSON.parse(storedUser);
            const studentId = parsedUser.username;
            setStudentId(studentId);
            fetchAttendance(studentId);
        } catch (error) {
            console.error("Error parsing user:", error);
            setError("Invalid user data. Please log in again.");
        }
    }, []);

    // ✅ Fetch Attendance List
    const fetchAttendance = async (studentId) => {
        setLoading(true);
        setError("");
    
        try {
            const token = localStorage.getItem("token");
    
            if (!token) {
                setError("Unauthorized: Please log in.");
                localStorage.removeItem("token");
                router.push("/login");
                return;
            }
    
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/students/attendance/${studentId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
    
            // ✅ Parse attendanceList safely
            let rawList = response.data.attendanceList;
            let parsedList = [];
    
            try {
                parsedList = typeof rawList === "string" ? JSON.parse(rawList) : rawList;
    
                // ✅ Handle double-stringified edge case
                if (typeof parsedList === "string") {
                    parsedList = JSON.parse(parsedList);
                }
    
                if (!Array.isArray(parsedList)) {
                    parsedList = [];
                }
    
            } catch (parseErr) {
                console.error("⚠️ Failed to parse attendanceList:", rawList);
                setError("Invalid attendance data format.");
                setLoading(false);
                return;
            }
    
            // ✅ Dynamically calculate totalClicks and attendancePercentage
            const total = parsedList.length;
            const percentage = ((total / 30) * 100).toFixed(2); // can append % in UI if needed
    
            setAttendanceList(parsedList);
            setTotalClicks(total);
            setAttendancePercentage(percentage);
    
            // ✅ Set last attendance time
            if (parsedList.length > 0) {
                const lastEntry = parsedList[parsedList.length - 1];
                const lastTime = new Date(lastEntry.time);
                setLastAttendanceTime(lastTime);
            }
    
        } catch (err) {
            console.error("Error fetching attendance:", err);
    
            if (err.response) {
                switch (err.response.status) {
                    case 400:
                        setError("Bad Request: Invalid input. Please check your request.");
                        break;
                    case 401:
                        setError("Unauthorized: Please log in to access this data.");
                        localStorage.removeItem("token");
                        router.push("/login");
                        break;
                    case 403:
                        setError("Forbidden: You do not have permission to view this data.");
                        break;
                    case 404:
                        setError("No attendance records found for this student.");
                        break;
                    case 500:
                        setError("Internal Server Error: Something went wrong on the server.");
                        break;
                    default:
                        setError("An unexpected error occurred. Please try again later.");
                }
            } else {
                setError("Network error. Please check your internet connection.");
            }
    
        } finally {
            setLoading(false);
        }
    };
    




    // ✅ Handle Attendance Marking
    const markAttendance = async () => {
        if (!studentId) {
            setError("Student ID not found. Please log in again.");
            return;
        }

        setLoading(true);
        setSuccessMessage("");
        setError("");

        const now = new Date();
        const date = now.toLocaleDateString("en-GB").replace(/\//g, "-"); // Format: dd-MM-yyyy
        const time = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true });

        // ✅ Check if attendance was given within the last 2 hours
        if (lastAttendanceTime) {
            const twoHoursLater = new Date(lastAttendanceTime);
            twoHoursLater.setHours(twoHoursLater.getHours() + 2);

            if (now < twoHoursLater) {
                setError("Attendance already given. Please wait before marking again.");
                setLoading(false);
                return;
            }
        }

        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/students/mark-attendance`,
                { studentId, date, time },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // ✅ Handle Successful Attendance Response
            if (response.status === 200) {
                setSuccessMessage(response.data.message);
                const newLastAttendanceTime = new Date(`${date} ${time}`);
                setLastAttendanceTime(newLastAttendanceTime); // ✅ Store last attendance time
                fetchAttendance(studentId);
            }
        } catch (err) {
            console.error("Error marking attendance:", err);

            // ✅ Handle API Error Responses Based on Status Code
            if (err.response) {
                if (err.response.status === 400) {
                    setError(err.response.data.message || "Invalid request. Please try again.");
                } else if (err.response.status === 401) {
                    setError("Unauthorized. Please log in again.");
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    window.location.href = "/login"; // ✅ Redirect to login if unauthorized
                } else if (err.response.status === 500) {
                    setError("Internal Server Error. Please try again later.");
                } else {
                    setError("An unexpected error occurred. Please try again.");
                }
            } else {
                setError("Network error. Please check your connection.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-primary fw-bold text-center">Student Attendance</h2>

            {error && <p className="text-danger text-center">{error}</p>}
            {successMessage && <p className="text-success text-center">{successMessage}</p>}

            <div className="text-center mb-4">
                <button className="btn btn-success" onClick={markAttendance} disabled={loading}>
                    {loading ? "Marking Attendance..." : "Give Attendance"}
                </button>
            </div>

            {loading ? (
                <p className="text-center">Loading attendance data...</p>
            ) : (
                <>
                    <div className="card shadow-lg p-4 mb-4">
                        <h4 className="fw-bold">Attendance Summary</h4>
                        <p><strong>Total Class Attendance:</strong> {totalClicks} out of 30 Class</p>
                        <p><strong>Attendance Percentage:</strong> {attendancePercentage}%</p>
                    </div>

                    {/* ✅ Attendance Table */}
                    <table className="table table-bordered table-hover">
                        <thead className="table-dark">
                            <tr>
                                <th>#</th>
                                <th>Attendance Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attendanceList.length > 0 ? (
                                attendanceList.map((entry, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{entry.time}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="2" className="text-center text-muted">
                                        No attendance records found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    );
}
