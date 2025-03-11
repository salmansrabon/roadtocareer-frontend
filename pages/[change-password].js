import { useState } from "react";
import axios from "axios";

export default function ChangePassword() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    // ✅ Handle Password Change
    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setMessage("Passwords do not match.");
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            const token = localStorage.getItem("token"); // ✅ Get Token from Storage
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/auth/change-password`,
                { currentPassword, newPassword },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setMessage(response.data.message);
        } catch (error) {
            setMessage(error.response?.data?.message || "Failed to change password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4 shadow-lg" style={{ maxWidth: "500px", width: "100%" }}>
                <h3 className="text-center text-primary">Change Password</h3>
                {message && <div className="alert alert-info">{message}</div>}

                <form onSubmit={handleChangePassword}>
                    <div className="mb-3">
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Current Password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <input
                            type="password"
                            className="form-control"
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
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
                        {loading ? "Updating..." : "Change Password"}
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
