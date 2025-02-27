import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function CreatePackage() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        courseId: "",
        packageName: "",
        studentFee: "",
        jobholderFee: "",
        installment: ""
    });

    const [courses, setCourses] = useState([]); // ✅ Stores fetched courseIds
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // ✅ Fetch course list from API on page load
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/courses/list");
                setCourses(response.data.courses); // ✅ Set course list
            } catch (err) {
                console.error("Error fetching courses:", err);
                setError("Failed to load courses.");
            }
        };
        fetchCourses();
    }, []);

    // ✅ Handle Input Changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // ✅ Handle Form Submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");
    
        try {
            const response = await axios.post("http://localhost:5000/api/packages/create", formData);
            setSuccess("Package created successfully!");
            setTimeout(() => router.push("/courses"), 2000); // ✅ Redirect after success
        } catch (err) {
            console.error("Error creating package:", err);
            
            // ✅ Handle duplicate package error
            if (err.response && err.response.status === 400) {
                setError("A package is already created for this course.");
            } else {
                setError("Failed to create package. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <div className="container mt-4">
            <div className="card shadow-sm p-4">
                <h2 className="fw-bold text-primary">Create Package</h2>
                <p className="text-muted">Fill in the details to create a new course package.</p>

                {error && <div className="alert alert-danger">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}

                <form onSubmit={handleSubmit} className="mt-3">
                    <div className="row">
                        {/* Course ID Dropdown */}
                        <div className="col-md-6">
                            <label className="form-label">Select Course</label>
                            <select name="courseId" className="form-control" required onChange={handleChange}>
                                <option value="">-- Select Course --</option>
                                {courses.map((course) => (
                                    <option key={course.courseId} value={course.courseId}>
                                        {course.courseId} - {course.course_title}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Package Name */}
                        <div className="col-md-6">
                            <label className="form-label">Package Name</label>
                            <input type="text" name="packageName" className="form-control" required onChange={handleChange} />
                        </div>

                        {/* Student Fee */}
                        <div className="col-md-6">
                            <label className="form-label">Student Fee</label>
                            <input type="number" name="studentFee" className="form-control" required onChange={handleChange} />
                        </div>

                        {/* Jobholder Fee */}
                        <div className="col-md-6">
                            <label className="form-label">Jobholder Fee</label>
                            <input type="number" name="jobholderFee" className="form-control" required onChange={handleChange} />
                        </div>

                        {/* Installments */}
                        <div className="col-md-6">
                            <label className="form-label">Installments</label>
                            <input type="number" name="installment" className="form-control" required onChange={handleChange} />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button type="submit" className="btn btn-primary mt-4 w-100" disabled={loading}>
                        {loading ? "Creating..." : "Create Package"}
                    </button>
                </form>
            </div>
        </div>
    );
}
