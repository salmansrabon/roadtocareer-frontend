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

    useEffect(() => {
        if (!courseId) return;

        // ✅ Fetch Course Details
        axios.get(`http://localhost:5000/api/courses/list`)
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
        axios.get(`http://localhost:5000/api/modules/${courseId}`)
            .then((res) => {
                if (res.data.modules.length > 0) {
                    // ✅ Parse module JSON for each record
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

    return (
        <section className="container course-details-page">
            {loading ? (
                <p className="text-center">Loading course details...</p>
            ) : error ? (
                <p className="text-danger text-center">{error}</p>
            ) : (
                <div className="row">
                    {/* ✅ Course Details */}
                    <div className="col-md-6">
                        <div className="card shadow-lg border-0">
                            <img src={course.course_image} className="card-img-top" alt={course.course_title} />
                            <div className="card-body">
                                <h3 className="card-title text-dark fw-bold">{course.course_title}</h3>
                                <p className="card-text text-muted">
                                    <strong>Batch:</strong> {course.batch_no} <br />
                                    <strong>Package:</strong> {course.Packages[0]?.packageName || "N/A"} <br />
                                    <strong>Course Fee:</strong> <span className="text-success">{course.Packages[0]?.jobholderFee || "N/A"} TK</span> <br />
                                    <strong>After discount:</strong> <span className="text-primary">{course.Packages[0]?.studentFee || "N/A"} TK</span><br/>
                                    <Link href={`/enroll/${course.courseId}`}>
                                        <button className="btn btn-success">Enroll Now</button>
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ✅ Modules List */}
                    <div className="col-md-6">
                        <h3 className="fw-bold text-dark mb-3">📌 Course Modules</h3>
                        {modules.length > 0 ? (
                            <ul className="list-group">
                                {modules.map((mod, index) => (
                                    <li key={index} className="list-group-item">
                                        <strong>{mod.title}</strong>: {mod.description}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-muted">No modules found for this course.</p>
                        )}
                    </div>
                </div>
            )}

            {/* ✅ CSS Fix for Top Margin */}
            <style jsx>{`
                .course-details-page {
                    margin-top: 100px; /* Ensures space below navbar */
                }

                @media (max-width: 768px) {
                    .course-details-page {
                        margin-top: 120px; /* More space on mobile for readability */
                    }
                }
            `}</style>
        </section>
    );
}
