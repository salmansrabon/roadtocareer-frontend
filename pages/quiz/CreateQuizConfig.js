import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function CreateMcqConfig() {
    const router = useRouter();
    const [courses, setCourses] = useState([]);
    const [formData, setFormData] = useState({
        CourseId: "",
        quiz_title: "",
        quiz_description: "",
        totalQuestion: "",
        totalTime: "",
        start_datetime: "",
        end_datetime: "",
        isActive: true
    });
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    // ✅ Fetch Courses from API
    useEffect(() => {
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/courses/list`)
            .then(response => {
                setCourses(response.data.courses);
            })
            .catch(error => {
                console.error("Error fetching courses:", error);
                setError("Failed to load courses.");
            });
    }, []);

    // ✅ Handle Input Change
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value
        });
    };

    // ✅ Handle Form Submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");

        // ✅ Basic Validation
        if (!formData.CourseId || !formData.quiz_title || !formData.totalQuestion || !formData.totalTime || !formData.start_datetime || !formData.end_datetime) {
            setError("All fields are required!");
            return;
        }

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/mcq-config/create`, formData);

            if (response.status === 201) {
                setSuccessMessage("MCQ Config created successfully!");
                setTimeout(() => router.push("/quiz/QuizConfigList"), 2000); // ✅ Redirect to list page after success
            }
        } catch (err) {
            if (err.response) {
                if (err.response.status === 400) {
                    setError("Bad Request: Please check the entered values.");
                } else if (err.response.status === 401) {
                    setError("Unauthorized: You need permission to perform this action.");
                } else {
                    setError("Something went wrong. Please try again later.");
                }
            } else {
                setError("Network error. Please check your connection.");
            }
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-primary text-center fw-bold">Create MCQ Config</h2>
            
            {error && <p className="text-danger text-center">{error}</p>}
            {successMessage && <p className="text-success text-center">{successMessage}</p>}

            <form onSubmit={handleSubmit} className="card p-4 shadow-lg">
            <div className="mb-3">
                    <label className="form-label">Course ID</label>
                    <select 
                        name="CourseId" 
                        value={formData.CourseId} 
                        onChange={handleChange} 
                        className="form-control" 
                        required
                    >
                        <option value="">Select a Course</option>
                        {courses.map(course => (
                            <option key={course.courseId} value={course.courseId}>
                                {course.course_title} ({course.courseId})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-3">
                    <label className="form-label">Quiz Title</label>
                    <input type="text" name="quiz_title" value={formData.quiz_title} onChange={handleChange} className="form-control" required />
                </div>

                <div className="mb-3">
                    <label className="form-label">Quiz Description</label>
                    <textarea name="quiz_description" value={formData.quiz_description} onChange={handleChange} className="form-control" required />
                </div>

                <div className="mb-3">
                    <label className="form-label">Total Questions</label>
                    <input type="number" name="totalQuestion" value={formData.totalQuestion} onChange={handleChange} className="form-control" required />
                </div>

                <div className="mb-3">
                    <label className="form-label">Total Time (Minutes)</label>
                    <input type="text" name="totalTime" value={formData.totalTime} onChange={handleChange} className="form-control" required />
                </div>

                <div className="mb-3">
                    <label className="form-label">Start Date & Time</label>
                    <input type="datetime-local" name="start_datetime" value={formData.start_datetime} onChange={handleChange} className="form-control" required />
                </div>

                <div className="mb-3">
                    <label className="form-label">End Date & Time</label>
                    <input type="datetime-local" name="end_datetime" value={formData.end_datetime} onChange={handleChange} className="form-control" required />
                </div>

                <div className="mb-3 form-check">
                    <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} className="form-check-input" />
                    <label className="form-check-label">Is Active</label>
                </div>

                <button type="submit" className="btn btn-success w-100">Create MCQ Config</button>
            </form>
        </div>
    );
}
