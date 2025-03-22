import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(""); // ✅ Store error messages
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            router.push("/dashboard"); // Redirect if already logged in
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); // ✅ Clear previous errors
        try {
            const res = await axios.post(process.env.NEXT_PUBLIC_API_URL + "/auth/login", { username, password });

            if (res.data.token && res.data.user) {
                localStorage.setItem("token", res.data.token);
                localStorage.setItem("user", JSON.stringify(res.data.user)); // ✅ Store user data
    
                // ✅ Redirect based on user role
                if (res.data.user.role === "student") {
                    router.push("/mydashboard"); // ✅ Redirect student
                } else {
                    router.push("/dashboard"); // ✅ Redirect admin/staff
                }
            } else {
                setError("Invalid response from server.");
            }
        } catch (error) {
            // ✅ Handle different errors
            if (error.response) {
                setError(error.response.data.message); // ✅ Show error message from backend
            } else {
                setError("An unexpected error occurred.");
            }
        }
    };

    return (
        <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
            <div className="card p-4 shadow-lg" style={{ width: "400px" }}>
                <h3 className="text-center mb-3">Login</h3>

                {/* ✅ Show Error Message */}
                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Username</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter username"
                            onChange={(e) => setUsername(e.target.value.trim())}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Enter password"
                            onChange={(e) => setPassword(e.target.value.trim())}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Login</button>
                </form>
                {/* ✅ Reset Password Link */}
                <div className="text-center mt-3">
                    <a href="/reset-password" className="text-primary fw-bold">Forgot Password?</a>
                </div>
            </div>
        </div>
    );
}
