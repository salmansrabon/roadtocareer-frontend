import { useEffect, useState, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/router";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const SIDEBAR_WIDTH = 260;

const Layout = ({ children }) => {
    const [role, setRole] = useState("");
    const router = useRouter();
    const [isMobile, setIsMobile] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const sidebarRef = useRef(null);

    // ✅ Check Authentication
    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            router.push("/login");
            return;
        }

        try {
            const decoded = jwtDecode(token);
            setRole(decoded.role);
        } catch (error) {
            console.error("Invalid token:", error);
            localStorage.removeItem("token");
            router.push("/login");
        }
    }, []);

    // ✅ Detect screen size
    useEffect(() => {
        const checkScreenSize = () => {
            const isNowMobile = window.innerWidth < 768;
            setIsMobile(isNowMobile);
            setIsSidebarOpen(!isNowMobile); // Close by default on mobile
        };

        checkScreenSize();
        window.addEventListener("resize", checkScreenSize);
        return () => window.removeEventListener("resize", checkScreenSize);
    }, []);

    // ✅ Close Sidebar on Outside Click (Only on Mobile)
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                isMobile &&
                isSidebarOpen &&
                sidebarRef.current &&
                !sidebarRef.current.contains(event.target)
            ) {
                setIsSidebarOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isSidebarOpen, isMobile]);

    return (
        <div className="d-flex">
            {/* ✅ Sidebar */}
            <div ref={sidebarRef}>
                <Sidebar
                    role={role}
                    isOpen={isSidebarOpen}
                    toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                />
            </div>

            {/* ✅ Main Content Wrapper */}
            <div
                className="d-flex flex-column"
                style={{
                    marginLeft: isSidebarOpen ? (isMobile ? "0px" : `${SIDEBAR_WIDTH}px`) : "0px",
                    width: isSidebarOpen ? (isMobile ? "100%" : `calc(100% - ${SIDEBAR_WIDTH}px)`) : "100%",
                    transition: "margin-left 0.3s ease-in-out",
                    padding: "20px",
                }}
            >
                <Navbar
                    isSidebarOpen={isSidebarOpen}
                    toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                />

                <div
                    className="content-container"
                    style={{
                        overflowY: "auto",
                        height: "calc(100vh - 70px)",
                        marginTop: "90px",
                        padding: "20px",
                    }}
                >
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Layout;
