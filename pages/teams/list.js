import { useEffect, useState } from "react";
import axios from "axios";

export default function TeamManagement() {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editingMember, setEditingMember] = useState(null);
    const [formData, setFormData] = useState({});
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        fetchTeamMembers();
    }, []);

    const fetchTeamMembers = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/teams/list`);
            setMembers(response.data.members || []);
        } catch (err) {
            setError("Failed to fetch team members");
        } finally {
            setLoading(false);
        }
    };

    const openEditModal = (member) => {
        setEditingMember(member);
        setFormData({
            name: member.name,
            company: member.company,
            designation: member.designation,
            email: member.email,
            whatsapp: member.whatsapp,
            linkedin: member.linkedin,
            about: member.about,
            photo: member.photo,
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        setSelectedImage(e.target.files[0]);
    };

    const handleUpdate = async () => {
        try {
            let uploadedImageUrl = formData.photo;
    
            if (selectedImage) {
                const imageForm = new FormData();
                imageForm.append("image", selectedImage);
    
                const imageUploadRes = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/images/upload`, imageForm);
                uploadedImageUrl = `${process.env.NEXT_PUBLIC_API_URL}${imageUploadRes.data.imageUrl}`;
            }
    
            const updatedData = { ...formData, photo: uploadedImageUrl };
            await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/teams/update/${editingMember.id}`, updatedData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
    
            fetchTeamMembers();
            setEditingMember(null);
            setSelectedImage(null);
    
        } catch (err) {
            if (err.response) {
                const status = err.response.status;
                if (status === 400) {
                    alert("Invalid data. Please review the input fields.");
                } else if (status === 401) {
                    alert("Unauthorized. Please login again.");
                    localStorage.removeItem("token");
                    router.push("/login");
                } else if (status === 403) {
                    alert("Forbidden: You do not have permission to update this member.");
                    router.push("/403");
                } else if (status === 404) {
                    alert("Member not found.");
                } else if (status === 500) {
                    alert("Server error while updating. Please try again later.");
                } else {
                    alert(err.response.data.message || "Unexpected error occurred during update.");
                }
            } else {
                alert("Network error. Please check your internet connection.");
            }
        }
    };
    

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this team member?")) return;
    
        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/teams/delete/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
    
            fetchTeamMembers();
    
        } catch (err) {
            if (err.response) {
                const status = err.response.status;
                if (status === 400) {
                    alert("Invalid delete request.");
                } else if (status === 401) {
                    alert("Unauthorized. Please login again.");
                    localStorage.removeItem("token");
                    router.push("/login");
                } else if (status === 403) {
                    alert("Forbidden: You do not have permission to delete this member.");
                    router.push("/403");
                } else if (status === 404) {
                    alert("Team member not found.");
                } else if (status === 500) {
                    alert("Server error during deletion. Try again later.");
                } else {
                    alert(err.response.data.message || "Unexpected error occurred during deletion.");
                }
            } else {
                alert("Network error. Please check your internet connection.");
            }
        }
    };
    

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="fw-bold text-primary">
                    Team Management <span className="">({members.length})</span>
                </h2>
                <a href="/teams/addMember" className="btn btn-success">
                    + Add Member
                </a>
            </div>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p className="text-danger">{error}</p>
            ) : (
                <table className="table table-bordered">
                    <thead className="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Designation</th>
                            <th>Company</th>
                            <th>Email</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {members.map((member) => (
                            <tr key={member.id}>
                                <td>{member.id}</td>
                                <td>{member.name}</td>
                                <td>{member.designation}</td>
                                <td>{member.company}</td>
                                <td>{member.email}</td>
                                <td>
                                    <button className="btn btn-warning btn-sm me-2" onClick={() => openEditModal(member)}>Edit</button>
                                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(member.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {editingMember && (
                <div className="modal d-block bg-dark bg-opacity-50">
                    <div className="modal-dialog">
                        <div className="modal-content p-4">
                            <h5 className="text-center">Edit Team Member</h5>
                            <div className="row">
                                <div className="col-md-6 mb-2">
                                    <label>Name</label>
                                    <input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} />
                                </div>
                                <div className="col-md-6 mb-2">
                                    <label>Designation</label>
                                    <input type="text" name="designation" className="form-control" value={formData.designation} onChange={handleChange} />
                                </div>
                                <div className="col-md-6 mb-2">
                                    <label>Company</label>
                                    <input type="text" name="company" className="form-control" value={formData.company} onChange={handleChange} />
                                </div>
                                <div className="col-md-6 mb-2">
                                    <label>Email</label>
                                    <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} />
                                </div>
                                <div className="col-md-6 mb-2">
                                    <label>LinkedIn</label>
                                    <input type="url" name="linkedin" className="form-control" value={formData.linkedin} onChange={handleChange} />
                                </div>
                                <div className="col-md-6 mb-2">
                                    <label>WhatsApp</label>
                                    <input type="text" name="whatsapp" className="form-control" value={formData.whatsapp} onChange={handleChange} />
                                </div>
                                <div className="col-12 mb-2">
                                    <label>About</label>
                                    <textarea name="about" className="form-control" value={formData.about} onChange={handleChange} />
                                </div>
                                <div className="col-12 mb-2">
                                    <label>Upload New Photo</label>
                                    <input type="file" accept="image/*" className="form-control" onChange={handleImageChange} />
                                    {formData.photo && (
                                        <img src={formData.photo} alt="Current" className="img-thumbnail mt-2" style={{ maxHeight: "120px" }} />
                                    )}
                                </div>
                                <div className="col-12 d-flex justify-content-between mt-3">
                                    <button className="btn btn-secondary" onClick={() => setEditingMember(null)}>Cancel</button>
                                    <button className="btn btn-primary" onClick={handleUpdate}>Update</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}