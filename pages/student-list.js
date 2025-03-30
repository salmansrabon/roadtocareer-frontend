import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { FaCcPaypal, FaEye } from "react-icons/fa";
import Pagination from "../components/common/Pagination";
import { CSVLink } from "react-csv";

export default function StudentList() {
    const [students, setStudents] = useState([]);
    const [exportData, setExportData] = useState([]);
    const [totalStudents, setTotalStudents] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [courses, setCourses] = useState([]); // ✅ Store courses list
    const [currentPage, setCurrentPage] = useState(1);
    const studentsPerPage = 10;
    const [filters, setFilters] = useState({
        courseId: "",
        batch_no: "",
        studentId: "",
        student_name: "",
        email: "",
        mobile: "",
        university: "",
        profession: "",
        company: "",
        isValid: "",
        isEnrolled: "",
    });

    const router = useRouter();

    useEffect(() => {
        fetchStudents();
        fetchCourses();
        fetchExportData();
    }, [currentPage, filters]);

    // ✅ Fetch Students from API with Filters
    const fetchStudents = async () => {
        setLoading(true);
        setError("");

        try {
            const queryParams = new URLSearchParams({
                ...filters,
                page: currentPage,
                limit: studentsPerPage,
            }).toString();

            const token = localStorage.getItem("token");

            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/students/list?${queryParams}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // ✅ Attach Token in Header
                    }
                }
            );

            setStudents(response.data.students || []); // ✅ Ensure data is an array
            setTotalStudents(response.data.totalStudents || 0);
        } catch (err) {
            console.error("Error fetching students:", err);

            if (err.response) {
                // ✅ Handle Unauthorized (401) and Forbidden (403) responses
                if (err.response.status === 401) {
                    setError("Unauthorized Access: " + err.response.data.message);
                    router.push("/login");
                } else if (err.response.status === 403) {
                    setError("Forbidden: " + err.response.data.message);
                    router.push("/403");
                } else {
                    setError("Failed to fetch student list: " + err.response.data.message);
                }
            } else {
                // ✅ Handle Network Errors
                setError("Failed to fetch student list. Please check your connection.");
            }
        }


        setLoading(false);
    };
    const fetchExportData = async () => {
        try {
            const token = localStorage.getItem("token");
            const queryParams = new URLSearchParams({
                ...filters,
                page: 1,
                limit: 1000, // Fetch large amount for export
            }).toString();

            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/students/list?${queryParams}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            );

            setExportData(response.data.students || []);
        } catch (err) {
            console.error("Failed to fetch export data");
        }
    };

    const exportHeaders = [
        { label: "Course ID", key: "Course.courseId" },
        { label: "Batch No", key: "batch_no" },
        { label: "Student ID", key: "StudentId" },
        { label: "Student Name", key: "student_name" },
        { label: "Email", key: "email" },
        { label: "Mobile", key: "mobile" },
        { label: "University", key: "university" },
        { label: "Profession", key: "profession" },
        { label: "Company", key: "company" },
        { label: "Designation", key: "designation" },
        { label: "Expereience", key: "experience" },
        { label: "KnowUs", key: "knowMe" },
        { label: "Opinion", key: "opinion" },
        { label: "Due", key: "due" },
        { label: "isValid", key: "User.isValid" },
        { label: "isEnrolled", key: "isEnrolled" }
    ];

    // ✅ Fetch Course List
    const fetchCourses = async () => {
        try {
            const response = await axios.get(process.env.NEXT_PUBLIC_API_URL + "/courses/list");
            const sortedCourses = response.data.courses.sort((a, b) => b.courseId.localeCompare(a.courseId));
            setCourses(sortedCourses);
        } catch (err) {
            console.error("Error fetching courses:", err);
        }
    };

    // ✅ Handle Filter Changes
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="container-fluid mt-4">
            <div className="card shadow-lg p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h2 className="text-primary fw-bold">Student List ({totalStudents})</h2>
                    <CSVLink
                        data={exportData}
                        headers={exportHeaders}
                        filename={`students_export_${new Date().toISOString()}.csv`}
                        className="btn btn-success"
                    >
                        Export to Excel
                    </CSVLink>
                </div>

                {/* ✅ Filters Section */}
                <div className="row md-3 mt-2">
                    {/* Course Dropdown */}
                    <div className="col-md-3 mt-2">
                        <select className="form-control" name="courseId" value={filters.courseId} onChange={handleFilterChange}>
                            <option value="">Select Course</option>
                            {courses
                                .slice()
                                .sort((a, b) => parseInt(b.batch_no) - parseInt(a.batch_no)) // ✅ numerical sort
                                .map((course) => (
                                    <option key={course.courseId} value={course.courseId}>
                                        {course.courseId} - Batch-{course.batch_no}
                                    </option>
                                ))
                            }
                        </select>

                    </div>


                    {/* Student Name */}
                    <div className="col-md-3 mt-2">
                        <input type="text" className="form-control" placeholder="Student Name" name="student_name" value={filters.student_name} onChange={handleFilterChange} />
                    </div>
                    {/* Salutation */}
                    <div className="col-md-3 mt-2">
                        <select
                            className="form-control"
                            name="salutation"
                            value={filters.salutation}
                            onChange={handleFilterChange}
                        >
                            <option value="">Select Salutation</option>
                            <option value="Mr">Mr</option>
                            <option value="Mrs">Mrs</option>
                        </select>
                    </div>
                    {/* Student ID */}
                    <div className="col-md-3 mt-2">
                        <input type="text" className="form-control" placeholder="Student ID" name="studentId" value={filters.studentId} onChange={handleFilterChange} />
                    </div>

                    {/* Email */}
                    <div className="col-md-3 mt-2">
                        <input type="text" className="form-control" placeholder="Email" name="email" value={filters.email} onChange={handleFilterChange} />
                    </div>

                    {/* Mobile */}
                    <div className="col-md-3 mt-2">
                        <input type="text" className="form-control" placeholder="Mobile" name="mobile" value={filters.mobile} onChange={handleFilterChange} />
                    </div>

                    {/* University */}
                    <div className="col-md-3 mt-2">
                        <input type="text" className="form-control" placeholder="University" name="university" value={filters.university} onChange={handleFilterChange} />
                    </div>

                    {/* Profession */}
                    <div className="col-md-3 mt-2">
                        <select
                            className="form-control"
                            name="profession"
                            value={filters.profession}
                            onChange={handleFilterChange}
                        >
                            <option value="">Select Profession</option>
                            <option value="Fresh Graduate">Fresh Graduate</option>
                            <option value="Job Holder">Job Holder</option>
                            <option value="Student">Student</option>
                        </select>
                    </div>


                    {/* Company */}
                    <div className="col-md-3 mt-2">
                        <input type="text" className="form-control" placeholder="Company" name="company" value={filters.company} onChange={handleFilterChange} />
                    </div>

                    {/* isValid Dropdown */}
                    <div className="col-md-3 mt-2">
                        <select className="form-control" name="isValid" value={filters.isValid} onChange={handleFilterChange}>
                            <option value="">Select Validity Status</option>
                            <option value="1">Active</option>
                            <option value="0">Disabled</option>
                        </select>
                    </div>

                    {/* isEnrolled Dropdown */}
                    <div className="col-md-3 mt-2">
                        <select className="form-control" name="isEnrolled" value={filters.isEnrolled} onChange={handleFilterChange}>
                            <option value="">Select Enrollment Status</option>
                            <option value="1">True</option>
                            <option value="0">False</option>
                        </select>
                    </div>
                </div>

                {/* Apply Filters Button */}
                <button className="btn btn-primary mb-3" onClick={fetchStudents}>Apply Filters</button>

                {/* ✅ Show Loading/Error */}
                {loading ? (
                    <p>Loading students...</p>
                ) : error ? (
                    <p className="text-danger">{error}</p>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-bordered table-hover w-100">
                            <thead className="table-dark">
                                <tr>
                                    <th>CourseId</th>
                                    <th>Batch No</th>
                                    <th>StudentId</th>
                                    <th>Student Name</th>
                                    <th>Email</th>
                                    <th>Mobile</th>
                                    <th>Profession</th>
                                    <th>University</th>
                                    <th>Due</th>
                                    <th>isValid</th>
                                    <th>isEnrolled</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.length > 0 ? (
                                    students.map((student) => {
                                        return (
                                            <tr key={student.StudentId}>
                                                <td>{student.Course?.courseId || "N/A"}</td>
                                                <td>{student.batch_no}</td>
                                                <td>{student.StudentId}</td>
                                                <td style={{ cursor: "pointer", color: "#0d6efd" }} onClick={() => router.push(`/students/details/${student.StudentId}`)}>
                                                    {student.student_name}
                                                </td>

                                                <td>{student.email}</td>
                                                <td>{student.mobile}</td>
                                                <td>{student.profession || "N/A"}</td>
                                                <td>{student.university}</td>
                                                <td>{student.due}</td>
                                                <td>
                                                    <span className={`badge ${student.User?.isValid === 1 ? "bg-success" : "bg-danger"}`}>
                                                        {student.User?.isValid === 1 ? "Active" : "Disabled"}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className={`badge ${student.isEnrolled === true ? "bg-success" : "bg-danger"}`}>
                                                        {student.isEnrolled === true ? "True" : "False"}
                                                    </span>
                                                </td>
                                                <td className="d-flex align-items-center">
                                                    <button className="btn btn-info btn-sm me-2" onClick={() => router.push(`/students/details/${student.StudentId}`)}>
                                                        <FaEye />
                                                    </button>
                                                    <button
                                                        className="btn btn-info btn-sm"
                                                        onClick={() => router.push(`/students/payments/history/${student.StudentId}`)}
                                                    >
                                                        <FaCcPaypal />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr><td colSpan="12" className="text-center text-muted">No students found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
                {/* ✅ Pagination Component */}
                <Pagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(totalStudents / studentsPerPage)}
                    onPageChange={setCurrentPage}
                />
            </div>
        </div>
    );
}
