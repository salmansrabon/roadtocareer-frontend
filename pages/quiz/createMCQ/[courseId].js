import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function CreateQuiz() {
    const router = useRouter();
    const { courseId } = router.query; // ✅ Get CourseId from URL
    const [formData, setFormData] = useState({
        question_title: "",
        option_1: "",
        option_2: "",
        option_3: "",
        option_4: "",
        correct_answer: ""
    });
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    // ✅ Handle Input Change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // ✅ Handle Form Submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");

        // ✅ Basic Validation
        if (!formData.question_title || !formData.option_1 || !formData.option_2 || !formData.option_3 || !formData.option_4 || !formData.correct_answer) {
            setError("All fields are required!");
            return;
        }

        try {
            const token = localStorage.getItem("token"); // ✅ Retrieve Token from Local Storage
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/mcq/add`, {
                CourseId: courseId, // ✅ Automatically set CourseId
                mcq_question: formData
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            if (response.status === 201) {
                setSuccessMessage("MCQ added successfully!");
                setTimeout(() => router.push(`/quiz/mcqList/${courseId}`), 2000); // ✅ Redirect to Quiz List
            }
        } catch (err) {
            if (err.response) {
                // ✅ Handle API Errors
                if (err.response.status === 400) {
                    setError("Bad Request: Please check the entered values.");
                } else if (err.response.status === 401) {
                    setError("Unauthorized! Please log in again.");
                } else if (err.response.status === 403) {
                    setError("Forbidden! You do not have permission to add MCQs.");
                } else if (err.response.status === 500) {
                    setError("Internal Server Error! Please try again later.");
                } else {
                    setError("An unexpected error occurred.");
                }
            } else {
                setError("Network error. Please check your internet connection.");
            }
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-primary text-center fw-bold">Create New MCQ</h2>

            {error && <p className="text-danger text-center">{error}</p>}
            {successMessage && <p className="text-success text-center">{successMessage}</p>}

            <form onSubmit={handleSubmit} className="card p-4 shadow-lg">
                <div className="mb-3">
                    <label className="form-label">Question Title</label>
                    <textarea name="question_title" value={formData.question_title} onChange={handleChange} className="form-control" required />
                </div>

                <div className="mb-3">
                    <label className="form-label">Option 1</label>
                    <input type="text" name="option_1" value={formData.option_1} onChange={handleChange} className="form-control" required />
                </div>

                <div className="mb-3">
                    <label className="form-label">Option 2</label>
                    <input type="text" name="option_2" value={formData.option_2} onChange={handleChange} className="form-control" required />
                </div>

                <div className="mb-3">
                    <label className="form-label">Option 3</label>
                    <input type="text" name="option_3" value={formData.option_3} onChange={handleChange} className="form-control" required />
                </div>

                <div className="mb-3">
                    <label className="form-label">Option 4</label>
                    <input type="text" name="option_4" value={formData.option_4} onChange={handleChange} className="form-control" required />
                </div>

                <div className="mb-3">
                    <label className="form-label">Correct Answer</label>
                    <select name="correct_answer" value={formData.correct_answer} onChange={handleChange} className="form-control" required>
                        <option value="">Select Correct Answer</option>
                        <option value={formData.option_1}>{formData.option_1}</option>
                        <option value={formData.option_2}>{formData.option_2}</option>
                        <option value={formData.option_3}>{formData.option_3}</option>
                        <option value={formData.option_4}>{formData.option_4}</option>
                    </select>
                </div>

                <button type="submit" className="btn btn-success w-100">Create MCQ</button>
            </form>
        </div>
    );
}
