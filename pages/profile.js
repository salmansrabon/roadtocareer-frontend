import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Profile() {
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");

        if (!storedUser) {
            router.push("/login");
            return;
        }

        try {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
        } catch (error) {
            console.error("Error parsing user:", error);
            localStorage.removeItem("user");
            router.push("/login");
        }
    }, []);

    if (!user) return <div className="text-center mt-5">Loading...</div>;

    return (
        <div>
            <h2>My Profile</h2>
            <div className="card p-4 shadow">
                <p><strong>Username:</strong> {user.username}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Role:</strong> {user.role}</p>
            </div>
        </div>
    );
}
