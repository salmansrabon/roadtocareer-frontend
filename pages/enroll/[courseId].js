import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function EnrollStudent() {
    const router = useRouter();
    const { courseId } = router.query; // ✅ Get courseId from URL

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
            const response = await axios.post(process.env.NEXT_PUBLIC_API_URL+"/students/signup", {
                ...formData,
                courseId // ✅ Attach courseId from URL
            });

            setSuccess("Registration successful! Check your email for the confirmation.");
            //setTimeout(() => router.push("/login"), 3000);
        } catch (err) {
            console.error("Error registering student:", err);
            setError("Failed to register. Please try again.");
        } finally {
            setLoading(false);
        }
    };

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

                {/* ✅ Show Error & Success Messages */}
                {error && <div className="alert alert-danger">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}

                {/* ✅ Form */}
                <form onSubmit={handleSubmit}>
                    <div className="row g-4">
                        {/* ✅ Salutation */}
                        <div className="col-md-6">
                            <label className="form-label fw-bold">Salutation</label>
                            <select className="form-control border-primary p-3" name="salutation" onChange={handleChange}>
                                <option value="Mr">Mr</option>
                                <option value="Mrs">Mrs</option>
                            </select>
                        </div>

                        {/* ✅ Full Name */}
                        <div className="col-md-6">
                            <label className="form-label fw-bold">Full Name</label>
                            <input type="text" className="form-control border-primary p-3" name="student_name" required onChange={handleChange} />
                        </div>

                        {/* ✅ Email */}
                        <div className="col-md-6">
                            <label className="form-label fw-bold">Email</label>
                            <input type="email" className="form-control border-primary p-3" name="email" required onChange={handleChange} />
                        </div>

                        {/* ✅ Mobile */}
                        <div className="col-md-6">
                            <label className="form-label fw-bold">Mobile</label>
                            <input type="text" className="form-control border-primary p-3" name="mobile" required onChange={handleChange} />
                        </div>

                        {/* ✅ Location */}
                        <div className="col-md-6">
                            <label className="form-label fw-bold">Location</label>
                            <input type="text" className="form-control border-primary p-3" name="address" onChange={handleChange} />
                        </div>

                        {/* ✅ University */}
                        <div className="col-md-6">
                            <label className="form-label fw-bold">University</label>
                            <input type="text" className="form-control border-primary p-3" name="university" onChange={handleChange} />
                        </div>

                        {/* ✅ Passing Year */}
                        <div className="col-md-6">
                            <label className="form-label fw-bold">Passing Year/Semester</label>
                            <input type="text" className="form-control border-primary p-3" name="passingYear" onChange={handleChange} />
                        </div>

                        {/* ✅ Profession */}
                        <div className="col-md-6">
                            <label className="form-label fw-bold">Profession</label>
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
                            <label className="form-label fw-bold">Package</label>
                            <select className="form-control border-primary p-3" name="package_name" required onChange={handleChange}>
                                <option value="">Select...</option>
                                {packages.map(pkg => (
                                    <option key={pkg.packageName} value={pkg.packageName}>{pkg.packageName}</option>
                                ))}
                            </select>
                        </div>

                        {/* ✅ KnowMe & Opinion */}
                        <div className="col-md-6">
                            <label className="form-label fw-bold">How do you know us?</label>
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
            </div>
        </div>
    );
}
