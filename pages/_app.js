import "bootstrap/dist/css/bootstrap.min.css"; // ✅ Import Bootstrap globally
import Layout from "../components/Layout";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }) {
    const router = useRouter();
    const noLayoutPages = ["/login"]; // ✅ List of pages that should NOT have Layout

    return noLayoutPages.includes(router.pathname) ? (
        <Component {...pageProps} />
    ) : (
        <Layout>
            <Component {...pageProps} />
        </Layout>
    );
}

export default MyApp;
