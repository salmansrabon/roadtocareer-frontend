import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function QuizConfig() {
    const router = useRouter();
    const [studentId, setStudentId] = useState(null);
    const [courseId, setCourseId] = useState(null);
    const [quizConfig, setQuizConfig] = useState(null);
    const [quizAttempted, setQuizAttempted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        // ✅ Fetch StudentId from Local Storage
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
            setError("User not found. Please log in.");
            setLoading(false);
            return;
        }

        try {
            const parsedUser = JSON.parse(storedUser);
            if (!parsedUser?.username) {
                throw new Error("Invalid user data.");
            }
            setStudentId(parsedUser.username);
        } catch (err) {
            setError("Error reading user data.");
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!studentId) return;

        // ✅ Fetch Student Data to get CourseId
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/students/${studentId}`)
            .then(res => {
                if (!res.data.Course?.courseId) {
                    throw new Error("No associated course found.");
                }
                setCourseId(res.data.Course.courseId);
            })
            .catch(err => {
                console.error("Error fetching student data:", err);
                setError("Failed to fetch student data.");
            });
    }, [studentId]);

    useEffect(() => {
        if (!courseId) return;

        // ✅ Fetch Quiz Config for the Course
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/mcq-config/${courseId}`)
            .then(res => {
                if (res.data.mcqConfigs.length > 0) {
                    setQuizConfig(res.data.mcqConfigs[0]);
                } else {
                    setError("No quiz configuration found.");
                }
            })
            .catch(err => {
                console.error("Error fetching quiz config:", err);
                setError("Failed to load quiz configuration.");
            })
            .finally(() => setLoading(false));
    }, [courseId]);

    // ✅ Start Quiz Handler
    const handleStartQuiz = async () => {
        if (!quizConfig) return;

        // ✅ Get current UTC time
        const now = new Date().getTime();

        // ✅ Convert start and end times to Date objects (Ensure values exist)
        const startTime = quizConfig.start_datetime ? new Date(quizConfig.start_datetime).getTime() : null;
        const endTime = quizConfig.end_datetime ? new Date(quizConfig.end_datetime).getTime() : null;

        if (!startTime || !endTime) {
            setError("Invalid quiz time configuration.");
            return;
        }

        // ✅ Check Quiz Availability
        if (now < startTime || now > endTime) {
            setError("Quiz is not available at this time.");
            return;
        }

        try {
            // ✅ Check if Student has Already Attempted the Quiz
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/mcq/attempt-status/${studentId}`);

            if (!response.data.isEligible) {
                alert(`${response.data.message}`);
                router.push(`/quiz/result`);
                return;
            }

            // ✅ Redirect to Quiz Page if Eligible
            router.push(`/quiz/${quizConfig.CourseId}`);

        } catch (err) {
            console.error("Error checking quiz attempt status:", err);
            setError("Failed to verify quiz eligibility.");
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-primary text-center fw-bold">Quiz Configuration</h2>

            {loading ? (
                <p className="text-center">Loading quiz details...</p>
            ) : error ? (
                <div className="text-danger text-center">
                    <p>{error}</p>
                    {error.includes("Quiz is not available") && (
                        <p>
                            <a href="/quiz/result" className="text-primary fw-bold">
                                If you have already attempted, click here to show your result
                            </a>
                        </p>
                    )}
                </div>
            ) : quizConfig ? (
                <div className="card p-4 shadow-lg">
                    <h3 className="fw-bold">{quizConfig.quiz_title}</h3>
                    <p><strong>Description:</strong> {quizConfig.quiz_description}</p>
                    <p><strong>Total Questions:</strong> {quizConfig.totalQuestion}</p>
                    <p><strong>Total Time:</strong> {quizConfig.totalTime} min</p>
                    <p>
                        <strong>Start Time:</strong>{" "}
                        {quizConfig.start_datetime
                            ? new Date(quizConfig.start_datetime).toLocaleString("en-US", {
                                month: "long",
                                day: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                                hour12: true
                            }).replace(",", "").replace(/(\d{2}) (\d{4})/, "$1/$2")
                            : "N/A"}
                    </p>
                    <p>
                        <strong>End Time:</strong>{" "}
                        {quizConfig.end_datetime
                            ? new Date(quizConfig.end_datetime).toLocaleString("en-US", {
                                month: "long",
                                day: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                                hour12: true
                            }).replace(",", "").replace(/(\d{2}) (\d{4})/, "$1/$2")
                            : "N/A"}
                    </p>
                    <p>
                        <strong>Status:</strong>{" "}
                        <span className={quizConfig.isActive ? "text-success" : "text-danger"}>
                            {quizConfig.isActive ? "Active" : "Inactive"}
                        </span>
                    </p>

                    {quizAttempted ? (
                        <button
                            className="btn btn-info mt-3"
                            onClick={() => router.push(`/result/${studentId}`)}
                        >
                            Show Result
                        </button>
                    ) : (
                        <button
                            className="btn btn-success mt-3"
                            onClick={handleStartQuiz}
                            disabled={!quizConfig.isActive}
                        >
                            Start Quiz
                        </button>
                    )}
                </div>
            ) : (
                <p className="text-center text-warning">No quiz configuration available.</p>
            )}
        </div>
    );
}
