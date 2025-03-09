import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";

export default function Reviews() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/reviews/list");
            setReviews(response.data.reviews);
        } catch (err) {
            console.error("Error fetching reviews:", err);
            setError("Failed to load reviews.");
        }
        setLoading(false);
    };

    return (
        <div className="reviews-container">
            <h2 className="fw-bold text-primary text-center mb-4">Student Reviews</h2>

            {loading && <p className="text-center">Loading reviews...</p>}
            {error && <p className="text-danger text-center">{error}</p>}

            <div className="row justify-content-center">
                {reviews.length > 0 ? (
                    reviews.map((review) => (
                        <div key={review.id} className="col-md-4 mb-4">
                            <div className="card shadow-sm p-3">
                                <div className="text-center">
                                    <Image 
                                        src={review.image || "/images/default-user.jpg"}
                                        alt={review.name}
                                        width={120}
                                        height={120}
                                        className="rounded-circle img-fluid"
                                    />
                                </div>
                                <div className="card-body text-center">
                                    <h5 className="fw-bold">{review.name}</h5>
                                    <p className="text-muted">{review.designation} at {review.company || "N/A"}</p>
                                    <p className="small text-warning">
                                        {"⭐".repeat(review.rating) || "No Rating"}
                                    </p>
                                    
                                    {/* ✅ Scrollable Description Box */}
                                    <div className="review-description">
                                        {review.description}
                                    </div>

                                    <div className="d-flex justify-content-center gap-2 mt-3">
                                        {review.linkedin && (
                                            <a href={review.linkedin} target="_blank" className="btn btn-primary btn-sm">
                                                LinkedIn
                                            </a>
                                        )}
                                        {review.facebook && (
                                            <a href={review.facebook} target="_blank" className="btn btn-info btn-sm">
                                                Facebook
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-muted">No reviews found.</p>
                )}
            </div>

            {/* ✅ Custom Styles */}
            <style jsx>{`
                .reviews-container {
                    margin-top: 80px;
                    padding: 20px;
                    min-height: 100vh;
                }

                .review-description {
                    max-height: 100px; /* ✅ Limit description height */
                    overflow-y: auto; /* ✅ Enable vertical scroll */
                    text-align: justify;
                    padding: 10px;
                    border-radius: 5px;
                    background: #f8f9fa;
                    font-size: 14px;
                }

                /* ✅ Custom scrollbar */
                .review-description::-webkit-scrollbar {
                    width: 5px;
                }

                .review-description::-webkit-scrollbar-thumb {
                    background: #888;
                    border-radius: 5px;
                }

                .review-description::-webkit-scrollbar-thumb:hover {
                    background: #555;
                }

                @media (max-width: 768px) {
                    .reviews-container {
                        margin-top: 100px;
                    }
                }
            `}</style>
        </div>
    );
}
