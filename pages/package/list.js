import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

const PackageList = () => {
    const [packages, setPackages] = useState([]);
    const [editingPkg, setEditingPkg] = useState(null);
    const [formData, setFormData] = useState({
        studentFee: "",
        jobholderFee: "",
        installment: ""
    });

    const fetchPackages = async () => {
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/packages/list`);
            setPackages(res.data.packages);
        } catch (err) {
            console.error("Failed to fetch packages:", err);
        }
    };

    useEffect(() => {
        fetchPackages();
    }, []);

    const handleEditClick = (pkg) => {
        setEditingPkg(pkg);
        setFormData({
            studentFee: pkg.studentFee,
            jobholderFee: pkg.jobholderFee,
            installment: pkg.installment
        });
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure to delete this package?")) return;
        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/packages/delete/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            fetchPackages();
        } catch (err) {
            alert("Failed to delete package.");
        }
    };

    const handleUpdate = async () => {
        try {
            await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/packages/update/${editingPkg.id}`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            setEditingPkg(null);
            fetchPackages();
        } catch (err) {
            alert("Failed to update package.");
        }
    };

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="mb-0">📦 Package List</h3>
                <Link href="/package/create">
                    <button className="btn btn-success">+ Create New Package</button>
                </Link>
            </div>


            <table className="table table-bordered table-striped">
                <thead className="table-primary">
                    <tr>
                        <th>ID</th>
                        <th>Course ID</th>
                        <th>Batch No</th>
                        <th>Package</th>
                        <th>Student Fee</th>
                        <th>Jobholder Fee</th>
                        <th>Installment</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {[...packages]
                        .sort((a, b) => Number(b.Course?.batch_no) - Number(a.Course?.batch_no))
                        .map((pkg) => (
                            <tr key={pkg.id}>
                                <td>{pkg.id}</td>
                                <td>{pkg.courseId}</td>
                                <td>{pkg.Course?.batch_no}</td>
                                <td>{pkg.packageName}</td>
                                <td>{pkg.studentFee} TK</td>
                                <td>{pkg.jobholderFee} TK</td>
                                <td>{pkg.installment}</td>
                                <td>
                                    {pkg.Course?.is_enabled ? (
                                        <span className="badge bg-success">Enabled</span>
                                    ) : (
                                        <span className="badge bg-secondary">Disabled</span>
                                    )}
                                </td>
                                <td>
                                    <button
                                        className="btn btn-sm btn-primary me-2"
                                        onClick={() => handleEditClick(pkg)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => handleDelete(pkg.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                </tbody>

            </table>

            {editingPkg && (
                <div className="custom-modal">
                    <div className="custom-modal-content p-4">
                        <h5>Edit Package (ID: {editingPkg.id})</h5>
                        <div className="mb-2">
                            <label>Student Fee</label>
                            <input
                                type="number"
                                className="form-control"
                                value={formData.studentFee}
                                onChange={(e) => setFormData({ ...formData, studentFee: e.target.value })}
                            />
                        </div>
                        <div className="mb-2">
                            <label>Jobholder Fee</label>
                            <input
                                type="number"
                                className="form-control"
                                value={formData.jobholderFee}
                                onChange={(e) => setFormData({ ...formData, jobholderFee: e.target.value })}
                            />
                        </div>
                        <div className="mb-2">
                            <label>Installment</label>
                            <input
                                type="number"
                                className="form-control"
                                value={formData.installment}
                                onChange={(e) => setFormData({ ...formData, installment: e.target.value })}
                            />
                        </div>
                        <div className="d-flex justify-content-end">
                            <button className="btn btn-secondary me-2" onClick={() => setEditingPkg(null)}>Cancel</button>
                            <button className="btn btn-success" onClick={handleUpdate}>Save</button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                .custom-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.6);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                }
                .custom-modal-content {
                    background: #fff;
                    border-radius: 8px;
                    width: 400px;
                }
            `}</style>
        </div>
    );
};

export default PackageList;
