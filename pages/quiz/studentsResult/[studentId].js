import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function StudentResult() {
    const router = useRouter();
    const { studentId } = router.query;
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!studentId) return;

        // ✅ Fetch Student's MCQ Result
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/mcq/result/${studentId}`)
            .then(res => {
                setResult(res.data);
            })
            .catch(err => {
                console.error("Error fetching student result:", err);
                setError("Failed to load student result.");
            })
            .finally(() => setLoading(false));
    }, [studentId]);

    return (
        <div className="container mt-5">
            <h2 className="text-primary text-center fw-bold">Student Quiz Result</h2>

            {loading ? (
                <p className="text-center">Loading result...</p>
            ) : error ? (
                <p className="text-danger text-center">{error}</p>
            ) : result ? (
                <>
                    {/* ✅ Display Student Summary */}
                    <div className="card p-4 shadow-lg mb-4">
                        <h4 className="fw-bold">Student ID: {result.StudentId}</h4>
                        <h5>Total Marks: {result.totalMarks} / {result.totalQuestions}</h5>
                    </div>

                    {/* ✅ Display Answer Sheet */}
                    <table className="table table-bordered shadow-lg">
                        <thead className="table-dark">
                            <tr>
                                <th>Question</th>
                                <th>Student Answer</th>
                                <th>Correct Answer</th>
                                <th>Status</th>
                                <th>Attempted At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {result.answerSheet.length > 0 ? (
                                result.answerSheet.map((answer, index) => (
                                    <tr key={index}>
                                        <td>{answer.question}</td>
                                        <td>{answer.student_answer}</td>
                                        <td>{answer.correct_answer}</td>
                                        <td>
                                            {answer.isCorrect ? (
                                                <span className="badge bg-success">Correct</span>
                                            ) : (
                                                <span className="badge bg-danger">Incorrect</span>
                                            )}
                                        </td>
                                        <td>{new Date(answer.attempted_at).toLocaleString()}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center text-muted">No answers found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* ✅ Back to All Results Button */}
                    <div className="text-center">
                        <button className="btn btn-secondary" onClick={() => router.push(`/quiz/mcqStudentsResult/${localStorage.getItem("courseId")}`)}>
                            Back to All Results
                        </button>
                    </div>
                </>
            ) : (
                <p className="text-center text-muted">No data available.</p>
            )}
        </div>
    );
}
