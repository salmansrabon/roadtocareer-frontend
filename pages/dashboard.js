import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function Dashboard() {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState("");
    const [selectedMonth, setSelectedMonth] = useState(new Date().toLocaleString('default', { month: 'long' }));

    const [totalPaidAmount, setTotalPaidAmount] = useState(0);
    const [totalDueAmount, setTotalDueAmount] = useState(0);
    const [unpaidStudents, setUnpaidStudents] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const router = useRouter();

    useEffect(() => {
        fetchCourses();
    }, []);

    useEffect(() => {
        if (selectedCourse) {
            fetchDashboardData();
        }
    }, [selectedCourse, selectedMonth]);

    const fetchCourses = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/courses/list`);
            if (response.data.courses.length > 0) {
                const sortedCourses = response.data.courses.sort((a, b) => b.courseId.localeCompare(a.courseId));
                setCourses(sortedCourses);
                setSelectedCourse(sortedCourses[0]?.courseId || "");
            }
        } catch (err) {
            console.error("Failed to fetch courses:", err);
        }
    };

    const fetchDashboardData = async () => {
        setLoading(true);
        setError("");

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                router.push("/login");
                return;
            }

            const paymentResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/payments/paid?courseId=${selectedCourse}&month=${selectedMonth}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setTotalPaidAmount(paymentResponse.data.totalPaidAmount);

            const unpaidResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/payments/unpaid?courseId=${selectedCourse}&month=${selectedMonth}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setUnpaidStudents(unpaidResponse.data.totalUnpaid);

            const studentsResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/students/list?courseId=${selectedCourse}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const students = studentsResponse.data.students || [];

            let totalDue = 0;
            students.forEach(student => {
                if (!student.isEnrolled) return;
                totalDue += parseFloat(student.due || 0);
            });

            setTotalDueAmount(totalDue);

        } catch (err) {
            console.error("Error fetching dashboard data:", err);

            if (err.response) {
                if (err.response.status === 401 || err.response.status === 403) {
                    alert("Session expired. Please log in again.");
                    localStorage.removeItem("token");
                    router.push("/login");
                    return;
                }

                setError(err.response.data?.message || "Failed to load dashboard data.");
            } else {
                setError("Network error. Please check your internet connection.");
            }
        }

        setLoading(false);
    };

    return (
        <div className="container mt-5">
            <h2 className="fw-bold text-primary text-center">📊 Payment Dashboard</h2>

            <div className="row mb-4">
                <div className="col-md-6">
                    <label className="form-label fw-bold">Select Month</label>
                    <select className="form-control" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
                        {["January", "February", "March", "April", "May", "June",
                            "July", "August", "September", "October", "November", "December"].map((month) => (
                                <option key={month} value={month}>{month}</option>
                        ))}
                    </select>
                </div>

                <div className="col-md-6">
                    <label className="form-label fw-bold">Select Course</label>
                    <select className="form-control" value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
                        {courses.map((course) => (
                            <option key={course.courseId} value={course.courseId}>
                                {course.courseId} - {course.course_title}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {loading ? (
                <p className="text-center">Loading dashboard data...</p>
            ) : error ? (
                <p className="text-danger text-center">{error}</p>
            ) : (
                <div className="row">
                    <div className="col-md-4">
                        <div className="card shadow-lg border-0 text-center p-4">
                            <h5 className="fw-bold text-success">💰 Total Collection</h5>
                            <h2 className="fw-bold">{totalPaidAmount.toFixed(2)} TK</h2>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="card shadow-lg border-0 text-center p-4">
                            <h5 className="fw-bold text-danger">📉 Total Due</h5>
                            <h2 className="fw-bold">{totalDueAmount.toFixed(2)} TK</h2>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="card shadow-lg border-0 text-center p-4">
                            <h5 className="fw-bold text-warning">🙅 Unpaid Students</h5>
                            <h2 className="fw-bold">{unpaidStudents}</h2>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                .card {
                    transition: transform 0.3s ease-in-out;
                    border-radius: 10px;
                }

                .card:hover {
                    transform: scale(1.05);
                }
            `}</style>
        </div>
    );
}
