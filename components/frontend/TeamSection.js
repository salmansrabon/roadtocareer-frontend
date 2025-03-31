import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";

export default function TeamSection() {
    const [teamMembers, setTeamMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        fetchTeamMembers();
    }, []);

    const fetchTeamMembers = async () => {
    setLoading(true);
    setError("");

    try {
        const response = await axios.get(process.env.NEXT_PUBLIC_API_URL + "/teams/list");
        const members = response.data.members;

        setTeamMembers(members);
        setCurrentIndex(members.length-1);
    } catch (err) {
        setError("Failed to load team members.");
    }

    setLoading(false);
};


    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % teamMembers.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + teamMembers.length) % teamMembers.length);
    };

    const getSlideStyle = (index) => {
        const position = index - currentIndex;
        if (position === 0 || position === -teamMembers.length || position === teamMembers.length) return "carousel-center";
        if (position === -1 || position === teamMembers.length - 1) return "carousel-left";
        if (position === 1 || position === -(teamMembers.length - 1)) return "carousel-right";
        return "carousel-hidden";
    };

    return (
        <section id="team" className="team-section py-5 bg-light">
            <div className="container text-center">
                <h2 className="fw-bold text-primary">Meet Our Team</h2>
                <p className="text-muted">Our experts behind the success</p>

                {loading && <p>Loading team members...</p>}
                {error && <p className="text-danger">{error}</p>}

                <div className="carousel-wrapper">
                    {teamMembers.length > 0 ? (
                        <div className="carousel">
                            {teamMembers.map((member, index) => (
                                <div key={member.id} className={`carousel-card ${getSlideStyle(index)}`}>
                                    <div className="card shadow-sm team-card">
                                        <Image
                                            src={member.photo || "/hero-background-2.jpg"}
                                            alt={member.name}
                                            width={200}
                                            height={200}
                                            className="rounded-circle mx-auto mt-3"
                                            unoptimized
                                        />
                                        <div className="card-body">
                                            <h5 className="fw-bold">{member.name}</h5>
                                            <p className="text-muted mb-1">{member.designation} at {member.company || "N/A"}</p>
                                            <p className="text-muted small">{member.about}</p>
                                            <div className="social-links">
                                                {member.linkedin && (
                                                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-primary me-2">
                                                        LinkedIn
                                                    </a>
                                                )}
                                                {member.whatsapp && (
                                                    <a href={`https://wa.me/${member.whatsapp}`} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-success">
                                                        WhatsApp
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted">No team members available.</p>
                    )}

                    {teamMembers.length > 1 && (
                        <>
                            <button className="btn btn-outline-primary carousel-prev" onClick={handlePrev}>⬅️ Previous</button>
                            <button className="btn btn-outline-primary carousel-next" onClick={handleNext}>Next ➡️</button>
                        </>
                    )}
                </div>
            </div>

            <style jsx>{`
                .carousel-wrapper {
                    position: relative;
                    overflow: hidden;
                    max-width: 100%;
                    min-height: 500px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .carousel {
                    position: relative;
                    width: 100%;
                    height: 100%;
                }
                .carousel-card {
                    position: absolute;
                    width: 320px;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%) scale(0.7);
                    opacity: 0;
                    transition: all 0.4s ease-in-out;
                }
                .carousel-center {
                    transform: translate(-50%, -50%) scale(1.05);
                    opacity: 1;
                    z-index: 2;
                }
                .carousel-left {
                    transform: translate(-160%, -50%) scale(0.9);
                    opacity: 0.5;
                    z-index: 1;
                }
                .carousel-right {
                    transform: translate(60%, -50%) scale(0.9);
                    opacity: 0.5;
                    z-index: 1;
                }
                .carousel-hidden {
                    display: none;
                }
                .carousel-prev {
                    position: absolute;
                    left: 10px;
                    top: 50%;
                    transform: translateY(-50%);
                }
                .carousel-next {
                    position: absolute;
                    right: 10px;
                    top: 50%;
                    transform: translateY(-50%);
                }
                .team-card {
                    border-radius: 12px;
                    text-align: center;
                    padding-bottom: 20px;
                    background: #fff;
                }
            `}</style>
        </section>
    );
}
