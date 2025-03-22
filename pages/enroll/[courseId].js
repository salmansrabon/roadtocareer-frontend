import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import universitiesData from "/public/data/universities.json";

export default function EnrollStudent() {
    const router = useRouter();
    const { courseId } = router.query; // ✅ Get courseId from URL
    const [universities, setUniversities] = useState([]); // ✅ Store university names
    const [filteredUniversities, setFilteredUniversities] = useState([]); // ✅ Filtered universities
    const [search, setSearch] = useState(""); // ✅ Search input
    const [showDropdown, setShowDropdown] = useState(false);

    const [formData, setFormData] = useState({
        salutation: "Mr",
        student_name: "",
        email: "",
        mobile: "",
        address: "",
        profession: "",
        package_name: "",
        university: "",
        passingYear: "",
        company: "",
        designation: "",
        experience: "",
        knowMe: "",
        opinion: ""
    });

    const [courseDetails, setCourseDetails] = useState(null);
    const [packages, setPackages] = useState([]); // ✅ Store available packages
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const [isJobHolder, setIsJobHolder] = useState(false); // ✅ Track Job Holder selection

    useEffect(() => {
        if (!courseId) return;

        // ✅ Fetch Course Details (Title & Batch No)
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/courses/${courseId}`)
            .then(res => {
                setCourseDetails(res.data.course);
                setPackages(res.data.course.Packages || []); // ✅ Set available packages
            })
            .catch(err => console.error("Error fetching course details:", err));
    }, [courseId]);
    // ✅ Load Universities & Sort Alphabetically
    useEffect(() => {
        const sortedUniversities = universitiesData.university
            .map((uni) => uni.name)
            .sort(); // Sort alphabetically

        setUniversities(sortedUniversities);
        setFilteredUniversities(sortedUniversities.slice(0, 5)); // Show first 5 by default
    }, []);


    // ✅ Handle Input Changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // ✅ Show or Hide Job Holder Fields
        if (name === "profession") {
            setIsJobHolder(value === "Job Holder");
        }
    };
    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearch(value);
        handleChange(e); // ✅ Update parent state

        if (value.length === 0) {
            setFilteredUniversities(universities.slice(0, 5)); // Show default 5 when empty
            setShowDropdown(false);
        } else {
            const filtered = universities.filter((uni) =>
                uni.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredUniversities(filtered.slice(0, 5)); // Show up to 5 matches
            setShowDropdown(true);
        }
    };
    // ✅ Handle Selection
    const handleSelect = (selectedUniversity) => {
        setSearch(selectedUniversity);
        setShowDropdown(false);
        handleChange({ target: { name: "university", value: selectedUniversity } });
    };

    // ✅ Handle Form Submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        if (!courseId) {
            setError("Invalid Course ID.");
            setLoading(false);
            return;
        }

        try {
            await axios.post(process.env.NEXT_PUBLIC_API_URL + "/students/signup", {
                ...formData,
                courseId
            });

            setSuccess("Registration successful! Check your email for the confirmation.");
            setTimeout(() => router.push("/login"), 5000);
        } catch (err) {
            console.error("Error registering student:", err);

            // ✅ Ensure API Error Message is extracted correctly
            const apiErrorMessage =
                err.response && err.response.data && err.response.data.message
                    ? err.response.data.message
                    : "An error occurred. Please contact admin\nWhatsApp: 01782808778";

            setError(apiErrorMessage);
        } finally {
            setLoading(false);
        }
    };
    if (!courseDetails) {
        return (
            <div className="d-flex justify-content-center align-items-center bg-light" style={{ minHeight: "100vh" }}>
                <h2 className="text-danger">Course is Not Found</h2>
            </div>
        );
    }

    return (
        <div
            className="d-flex justify-content-center bg-light"
            style={{ minHeight: "100vh", padding: "40px 20px", overflowY: "auto" }} // ✅ Make entire page scrollable
        >
            <div
                className="card p-5 shadow-lg"
                style={{ width: "850px", borderRadius: "12px", minHeight: "auto" }} // ✅ Prevent shrinking, allow content expansion
            >
                {/* ✅ Sticky Title & Course Details */}
                <div className="text-center mb-4">
                    <h2 className="fw-bold mb-3">Student Enrollment</h2>
                    {courseDetails && (
                        <div>
                            <h4 className="fw-bold text-primary">{courseDetails.course_title}</h4>
                            <p className="text-muted fs-5">Batch: <strong>{courseDetails.batch_no}</strong></p>
                        </div>
                    )}
                </div>

                {/* ✅ Form */}
                <form onSubmit={handleSubmit}>
                    <div className="row g-4">
                        {/* ✅ Salutation */}
                        <div className="col-md-6">
                            <label className="form-label fw-bold">Salutation
                                <span className="text-danger fw-bold">*</span>
                            </label>
                            <select className="form-control border-primary p-3" name="salutation" required onChange={handleChange}>
                                <option value="">Select...</option>
                                <option value="Mr">Mr</option>
                                <option value="Mrs">Mrs</option>
                            </select>
                        </div>

                        {/* ✅ Full Name */}
                        <div className="col-md-6">
                            <label className="form-label fw-bold">Full Name
                                <span className="text-danger fw-bold">*</span>
                            </label>
                            <input type="text" className="form-control border-primary p-3" name="student_name" required onChange={handleChange} />
                        </div>

                        {/* ✅ Email */}
                        <div className="col-md-6">
                            <label className="form-label fw-bold">Email
                                <span className="text-danger fw-bold">*</span>
                            </label>
                            <input
                                type="email"
                                className="form-control border-primary p-3"
                                name="email"
                                required
                                placeholder="Enter your Gmail address"
                                onChange={(e) => {
                                    const value = e.target.value.trim();
                                    const input = e.target;

                                    if (value === "" || value.endsWith("@gmail.com")) {
                                        input.setCustomValidity("");
                                        handleChange(e);
                                    } else {
                                        input.setCustomValidity("Only Gmail addresses are allowed");
                                        input.reportValidity(); // ✅ Force immediate error display
                                    }
                                }}
                                onInvalid={(e) => e.target.setCustomValidity("Only Gmail addresses are allowed")}
                                onInput={(e) => e.target.setCustomValidity("")}
                            />
                        </div>

                        {/* ✅ Mobile */}
                        <div className="col-md-6">
                            <label className="form-label fw-bold">Mobile
                                <span className="text-danger fw-bold">*</span>
                            </label>
                            <input type="text" className="form-control border-primary p-3" name="mobile" required onChange={handleChange} />
                        </div>

                        {/* ✅ Location */}
                        <div className="col-md-6">
                            <label className="form-label fw-bold">Location
                                <span className="text-danger fw-bold">*</span>
                            </label>
                            <input type="text" className="form-control border-primary p-3" name="address" required onChange={handleChange} placeholder="The area where you live" />
                        </div>

                        {/* ✅ University */}
                        <div className="col-md-6 position-relative">
                            <label className="form-label fw-bold">University
                                <span className="text-danger fw-bold">*</span>
                            </label>
                            <input
                                type="text"
                                className="form-control border-primary p-3"
                                name="university"
                                value={search}
                                required
                                onChange={handleInputChange}
                                onFocus={() => setShowDropdown(true)}
                                autoComplete="off"
                            />

                            {/* ✅ Dropdown List */}
                            {showDropdown && filteredUniversities.length > 0 && (
                                <ul className="list-group position-absolute w-100" style={{ zIndex: 10 }}>
                                    {filteredUniversities.map((uni, index) => (
                                        <li
                                            key={index}
                                            className="list-group-item list-group-item-action"
                                            onClick={() => handleSelect(uni)}
                                            style={{ cursor: "pointer" }}
                                        >
                                            {uni}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>


                        {/* ✅ Passing Year */}
                        <div className="col-md-6">
                            <label className="form-label fw-bold">Passing Year/Semester
                                <span className="text-danger fw-bold">*</span>
                            </label>
                            <input type="text" className="form-control border-primary p-3" name="passingYear" required onChange={handleChange} placeholder="e.g. 01,2025" />
                        </div>

                        {/* ✅ Profession */}
                        <div className="col-md-6">
                            <label className="form-label fw-bold">Profession
                                <span className="text-danger fw-bold">*</span>
                            </label>
                            <select className="form-control border-primary p-3" name="profession" onChange={handleChange}>
                                <option value="">Select...</option>
                                <option value="Fresh Graduate">Fresh Graduate</option>
                                <option value="Student">Student</option>
                                <option value="Job Holder">Job Holder</option>
                            </select>
                        </div>

                        {/* ✅ Conditional Job Holder Fields */}
                        {isJobHolder && (
                            <>
                                <div className="col-md-6">
                                    <label className="form-label fw-bold">Company Name</label>
                                    <input type="text" className="form-control border-primary p-3" name="company" onChange={handleChange} />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-bold">Designation</label>
                                    <input type="text" className="form-control border-primary p-3" name="designation" onChange={handleChange} />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-bold">Experience</label>
                                    <input type="text" className="form-control border-primary p-3" name="experience" onChange={handleChange} />
                                </div>
                            </>
                        )}

                        {/* ✅ Package Dropdown (Fetched from API) */}
                        <div className="col-md-6">
                            <label className="form-label fw-bold">Package
                                <span className="text-danger fw-bold">*</span>
                            </label>
                            <select className="form-control border-primary p-3" name="package_name" required onChange={handleChange}>
                                <option value="">Select...</option>
                                {packages.map(pkg => (
                                    <option key={pkg.packageName} value={pkg.packageName}>{pkg.packageName}</option>
                                ))}
                            </select>
                        </div>

                        {/* ✅ KnowMe & Opinion */}
                        <div className="col-md-6">
                            <label className="form-label fw-bold">How do you know us?
                                <span className="text-danger fw-bold">*</span>
                            </label>
                            <select className="form-control border-primary p-3" name="knowMe" required onChange={handleChange}>
                                <option value="">Select...</option>
                                <option value="Facebook">Facebook</option>
                                <option value="Friends or Known">Friends or Known</option>
                            </select>
                        </div>

                        <div className="col-md-12">
                            <label className="form-label fw-bold">Share something about you (Optional)</label>
                            <input type="text" className="form-control border-primary p-3" name="opinion" onChange={handleChange} />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary w-100 mt-4 p-3 fw-bold shadow-lg" disabled={loading}>
                        {loading ? "Submitting..." : "Register Now"}
                    </button>
                </form>
                {/* ✅ Show Error & Success Messages */}
                {error && <div className="alert alert-danger text-center">{error}</div>}
                {success && <div className="alert alert-success text-center">{success}</div>}
            </div>
        </div>
    );
}
