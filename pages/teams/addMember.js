import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function AddMember() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        company: "",
        designation: "",
        email: "",
        whatsapp: "",
        linkedin: "",
        about: "",
    });
    const [photo, setPhoto] = useState(null);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePhotoChange = (e) => {
        setPhoto(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            let uploadedPhotoUrl = "";
        
            if (photo) {
                const imageForm = new FormData();
                imageForm.append("image", photo);
        
                const imageRes = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/images/upload`, imageForm);
                uploadedPhotoUrl = `${process.env.NEXT_PUBLIC_API_URL}${imageRes.data.imageUrl}`;
            }
        
            const payload = {
                ...formData,
                photo: uploadedPhotoUrl,
            };
        
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/teams/add`, payload, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
            });
        
            setMessage("Team member added successfully!");
            setTimeout(() => router.push("/teams/list"), 1500);
        } catch (err) {
            if (err.response) {
                const status = err.response.status;
                if (status === 400) {
                    setMessage("Bad request. Please check the submitted data.");
                } else if (status === 401) {
                    setMessage("Unauthorized. Please login again.");
                    localStorage.removeItem("token");
                    router.push("/login");
                } else if (status === 403) {
                    setMessage("Forbidden. You do not have access to perform this action.");
                    router.push("/403");
                } else if (status === 404) {
                    setMessage("API endpoint not found.");
                } else if (status === 500) {
                    setMessage("Server error. Please try again later.");
                } else {
                    setMessage(err.response.data.message || "An unexpected error occurred.");
                }
            } else {
                setMessage("Network error or server is not reachable.");
            }
        } finally {
            setLoading(false);
        }
        
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center fw-bold text-primary mb-4">Add New Team Member</h2>

            {message && <div className="alert alert-info text-center">{message}</div>}

            <form onSubmit={handleSubmit} className="card p-4 shadow">
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Name</label>
                        <input type="text" name="name" className="form-control" required onChange={handleChange} />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Designation</label>
                        <input type="text" name="designation" className="form-control" required onChange={handleChange} />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Company</label>
                        <input type="text" name="company" className="form-control" required onChange={handleChange} />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Email</label>
                        <input type="email" name="email" className="form-control" required onChange={handleChange} />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label">LinkedIn</label>
                        <input type="url" name="linkedin" className="form-control" onChange={handleChange} />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label">WhatsApp</label>
                        <input type="text" name="whatsapp" className="form-control" onChange={handleChange} />
                    </div>
                    <div className="col-12 mb-3">
                        <label className="form-label">About</label>
                        <textarea name="about" className="form-control" rows="3" onChange={handleChange}></textarea>
                    </div>
                    <div className="col-12 mb-3">
                        <label className="form-label">Upload Photo</label>
                        <input type="file" accept="image/*" className="form-control" onChange={handlePhotoChange} required />
                    </div>
                    <div className="text-center">
                        <button type="submit" className="btn btn-success" disabled={loading}>
                            {loading ? "Submitting..." : "Add Member"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
