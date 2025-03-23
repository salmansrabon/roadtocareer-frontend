import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function McqList() {
    const router = useRouter();
    const { courseId } = router.query; // ✅ Get courseId from URL parameter
    const [mcqs, setMcqs] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    
    useEffect(() => {
        if (!courseId) return;
    
        // ✅ Fetch MCQs by Course ID
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/mcq/admin/fetch/${courseId}`,{
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        })
            .then(res => {
                setMcqs(res.data.questions);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching MCQs:", err);
                
                if (err.response) {
                    // ✅ Handle specific error status codes
                    if (err.response.status === 404) {
                        setError("No MCQs found for this course.");
                    } else if (err.response.status === 401) {
                        setError("Unauthorized! Please log in again.");
                    } else if (err.response.status === 403) {
                        setError("Forbidden! You do not have permission to access this page.");
                        router.push("/403");
                    } else if (err.response.status === 500) {
                        setError("Internal Server Error! Please try again later.");
                    } else {
                        setError("An unexpected error occurred.");
                    }
                } else {
                    setError("Network error. Please check your internet connection.");
                }
    
                setLoading(false);
            });
    }, [courseId]);
    

    // ✅ Handle Input Change for Editing MCQs
    const handleInputChange = (index, field, value) => {
        const updatedMcqs = [...mcqs];
        updatedMcqs[index].mcq_question[field] = value;
        setMcqs(updatedMcqs);
    };

    // ✅ Save Updated Question
    const handleSave = async (mcq) => {
        setSaving(true);
        try {
            await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/mcq/update/${mcq.mcq_id}`, {
                question_title: mcq.mcq_question.question_title,
                option_1: mcq.mcq_question.option_1,
                option_2: mcq.mcq_question.option_2,
                option_3: mcq.mcq_question.option_3,
                option_4: mcq.mcq_question.option_4,
                correct_answer: mcq.mcq_question.correct_answer
            });

            alert("MCQ updated successfully!");
        } catch (err) {
            console.error("Error updating MCQ:", err);
            alert("Failed to update question.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-primary text-center fw-bold">
                MCQs for Course: {courseId}
            </h2>

            {loading ? (
                <p className="text-center">Loading questions...</p>
            ) : error ? (
                <p className="text-danger text-center">{error}</p>
            ) : (
                <>
                    <h4 className="text-secondary">Total Questions: {mcqs.length}</h4>

                    <div className="table-responsive">
                        <table className="table table-bordered table-striped shadow">
                            <thead className="thead-dark">
                                <tr>
                                    <th>#</th>
                                    <th>Question</th>
                                    <th>Option 1</th>
                                    <th>Option 2</th>
                                    <th>Option 3</th>
                                    <th>Option 4</th>
                                    <th>Correct Answer</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mcqs.map((mcq, index) => (
                                    <tr key={mcq.mcq_id}>
                                        <td>{index + 1}</td>
                                        <td>
                                            <textarea
                                                rows={5}
                                                width="100%"
                                                height="100%"
                                                type="text"
                                                className="form-control"
                                                value={mcq.mcq_question.question_title}
                                                onChange={(e) => handleInputChange(index, "question_title", e.target.value)}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={mcq.mcq_question.option_1}
                                                onChange={(e) => handleInputChange(index, "option_1", e.target.value)}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={mcq.mcq_question.option_2}
                                                onChange={(e) => handleInputChange(index, "option_2", e.target.value)}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={mcq.mcq_question.option_3}
                                                onChange={(e) => handleInputChange(index, "option_3", e.target.value)}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={mcq.mcq_question.option_4}
                                                onChange={(e) => handleInputChange(index, "option_4", e.target.value)}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={mcq.mcq_question.correct_answer}
                                                onChange={(e) => handleInputChange(index, "correct_answer", e.target.value)}
                                            />
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-success"
                                                onClick={() => handleSave(mcq)}
                                                disabled={saving}
                                            >
                                                {saving ? "Saving..." : "Save"}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
}
