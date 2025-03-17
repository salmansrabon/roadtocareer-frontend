import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function PaymentDetails() {
    const [student, setStudent] = useState(null);
    const [payments, setPayments] = useState([]);
    const [totalPaid, setTotalPaid] = useState(0);
    const [remainingBalance, setRemainingBalance] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const router = useRouter();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");

        if (!storedUser) {
            router.push("/login"); // ✅ Redirect to login if no user found
            return;
        }

        try {
            const parsedUser = JSON.parse(storedUser);
            const studentId = parsedUser.username; // ✅ Get studentId from localStorage
            fetchStudentDetails(studentId);
            fetchPaymentDetails(studentId);
        } catch (error) {
            console.error("Error parsing user:", error);
            localStorage.removeItem("user");
            router.push("/login");
        }
    }, []);

    // ✅ Fetch Student Details
    const fetchStudentDetails = async (studentId) => {
        try {
            const token = localStorage.getItem("token"); // ✅ Retrieve Token from Local Storage

            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/students/${studentId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // ✅ Attach Token in Header
                    },
                }
            );

            if (response.data) {
                setStudent(response.data); // ✅ Store student data
            } else {
                setError("Student not found.");
            }
        } catch (err) {
            console.error("Error fetching student details:", err);
            setError("Failed to load student details.");
        }
    };

    // ✅ Fetch Payment Details
    const fetchPaymentDetails = async (studentId) => {
        try {
            const token = localStorage.getItem("token"); // ✅ Retrieve Token from Local Storage
    
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/payments/details`,
                { username: studentId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // ✅ Attach Token in Header
                    },
                    validateStatus: (status) => status < 500 // ✅ Prevents axios from throwing error for 4xx responses
                }
            );
    
            // ✅ Check if success is false but not an error
            if (!response.data.success) {
                setError(response.data.message || "No payments found.");
                setPayments([]); // ✅ Clear any previous payment data
                setTotalPaid(0);
                setRemainingBalance(0);
                return;
            }
    
            // ✅ If payments exist, store data
            setPayments(response.data.installments.sort((a, b) => b.installmentNumber - a.installmentNumber));
            setTotalPaid(parseFloat(response.data.totalPaid));
            setRemainingBalance(parseFloat(response.data.remainingBalance));
            setError(""); // ✅ Clear any previous errors
    
        } catch (err) {
            if (err.response) {
                if (err.response.status === 400) {
                    setError(err.response.data.message || "Invalid request. Please check student ID.");
                } else if (err.response.status === 401) {
                    setError("Unauthorized access. Redirecting to login...");
                    setTimeout(() => router.push("/login"), 2000); // ✅ Redirect to Login
                } else {
                    setError("Something went wrong. Please try again.");
                }
            } else {
                setError("Network error. Please check your connection.");
            }
        } finally {
            setLoading(false);
        }
    };
    
    

    return (
        <div className="container mt-5">
            <h2 className="text-primary fw-bold text-center">Payment Details</h2>
            {loading ? (
                <p className="text-center">Loading...</p>
            ) : error ? (
                <p className="text-danger text-center">{error}</p>
            ) : (
                <>
                    {/* ✅ Student Info Section */}
                    {student && (
                        <div className="card shadow-lg p-4 mb-4">
                            <h4 className="text-center fw-bold">{student.student_name} ({student.StudentId})</h4>
                            <hr />
                            <div className="row">
                                <div className="col-md-6">
                                    <p><strong>Course:</strong> {student?.Course?.course_title} ({student?.Course?.courseId})</p>
                                    <p><strong>Batch:</strong> {student?.batch_no}</p>
                                    <p><strong>Package:</strong> {student?.Package?.packageName}</p>
                                    <p><strong>Installments:</strong> {student?.Package?.installment}</p>
                                </div>
                                <div className="col-md-6">
                                    <p><strong>Email:</strong> {student?.email}</p>
                                    <p><strong>Mobile:</strong> {student?.mobile}</p>

                                </div>
                            </div>
                        </div>
                    )}

                    {/* ✅ Payment Summary */}
                    <div className="card shadow-lg p-4 mb-4">
                        <h4 className="fw-bold">Payment Summary</h4>
                        <p><strong>Total Paid:</strong> <span className="text-success fw-bold">{totalPaid} TK</span></p>
                        <p><strong>Remaining Due:</strong> <span className="text-danger fw-bold">{remainingBalance} TK</span></p>
                    </div>

                    {/* ✅ Payment Receipts */}
                    {payments.length > 0 ? (
                        payments.map((payment, index) => (
                            <div key={index} className="card shadow-lg p-4 mb-3">
                                <h5 className="fw-bold text-center">Installment {payment.installmentNumber}</h5>
                                <hr />
                                <div className="row">
                                    <div className="col-md-6">
                                        <p><strong>Course ID:</strong> {student?.Course?.courseId}</p>
                                        <p><strong>Installment Amount:</strong> {payment.installmentAmount} TK</p>
                                        <p><strong>Paid Amount:</strong> <span className="text-success">{payment.paidAmount} TK</span></p>
                                    </div>
                                    <div className="col-md-6">
                                        <p><strong>Month:</strong> {payment.month}</p>
                                        <p>
                                            <strong>Payment Date:</strong> {new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(payment.paymentDateTime))}
                                        </p>

                                        <p><strong>Remaining Due:</strong> <span className="text-danger fw-bold">{payment.remainingBalance} TK</span></p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-muted">No payments found.</p>
                    )}
                </>
            )}
        </div>
    );
}
