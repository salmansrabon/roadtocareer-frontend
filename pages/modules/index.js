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
        axios.get("http://localhost:5000/api/modules/list")
            .then((res) => {
                setModules(res.data.modules);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching modules:", err);
                setError("Failed to fetch module list.");
                setLoading(false);
            });
    }, []);

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
                                                {JSON.parse(module.module).map((m, index) => (
                                                    <li key={index}>
                                                        <strong>{m.title}</strong>: {m.description}
                                                    </li>
                                                ))}
                                            </ul>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center text-muted">
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
