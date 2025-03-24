const fs = require("fs");
const path = require("path");
const { SitemapStream, streamToPromise } = require("sitemap");
const axios = require("axios");
require("dotenv").config();

const BASE_URL = `${process.env.NEXT_PUBLIC_FRONTEND_URL}`;

async function generateSitemap() {
    const sitemap = new SitemapStream({ hostname: BASE_URL });

    // ✅ Static Routes
    const staticRoutes = [
        "/",
        "/login",
        "/reviews",
    ];

    staticRoutes.forEach((url) => sitemap.write({ url }));

    // ✅ Dynamic Course Routes
    try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/courses/list`);
        const courses = res.data.courses;

        courses.forEach((course) => {
            sitemap.write({ url: `/courses/${course.courseId}` });
            sitemap.write({ url: `/enroll/${course.courseId}` });
        });
    } catch (err) {
        console.error("Error fetching courses for sitemap:", err.message);
    }

    sitemap.end();
    const sitemapOutput = await streamToPromise(sitemap).then((data) => data.toString());

    fs.writeFileSync(path.resolve(__dirname, "../public/sitemap.xml"), sitemapOutput, "utf8");
    console.log("✅ Public-only sitemap generated at /public/sitemap.xml");
}

generateSitemap();
