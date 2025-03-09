import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";

export default function TeamSection() {
    const [teamMembers, setTeamMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchTeamMembers();
    }, []);

    // ✅ Fetch Team Members
    const fetchTeamMembers = async () => {
        setLoading(true);
        setError("");

        try {
            const response = await axios.get("http://localhost:5000/api/teams");
            setTeamMembers(response.data.members);
        } catch (err) {
            setError("Failed to load team members.");
        }

        setLoading(false);
    };

    return (
        <section id="team" className="team-section py-5 bg-light">
            <div className="container text-center">
                <h2 className="fw-bold text-primary">Meet Our Team</h2>
                <p className="text-muted">Our experts behind the success</p>

                {loading && <p>Loading team members...</p>}
                {error && <p className="text-danger">{error}</p>}

                <div className="row mt-4">
                    {teamMembers.length > 0 ? (
                        teamMembers.map((member) => (
                            <div key={member.id} className="col-md-4 mb-4">
                                <div className="card shadow-sm team-card">
                                    <Image
                                        src={member.photo ? member.photo : "/hero-background-2.jpg"} // ✅ Fallback Image
                                        alt={member.name}
                                        width={200}
                                        height={200}
                                        className="rounded-circle mx-auto mt-3"
                                        unoptimized={member.photo?.startsWith("http") ? false : true} // ✅ Avoid optimization issues for remote images
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
                        ))
                    ) : (
                        <p className="text-muted">No team members available.</p>
                    )}
                </div>
            </div>

            {/* ✅ Styles */}
            <style jsx>{`
                .team-card {
                    border-radius: 12px;
                    transition: transform 0.2s ease-in-out;
                    text-align: center;
                    padding-bottom: 20px;
                }
                .team-card:hover {
                    transform: scale(1.05);
                }
                .social-links a {
                    text-decoration: none;
                    font-size: 14px;
                }
            `}</style>
        </section>
    );
}
