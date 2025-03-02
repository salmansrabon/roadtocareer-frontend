import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/router";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
    const [role, setRole] = useState("");
    const router = useRouter();
    const [isMobile, setIsMobile] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); // ✅ Sidebar is open by default on desktop

    // ✅ Check Authentication
    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            router.push("/login"); // Redirect if not logged in
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

    // ✅ Detect Screen Size & Adjust Sidebar Visibility
    useEffect(() => {
        const checkScreenSize = () => {
            const isNowMobile = window.innerWidth < 768;
            setIsMobile(isNowMobile);
            setIsSidebarOpen(!isNowMobile); // ✅ Open by default on desktop, closed on mobile
        };

        checkScreenSize(); // Initial check
        window.addEventListener("resize", checkScreenSize);
        return () => window.removeEventListener("resize", checkScreenSize);
    }, []);

    return (
        <div className="d-flex">
            {/* ✅ Sidebar - Always Open on Desktop, Toggleable on Mobile */}
            <Sidebar
                role={role}
                isOpen={isSidebarOpen}
                toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            />

            {/* ✅ Main Content Wrapper */}
            <div
                className="d-flex flex-column"
                style={{
                    marginLeft: isSidebarOpen ? (isMobile ? "0px" : "260px") : "0px",
                    width: isSidebarOpen ? (isMobile ? "100%" : "calc(100% - 260px)") : "100%",
                    transition: "margin-left 0.3s ease-in-out",
                    padding: "20px",
                }}
            >
                {/* ✅ Navbar */}
                <Navbar
                    isSidebarOpen={isSidebarOpen}
                    toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                />

                {/* ✅ Content Area */}
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
