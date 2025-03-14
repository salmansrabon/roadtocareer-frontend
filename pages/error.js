import { useRouter } from "next/router";

export default function ErrorPage() {
    const router = useRouter();

    return (
        <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: "100vh", textAlign: "center" }}>
            <h1 className="text-danger fw-bold">404 - Not Found</h1>
            <p className="text-muted">Oops! The page you're looking for does not exist.</p>
            <button className="btn btn-primary mt-3" onClick={() => router.push("/")}>Go to Home</button>
        </div>
    );
}
