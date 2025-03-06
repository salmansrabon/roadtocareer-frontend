import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FaBars } from "react-icons/fa";

const Sidebar = ({ role, isOpen, toggleSidebar }) => {
    const router = useRouter();

    const menuItems = role === "admin" 
        ? [
            { name: "Courses", path: "/courses" },
            { name: "Create Package", path: "/create-package" },
            { name: "Create Modules", path: "/modules" },
            { name: "Student List", path: "/student-list" },
            { name: "Attendance", path: "/attendance" },
            { name: "Certificate", path: "/certificate" }
        ]
        : role === "student"
        ? [
            { name: "Student List", path: "/student-list" },
            { name: "Attendance", path: "/attendance" },
            { name: "Certificate", path: "/certificate" }
        ]
        : [];

    return (
        <>
            {/* ✅ Drawer Button - Only visible in mobile view */}
            <button 
                className="btn btn-warning d-md-none position-fixed top-0 start-0 m-3"
                onClick={toggleSidebar}
                style={{ zIndex: 1050 }}
            >
                <FaBars />
            </button>

            {/* ✅ Sidebar - Always Open on Desktop, Toggleable on Mobile */}
            <div
                className={`d-flex flex-column p-3 bg-dark text-white shadow-lg position-fixed vh-100`}
                style={{
                    width: isOpen ? "260px" : "0",
                    overflow: "hidden",
                    transition: "width 0.3s ease-in-out",
                    zIndex: 1000,
                }}
            >
                <h4 className="text-center text-warning mb-3">Road to SDET</h4>
                <ul className="nav nav-pills flex-column mb-auto">
                    {menuItems.map((item, idx) => (
                        <li key={idx} className="nav-item">
                            <Link href={item.path} passHref>
                                <span 
                                    className={`nav-link d-flex align-items-center text-white px-3 py-2 ${router.pathname === item.path ? "bg-warning text-dark fw-bold" : ""}`}
                                >
                                    {item.name}
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
};

export default Sidebar;
