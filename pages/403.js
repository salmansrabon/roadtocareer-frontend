import { useRouter } from "next/router";

export default function ErrorPage() {
    const router = useRouter();

    return (
        <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: "50vh", textAlign: "center" }}>
            <h1 className="text-danger fw-bold">403 - Forbidden</h1>
            <p className="text-info">Oops! The page you're looking for is unauthorized.</p>
        </div>
    );
}
