import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function Courses() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get(process.env.NEXT_PUBLIC_API_URL+"/courses/list");
                setCourses(response.data.courses);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching courses:", error);
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    return (
        <div className="container mt-4">
            {/* Page Header */}
            <div className="d-flex justify-content-between align-items-center">
                <h2 className="fw-bold">
                    Course List <span className="badge bg-primary ms-2">{courses.length}</span>
                </h2>
                <Link href="/create-course">
                    <button className="btn btn-success">+ Create Course</button>
                </Link>
            </div>

            {/* Course Table */}
            <div className="mt-4">
                <div className="table-responsive">
                    <table className="table table-hover table-bordered shadow-sm">
                        <thead className="table-dark">
                            <tr>
                                <th className="text-center">Course ID</th>
                                <th className="text-center">Batch No</th>
                                <th className="text-center">Course Title</th>
                                <th className="text-center">Enabled</th>
                                <th className="text-center">Package</th>
                                <th className="text-center">Student Fee</th>
                                <th className="text-center">Jobholder Fee</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="text-center">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : courses.length > 0 ? (
                                courses.map((course) => (
                                    <tr key={course.courseId}>
                                        <td className="text-center fw-bold">{course.courseId}</td>
                                        <td className="text-center">{course.batch_no}</td>
                                        <td className="text-center">{course.course_title}</td>
                                        <td className="text-center">
                                            <span className={`badge ${course.is_enabled ? "bg-success" : "bg-danger"}`}>
                                                {course.is_enabled ? "Active" : "Inactive"}
                                            </span>
                                        </td>
                                        <td className="text-center">{course.Packages.length > 0 ? course.Packages[0].packageName : "N/A"}</td>
                                        <td className="text-center">{course.Packages.length > 0 ? `$${course.Packages[0].studentFee}` : "N/A"}</td>
                                        <td className="text-center">{course.Packages.length > 0 ? `$${course.Packages[0].jobholderFee}` : "N/A"}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center text-muted">No courses found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
