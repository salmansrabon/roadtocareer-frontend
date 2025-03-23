import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function QuizResult() {
    const router = useRouter();
    const [studentId, setStudentId] = useState(null);
    const [resultData, setResultData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        // ✅ Fetch Student ID from Local Storage
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
            setError("User not found. Please log in.");
            setLoading(false);
            return;
        }

        try {
            const parsedUser = JSON.parse(storedUser);
            setStudentId(parsedUser.username);
        } catch (err) {
            setError("Error reading user data.");
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!studentId) return;
    
        // ✅ Fetch Result Data
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/mcq/result/${studentId}`)
            .then(res => {
                setResultData(res.data);
            })
            .catch(err => {
                console.error("Error fetching result:", err);
    
                if (err.response) {
                    const status = err.response.status;
                    switch (status) {
                        case 400:
                            setError("Bad Request: Please check the student ID.");
                            break;
                        case 401:
                            setError("Unauthorized: Please log in to view quiz results.");
                            break;
                        case 403:
                            setError("Forbidden: You do not have permission to access this student's result.");
                            break;
                        case 404:
                            setError("No quiz result found for this student.");
                            break;
                        case 500:
                            setError("Internal Server Error: Please try again later.");
                            break;
                        default:
                            setError("An unexpected error occurred.");
                    }
                } else {
                    setError("Network error or server not reachable.");
                }
            })
            .finally(() => setLoading(false));
    }, [studentId]);
    

    return (
        <div className="container mt-5">
            <h2 className="text-primary text-center fw-bold">Quiz Results</h2>

            {loading ? (
                <p className="text-center">Loading results...</p>
            ) : error ? (
                <p className="text-danger text-center">{error}</p>
            ) : resultData ? (
                <div className="card p-4 shadow-lg">
                    {/* ✅ Score Summary */}
                    <div className="text-center mb-4">
                        <h3 className="fw-bold">Score Summary</h3>
                        <p className="fs-5">
                            <strong>Total Marks:</strong> {resultData.totalMarks} / {resultData.totalQuestions}
                        </p>
                    </div>

                    {/* ✅ Answer Sheet Table */}
                    <table className="table table-bordered table-hover">
                        <thead className="table-dark">
                            <tr>
                                <th>#</th>
                                <th>Question</th>
                                <th>Correct Answer</th>
                                <th>Your Answer</th>
                                <th>Result</th>
                                <th>Attempted At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {resultData.answerSheet.map((entry, index) => (
                                <tr key={index} className={entry.isCorrect ? "table-success" : "table-danger"}>
                                    <td>{index + 1}</td>
                                    <td>{entry.question}</td>
                                    <td>{entry.correct_answer}</td>
                                    <td>{entry.student_answer}</td>
                                    <td>
                                        {entry.isCorrect ? (
                                            <span className="text-success fw-bold">✔ Correct</span>
                                        ) : (
                                            <span className="text-danger fw-bold">✘ Incorrect</span>
                                        )}
                                    </td>
                                    <td>
                                        {new Date(entry.attempted_at).toLocaleString("en-US", {
                                            month: "long",
                                            day: "2-digit",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            second: "2-digit",
                                            hour12: true
                                        })}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* ✅ Back to Home Button */}
                    <div className="text-center mt-4">
                        <button className="btn btn-primary" onClick={() => router.push("/quiz/QuizConfig")}>
                            Back to Home
                        </button>
                    </div>
                </div>
            ) : (
                <p className="text-center">No quiz results found.</p>
            )}
        </div>
    );
}
