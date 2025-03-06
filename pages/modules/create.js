import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function CreateModule() {
    const [courses, setCourses] = useState([]);
    const [selectedCourseId, setSelectedCourseId] = useState("");
    const [packages, setPackages] = useState([]);
    const [selectedPackageId, setSelectedPackageId] = useState("");
    const [modules, setModules] = useState([{ title: "", description: "" }]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    // ✅ Fetch Courses and Packages
    useEffect(() => {
        axios.get("http://localhost:5000/api/courses/list")
            .then(res => {
                setCourses(res.data.courses);
            })
            .catch(err => console.error("Error fetching courses:", err));
    }, []);

    // ✅ Handle Course Selection & Update Packages List
    const handleCourseChange = (e) => {
        const courseId = e.target.value;
        setSelectedCourseId(courseId);

        // Find selected course and get packages
        const selectedCourse = courses.find(course => course.courseId === courseId);
        if (selectedCourse) {
            setPackages(selectedCourse.Packages);
            setSelectedPackageId(""); // Reset package selection
        } else {
            setPackages([]);
            setSelectedPackageId("");
        }
    };

    // ✅ Handle Module Input Changes
    const handleModuleChange = (index, e) => {
        const { name, value } = e.target;
        const updatedModules = [...modules];
        updatedModules[index][name] = value;
        setModules(updatedModules);
    };

    // ✅ Add New Module Input Field
    const addModuleField = () => {
        setModules([...modules, { title: "", description: "" }]);
    };

    // ✅ Remove a Module Input Field
    const removeModuleField = (index) => {
        const updatedModules = modules.filter((_, i) => i !== index);
        setModules(updatedModules);
    };

    // ✅ Handle Form Submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.post("http://localhost:5000/api/modules/add", {
                courseId: selectedCourseId,
                packageId: selectedPackageId,
                module: JSON.stringify(modules)
            });

            alert("Module created successfully!");
            router.push("/modules");
        } catch (err) {
            console.error("Error saving module:", err);
            setError("Failed to save module.");
        }
        setLoading(false);
    };

    return (
        <div className="container mt-4">
            <div className="card shadow-lg p-4">
                <h2 className="text-primary fw-bold">Create Module</h2>

                {error && <p className="text-danger">{error}</p>}

                <form onSubmit={handleSubmit}>
                    {/* Course Dropdown */}
                    <div className="mb-3">
                        <label className="form-label">Select Course</label>
                        <select 
                            className="form-control" 
                            value={selectedCourseId} 
                            onChange={handleCourseChange} 
                            required
                        >
                            <option value="">-- Select Course --</option>
                            {courses.map(course => (
                                <option key={course.courseId} value={course.courseId}>
                                    {course.course_title} (Batch {course.batch_no})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Package Dropdown */}
                    <div className="mb-3">
                        <label className="form-label">Select Package</label>
                        <select 
                            className="form-control" 
                            value={selectedPackageId} 
                            onChange={(e) => setSelectedPackageId(e.target.value)} 
                            required
                            disabled={!packages.length} // Disable if no packages available
                        >
                            <option value="">-- Select Package --</option>
                            {packages.map(pkg => (
                                <option key={pkg.id} value={pkg.id}>
                                    {pkg.packageName} (Fee: ${pkg.studentFee})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Module Inputs */}
                    <h5 className="text-dark">Modules</h5>
                    {modules.map((mod, index) => (
                        <div key={index} className="mb-3 d-flex align-items-center">
                            <input
                                type="text"
                                className="form-control me-2"
                                name="title"
                                placeholder="Module Title"
                                value={mod.title}
                                onChange={(e) => handleModuleChange(index, e)}
                                required
                            />
                            <input
                                type="text"
                                className="form-control me-2"
                                name="description"
                                placeholder="Module Description"
                                value={mod.description}
                                onChange={(e) => handleModuleChange(index, e)}
                                required
                            />
                            <button type="button" className="btn btn-danger" onClick={() => removeModuleField(index)}>X</button>
                        </div>
                    ))}

                    {/* Add More Module Button */}
                    <button type="button" className="btn btn-info mb-3" onClick={addModuleField}>
                        + Add Module
                    </button>

                    {/* Submit Button */}
                    <button type="submit" className="btn btn-success" disabled={!selectedCourseId || !selectedPackageId}>
                        {loading ? "Saving..." : "Save Module"}
                    </button>
                </form>
            </div>
        </div>
    );
}
