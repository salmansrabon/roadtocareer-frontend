import { useEffect, useState } from "react";
import { useRouter } from "next/router";  // ✅ Import router for navigation
import axios from "axios";

export default function CoursesSection() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const router = useRouter(); // ✅ Router Instance

    useEffect(() => {
        axios.get(process.env.NEXT_PUBLIC_API_URL+"/courses/list")
            .then((res) => {
                const enabledCourses = res.data.courses.filter(course => course.is_enabled);
                setCourses(enabledCourses);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching courses:", err);
                setError("Failed to fetch courses.");
                setLoading(false);
            });
    }, []);

    return (
        <section id="courses" className="courses-section py-5">
            <div className="container">
                <h2 className="text-center text-dark fw-bold mb-5">📚 Our Courses</h2>

                {loading ? (
                    <p className="text-center">Loading courses...</p>
                ) : error ? (
                    <p className="text-danger text-center">{error}</p>
                ) : (
                    <div className="row">
                        {courses.map(course => (
                            <div key={course.courseId} className="col-md-4 mb-4">
                                <div className="card course-card">
                                    <img src={course.course_image} className="card-img-top" alt={course.course_title} />
                                    <div className="card-body">
                                        <h5 className="card-title text-dark fw-bold">
                                            {course.course_title} ({course.Packages[0]?.packageName || "N/A"})
                                        </h5>
                                        <p className="card-text text-muted">
                                            <strong>Batch:</strong> {course.batch_no} <br />
                                            <strong>Course Fee:</strong> <span className="text-success">{course.Packages[0]?.jobholderFee || "N/A"} TK</span> <br />
                                            <strong>After discount, only</strong> <span className="text-primary">{course.Packages[0]?.studentFee || "N/A"} TK</span><strong> for the fresh graduates, students, and unemployed</strong>
                                        </p>
                                        <button 
                                            className="btn btn-outline-primary w-100 mt-2"
                                            onClick={() => router.push(`/courses/${course.courseId}`)} // ✅ Navigate to Course Details Page
                                        >
                                            See Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
