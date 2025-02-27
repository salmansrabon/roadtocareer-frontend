import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/router";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
    const [role, setRole] = useState("");
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            router.push("/login"); // Redirect if not logged in
            return;
        }

        try {
            const decoded = jwtDecode(token);
            setRole(decoded.role); // ✅ Pass role to Sidebar
        } catch (error) {
            console.error("Invalid token:", error);
            localStorage.removeItem("token");
            router.push("/login");
        }
    }, []);

    return (
        <div className="d-flex">
            {/* Sidebar - Fixed */}
            <Sidebar role={role} />

            {/* Main Content Wrapper */}
            <div className="d-flex flex-column" style={{ marginLeft: "250px", width: "calc(100% - 250px)" }}>
                {/* ✅ Fixed Navbar */}
                <Navbar />

                {/* ✅ Properly Spaced Content */}
                <div className="content-container p-4" style={{
                    overflowY: "auto",
                    height: "calc(100vh - 70px)", // ✅ Ensures full height minus navbar
                    marginTop: "90px", // ✅ Pushes content down
                }}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Layout;
