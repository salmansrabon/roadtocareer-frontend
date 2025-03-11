import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function ResetPassword() {
    const [studentId, setStudentId] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // ✅ Handle Reset Request
    const handleResetRequest = async (e) => {
        e.preventDefault();
        setMessage("");
        setLoading(true);

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/request-password-reset`, {
                studentId,
            });

            setMessage(response.data.message);
        } catch (error) {
            setMessage(error.response?.data?.message || "Failed to request password reset.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card shadow-lg p-4" style={{ maxWidth: "500px", width: "100%" }}>
                <h3 className="text-center text-primary">Reset Password</h3>
                <p className="text-muted text-center">Enter your Student ID to receive a reset link.</p>

                {message && <div className="alert alert-info">{message}</div>}

                <form onSubmit={handleResetRequest}>
                    <div className="mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Student ID"
                            value={studentId}
                            onChange={(e) => setStudentId(e.target.value)}
                            required
                        />
                    </div>

                    <button className="btn btn-primary w-100" type="submit" disabled={loading}>
                        {loading ? "Sending..." : "Send Reset Link"}
                    </button>
                </form>
            </div>

            <style jsx>{`
                .container {
                    height: 100vh;
                }
                .card {
                    border-radius: 10px;
                }
            `}</style>
        </div>
    );
}
