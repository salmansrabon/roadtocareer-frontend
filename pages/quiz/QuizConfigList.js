import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function QuizConfigPage() {
    const router = useRouter();
    const [quizConfigs, setQuizConfigs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedConfig, setSelectedConfig] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchQuizConfigs();
    }, []);

    const fetchQuizConfigs = async () => {
        try {
            const token = localStorage.getItem("token"); 
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/mcq-config`,{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setQuizConfigs(response.data.mcqConfigs);
        } catch (err) {
            console.error("Error fetching quiz config:", err);

            if (err.response) {
                switch (err.response.status) {
                    case 400:
                        setError("Bad Request: Please check your input data.");
                        break;
                    case 401:
                        setError("Unauthorized: Please log in to access this page.");
                        router.push("/login");
                        break;
                    case 403:
                        setError("Forbidden: You do not have permission to access this page.");
                        router.push("/403");
                        break;
                    case 404:
                        setError("No quiz configurations found.");
                        break;
                    case 500:
                        setError("Internal Server Error: Something went wrong on the server.");
                        break;
                    default:
                        setError("An unexpected error occurred. Please try again.");
                }
            } else {
                setError("Network error: Please check your connection.");
            }
        } finally {
            setLoading(false);
        }
    };

    // ✅ Format Date for Readability
    const formatDateTime = (dateString) => {
        return new Date(dateString).toLocaleString("en-US", {
            month: "long",
            day: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true
        }).replace(",", "").replace(/(\d{2}) (\d{4})/, "$1/$2");
    };

    // ✅ Open Modal with Selected Config
    const handleViewConfig = (config) => {
        setSelectedConfig({ ...config });
        setShowModal(true);
    };

    // ✅ Update Config
    const handleUpdateConfig = async () => {
        try {
            await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/mcq-config/${selectedConfig.CourseId}`, {
                quiz_title: selectedConfig.quiz_title,
                quiz_description: selectedConfig.quiz_description,
                totalQuestion: selectedConfig.totalQuestion,
                totalTime: selectedConfig.totalTime,
                start_datetime: selectedConfig.start_datetime,
                end_datetime: selectedConfig.end_datetime,
                isActive: selectedConfig.isActive
            });

            alert("Quiz configuration updated successfully!");
            setShowModal(false);
            fetchQuizConfigs(); // Refresh List
        } catch (error) {
            console.error("Error updating quiz config:", error);
            alert("Failed to update quiz configuration.");
        }
    };

    // ✅ Delete Config
    const handleDeleteConfig = async () => {
        if (!confirm("Are you sure you want to delete this quiz configuration?")) return;

        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/mcq-config/${selectedConfig.CourseId}`);
            alert("Quiz configuration deleted successfully!");
            setShowModal(false);
            fetchQuizConfigs(); // Refresh List
        } catch (error) {
            console.error("Error deleting quiz config:", error);
            alert("Failed to delete quiz configuration.");
        }
    };
    const formatDateTimeLocal = (dateString) => {
        if (!dateString) return "";

        const date = new Date(dateString);

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Ensure 2 digits
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0"); // 24-hour format
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const seconds = String(date.getSeconds()).padStart(2, "0"); // Include seconds

        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    };



    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center">
                <h2 className="text-primary fw-bold">Quiz Configurations</h2>
                <button
                    className="btn btn-success"
                    onClick={() => router.push("/quiz/CreateQuizConfig")}
                >
                    + Create Quiz Configuration
                </button>
            </div>

            {loading ? (
                <p className="text-center">Loading quiz configurations...</p>
            ) : error ? (
                <p className="text-danger text-center">{error}</p>
            ) : (
                <div className="table-responsive">
                    <table className="table table-bordered table-striped shadow">
                        <thead className="thead-dark">
                            <tr>
                                <th>#</th>
                                <th>Course ID</th>
                                <th>Quiz Title</th>
                                <th>Description</th>
                                <th>Total Questions</th>
                                <th>Total Time (Minutes)</th>
                                <th>Start Time</th>
                                <th>End Time</th>
                                <th>Status</th>
                                <th className="text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {quizConfigs.length > 0 ? (
                                quizConfigs.map((config, index) => (
                                    <tr key={config.id}>
                                        <td>{index + 1}</td>
                                        <td>
                                            <a
                                                href={`/quiz/mcqStudentsResult/${config.CourseId}`}
                                                className="text-primary fw-bold"
                                                onClick={() => localStorage.setItem("courseId", config.CourseId)}
                                            >
                                                {config.CourseId}
                                            </a>
                                        </td>
                                        <td>{config.quiz_title}</td>
                                        <td>{config.quiz_description}</td>
                                        <td>{config.totalQuestion}</td>
                                        <td>{config.totalTime} mins</td>
                                        <td>{formatDateTime(config.start_datetime)}</td>
                                        <td>{formatDateTime(config.end_datetime)}</td>
                                        <td className={config.isActive ? "text-success fw-bold" : "text-danger fw-bold"}>
                                            {config.isActive ? "Active" : "Inactive"}
                                        </td>
                                        <td className="d-flex gap-2">
                                            <button
                                                className="btn btn-warning btn-sm mx-1"
                                                onClick={() => handleViewConfig(config)}
                                            >
                                                Edit Config
                                            </button>

                                            <button
                                                className="btn btn-info btn-sm mx-1"
                                                onClick={() => router.push(`/quiz/mcqList/${config.CourseId}`)}
                                            >
                                                <i className="fas fa-eye"></i> View Quiz
                                            </button>

                                            <button
                                                className="btn btn-success btn-sm mx-1"
                                                onClick={() => router.push(`/quiz/createMCQ/${config.CourseId}`)}
                                            >
                                                <i className="fas fa-eye"></i> Create Quiz
                                            </button>
                                        </td>


                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="10" className="text-center text-warning">
                                        No quiz configurations available.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* ✅ Modal for Viewing & Editing */}
            {showModal && selectedConfig && (
                <div className="modal d-block" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title">Edit Quiz Configuration</h4>
                                <button className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label">Quiz Title</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={selectedConfig.quiz_title}
                                        onChange={(e) => setSelectedConfig({ ...selectedConfig, quiz_title: e.target.value })}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Description</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={selectedConfig.quiz_description}
                                        onChange={(e) => setSelectedConfig({ ...selectedConfig, quiz_description: e.target.value })}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Total Questions</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={selectedConfig.totalQuestion}
                                        onChange={(e) => setSelectedConfig({ ...selectedConfig, totalQuestion: e.target.value })}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Total Time (Minutes)</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={selectedConfig.totalTime}
                                        onChange={(e) => setSelectedConfig({ ...selectedConfig, totalTime: e.target.value })}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Start Time</label>
                                    <input
                                        type="datetime-local"
                                        className="form-control"
                                        value={selectedConfig.start_datetime ? formatDateTimeLocal(selectedConfig.start_datetime) : ""}
                                        onChange={(e) => {
                                            const localDate = new Date(e.target.value);
                                            const formattedDate = localDate.toISOString().slice(0, 19) + ".000Z";
                                            setSelectedConfig({ ...selectedConfig, start_datetime: formattedDate });
                                        }}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">End Time</label>
                                    <input
                                        type="datetime-local"
                                        className="form-control"
                                        value={selectedConfig.end_datetime ? formatDateTimeLocal(selectedConfig.end_datetime) : ""}
                                        onChange={(e) => {
                                            const localDate = new Date(e.target.value);
                                            const formattedDate = localDate.toISOString().slice(0, 19) + ".000Z";
                                            setSelectedConfig({ ...selectedConfig, end_datetime: formattedDate });
                                        }}
                                    />
                                </div>


                                <div className="mb-3">
                                    <label className="form-label">Status</label>
                                    <select
                                        className="form-select"
                                        value={selectedConfig.isActive}
                                        onChange={(e) => setSelectedConfig({ ...selectedConfig, isActive: e.target.value === "true" })}
                                    >
                                        <option value="true">Active</option>
                                        <option value="false">Inactive</option>
                                    </select>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-danger" onClick={handleDeleteConfig}>Delete</button>
                                <button className="btn btn-success" onClick={handleUpdateConfig}>Update</button>
                                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
