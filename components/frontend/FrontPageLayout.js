import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const FrontPageLayout = ({ children }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const router = useRouter();
    // Function to Smoothly Scroll to Sections
    const scrollToSection = (sectionId) => {
        if (router.pathname !== "/") {
            // If not on the homepage, navigate first, then scroll
            router.push(`/#${sectionId}`);
        } else {
            // If already on home, just scroll smoothly
            const section = document.getElementById(sectionId);
            if (section) {
                window.scrollTo({
                    top: section.offsetTop - 70, // Adjust for navbar height
                    behavior: "smooth",
                });
                window.history.pushState(null, null, `#${sectionId}`);
            }
            setMenuOpen(false); //Close menu after clicking (mobile view)
        }
    };


    return (
        <div>
            {/* Responsive Navbar */}
            <nav className="navbar fixed-top navbar-dark bg-dark px-4 d-flex justify-content-between">
                <h1 className="text-warning" style={{ cursor: "pointer" }}>
                    <a href={process.env.NEXT_PUBLIC_FRONTEND_URL} className="text-warning text-decoration-none">
                        Road to SDET
                    </a>
                </h1>

                {/* Mobile Menu Toggle Button */}
                <button className="menu-toggle d-md-none" onClick={() => setMenuOpen(!menuOpen)}>
                    ☰ Menu
                </button>

                {/* Menu Items (Shown in a row on desktop, dropdown on mobile) */}
                <div className={`menu-items ${menuOpen ? "show" : ""}`}>
                    <span className="nav-link text-white" onClick={() => scrollToSection("courses")}>
                        Courses
                    </span>
                    <span className="nav-link text-white" onClick={() => scrollToSection("about-us")}>
                        About Us
                    </span>
                    <span className="nav-link text-white" onClick={() => scrollToSection("specialities")}>
                        Our Specialities
                    </span>
                    <span className="nav-link text-white" onClick={() => scrollToSection("team")}>
                        Our Team
                    </span>
                    <Link href="/reviews" className="nav-link text-white">
                        Reviews
                    </Link>
                    <Link href="/login" className="nav-link text-white">
                        Login
                    </Link>
                </div>
            </nav>

            {/* Main Content */}
            <div className="content-container">{children}</div>

            {/* Footer */}
            <footer className="bg-dark text-white text-center p-4">
                <h5>Contact Us</h5>
                <p>📞 +88 01782 808 778 | ✉ roadtosdet@gmail.com</p>
            </footer>

            {/* ✅ Styles */}
            <style jsx>{`
                .navbar {
                    height: 70px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }
                .menu-toggle {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 20px;
                    cursor: pointer;
                }
                .menu-items {
                    display: flex;
                    gap: 20px;
                }
                .menu-items .nav-link {
                    cursor: pointer;
                }
                @media (max-width: 768px) {
                    .menu-items {
                        display: ${menuOpen ? "block" : "none"};
                        position: absolute;
                        top: 70px;
                        left: 0;
                        width: 100%;
                        background: rgba(0, 0, 0, 0.9);
                        text-align: center;
                        padding: 10px 0;
                    }
                    .menu-items .nav-link {
                        display: block;
                        padding: 10px;
                    }
                }
            `}</style>
        </div>
    );
};

export default FrontPageLayout;
