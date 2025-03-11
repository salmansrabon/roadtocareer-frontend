import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { FaUserCircle } from "react-icons/fa"; // ✅ Import Profile Icon

const Navbar = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const router = useRouter();
    const dropdownRef = useRef(null);

    // ✅ Handle logout
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/login");
    };

    // ✅ Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false); // ✅ Close dropdown if clicked outside
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <nav className="navbar navbar-dark bg-dark px-4 d-flex justify-content-between align-items-center"
            style={{ 
                position: "fixed", 
                top: 0, 
                left: "250px", 
                right: 0, 
                height: "70px",  
                zIndex: 1000,
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)"
            }}
        >
            {/* ✅ Clickable Admin Dashboard */}
            <h2 
                className="text-white" 
                style={{ cursor: "pointer" }} 
                onClick={() => router.push("/dashboard")}
            >
                Admin Dashboard
            </h2>

            {/* ✅ Profile Dropdown */}
            <div className="position-relative" ref={dropdownRef}>
                <div 
                    className="d-flex align-items-center text-warning fw-bold" // ✅ Text & Icon Yellow
                    onClick={() => setShowDropdown((prev) => !prev)} // ✅ Fix toggle
                    style={{ cursor: "pointer", fontSize: "16px", userSelect: "none" }}
                >
                    <FaUserCircle size={20} className="me-1" /> {/* ✅ Profile Icon */}
                    Profile ▼
                </div>

                {/* ✅ Show dropdown only when clicked */}
                {showDropdown && (
                    <div 
                        className="position-absolute bg-white shadow-lg rounded p-2" 
                        style={{ right: 0, top: "40px", minWidth: "160px", zIndex: 2000 }} // ✅ Ensure z-index is high
                    >
                        <ul className="list-unstyled mb-0">
                            <li 
                                className="p-2 text-dark" 
                                onClick={() => { setShowDropdown(false); router.push("/profile"); }} 
                                style={{ cursor: "pointer" }}
                            >
                                My Profile
                            </li>
                            <li 
                                className="p-2 text-dark" 
                                onClick={() => { setShowDropdown(false); router.push("/change-password"); }} 
                                style={{ cursor: "pointer" }}
                            >
                                Change Password
                            </li>
                            <li 
                                className="p-2 text-danger" 
                                onClick={handleLogout} 
                                style={{ cursor: "pointer" }}
                            >
                                Logout
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
