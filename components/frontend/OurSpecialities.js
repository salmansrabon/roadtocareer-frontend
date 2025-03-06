import { useEffect, useState } from "react";
import { FaCheckSquare } from "react-icons/fa";

const OurSpecialities = () => {
    const [specialities, setSpecialities] = useState([]);

    useEffect(() => {
        fetch("/data/specialities.json")
            .then((res) => res.json())
            .then((data) => setSpecialities(data.items))
            .catch((err) => console.error("Error loading specialities:", err));
    }, []);

    return (
        <section id="specialities" className="container my-5">
            <h2 className="fw-bold text-center mb-4">আমাদের বিশেষত্ব</h2>
            <div className="row align-items-center">
                {/* ✅ Left Side - Logo */}
                <div className="col-md-4 d-flex justify-content-center">
                    <img src="/logo.png" alt="Road to SDET" className="img-fluid rounded-circle shadow-lg" style={{ width: "200px" }} />
                </div>

                {/* ✅ Right Side - Specialities List */}
                <div className="col-md-8">
                    <ul className="list-unstyled">
                        {specialities.map((item, index) => (
                            <li key={index} className="mb-3 d-flex align-items-start">
                                <FaCheckSquare className="text-success me-2" size={18} />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
};

export default OurSpecialities;
