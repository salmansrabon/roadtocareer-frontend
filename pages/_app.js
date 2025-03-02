import "bootstrap/dist/css/bootstrap.min.css";
import Layout from "../components/Layout";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }) {
    const router = useRouter();
    const noLayoutPages = ["/login", /^\/enroll\/.*/]; // ✅ Exclude Enrollment Page

    return noLayoutPages.some(pattern => 
        typeof pattern === "string" ? router.pathname === pattern : pattern.test(router.pathname)
    ) ? (
        <Component {...pageProps} />
    ) : (
        <Layout>
            <Component {...pageProps} />
        </Layout>
    );
}

export default MyApp;
