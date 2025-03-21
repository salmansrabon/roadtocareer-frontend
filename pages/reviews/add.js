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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const formDataImage = new FormData();
            formDataImage.append("image", image);

            const imageUploadRes = await axios.post(process.env.NEXT_PUBLIC_API_URL + "/images/upload", formDataImage, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            const uploadedImageUrl = process.env.NEXT_PUBLIC_API_URL + `${imageUploadRes.data.imageUrl}`;

            const reviewData = {
                ...formData,
                image: uploadedImageUrl,
            };

            await axios.post(process.env.NEXT_PUBLIC_API_URL + "/reviews/create", reviewData);

            setMessage("Review added successfully!");
            setLoading(false);

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
            <div className="row justify-content-center">
                <div className="col-lg-10">
                    <div className="card shadow-lg p-4 border-0">
                        <h2 className="fw-bold text-primary text-center mb-4">✨ Add a Review</h2>

                        {message && <div className="alert alert-info text-center fw-bold">{message}</div>}

                        <form onSubmit={handleSubmit}>
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label className="form-label">Name</label>
                                    <input type="text" name="name" className="form-control" required value={formData.name} onChange={handleChange} />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label">Batch</label>
                                    <input type="number" name="batch" className="form-control" required value={formData.batch} onChange={handleChange} />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label">Rating (1-5)</label>
                                    <input type="number" name="rating" min="1" max="5" className="form-control" required value={formData.rating} onChange={handleChange} />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label">Priority</label>
                                    <input type="number" name="priority" className="form-control" required value={formData.priority} onChange={handleChange} />
                                </div>

                                <div className="col-12">
                                    <label className="form-label">Description</label>
                                    <textarea name="description" rows="4" className="form-control" required value={formData.description} onChange={handleChange}></textarea>
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label">Designation</label>
                                    <input type="text" name="designation" className="form-control" required value={formData.designation} onChange={handleChange} />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label">Company</label>
                                    <input type="text" name="company" className="form-control" required value={formData.company} onChange={handleChange} />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label">University</label>
                                    <input type="text" name="university" className="form-control" required value={formData.university} onChange={handleChange} />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label">Facebook</label>
                                    <input type="url" name="facebook" className="form-control" value={formData.facebook} onChange={handleChange} />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label">WhatsApp</label>
                                    <input type="text" name="whatsapp" className="form-control" value={formData.whatsapp} onChange={handleChange} />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label">LinkedIn</label>
                                    <input type="url" name="linkedin" className="form-control" value={formData.linkedin} onChange={handleChange} />
                                </div>

                                <div className="col-md-12">
                                    <label className="form-label">Upload Image</label>
                                    <input type="file" accept="image/*" className="form-control" onChange={handleImageChange} required />
                                    {imagePreview && <img src={imagePreview} alt="Preview" className="img-thumbnail mt-3" style={{ maxWidth: "150px" }} />}
                                </div>

                                <div className="col-12 text-center">
                                    <button type="submit" className="btn btn-success px-4 py-2 fw-bold" disabled={loading}>
                                        {loading ? "Submitting..." : "Submit Review"}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
