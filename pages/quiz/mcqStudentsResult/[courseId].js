import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function McqStudentsResult() {
    const router = useRouter();
    const { courseId } = router.query;
    const [studentResults, setStudentResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!courseId) return;
    
        // ✅ Fetch results for the given CourseId
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/mcq/result/list/${courseId}`)
            .then(res => {
                setStudentResults(res.data.results);
            })
            .catch(err => {
                console.error("Error fetching student results:", err);
    
                if (err.response) {
                    // ✅ Handle specific error status codes
                    if (err.response.status === 404) {
                        setError("No students found for this course.");
                    } else if (err.response.status === 401) {
                        setError("Unauthorized! Please log in again.");
                    } else if (err.response.status === 403) {
                        setError("Forbidden! You do not have permission to access this resource.");
                    } else if (err.response.status === 500) {
                        setError("Internal Server Error! Please try again later.");
                    } else {
                        setError("An unexpected error occurred.");
                    }
                } else {
                    setError("Network error. Please check your internet connection.");
                }
            })
            .finally(() => setLoading(false));
    }, [courseId]);
    

    return (
        <div className="container mt-5">
            <h2 className="text-primary text-center fw-bold">MCQ Student Results</h2>

            {loading ? (
                <p className="text-center">Loading results...</p>
            ) : error ? (
                <p className="text-danger text-center">{error}</p>
            ) : (
                <table className="table table-bordered mt-4 shadow-lg">
                    <thead className="table-dark">
                        <tr>
                            <th>Student ID</th>
                            <th>Name</th>
                            <th>Total Marks</th>
                            <th>Total Questions</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {studentResults.length > 0 ? (
                            studentResults.map((student, index) => (
                                <tr key={index}>
                                    <td>{student.StudentId}</td>
                                    <td>{student.student_name}</td>
                                    <td>{student.totalMarks}</td>
                                    <td>{student.totalQuestions}</td>
                                    <td>
                                        <button 
                                            className="btn btn-primary"
                                            onClick={() => router.push(`/quiz/studentsResult/${student.StudentId}`)}
                                        >
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center text-muted">No student results found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
}
