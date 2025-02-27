import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function CreateCourse() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        courseId: "",
        batch_no: "",
        course_title: "",
        course_initial: "",
        drive_folder_id: "",
        short_description: "",
        is_enabled: true,
        enrollment_start_date: "",
        enrollment_end_date: "",
        orientation_date: "",
        class_start_date: "",
        class_days: [],
        class_time: "",
        course_image: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const classDaysOptions = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    // ✅ Auto-generate courseId when `course_initial`, `batch_no`, or `enrollment_start_date` changes
    const generateCourseId = (course_initial, batch_no, enrollment_start_date) => {
        if (course_initial && batch_no && enrollment_start_date) {
            const year = new Date(enrollment_start_date).getFullYear(); // Extract year
            return `${course_initial}${batch_no}${year}`;
        }
        return "";
    };

    // ✅ Handle Input Changes
    const handleChange = (e) => {
        const { name, value } = e.target;

        let updatedValue = value;
        if (name === "class_time" && value.length === 5) {
            updatedValue = value + ":00"; // Ensure "HH:MM" is converted to "HH:MM:SS"
        }

        const updatedFormData = { ...formData, [name]: updatedValue };

        // ✅ Auto-update courseId when related fields change
        if (["course_initial", "batch_no", "enrollment_start_date"].includes(name)) {
            updatedFormData.courseId = generateCourseId(
                updatedFormData.course_initial,
                updatedFormData.batch_no,
                updatedFormData.enrollment_start_date
            );
        }

        setFormData(updatedFormData);
    };

    // ✅ Handle Multi-Select for Class Days
    const handleClassDaysChange = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
        setFormData((prev) => ({ ...prev, class_days: selectedOptions }));
    };

    // ✅ Handle Form Submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const response = await axios.post("http://localhost:5000/api/courses/create", formData);
            setSuccess("Course created successfully!");
            setTimeout(() => router.push("/courses"), 2000);
        } catch (err) {
            console.error("Error creating course:", err);
            setError("Failed to create course. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4">
            <div className="card shadow-sm p-4">
                <h2 className="fw-bold text-primary">Create Course</h2>
                <p className="text-muted">Fill in the details to create a new course.</p>

                {error && <div className="alert alert-danger">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}

                <form onSubmit={handleSubmit} className="mt-3">
                    <div className="row">
                        {/* Course ID - Auto Generated */}
                        <div className="col-md-6">
                            <label className="form-label">Course ID (Auto-generated)</label>
                            <input type="text" name="courseId" className="form-control" value={formData.courseId} readOnly />
                        </div>

                        {/* Batch No */}
                        <div className="col-md-6">
                            <label className="form-label">Batch No</label>
                            <input type="text" name="batch_no" className="form-control" required onChange={handleChange} />
                        </div>

                        {/* Course Title & Initial */}
                        <div className="col-md-6">
                            <label className="form-label">Course Title</label>
                            <input type="text" name="course_title" className="form-control" required onChange={handleChange} />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Course Initial</label>
                            <input type="text" name="course_initial" className="form-control" required onChange={handleChange} />
                        </div>

                        {/* Drive Folder ID & Short Description */}
                        <div className="col-md-6">
                            <label className="form-label">Drive Folder ID</label>
                            <input type="text" name="drive_folder_id" className="form-control" required onChange={handleChange} />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Short Description</label>
                            <textarea name="short_description" className="form-control" required onChange={handleChange} />
                        </div>

                        {/* Enable/Disable Course */}
                        <div className="col-md-6">
                            <label className="form-label">Course Enabled</label>
                            <select name="is_enabled" className="form-control" onChange={handleChange}>
                                <option value="true">Yes</option>
                                <option value="false">No</option>
                            </select>
                        </div>

                        {/* Enrollment Start Date */}
                        <div className="col-md-6">
                            <label className="form-label">Enrollment Start Date</label>
                            <input type="date" name="enrollment_start_date" className="form-control" required onChange={handleChange} />
                        </div>

                        {/* Enrollment End Date */}
                        <div className="col-md-6">
                            <label className="form-label">Enrollment End Date</label>
                            <input type="date" name="enrollment_end_date" className="form-control" required onChange={handleChange} />
                        </div>
                        {/* Orientation Date */}
                        <div className="col-md-6">
                            <label className="form-label">Orientation date</label>
                            <input type="date" name="orientation_date" className="form-control" required onChange={handleChange} />
                        </div>
                        {/* Class start Date */}
                        <div className="col-md-6">
                            <label className="form-label">Class start date</label>
                            <input type="date" name="class_start_date" className="form-control" required onChange={handleChange} />
                        </div>

                        {/* Class Days (Multi-Select Dropdown) */}
                        <div className="col-md-6">
                            <label className="form-label">Class Days</label>
                            <select
                                name="class_days"
                                className="form-select"
                                multiple
                                onChange={handleClassDaysChange}
                            >
                                {classDaysOptions.map((day) => (
                                    <option key={day} value={day}>
                                        {day}
                                    </option>
                                ))}
                            </select>
                            <small className="text-muted">Hold Ctrl (Windows) or Cmd (Mac) to select multiple days.</small>
                        </div>

                        {/* Class Time */}
                        <div className="col-md-6">
                            <label className="form-label">Class Time</label>
                            <input type="time" name="class_time" className="form-control" required onChange={handleChange} />
                        </div>

                        {/* Course Image URL */}
                        <div className="col-md-6">
                            <label className="form-label">Course Image URL</label>
                            <input type="text" name="course_image" className="form-control" required onChange={handleChange} />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button type="submit" className="btn btn-primary mt-4 w-100" disabled={loading}>
                        {loading ? "Creating..." : "Create Course"}
                    </button>
                </form>
            </div>
        </div>
    );
}
