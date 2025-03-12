import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function EditModule() {
    const router = useRouter();
    const { moduleId } = router.query; // ✅ Get moduleId from URL
    const [moduleData, setModuleData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!moduleId) return;
        fetchModuleDetails();
    }, [moduleId]);

    // ✅ Fetch Module Details
    const fetchModuleDetails = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/modules/${moduleId}`);
            if (response.data.success) {
                setModuleData({
                    ...response.data.modules[0], 
                    module: JSON.parse(response.data.modules[0].module) // ✅ Parse JSON modules
                });
            } else {
                setError("Module not found.");
            }
        } catch (err) {
            console.error("Error fetching module:", err);
            setError("Failed to fetch module details.");
        } finally {
            setLoading(false);
        }
    };

    // ✅ Handle Input Change for Titles and Descriptions
    const handleModuleChange = (index, field, value) => {
        setModuleData((prev) => ({
            ...prev,
            module: prev.module.map((m, i) => (i === index ? { ...m, [field]: value } : m)),
        }));
    };

    // ✅ Handle Save
    const handleSave = async () => {
        setSaving(true);
        try {
            const token = localStorage.getItem("token");
            await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/modules/update/${moduleId}`, 
                { module: JSON.stringify(moduleData.module) }, // ✅ Convert module array back to JSON
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert("Module updated successfully!");
            router.push("/modules"); // ✅ Redirect after update
        } catch (err) {
            console.error("Error updating module:", err);
            alert("Failed to update module.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="fw-bold text-primary text-center">Edit Module</h2>

            {loading ? (
                <p className="text-center">Loading module details...</p>
            ) : error ? (
                <p className="text-danger text-center">{error}</p>
            ) : (
                <div className="card shadow-lg p-4">
                    <h4 className="text-dark text-center">Course ID: {moduleData.courseId}</h4>
                    <h5 className="text-dark text-center mb-3">Package ID: {moduleData.packageId}</h5>

                    {/* ✅ Editable Module List */}
                    {moduleData.module.map((m, index) => (
                        <div key={index} className="mb-3 border p-3 rounded">
                            <label className="form-label">Module Title</label>
                            <input
                                type="text"
                                className="form-control"
                                value={m.title}
                                onChange={(e) => handleModuleChange(index, "title", e.target.value)}
                            />

                            <label className="form-label mt-2">Module Description</label>
                            <textarea
                                className="form-control"
                                value={m.description}
                                onChange={(e) => handleModuleChange(index, "description", e.target.value)}
                            />
                        </div>
                    ))}

                    {/* ✅ Save Button */}
                    <div className="d-flex justify-content-between">
                        <button className="btn btn-secondary" onClick={() => router.push("/modules")}>Cancel</button>
                        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                            {saving ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
