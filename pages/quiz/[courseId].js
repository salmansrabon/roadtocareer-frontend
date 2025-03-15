import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function QuizPage() {
    const router = useRouter();
    const [studentId, setStudentId] = useState(null);
    const [courseId, setCourseId] = useState(null);
    const [totalQuestions, setTotalQuestions] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState(1);
    const [mcqData, setMcqData] = useState(null);
    const [answers, setAnswers] = useState([]);
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

        // ✅ Fetch Student Data to get CourseId
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/students/${studentId}`)
            .then(res => {
                setCourseId(res.data.Course?.courseId);
            })
            .catch(err => {
                console.error("Error fetching student data:", err);
                setError("Failed to fetch student data.");
            });
    }, [studentId]);

    useEffect(() => {
        if (!courseId) return;

        // ✅ Fetch Total Questions
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/mcq/fetch/${courseId}`)
            .then(res => {
                setTotalQuestions(res.data.totalQuestions);
            })
            .catch(err => {
                console.error("Error fetching total questions:", err);
                setError("Failed to load total questions.");
            });
    }, [courseId]);

    useEffect(() => {
        if (!courseId || !currentQuestion) return;

        // ✅ Fetch Current Question
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/mcq/fetch/${courseId}?ques=${currentQuestion}`)
            .then(res => {
                setMcqData(res.data);
            })
            .catch(err => {
                console.error("Error fetching question:", err);
                setError("Failed to load question.");
            })
            .finally(() => setLoading(false));
    }, [courseId, currentQuestion]);

    // ✅ Handle Answer Selection
    const handleAnswerSelect = (selectedAnswer) => {
        setAnswers(prev => {
            const existingIndex = prev.findIndex(ans => ans.mcq_id === mcqData.mcq_id);
            if (existingIndex !== -1) {
                prev[existingIndex].user_answer = selectedAnswer; // ✅ Update existing answer
                return [...prev];
            }
            return [...prev, { mcq_id: mcqData.mcq_id, user_answer: selectedAnswer }]; // ✅ Store new answer
        });
    };

    // ✅ Navigate to Next Question
    const handleNext = () => {
        if (currentQuestion < totalQuestions) {
            setCurrentQuestion(prev => prev + 1);
        }
    };

    // ✅ Navigate to Previous Question
    const handlePrevious = () => {
        if (currentQuestion > 1) {
            setCurrentQuestion(prev => prev - 1);
        }
    };

    // ✅ Submit All Answers
    const handleSubmit = async () => {
        if (!studentId || !courseId || answers.length === 0) {
            setError("No answers to submit.");
            return;
        }

        try {
            for (const answer of answers) {
                await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/mcq/validate`, {
                    CourseId: courseId,
                    StudentId: studentId,
                    mcq_id: answer.mcq_id,
                    user_answer: answer.user_answer
                });
            }

            router.push("/quiz/result"); // ✅ Redirect to result page
        } catch (err) {
            console.error("Error submitting answers:", err);
            setError("Failed to submit answers.");
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-primary text-center fw-bold">Quiz</h2>

            {loading ? (
                <p className="text-center">Loading question...</p>
            ) : error ? (
                <p className="text-danger text-center">{error}</p>
            ) : mcqData ? (
                <div className="card p-4 shadow-lg">
                    <h4 className="fw-bold">Question {mcqData.ques} of {totalQuestions}</h4>
                    <p className="fs-5">{mcqData.mcq_question.question_title}</p>

                    {/* ✅ Options */}
                    <div className="mb-3">
                        {["option_1", "option_2", "option_3", "option_4"].map(optionKey => (
                            <div key={optionKey} className="form-check">
                                <input
                                    type="radio"
                                    className="form-check-input"
                                    id={optionKey}
                                    name="answer"
                                    value={mcqData.mcq_question[optionKey]}
                                    checked={answers.some(ans => ans.mcq_id === mcqData.mcq_id && ans.user_answer === mcqData.mcq_question[optionKey])}
                                    onChange={() => handleAnswerSelect(mcqData.mcq_question[optionKey])}
                                />
                                <label className="form-check-label" htmlFor={optionKey}>
                                    {mcqData.mcq_question[optionKey]}
                                </label>
                            </div>
                        ))}
                    </div>

                    {/* ✅ Navigation Buttons */}
                    <div className="d-flex justify-content-between">
                        <button
                            className="btn btn-secondary"
                            onClick={handlePrevious}
                            disabled={currentQuestion === 1}
                        >
                            Previous
                        </button>
                        
                        {currentQuestion === totalQuestions ? (
                            <button
                                className="btn btn-success"
                                onClick={handleSubmit}
                            >
                                Submit Quiz
                            </button>
                        ) : (
                            <button
                                className="btn btn-primary"
                                onClick={handleNext}
                                disabled={!answers.some(ans => ans.mcq_id === mcqData.mcq_id)}
                            >
                                Next
                            </button>
                        )}
                    </div>
                </div>
            ) : (
                <p className="text-center">No questions available.</p>
            )}
        </div>
    );
}
