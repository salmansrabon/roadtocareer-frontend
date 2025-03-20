import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function StudentCertificate() {
    const router = useRouter();

    const [studentId, setStudentId] = useState("");
    const [certificateUrl, setCertificateUrl] = useState("");
    const [studentName, setStudentName] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        // ✅ Ensure this runs only on the client-side
        if (typeof window !== "undefined") {
            const user = JSON.parse(localStorage.getItem("user"));
            if (!user || !user.username) {
                localStorage.removeItem("token"); // Clear token if invalid
                router.push("/login"); // Redirect to login page
                return;
            }

            setStudentId(user.username);
        }
    }, []);

    useEffect(() => {
        let isMounted = true;

        if (!studentId) return;

        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/students/${studentId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
            .then(res => {
                if (!isMounted) return; // Prevent updating state if unmounted
                console.log("API Response:", res.data);
                const student = res.data;

                if (student) {
                    setStudentName(student.student_name);
                    setCertificateUrl(student.certificate || "");
                } else {
                    setError("Student not found.");
                }
            })
            .catch(err => {
                console.error("Error fetching student data:", err.response ? err.response.data : err.message);
                if (!isMounted) return;

                if (err.response?.status === 401) {
                    setError("Session expired. Please login again.");
                    localStorage.removeItem("token");
                    router.push("/login");
                } else if (err.response?.status === 404) {
                    setError("Student not found.");
                } else {
                    setError("Failed to fetch student details.");
                }
            })
            .finally(() => {
                if (isMounted) setLoading(false);
            });

        return () => {
            isMounted = false; // Cleanup on unmount
        };
    }, [studentId]);

    // ✅ Handle Certificate URL Copy
    const handleCopy = () => {
        navigator.clipboard.writeText(certificateUrl);
        alert("Certificate URL copied to clipboard!");
    };

    return (
        <div
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: "100vh", backgroundColor: "#f8f9fa", padding: "20px" }} // ✅ Center page
        >
            <div
                className="card p-5 shadow-lg text-center"
                style={{ width: "600px", borderRadius: "12px" }} // ✅ Centered content with fixed width
            >
                <h2 className="text-primary fw-bold">Student Certificate</h2>

                {loading ? (
                    <p className="text-center">Loading certificate...</p>
                ) : error ? (
                    <p className="text-danger">{error}</p>
                ) : certificateUrl ? (
                    <>
                        <h4 className="fw-bold mt-3">{studentName}'s Certificate</h4>

                        {/* ✅ Resized Certificate Image */}
                        <div className="d-flex flex-column align-items-center mt-4">
                            <img
                                src={certificateUrl}
                                alt="Certificate"
                                className="img-fluid shadow"
                                style={{
                                    maxWidth: "100%",
                                    height: "auto",
                                    borderRadius: "10px",
                                    objectFit: "cover"
                                }}
                            />

                            {/* ✅ Certificate URL Input & Copy Button */}
                            <div className="input-group mt-3 w-75">
                                <input
                                    type="text"
                                    className="form-control text-center"
                                    value={certificateUrl}
                                    readOnly
                                />
                                <button className="btn btn-secondary" onClick={handleCopy}>
                                    Copy
                                </button>
                            </div>

                            {/* ✅ Download Certificate Button */}
                            <a
                                href={certificateUrl}
                                className="btn btn-success mt-3 w-75"
                                download={`Certificate-${studentName}.jpg`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Download Certificate
                            </a>
                        </div>
                    </>
                ) : (
                    <p className="text-warning">No certificate found.</p>
                )}
            </div>
        </div>
    );

}
