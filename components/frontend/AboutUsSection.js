import { useState, useEffect } from "react";

const AboutUs = () => {
    const [achievements, setAchievements] = useState([]);

    useEffect(() => {
        fetch("/data/aboutUsData.json") // Adjust the path if needed
            .then((res) => res.json())
            .then((data) => setAchievements(data))
            .catch((error) => console.error("Error fetching About Us data:", error));
    }, []);

    return (
        <section id="about-us" className="about-us-section py-5">
            <div className="container">
                <h2 className="text-center text-primary fw-bold mb-4">আমাদের সম্পর্কে</h2>
                <div className="row">
                    {achievements.map((achievement) => (
                        <div key={achievement.id} className="col-md-6 mb-4 d-flex align-items-center">
                            <div className="achievement-card p-4 shadow-sm">
                                <h4>{achievement.text}</h4>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <style jsx>{`
                .about-us-section {
                    background-color: #f8f9fa;
                }
                .achievement-card {
                    background: white;
                    border-radius: 10px;
                    text-align: center;
                    flex-grow: 1;
                }
            `}</style>
        </section>
    );
};

export default AboutUs;
