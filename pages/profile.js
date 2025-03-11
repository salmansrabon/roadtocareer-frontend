import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function Profile() {
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({
        student_name: "",
        email: "",
        mobile: "",
        university: "",
        profession: "",
        company: "",
        designation: "",
        experience: "",
        knowMe: "",
        remark: "",
        isEnrolled: false,
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const router = useRouter();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");

        if (!storedUser) {
            router.push("/login");
            return;
        }

        try {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            fetchStudentProfile(parsedUser.username); // ✅ Fetch student profile data
        } catch (error) {
            console.error("Error parsing user:", error);
            localStorage.removeItem("user");
            router.push("/login");
        }
    }, []);

    // ✅ Fetch Student Profile Data
    const fetchStudentProfile = async (studentId) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/students/${studentId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setFormData(response.data); // ✅ Populate form with fetched data
        } catch (err) {
            console.error("Error fetching profile:", err);
            setError("Failed to load profile data.");
        } finally {
            setLoading(false);
        }
    };

    // ✅ Handle Input Change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // ✅ Handle Profile Update
    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setSuccess("");
        setError("");

        try {
            const token = localStorage.getItem("token");
            await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/students/${user.username}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setSuccess("Profile updated successfully!");
        } catch (err) {
            console.error("Error updating profile:", err);
            setError("Failed to update profile.");
        }
    };

    if (!user) return <div className="text-center mt-5">Loading...</div>;

    return (
        <div className="container mt-5">
            <h2 className="fw-bold text-primary text-center">My Profile</h2>

            <div className="card p-4 shadow-lg">
                {error && <div className="alert alert-danger">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}

                <form onSubmit={handleUpdateProfile}>
                    <div className="row">
                        {/* Student Id */}
                        <div className="col-md-6">
                            <label className="form-label">Student Id</label>
                            <input
                                type="text"
                                className="form-control"
                                name="StudentId"
                                value={formData.StudentId}
                                onChange={handleChange}
                                disabled
                            />
                        </div>
                        {/* Student Name */}
                        <div className="col-md-6">
                            <label className="form-label">Student Name</label>
                            <input
                                type="text"
                                className="form-control"
                                name="student_name"
                                value={formData.student_name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Email */}
                        <div className="col-md-6">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                disabled
                            />
                        </div>

                        {/* Mobile */}
                        <div className="col-md-6 mt-3">
                            <label className="form-label">Mobile</label>
                            <input
                                type="text"
                                className="form-control"
                                name="mobile"
                                value={formData.mobile}
                                onChange={handleChange}
                            />
                        </div>

                        {/* University */}
                        <div className="col-md-6 mt-3">
                            <label className="form-label">University</label>
                            <input
                                type="text"
                                className="form-control"
                                name="university"
                                value={formData.university}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Profession */}
                        <div className="col-md-6 mt-3">
                            <label className="form-label">Profession</label>
                            <input
                                type="text"
                                className="form-control"
                                name="profession"
                                value={formData.profession}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Company */}
                        <div className="col-md-6 mt-3">
                            <label className="form-label">Company</label>
                            <input
                                type="text"
                                className="form-control"
                                name="company"
                                value={formData.company}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Designation */}
                        <div className="col-md-6 mt-3">
                            <label className="form-label">Designation</label>
                            <input
                                type="text"
                                className="form-control"
                                name="designation"
                                value={formData.designation}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Experience */}
                        <div className="col-md-6 mt-3">
                            <label className="form-label">Experience (Years)</label>
                            <input
                                type="text"
                                className="form-control"
                                name="experience"
                                value={formData.experience}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Know Me */}
                        <div className="col-md-6 mt-3">
                            <label className="form-label">How You Know Us?</label>
                            <input
                                type="text"
                                className="form-control"
                                name="knowMe"
                                value={formData.knowMe}
                                onChange={handleChange}
                            />
                        </div>
                        {/* Opinion */}
                        <div className="col-md-6 mt-3">
                            <label className="form-label">Share something about you</label>
                            <input
                                type="text"
                                className="form-control"
                                name="opinion"
                                value={formData.opinion}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button type="submit" className="btn btn-primary mt-4 w-100">
                        Update Profile
                    </button>
                </form>
            </div>

            <style jsx>{`
                .card {
                    max-width: 800px;
                    margin: auto;
                }
            `}</style>
        </div>
    );
}
