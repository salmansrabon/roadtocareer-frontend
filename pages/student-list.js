import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { FaCcPaypal, FaEye } from "react-icons/fa";

export default function StudentList() {
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [search, setSearch] = useState("");
    const [totalStudents, setTotalStudents] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const router = useRouter();

    useEffect(() => {
        axios.get("http://localhost:5000/api/students/list")
            .then((res) => {
                setStudents(res.data.students);
                setFilteredStudents(res.data.students);
                setTotalStudents(res.data.totalStudents);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching students:", err);
                setError("Failed to fetch student list.");
                setLoading(false);
            });
    }, []);

    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearch(value);

        const filtered = students.filter(student =>
            student.student_name.toLowerCase().includes(value) ||
            student.email.toLowerCase().includes(value) ||
            student.mobile.includes(value) ||
            student.profession?.toLowerCase().includes(value) ||
            student.university.toLowerCase().includes(value) ||
            String(student.User?.isValid).includes(value)
        );
        setFilteredStudents(filtered);
    };

    return (
        <div className="container-fluid mt-4"> {/* ✅ Full Width Container */}
            <div className="card shadow-lg p-4">
                <h2 className="text-primary fw-bold text-center">Student List ({totalStudents})</h2>

                <input
                    type="text"
                    className="form-control my-3"
                    placeholder="Search by name, email, mobile, profession, university, isValid..."
                    value={search}
                    onChange={handleSearch}
                />

                {loading ? (
                    <p>Loading students...</p>
                ) : error ? (
                    <p className="text-danger">{error}</p>
                ) : (
                    <div className="table-responsive"> {/* ✅ Ensure Table Scrolls */}
                        <table className="table table-bordered table-hover w-100"> {/* ✅ Full Width Table */}
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
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStudents.length > 0 ? (
                                    filteredStudents.map((student) => {
                                        const isValid = student.User?.isValid ?? null;

                                        return (
                                            <tr
                                                key={student.StudentId}
                                                style={{
                                                    backgroundColor: isValid === 1 ? "#d4edda" : isValid === 0 ? "#fff3cd" : "transparent"
                                                }}
                                            >
                                                <td>{student.Course?.courseId || "N/A"}</td>
                                                <td>{student.batch_no}</td>
                                                <td>{student.StudentId}</td>
                                                <td>{student.student_name}</td>
                                                <td>{student.email}</td>
                                                <td>{student.mobile}</td>
                                                <td>{student.profession || "N/A"}</td>
                                                <td>{student.university}</td>
                                                <td>
                                                    <span className={`badge ${isValid === 1 ? "bg-success" : "bg-danger"}`}>
                                                        {isValid === 1 ? "Active" : "Disabled"}
                                                    </span>
                                                </td>
                                                <td className="d-flex align-items-center">
                                                    <button 
                                                        className="btn btn-info btn-sm me-3"
                                                        onClick={() => router.push(`/students/details/${student.StudentId}`)}
                                                    >
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
                                    <tr>
                                        <td colSpan="10" className="text-center text-muted">
                                            No students found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* ✅ Add Styles for Mobile */}
            <style jsx>{`
                .table-responsive {
                    overflow-x: auto; /* ✅ Allow table to scroll on small screens */
                    width: 100%;
                }

                /* ✅ Ensure Table Expands */
                table {
                    min-width: 100%;
                    max-width: 100%;
                }

                /* ✅ Adjustments for Small Screens */
                @media (max-width: 768px) {
                    .table th, .table td {
                        font-size: 14px;
                        padding: 8px;
                    }
                    .btn {
                        padding: 6px 10px;
                        font-size: 14px;
                    }
                }
            `}</style>
        </div>
    );
}
