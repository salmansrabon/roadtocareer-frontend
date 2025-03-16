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
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [timeLeft, setTimeLeft] = useState(null); // Timer state

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

        // ✅ Fetch Quiz Config (for total time)
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/mcq-config/${courseId}`)
            .then(res => {
                if (res.data.mcqConfigs.length > 0) {
                    const totalTime = res.data.mcqConfigs[0].totalTime; // Time in minutes
                    setTimeLeft(totalTime * 60); // Convert to seconds
                }
            })
            .catch(err => {
                console.error("Error fetching quiz config:", err);
                setError("Failed to load quiz configuration.");
            });

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

    // ✅ Timer Logic
    useEffect(() => {
        if (timeLeft === null || timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    useEffect(() => {
        if (timeLeft === 0) {
            handleSubmit(true); // ✅ Auto-submit when timer expires
        }
    }, [timeLeft]);
    useEffect(() => {
        const handleBeforeUnload = (event) => {
            event.preventDefault();
            event.returnValue = "Warning: Refreshing the page will auto-submit your quiz!";
        };
    
        window.addEventListener("beforeunload", handleBeforeUnload);
    
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, []);
    useEffect(() => {
        const handleUnload = async () => {
            await handleSubmit(true); // ✅ Auto-submit when page refreshes
        };
    
        window.addEventListener("unload", handleUnload);
    
        return () => {
            window.removeEventListener("unload", handleUnload);
        };
    }, []);
        

    // ✅ Format Time for Display (MM:SS)
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
    };

    // ✅ Handle Answer Selection
    const handleAnswerSelect = (selectedAnswer) => {
        setAnswers(prev => ({
            ...prev,
            [mcqData.mcq_id]: selectedAnswer
        }));
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
    const handleSubmit = async (isAutoSubmit = false) => {
        if (!studentId || !courseId || answers.length === 0) {
            setError("No answers to submit.");
            return;
        }
    
        try {
            for (const mcq_id in answers) {
                await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/mcq/validate`, {
                    CourseId: courseId,
                    StudentId: studentId,
                    mcq_id: mcq_id,
                    user_answer: answers[mcq_id]
                });
            }
    
            alert(isAutoSubmit ? "Auto submission has been processed." : "Thanks for your submission!");
    
            router.push("/quiz/result");
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
                    {/* ✅ Display Countdown Timer */}
                    <div className="text-end">
                        <h5 className="text-danger fw-bold">Time Left: {formatTime(timeLeft)}</h5>
                    </div>

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
                                    checked={answers[mcqData.mcq_id] === mcqData.mcq_question[optionKey]}
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
                        <button className="btn btn-secondary" onClick={handlePrevious} disabled={currentQuestion === 1}>
                            Previous
                        </button>

                        {currentQuestion === totalQuestions ? (
                            <button className="btn btn-success" onClick={() => handleSubmit(false)}>
                                Submit Quiz
                            </button>
                        ) : (
                            <button className="btn btn-primary" onClick={handleNext} disabled={!answers[mcqData.mcq_id]}>
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
