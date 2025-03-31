import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FaBars, FaChartBar, FaChalkboardTeacher, FaBoxOpen, FaCubes, FaUsers, FaMoneyCheckAlt, FaUserSlash, FaStar, FaClipboardList, FaQuestionCircle, FaUserGraduate, FaCertificate, FaUserFriends } from "react-icons/fa";

const Sidebar = ({ role, isOpen, toggleSidebar }) => {
    const router = useRouter();

    const menuItems = role === "admin"
        ? [
            { name: "Dashboard", path: "/dashboard", icon: FaChartBar },
            { name: "Student List", path: "/student-list", icon: FaUsers },
            { name: "Payment History", path: "/payments/history", icon: FaMoneyCheckAlt },
            { name: "Unpaid Students", path: "/payments/unpaid", icon: FaUserSlash },

            { name: "Course Config", path: "/course/list", icon: FaChalkboardTeacher },
            { name: "Package Config", path: "/package/list", icon: FaBoxOpen },
            { name: "Modules Config", path: "/modules", icon: FaCubes },

            { name: "Attendance", path: "/attendanceList", icon: FaClipboardList },
            { name: "Quiz Config", path: "/quiz/QuizConfigList", icon: FaQuestionCircle },

            { name: "Our Teams", path: "/teams/list", icon: FaUserFriends },
            { name: "Student Review", path: "/reviews/add", icon: FaStar }

        ]
        : role === "student"
            ? [
                { name: "My Dashboard", path: "/mydashboard", icon: FaChartBar },
                { name: "Attendance", path: "/attendance", icon: FaClipboardList },
                { name: "Certificate", path: "/certificate", icon: FaCertificate },
                { name: "Quiz", path: "/quiz/QuizConfig", icon: FaQuestionCircle }

            ]
            : [];

    return (
        <>
            <button
                className="btn btn-warning d-md-none position-fixed top-0 start-0 m-3"
                onClick={toggleSidebar}
                style={{ zIndex: 1050 }}
            >
                <FaBars />
            </button>

            <div
                className="d-flex flex-column p-3 bg-dark text-white shadow-lg position-fixed vh-100"
                style={{
                    width: isOpen ? "260px" : "0",
                    overflow: "hidden",
                    transition: "width 0.3s ease-in-out",
                    zIndex: 1000,
                }}
            >
                <h4 className="text-center text-warning mb-3">
                    <Link href={`${process.env.NEXT_PUBLIC_FRONTEND_URL}`} target="_blank" className="text-warning text-decoration-none">
                        Road to SDET
                    </Link>
                </h4>

                <ul className="nav nav-pills flex-column mb-auto">
                    {menuItems.map((item, idx) => (
                        <li key={idx} className="nav-item">
                            <Link href={item.path} passHref>
                                <span
                                    onClick={() => {
                                        if (window.innerWidth < 768) {
                                          toggleSidebar(); // Only hide sidebar on mobile view
                                        }
                                      }}
                                      
                                    className={`nav-link d-flex align-items-center text-white px-3 py-2 ${router.pathname === item.path ? "bg-warning text-dark fw-bold" : ""}`}
                                    role="button"
                                >
                                    {item.icon && (
                                        <span className="me-2"><item.icon /></span>
                                    )}
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
