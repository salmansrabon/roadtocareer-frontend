import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function AddReview() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        batch: "",
        rating: 5,
        description: "",
        designation: "",
        company: "",
        university: "",
        facebook: "",
        whatsapp: "",
        linkedin: "",
        rEnable: 1,
        priority: 10,
    });

    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    // ✅ Handle Input Change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // ✅ Handle Image Upload
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        setImagePreview(URL.createObjectURL(file));
    };

    // ✅ Handle Form Submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            // 🔹 Upload Image First
            const formDataImage = new FormData();
            formDataImage.append("image", image);

            const imageUploadRes = await axios.post("http://localhost:5000/api/images/upload", formDataImage, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            const uploadedImageUrl = `http://localhost:5000/api${imageUploadRes.data.imageUrl}`; // ✅ Get image URL from response

            // 🔹 Submit Review Data
            const reviewData = {
                ...formData,
                image: uploadedImageUrl,
            };

            await axios.post("http://localhost:5000/api/reviews/create", reviewData);

            setMessage("Review added successfully!");
            setLoading(false);

            // ✅ Redirect to Reviews Page After Success
            setTimeout(() => {
                router.push("/reviews");
            }, 2000);
        } catch (error) {
            console.error("Error submitting review:", error);
            setMessage("Failed to add review.");
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="fw-bold text-primary text-center mb-4">Add a Review</h2>

            {message && <div className="alert alert-info text-center">{message}</div>}

            <form onSubmit={handleSubmit} className="card p-4 shadow">
                <div className="row">
                    {/* ✅ Name */}
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Name:</label>
                        <input type="text" name="name" className="form-control" required value={formData.name} onChange={handleChange} />
                    </div>

                    {/* ✅ Batch */}
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Batch:</label>
                        <input type="number" name="batch" className="form-control" required value={formData.batch} onChange={handleChange} />
                    </div>

                    {/* ✅ Rating */}
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Rating (1-5):</label>
                        <input type="number" name="rating" className="form-control" min="1" max="5" required value={formData.rating} onChange={handleChange} />
                    </div>

                    {/* ✅ Priority */}
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Priority:</label>
                        <input type="number" name="priority" className="form-control" required value={formData.priority} onChange={handleChange} />
                    </div>

                    {/* ✅ Description */}
                    <div className="col-12 mb-3">
                        <label className="form-label">Description:</label>
                        <textarea name="description" className="form-control" required rows="3" value={formData.description} onChange={handleChange}></textarea>
                    </div>

                    {/* ✅ Designation & Company */}
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Designation:</label>
                        <input type="text" name="designation" className="form-control" required value={formData.designation} onChange={handleChange} />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Company:</label>
                        <input type="text" name="company" className="form-control" required value={formData.company} onChange={handleChange} />
                    </div>

                    {/* ✅ University */}
                    <div className="col-md-6 mb-3">
                        <label className="form-label">University:</label>
                        <input type="text" name="university" className="form-control" required value={formData.university} onChange={handleChange} />
                    </div>

                    {/* ✅ Social Links */}
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Facebook:</label>
                        <input type="url" name="facebook" className="form-control" value={formData.facebook} onChange={handleChange} />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label">WhatsApp:</label>
                        <input type="text" name="whatsapp" className="form-control" value={formData.whatsapp} onChange={handleChange} />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label">LinkedIn:</label>
                        <input type="url" name="linkedin" className="form-control" value={formData.linkedin} onChange={handleChange} />
                    </div>

                    {/* ✅ Image Upload */}
                    <div className="col-12 mb-3">
                        <label className="form-label">Upload Image:</label>
                        <input type="file" className="form-control" accept="image/*" onChange={handleImageChange} required />
                        {imagePreview && <img src={imagePreview} alt="Preview" className="mt-2 img-thumbnail" style={{ maxWidth: "150px" }} />}
                    </div>

                    {/* ✅ Submit Button */}
                    <div className="col-12 text-center">
                        <button type="submit" className="btn btn-success" disabled={loading}>
                            {loading ? "Submitting..." : "Submit Review"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
