import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Link from "next/link";

export default function CourseDetails() {
    const router = useRouter();
    const { courseId } = router.query;

    const [course, setCourse] = useState(null);
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [expandedIndex, setExpandedIndex] = useState(null); // ✅ Expand & Collapse Feature

    useEffect(() => {
        if (!courseId) return;

        // ✅ Fetch Course Details
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/courses/list`)
            .then((res) => {
                const foundCourse = res.data.courses.find(course => course.courseId === courseId);
                if (foundCourse) {
                    setCourse(foundCourse);
                } else {
                    setError("Course not found.");
                }
                setLoading(false);
            })
            .catch(() => {
                setError("Failed to fetch course details.");
                setLoading(false);
            });

        // ✅ Fetch Modules for the Course
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/modules/${courseId}`)
            .then((res) => {
                if (res.data.modules.length > 0) {
                    const parsedModules = res.data.modules.flatMap(mod => JSON.parse(mod.module));
                    setModules(parsedModules);
                } else {
                    setModules([]);
                }
            })
            .catch(() => {
                setModules([]);
            });
    }, [courseId]);

    // ✅ Expand/Collapse Module Description
    const handleToggle = (index) => {
        setExpandedIndex((prevIndex) => (prevIndex === index ? null : index));
    };

    return (
        <section className="container course-details-page">
            {loading ? (
                <p className="text-center">Loading course details...</p>
            ) : error ? (
                <p className="text-danger text-center">{error}</p>
            ) : (
                <div className="row justify-content-center">
                    {/* ✅ Course Details */}
                    <div className="col-md-6">
                        <div className="card shadow-lg border-0 rounded-4 overflow-hidden hover-scale">
                            <img
                                src={course.course_image}
                                className="card-img-top object-fit-cover"
                                alt={course.course_title}
                                style={{ height: "300px", objectFit: "cover" }}
                            />
                            <div className="card-body text-center">
                                <h3 className="card-title text-dark fw-bold">{course.course_title}</h3>
                                <p className="card-text text-muted">
                                    <strong>Batch:</strong> <span className="text-primary">{course.batch_no}</span> <br />
                                    <strong>Package:</strong> <span className="text-warning">{course.Packages[0]?.packageName || "N/A"}</span> <br />
                                    <strong>Course Fee:</strong> <span className="text-danger fw-bold">{course.Packages[0]?.jobholderFee || "N/A"} TK</span> <br />
                                    {course.Packages[0]?.studentFee > 0 && (
                                        <p className="card-text text-muted">
                                            <strong>After Discount:</strong> <span className="text-success fw-bold">{course.Packages[0].studentFee} TK</span>
                                        </p>
                                    )}

                                </p>
                                <Link href={`/enroll/${course.courseId}`} passHref>
                                    <button className="btn btn-lg btn-success w-100 fw-bold shadow-sm mt-2">
                                        Enroll Now 🚀
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* ✅ Modules List with Expand/Collapse */}
                    <div className="col-md-6">
                        <div className="card shadow-lg border-0 rounded-4 p-4">
                            <h3 className="fw-bold text-dark text-center mb-3">📌 Course Modules</h3>
                            {modules.length > 0 ? (
                                <ul className="list-group list-group-flush">
                                    {modules.map((mod, index) => (
                                        <li
                                            key={index}
                                            className="list-group-item border-0 text-muted p-2"
                                            style={{ fontSize: "16px", cursor: "pointer", transition: "0.3s" }}
                                            onClick={() => handleToggle(index)} // ✅ Expand/collapse on click
                                        >
                                            <strong className="d-flex justify-content-between">
                                                {mod.title}
                                                <span>{expandedIndex === index ? "🔽" : "▶️"}</span>
                                            </strong>

                                            {/* ✅ Description shows when expanded */}
                                            {expandedIndex === index && (
                                                <p className="mt-2 text-dark description">
                                                    {mod.description}
                                                </p>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-center text-muted">No modules found for this course.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ✅ CSS for Styling */}
            <style jsx>{`
                .course-details-page {
                    margin-top: 100px; /* Ensures space below navbar */
                }

                .card {
                    transition: transform 0.3s ease-in-out;
                }

                .hover-scale:hover {
                    transform: scale(1.02); /* ✅ Slight hover effect */
                }

                .object-fit-cover {
                    object-fit: cover;
                }

                .list-group-item {
                    background: #fff;
                    border-bottom: 1px solid #ddd;
                }

                .list-group-item:hover {
                    background: #f9f9f9;
                }

                .description {
                    padding: 10px;
                    background: #eef5ff;
                    border-radius: 5px;
                }

                @media (max-width: 768px) {
                    .course-details-page {
                        margin-top: 120px; /* More space on mobile */
                    }
                }
            `}</style>
        </section>
    );
}
