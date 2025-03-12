import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function CourseManagement() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editingCourse, setEditingCourse] = useState(null);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        fetchCourses();
    }, []);

    // ✅ Fetch Course List
    const fetchCourses = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/courses/list`);
            if (response.data && response.data.courses) {
                setCourses(response.data.courses);
            } else {
                setCourses([]); // ✅ Ensure it's an array
            }
        } catch (err) {
            console.error("Error fetching courses:", err);
            setError("Failed to load courses.");
        } finally {
            setLoading(false);
        }
    };

    // ✅ Open Edit Modal
    const openEditModal = (course) => {
        setEditingCourse(course);
        setFormData({
            batch_no: course.batch_no || "",
            course_title: course.course_title || "",
            short_description: course.short_description || "",
            drive_folder_id: course.drive_folder_id || "",
            is_enabled: course.is_enabled || false,
            enrollment_start_date: course.enrollment_start_date || "",
            enrollment_end_date: course.enrollment_end_date || "",
            orientation_date: course.orientation_date || "",
            class_start_date: course.class_start_date || "",
            class_days: Array.isArray(course.class_days) ? course.class_days : JSON.parse(course.class_days || "[]"),
            class_time: course.class_time || "",
            course_image: course.course_image || "",
        });
    };


    // ✅ Handle Input Change
    const handleChange = (e) => {
        const { name, value } = e.target;

        // ✅ Handle Multi-Select for Class Days
        if (name === "class_days") {
            const selectedOptions = [...e.target.selectedOptions].map(opt => opt.value);
            setFormData((prev) => ({ ...prev, [name]: selectedOptions }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    // ✅ Update Course
    const handleUpdate = async () => {
        try {
            const token = localStorage.getItem("token");
            await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/courses/update/${editingCourse.courseId}`, formData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchCourses();
            setEditingCourse(null);
        } catch (err) {
            alert("Failed to update course.");
        }
    };

    // ✅ Delete Course
    const handleDelete = async (courseId) => {
        if (!confirm("Are you sure you want to delete this course?")) return;

        try {
            const token = localStorage.getItem("token");
            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/courses/delete/${courseId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchCourses();
        } catch (err) {
            alert("Failed to delete course.");
        }
    };

    return (
        <div className="container mt-5">
            {/* ✅ Page Header */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="fw-bold text-primary">Course Management</h2>
                <Link href="/course/create">
                    <button className="btn btn-success">+ Create Course</button>
                </Link>
            </div>

            {loading ? (
                <p className="text-center">Loading courses...</p>
            ) : error ? (
                <p className="text-danger">{error}</p>
            ) : (
                <table className="table table-bordered mt-3 shadow-sm">
                    <thead className="table-dark">
                        <tr>
                            <th>Course ID</th>
                            <th>Batch</th>
                            <th>Title</th>
                            <th>Status</th>
                            <th>Package</th>
                            <th>Student Fee</th>
                            <th>Jobholder Fee</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.map((course) => (
                            <tr key={course.courseId}>
                                <td>{course.courseId}</td>
                                <td>{course.batch_no}</td>
                                <td>{course.course_title}</td>
                                <td>
                                    <span className={`badge ${course.is_enabled ? "bg-success" : "bg-danger"}`}>
                                        {course.is_enabled ? "Enabled" : "Disabled"}
                                    </span>
                                </td>
                                <td>{course.Packages.length > 0 ? course.Packages[0].packageName : "N/A"}</td>
                                <td>{course.Packages.length > 0 ? `${course.Packages[0].studentFee} TK` : "N/A"}</td>
                                <td>{course.Packages.length > 0 ? `${course.Packages[0].jobholderFee} TK` : "N/A"}</td>
                                <td>
                                    <button className="btn btn-warning btn-sm me-2" onClick={() => openEditModal(course)}>Edit</button>
                                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(course.courseId)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* ✅ Edit Modal */}
            {editingCourse && (
                <div className="modal d-block bg-dark bg-opacity-50">
                    <div className="modal-dialog modal-lg"> {/* 🔹 Enlarged modal */}
                        <div className="modal-content p-4">
                            <h4 className="text-center">Edit Course</h4>

                            <div className="row">
                                {/* ✅ Course Title */}
                                <div className="col-md-6">
                                    <label className="form-label">Course Title</label>
                                    <input type="text" className="form-control" name="course_title" value={formData.course_title} onChange={handleChange} />
                                </div>

                                {/* ✅ Batch Number */}
                                <div className="col-md-6">
                                    <label className="form-label">Batch</label>
                                    <input type="text" className="form-control" name="batch_no" value={formData.batch_no} onChange={handleChange} />
                                </div>

                                {/* ✅ Short Description */}
                                <div className="col-md-12 mt-2">
                                    <label className="form-label">Description</label>
                                    <textarea className="form-control" name="short_description" value={formData.short_description} onChange={handleChange} />
                                </div>
                                 {/* ✅ Drive Folder ID */}
                                 <div className="col-md-6 mt-2">
                                    <label className="form-label">Drive Folder ID</label>
                                    <input type="text" className="form-control" name="drive_folder_id" value={formData.drive_folder_id} onChange={handleChange} />
                                </div>

                                {/* ✅ Status */}
                                <div className="col-md-6 mt-2">
                                    <label className="form-label">Status</label>
                                    <select className="form-control" name="is_enabled" value={formData.is_enabled} onChange={handleChange}>
                                        <option value="true">Enabled</option>
                                        <option value="false">Disabled</option>
                                    </select>
                                </div>

                                {/* ✅ Enrollment Start Date */}
                                <div className="col-md-6 mt-2">
                                    <label className="form-label">Enrollment Start Date</label>
                                    <input type="date" className="form-control" name="enrollment_start_date" value={formData.enrollment_start_date} onChange={handleChange} />
                                </div>

                                {/* ✅ Enrollment End Date */}
                                <div className="col-md-6 mt-2">
                                    <label className="form-label">Enrollment End Date</label>
                                    <input type="date" className="form-control" name="enrollment_end_date" value={formData.enrollment_end_date} onChange={handleChange} />
                                </div>

                                {/* ✅ Orientation Date */}
                                <div className="col-md-6 mt-2">
                                    <label className="form-label">Orientation Date</label>
                                    <input type="date" className="form-control" name="orientation_date" value={formData.orientation_date} onChange={handleChange} />
                                </div>

                                {/* ✅ Class Start Date */}
                                <div className="col-md-6 mt-2">
                                    <label className="form-label">Class Start Date</label>
                                    <input type="date" className="form-control" name="class_start_date" value={formData.class_start_date} onChange={handleChange} />
                                </div>

                                {/* ✅ Class Days Multi-Select */}
                                <div className="col-md-6 mt-2">
                                    <label className="form-label">Class Days</label>
                                    <select className="form-control" name="class_days" multiple value={formData.class_days} onChange={handleChange}>
                                        {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                                            <option key={day} value={day}>{day}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* ✅ Class Time */}
                                <div className="col-md-6 mt-2">
                                    <label className="form-label">Class Time</label>
                                    <input type="time" className="form-control" name="class_time" value={formData.class_time} onChange={handleChange} />
                                </div>

                                {/* ✅ Course Image URL */}
                                <div className="col-md-12 mt-2">
                                    <label className="form-label">Course Image URL</label>
                                    <input type="text" className="form-control" name="course_image" value={formData.course_image} onChange={handleChange} />
                                    {formData.course_image && (
                                        <img src={formData.course_image} alt="Course" className="img-fluid mt-2 rounded" style={{ maxHeight: "150px" }} />
                                    )}
                                </div>

                                {/* ✅ Action Buttons */}
                                <div className="col-md-12 mt-3 d-flex justify-content-between">
                                    <button className="btn btn-secondary" onClick={() => setEditingCourse(null)}>Cancel</button>
                                    <button className="btn btn-primary" onClick={handleUpdate}>Update</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
