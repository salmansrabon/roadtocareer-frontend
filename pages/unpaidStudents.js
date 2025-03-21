import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function UnpaidStudents() {
    const router = useRouter();
    const [students, setStudents] = useState([]);
    const [courses, setCourses] = useState([]);
    const [totalUnpaid, setTotalUnpaid] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    
    // Filters
    const [month, setMonth] = useState("");
    const [batchNo, setBatchNo] = useState("");
    const [courseId, setCourseId] = useState("");
    const limit = 10;

    useEffect(() => {
        fetchCourses();
        fetchUnpaidStudents();
    }, [month, batchNo, courseId, currentPage]);

    const fetchCourses = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/courses/list`);
            setCourses(response.data.courses);
        } catch (error) {
            console.error("Error fetching courses:", error);
        }
    };

    const fetchUnpaidStudents = async () => {
        setLoading(true);
        setError("");
        try {
            const params = { limit, offset: (currentPage - 1) * limit };
            if (month) params.month = month;
            if (batchNo) params.batch_no = batchNo;
            if (courseId) params.courseId = courseId;

            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/payments/unpaid`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                params,
            });

            setStudents(response.data.unpaidStudents);
            setTotalUnpaid(response.data.totalUnpaid);
            setTotalPages(response.data.totalPages);
        } catch (err) {
            setError("Failed to load unpaid students.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-fluid mt-4">
            <div className="card shadow-lg p-4">
                <h2 className="text-primary fw-bold text-center">Unpaid Students List ({totalUnpaid})</h2>

                {/* Filters Section */}
                <div className="row mb-3">
                    <div className="col-md-4">
                        <label className="form-label">Select Month</label>
                        <select className="form-control" value={month} onChange={(e) => setMonth(e.target.value)}>
                            <option value="">All Months</option>
                            {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map(m => (
                                <option key={m} value={m}>{m}</option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-4">
                        <label className="form-label">Select Course</label>
                        <select className="form-control" value={courseId} onChange={(e) => setCourseId(e.target.value)}>
                            <option value="">All Courses</option>
                            {courses.map(course => (
                                <option key={course.courseId} value={course.courseId}>{course.courseId} - {course.course_title}</option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-4">
                        <label className="form-label">Select Batch</label>
                        <select className="form-control" value={batchNo} onChange={(e) => setBatchNo(e.target.value)}>
                            <option value="">All Batches</option>
                            {courses.map(course => (
                                <option key={course.batch_no} value={course.batch_no}>Batch {course.batch_no}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Apply Filters Button */}
                <button className="btn btn-primary mb-3" onClick={fetchUnpaidStudents}>Apply Filters</button>

                {loading ? (
                    <p className="text-center">Loading...</p>
                ) : error ? (
                    <p className="text-danger text-center">{error}</p>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-bordered table-hover w-100">
                            <thead className="table-dark">
                                <tr>
                                    <th>#</th>
                                    <th>Student ID</th>
                                    <th>Student Name</th>
                                    <th>Course ID</th>
                                    <th>Batch No</th>
                                    <th>Mobile</th>
                                    <th>Email</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.length > 0 ? (
                                    students.map((student, index) => (
                                        <tr key={student.studentId}>
                                            <td>{(currentPage - 1) * limit + index + 1}</td>
                                            <td>{student.studentId}</td>
                                            <td>{student.student_name}</td>
                                            <td>{student.courseId}</td>
                                            <td>{student.batch_no}</td>
                                            <td>{student.mobile}</td>
                                            <td>{student.email}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="text-center text-warning">No unpaid students found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="d-flex justify-content-center mt-3">
                        <button
                            className="btn btn-secondary mx-2"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => prev - 1)}
                        >
                            Previous
                        </button>
                        <span className="fw-bold mx-3">Page {currentPage} of {totalPages}</span>
                        <button
                            className="btn btn-secondary mx-2"
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => prev + 1)}
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}