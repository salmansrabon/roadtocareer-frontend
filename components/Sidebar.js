import Link from "next/link";
import { useRouter } from "next/router";
import { FaBook, FaBox, FaListAlt, FaUsers, FaCheckCircle, FaAward } from "react-icons/fa";

const Sidebar = ({ role }) => {
    const router = useRouter();

    const menuItems = role === "admin" 
        ? [
            { name: "Courses", path: "/courses", icon: <FaBook /> },
            { name: "Create Package", path: "/create-package", icon: <FaBox /> },
            { name: "Create Modules", path: "/create-modules", icon: <FaListAlt /> },
            { name: "Student List", path: "/student-list", icon: <FaUsers /> },
            { name: "Attendance", path: "/attendance", icon: <FaCheckCircle /> },
            { name: "Certificate", path: "/certificate", icon: <FaAward /> }
        ]
        : role === "student"
        ? [
            { name: "Student List", path: "/student-list", icon: <FaUsers /> },
            { name: "Attendance", path: "/attendance", icon: <FaCheckCircle /> },
            { name: "Certificate", path: "/certificate", icon: <FaAward /> }
        ]
        : [];

    return (
        <div className="d-flex flex-column p-3 bg-dark text-white vh-100 shadow-lg" style={{ width: "250px", position: "fixed" }}>
            <h4 className="text-center text-warning mb-3">Road to SDET</h4>
            <ul className="nav nav-pills flex-column mb-auto">
                {menuItems.map((item, idx) => (
                    <li key={idx} className="nav-item">
                        <Link href={item.path} className={`nav-link d-flex align-items-center text-white px-3 py-2 ${router.pathname === item.path ? "bg-warning text-dark fw-bold" : ""}`}>
                            <span className="me-2">{item.icon}</span> {item.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;
