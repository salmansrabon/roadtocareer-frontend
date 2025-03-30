import CoursesSection from "../components/frontend/CoursesSection";
import OurSpecialities from "../components/frontend/OurSpecialities";
import HeroSection from "../components/frontend/HeroSection";
import AboutUsSection from "../components/frontend/AboutUsSection";
import TeamSection from "../components/frontend/TeamSection";
import Head from "next/head";
export default function Home() {
    return (
        <div>
            <Head>
                <title>Road to SDET - Empowering Software Testers</title>
                <link rel="icon" type="image/png" href="/logo.png" />
                <link rel="canonical" href={process.env.NEXT_PUBLIC_FRONTEND_URL} />
                <meta
                    name="description"
                    content="Road to SDET offers industry-ready SQA training, full stack testing courses, expert mentorship, and hands-on projects."
                />
                <meta
                    name="keywords"
                    content="SQA Training, SQA Training in BD, SQA Training in Bangladesh, Best SQA course in Bangladesh, Full Stack SDET, Software Testing, QA Courses, Playwright, Selenium, Postman, Rest Assured, Manual Testing, Automation, CI/CD"
                />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                {/* ✅ Open Graph Meta Tags */}
                <meta property="og:title" content="Road to SDET - Empowering Software Testers" />
                <meta property="og:description" content="Join the best SQA and full stack SDET courses in Bangladesh. Learn automation, manual testing, CI/CD, and more." />
                <meta property="og:image" content={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/og-image.jpg`} />
                <meta property="og:url" content={process.env.NEXT_PUBLIC_FRONTEND_URL} />
                <meta property="og:type" content="website" />
            </Head>

            <div>
                {/* ✅ Hero Section */}
                <HeroSection />
                {/* ✅ Courses Section */}
                <CoursesSection />
                {/* ✅ About us Section */}
                <AboutUsSection />
                {/* ✅ Our Specialities Section */}
                <OurSpecialities />
                {/* ✅ Team Section */}
                <TeamSection />
            </div>
            <script type="application/ld+json" dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "Organization",
                    "name": "Road to SDET",
                    "url": "https://roadtocareer.net",
                    "logo": "https://roadtocareer.net/logo.png",
                    "sameAs": [
                        "https://www.facebook.com/roadtosdet/",
                        "https://www.linkedin.com/company/road-to-sdet"
                    ]
                })
            }} />

        </div>

    );
}
