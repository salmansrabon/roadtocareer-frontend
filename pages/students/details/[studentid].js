import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";

export default function StudentDetails() {
    const router = useRouter();
    const { studentid } = router.query;

    const [student, setStudent] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false); // ✅ Track Edit Mode
    const [formData, setFormData] = useState({}); // ✅ Track Editable Data
    const [originalData, setOriginalData] = useState({});
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        if (!router.isReady || !studentid) return; // ✅ Ensure router is ready

        axios.get(`http://localhost:5000/api/students/${studentid}`)
            .then(res => {
                setStudent(res.data);
                setFormData(res.data); // ✅ Initialize formData
                setOriginalData(res.data); // ✅ Store Original Data for Reset
                setLoading(false);
            })
            .catch(err => {
                setError("Failed to fetch student details.");
                setLoading(false);
            });
    }, [router.isReady, studentid]); // ✅ Add router.isReady dependency

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: name === "isEnrolled" ? Number(value) : value, // ✅ Convert `isEnrolled` to Number (1 or 0)
            User: name === "isValid"
                ? { ...prev.User, isValid: Number(value) } // ✅ Update `isValid` inside `User`
                : prev.User, // ✅ Keep User unchanged for other fields
        }));
    };


    // ✅ Handle Update Student
    const handleUpdate = async () => {
        setUpdating(true);

        try {
            // ✅ Prepare updated data (Ensure `isEnrolled` is converted to Number)
            const updatedData = {
                ...formData,
                isEnrolled: formData.isEnrolled ? 1 : 0, // Ensure correct format
            };

            // 🔹 Update Student Info (including `isEnrolled`)
            await axios.put(`http://localhost:5000/api/students/${studentid}`, updatedData);

            // 🔹 Update User Status if `isValid` has changed
            if (formData.User?.isValid !== originalData.User?.isValid) {
                await axios.patch(`http://localhost:5000/api/users/${studentid}`, {
                    isValid: formData.User?.isValid
                });
            }

            // ✅ Update UI: Ensure both `isValid` and `isEnrolled` are reflected
            setStudent((prev) => ({
                ...prev,
                isEnrolled: !!updatedData.isEnrolled, // Convert to Boolean for UI
                User: { ...prev.User, isValid: formData.User?.isValid }
            }));

            setOriginalData(updatedData);
            setIsEditing(false);
            fetchStudentData(); // ✅ Refresh student data
        } catch (err) {
            setError("Failed to update student details.");
        }

        setUpdating(false);
    };


    // ✅ Handle Cancel (Reset Fields)
    const handleCancel = () => {
        setFormData(originalData); // ✅ Reset form data to original
        setIsEditing(false);
    };

    // ✅ Handle Delete Student
    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this student?")) return;

        try {
            await axios.delete(`http://localhost:5000/api/students/${studentid}`);
            alert("Student deleted successfully.");
            router.push("/student-list");
        } catch (err) {
            setError("Failed to delete student.");
        }
    };
    const fetchStudentData = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/students/${studentid}`);
            setStudent(res.data);
            setFormData(res.data);
            setOriginalData(res.data);
        } catch (err) {
            setError("Failed to fetch student details.");
        }
    };


    if (loading) return <div className="text-center mt-5"><strong>Loading...</strong></div>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div className="container mt-5">
            <h2 className="fw-bold text-primary text-center mb-4">Student Details</h2>

            {/* ✅ Display Course and Batch Info */}
            <div className="text-center mb-3">
                <h4 className="fw-bold text-dark">{student.Course?.course_title || "N/A"}</h4>
                <p className="text-muted fs-5">Course Id: {student.Course?.courseId}</p>
                <p className="text-muted fs-5">Batch: <strong>{student.batch_no}</strong></p>
            </div>

            {/* ✅ Student Details Table */}
            <table className="table table-bordered table-hover shadow-sm">
                <tbody>
                    <tr>
                        <td><strong>Status</strong></td>
                        <td>
                            {isEditing ? (
                                <select
                                    className="form-control"
                                    name="isValid"
                                    value={formData.User?.isValid}
                                    onChange={handleChange}
                                >
                                    <option value={1}>Active</option>
                                    <option value={0}>Disabled</option>
                                </select>
                            ) : (
                                <span
                                    className="badge"
                                    style={{
                                        backgroundColor: student.User?.isValid ? "#28a745" : "#dc3545",
                                        color: "#fff",
                                        padding: "6px 12px",
                                        borderRadius: "8px",
                                        fontWeight: "bold"
                                    }}
                                >
                                    {student.User?.isValid ? "Active" : "Disabled"}
                                </span>
                            )}
                        </td>
                    </tr>

                    <tr><td><strong>Student ID</strong></td><td>{student.StudentId}</td></tr>
                    <tr><td><strong>Name</strong></td>
                        <td>
                            {isEditing ? (
                                <input type="text" className="form-control" name="student_name" value={formData.student_name} onChange={handleChange} />
                            ) : student.student_name}
                        </td>
                    </tr>
                    <tr><td><strong>Email</strong></td>
                        <td>
                            {isEditing ? (
                                <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} />
                            ) : student.email}
                        </td>
                    </tr>
                    <tr><td><strong>Mobile</strong></td>
                        <td>
                            {isEditing ? (
                                <input type="text" className="form-control" name="mobile" value={formData.mobile} onChange={handleChange} />
                            ) : student.mobile}
                        </td>
                    </tr>
                    <tr><td><strong>University</strong></td>
                        <td>
                            {isEditing ? (
                                <input type="text" className="form-control" name="university" value={formData.university} onChange={handleChange} />
                            ) : student.university}
                        </td>
                    </tr>
                    <tr><td><strong>Batch No</strong></td>
                        <td>
                            {isEditing ? (
                                <input type="text" className="form-control" name="batch_no" value={formData.batch_no} onChange={handleChange} />
                            ) : student.batch_no}
                        </td>
                    </tr>
                    <tr><td><strong>Course Title</strong></td><td>{student.Course?.course_title || "N/A"}</td></tr>
                    <tr><td><strong>Course ID</strong></td><td>{student.Course?.courseId || "N/A"}</td></tr>
                    <tr><td><strong>Package</strong></td><td>{student.package || "N/A"}</td></tr>
                    <tr><td><strong>Profession</strong></td>
                        <td>
                            {isEditing ? (
                                <input type="text" className="form-control" name="profession" value={formData.profession} onChange={handleChange} />
                            ) : student.profession}
                        </td>
                    </tr>
                    <tr><td><strong>Course Fee</strong></td><td>{student.courseFee || "N/A"}</td></tr>
                    <tr><td><strong>Company</strong></td>
                        <td>
                            {isEditing ? (
                                <input type="text" className="form-control" name="company" value={formData.company} onChange={handleChange} />
                            ) : student.company}
                        </td>
                    </tr>
                    <tr><td><strong>Designation</strong></td>
                        <td>
                            {isEditing ? (
                                <input type="text" className="form-control" name="designation" value={formData.designation} onChange={handleChange} />
                            ) : student.designation}
                        </td>
                    </tr>
                    <tr><td><strong>Experience (Years)</strong></td>
                        <td>
                            {isEditing ? (
                                <input type="number" className="form-control" name="experience" value={formData.experience} onChange={handleChange} />
                            ) : student.experience}
                        </td>
                    </tr>
                    <tr><td><strong>Remark</strong></td>
                        <td>
                            {isEditing ? (
                                <input type="text" className="form-control" name="remark" value={formData.remark} onChange={handleChange} />
                            ) : student.remark}
                        </td>
                    </tr>
                    <tr>
                        <td><strong>isEnrolled</strong></td>
                        <td>
                            {isEditing ? (
                                <select
                                    className="form-control"
                                    name="isEnrolled"
                                    value={formData.isEnrolled ? 1 : 0} // ✅ Ensure it's converted to 1/0
                                    onChange={handleChange}
                                >
                                    <option value={1}>True</option>
                                    <option value={0}>False</option>
                                </select>
                            ) : (
                                <span
                                    className="badge"
                                    style={{
                                        backgroundColor: student.isEnrolled ? "#28a745" : "#dc3545",
                                        color: "#fff",
                                        padding: "6px 12px",
                                        borderRadius: "8px",
                                        fontWeight: "bold"
                                    }}
                                >
                                    {student.isEnrolled ? "True" : "False"} {/* ✅ Properly Display True/False */}
                                </span>
                            )}
                        </td>
                    </tr>

                    <tr>
                        <td><strong>Registered On</strong></td>
                        <td>
                            {new Date(student.createdAt).toLocaleString("en-US", {
                                month: "long",
                                day: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                                hour12: true
                            }).replace(",", "").replace(/(\d{2}) (\d{4})/, "$1/$2")}
                        </td>
                    </tr>
                </tbody>
            </table>

            {/* ✅ Buttons */}
            <div className="text-center mt-3">
                {isEditing ? (
                    <>
                        <button className="btn btn-success me-2" onClick={handleUpdate} disabled={updating}>
                            {updating ? "Updating..." : "Update"}
                        </button>
                        <button className="btn btn-secondary me-2" onClick={handleCancel}>
                            Cancel
                        </button>
                    </>
                ) : (
                    <>
                        <button className="btn btn-warning me-2" onClick={() => setIsEditing(true)}>
                            Edit
                        </button>
                        <button className="btn btn-danger me-2" onClick={handleDelete}>
                            Delete
                        </button>
                    </>
                )}

                <button className="btn btn-secondary px-4 fw-bold" onClick={() => router.push("/student-list")}>
                    ← Back to Student List
                </button>
            </div>

        </div>
    );
}
