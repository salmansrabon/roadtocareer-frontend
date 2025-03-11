import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function ResetPasswordConfirm() {
    const [newPassword, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { token } = router.query; // ✅ Get token from URL

    useEffect(() => {
        if (!router.isReady) return; // ✅ Ensure router is ready before accessing query params
        if (!token) {
            setMessage("Invalid reset link.");
        }
    }, [router.isReady, token]);

    // ✅ Handle Password Reset
    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setMessage("Passwords do not match.");
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`, {
                token,
                newPassword,
            });

            setMessage(response.data.message);
            setTimeout(() => router.push("/login"), 3000); // ✅ Redirect to login page
        } catch (error) {
            setMessage(error.response?.data?.message || "Failed to reset password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card shadow-lg p-4" style={{ maxWidth: "500px", width: "100%" }}>
                <h3 className="text-center text-primary">Set New Password</h3>
                <p className="text-muted text-center">Enter your new password below.</p>

                {message && <div className="alert alert-info">{message}</div>}

                <form onSubmit={handleResetPassword}>
                    <div className="mb-3">
                        <input
                            type="password"
                            className="form-control"
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Confirm New Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button className="btn btn-success w-100" type="submit" disabled={loading}>
                        {loading ? "Updating..." : "Reset Password"}
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
