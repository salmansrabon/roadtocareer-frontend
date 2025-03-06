import CoursesSection from "../components/frontend/CoursesSection";
import OurSpecialities from "../components/frontend/OurSpecialities";
import HeroSection from "../components/frontend/HeroSection";
import AboutUsSection from "../components/frontend/AboutUsSection";

export default function Home() {
    return (
        <div>
            {/* ✅ Hero Section */}
            <HeroSection/>
            {/* ✅ Courses Section */}
            <CoursesSection />
            {/* ✅ About us Section */}
            <AboutUsSection/>
            {/* ✅ Our Specialities Section */}
            <OurSpecialities />
        </div>
    );
}
