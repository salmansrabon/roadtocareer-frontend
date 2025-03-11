import { useEffect, useState } from "react";
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

    useEffect(() => {
        fetchCourses();
    }, []);

    useEffect(() => {
        if (selectedCourse) {
            fetchDashboardData();
        }
    }, [selectedCourse, selectedMonth]);

    // ✅ Fetch Courses List (Latest First)
    const fetchCourses = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/courses/list`);
            if (response.data.courses.length > 0) {
                const sortedCourses = response.data.courses.sort((a, b) => b.courseId.localeCompare(a.courseId));
                setCourses(sortedCourses);
                setSelectedCourse(sortedCourses[0]?.courseId || ""); // Default to latest course
            }
        } catch (err) {
            console.error("Failed to fetch courses:", err);
        }
    };

    // ✅ Fetch Dashboard Data
    const fetchDashboardData = async () => {
        setLoading(true);
        setError("");

        try {
            // ✅ Fetch Payments Data
            const token = localStorage.getItem("token");
            const paymentResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/payments?courseId=${selectedCourse}&month=${selectedMonth}`,{
                headers: {
                    Authorization: `Bearer ${token}`, // ✅ Attach Token in Header
                },
            });
            setTotalPaidAmount(paymentResponse.data.totalPaidAmount);

            // ✅ Fetch Students Data to Calculate Unpaid & Due
            const studentsResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/students/list?courseId=${selectedCourse}`,{
                headers: {
                    Authorization: `Bearer ${token}`, // ✅ Attach Token in Header
                },
            });
            const students = studentsResponse.data.students || [];
            
            let totalDue = 0;
            let unpaidCount = 0;

            students.forEach(student => {
                // ✅ Ignore students who are not enrolled
                if (!student.isEnrolled) return;
    
                // ✅ Check if student has made any payment
                const paidStudent = paymentResponse.data.payments.find(p => p.studentId === student.StudentId);
                if (!paidStudent) unpaidCount += 1; // ✅ Count unpaid students
    
                totalDue += parseFloat(student.due || 0); // ✅ Sum total due
            });

            setTotalDueAmount(totalDue);
            setUnpaidStudents(unpaidCount);
        } catch (err) {
            console.error("Error fetching dashboard data:", err);
            setError("Failed to load dashboard data.");
        }

        setLoading(false);
    };

    return (
        <div className="container mt-5">
            <h2 className="fw-bold text-primary text-center">📊 Payment Dashboard</h2>

            {/* ✅ Filters Section */}
            <div className="row mb-4">
                {/* Month Dropdown */}
                <div className="col-md-6">
                    <label className="form-label fw-bold">Select Month</label>
                    <select className="form-control" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
                        {[
                            "January", "February", "March", "April", "May", "June",
                            "July", "August", "September", "October", "November", "December"
                        ].map((month) => (
                            <option key={month} value={month}>{month}</option>
                        ))}
                    </select>
                </div>

                {/* Course Dropdown */}
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

            {/* ✅ Summary Cards */}
            {loading ? (
                <p className="text-center">Loading dashboard data...</p>
            ) : error ? (
                <p className="text-danger text-center">{error}</p>
            ) : (
                <div className="row">
                    {/* Total Payment Collection */}
                    <div className="col-md-4">
                        <div className="card shadow-lg border-0 text-center p-4">
                            <h5 className="fw-bold text-success">💰 Total Collection</h5>
                            <h2 className="fw-bold">{totalPaidAmount.toFixed(2)} TK</h2>
                        </div>
                    </div>

                    {/* Total Due */}
                    <div className="col-md-4">
                        <div className="card shadow-lg border-0 text-center p-4">
                            <h5 className="fw-bold text-danger">📉 Total Due</h5>
                            <h2 className="fw-bold">{totalDueAmount.toFixed(2)} TK</h2>
                        </div>
                    </div>

                    {/* Number of Unpaid Students */}
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
