import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { FaBars } from "react-icons/fa";

const Navbar = ({ isSidebarOpen, toggleSidebar }) => {
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
                setShowDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <nav className="navbar navbar-dark bg-dark px-4 d-flex justify-content-between"
            style={{ 
                position: "fixed", 
                top: 0, 
                left: isSidebarOpen ? "250px" : "0", 
                right: 0, 
                height: "70px",
                zIndex: 1000,
                transition: "left 0.3s ease-in-out",
            }}
        >
            {/* ✅ Drawer Toggle Button for Mobile */}
            <button className="btn btn-warning d-md-none" onClick={toggleSidebar}>
                <FaBars size={20} />
            </button>

            <h2 className="text-white" style={{ cursor: "pointer" }} onClick={() => router.push("/dashboard")}>
                Admin Dashboard
            </h2>

            <div className="text-white" onClick={() => setShowDropdown(!showDropdown)} style={{ cursor: "pointer" }}>
                Profile ▼
            </div>
        </nav>
    );
};

export default Navbar;
