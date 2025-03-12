import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function ModuleList() {
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const router = useRouter();

    // ✅ Fetch Module List
    useEffect(() => {
        fetchModules();
    }, []);

    const fetchModules = async () => {
        try {
            const response = await axios.get(process.env.NEXT_PUBLIC_API_URL + "/modules/list");
            setModules(response.data.modules);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching modules:", err);
            setError("Failed to fetch module list.");
            setLoading(false);
        }
    };

    // ✅ Handle Delete Module
    const handleDelete = async (courseId) => {
        if (!confirm("Are you sure you want to delete this module?")) return;

        try {
            const token = localStorage.getItem("token"); // Retrieve authentication token
            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/modules/delete/${courseId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            alert("Module deleted successfully!");
            fetchModules(); // Refresh the module list
        } catch (err) {
            console.error("Error deleting module:", err);
            alert("Failed to delete module.");
        }
    };

    return (
        <div className="container mt-4">
            <div className="card shadow-lg p-4">
                <h2 className="text-primary fw-bold">Module List</h2>

                <button
                    className="btn btn-success mb-3"
                    onClick={() => router.push("/modules/create")}
                >
                    + Create Module
                </button>

                {loading ? (
                    <p>Loading modules...</p>
                ) : error ? (
                    <p className="text-danger">{error}</p>
                ) : (
                    <table className="table table-bordered table-hover">
                        <thead className="table-dark">
                            <tr>
                                <th>Module ID</th>
                                <th>Course ID</th>
                                <th>Package ID</th>
                                <th>Modules</th>
                                <th>Actions</th> {/* Added Actions Column */}
                            </tr>
                        </thead>
                        <tbody>
                            {modules.length > 0 ? (
                                modules.map((module) => (
                                    <tr key={module.id}>
                                        <td>{module.id}</td>
                                        <td>{module.courseId}</td>
                                        <td>{module.packageId}</td>
                                        <td>
                                            <ul>
                                                {(() => {
                                                    try {
                                                        const parsedModules = typeof module.module === "string" 
                                                            ? JSON.parse(module.module) 
                                                            : module.module;

                                                        if (!Array.isArray(parsedModules)) {
                                                            return <li className="text-danger">Invalid module format</li>;
                                                        }

                                                        return parsedModules.map((m, index) => (
                                                            <li key={index}>
                                                                <strong>{m.title}</strong>: {m.description}
                                                            </li>
                                                        ));
                                                    } catch (error) {
                                                        console.error("Error parsing module JSON:", error);
                                                        return <li className="text-danger">Error parsing module data</li>;
                                                    }
                                                })()}
                                            </ul>
                                        </td>

                                        <td>
                                            <button
                                                className="btn btn-warning btn-sm me-2"
                                                onClick={() => router.push(`/modules/edit/${module.courseId}`)}
                                            >
                                                Edit
                                            </button>

                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleDelete(module.courseId)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center text-muted">
                                        No modules found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
