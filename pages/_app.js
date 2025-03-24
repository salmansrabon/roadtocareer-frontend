import "bootstrap/dist/css/bootstrap.min.css";
import Layout from "../components/Layout";
import FrontPageLayout from "../components/frontend/FrontPageLayout";
import { useRouter } from "next/router";
import "../styles/globals.css";
import Head from "next/head";

function MyApp({ Component, pageProps }) {
    const router = useRouter();

    // ✅ Pages that should use the FrontPage Layout (Public Pages)
    const frontPageRoutes = ["/", "/login", /^\/enroll\/.*/, /^\/courses\/.*/, "/reviews", "/reset-password", /^\/reset-password\/.*/, "/error"];

    if (frontPageRoutes.some(pattern =>
        typeof pattern === "string" ? router.pathname === pattern : pattern.test(router.pathname)
    )) {
        return (
            <FrontPageLayout>
                <Component {...pageProps} />
            </FrontPageLayout>
        );
    }

    return (
        <>
        <Head>
            <link rel="icon" href="/logo.png" type="image/png" />
            <title>Road to SDET</title>
        </Head>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </>
    );
}

export default MyApp;
