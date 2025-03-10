import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function PaymentHistory() {
    const router = useRouter();
    const { studentId } = router.query;

    const [paymentHistory, setPaymentHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [courseFee, setCourseFee] = useState(0);
    const [remainingBalance, setRemainingBalance] = useState(0); // ✅ Track Remaining Balance

    // ✅ Store student details from payment history API
    const [studentData, setStudentData] = useState({
        courseId: "",
        packageId: "",
        studentId: studentId || "",
        studentName: "",
        totalInstallment: 0,
        installmentNumber: "",
        installmentAmount: "",
        paidAmount: "",
        month: ""
    });

    // ✅ Fetch Payment History & Student Data
    useEffect(() => {
        if (!studentId) return;
    
        const token = localStorage.getItem("token");
        setLoading(true);
        setError("");
    
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/payments/history/${studentId}`, {
            headers: {
                Authorization: `Bearer ${token}`, // ✅ Attach Token in Header
            }
        })
        .then((res) => {
            const { studentId, student_name, courseId, packageId, courseFee, payments } = res.data;
    
            setPaymentHistory(payments);
            setCourseFee(courseFee);
    
            // ✅ Calculate remaining balance (latest payment entry)
            if (payments.length > 0) {
                setRemainingBalance(payments[payments.length - 1].remainingBalance);
            } else {
                setRemainingBalance(courseFee);
            }
    
            // ✅ Update studentData from the API response
            setStudentData((prev) => ({
                ...prev,
                studentId,
                studentName: student_name,
                courseId,
                packageId
            }));
        })
        .catch((err) => {
            console.error("Error fetching payment history:", err);
    
            if (err.response) {
                // ✅ Handle Unauthorized (401) or Forbidden (403) Responses
                if (err.response.status === 401) {
                    setError("Unauthorized Access: " + err.response.data.message);
                } else if (err.response.status === 403) {
                    setError("Forbidden: " + err.response.data.message);
                } else {
                    setError("Failed to fetch payment history: " + err.response.data.message);
                }
            } else {
                // ✅ Handle Network Errors or Unexpected Issues
                setError("Failed to fetch payment history. Please check your connection.");
            }
        })
        .finally(() => {
            setLoading(false);
        });
    
    }, [studentId]);
    

    // ✅ Handle Input Change
    const handleChange = (e) => {
        setStudentData({ ...studentData, [e.target.name]: e.target.value });
    };

    // ✅ Handle Add Payment
    const handleAddPayment = async () => {
        if (!studentData.installmentNumber || !studentData.paidAmount || !studentData.month) {
            alert("Please fill all required fields.");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            await axios.post(process.env.NEXT_PUBLIC_API_URL + "/payments/add", studentData, {
                headers: {
                    Authorization: `Bearer ${token}`, // ✅ Attach Token in Header
                }
            });
            alert("Payment added successfully!");

            // ✅ Refresh Payment History after adding payment
            axios.get(`${process.env.NEXT_PUBLIC_API_URL}/payments/history/${studentId}`,{
                headers: {
                    Authorization: `Bearer ${token}`, // ✅ Attach Token in Header
                }
            })
                .then((res) => {
                    setPaymentHistory(res.data.payments);
                    setCourseFee(res.data.courseFee);

                    // ✅ Update remaining balance (latest payment entry)
                    if (res.data.payments.length > 0) {
                        setRemainingBalance(res.data.payments[res.data.payments.length - 1].remainingBalance);
                    } else {
                        setRemainingBalance(res.data.courseFee);
                    }
                })
                .catch((err) => console.error("Error refreshing payment history:", err));

            // ✅ Reset Fields after adding payment
            setStudentData((prev) => ({
                ...prev,
                installmentNumber: "",
                installmentAmount: "",
                paidAmount: "",
                month: ""
            }));
        } catch (err) {
            console.error("Error adding payment:", err);
            alert("Failed to add payment.");
        }
    };

    return (
        <div className="container mt-4">
            <div className="card shadow-lg p-4">
                <h2 className="text-primary fw-bold">Payment History</h2>

                {loading ? <p>Loading payments...</p> : error ? <p className="text-danger">{error}</p> : (
                    <>
                        <h4 className="fw-bold text-dark">Total Course Fee: {courseFee} TK</h4>
                        <h5 className="fw-bold text-danger">Remaining Due: {remainingBalance} TK</h5> {/* ✅ Display Remaining Balance */}

                        {/* ✅ Add New Payment Form */}
                        <div className="card p-3 mb-4">
                            <h5 className="fw-bold">Add Payment</h5>
                            <div className="row">
                                <div className="col-md-6">
                                    <label>Student ID</label>
                                    <input type="text" className="form-control" value={studentData.studentId} readOnly />
                                </div>
                                <div className="col-md-6">
                                    <label>Student Name</label>
                                    <input type="text" className="form-control" value={studentData.studentName} readOnly />
                                </div>
                                <div className="col-md-6">
                                    <label>Course ID</label>
                                    <input type="text" className="form-control" value={studentData.courseId} readOnly />
                                </div>
                                <div className="col-md-6">
                                    <label>Package ID</label>
                                    <input type="text" className="form-control" value={studentData.packageId} readOnly />
                                </div>
                                <div className="col-md-6">
                                    <label>Installment Number</label>
                                    <input type="number" className="form-control" name="installmentNumber" value={studentData.installmentNumber} onChange={handleChange} />
                                </div>
                                <div className="col-md-6">
                                    <label>Installment Amount</label>
                                    <input type="number" className="form-control" name="installmentAmount" value={studentData.installmentAmount} onChange={handleChange} />
                                </div>
                                <div className="col-md-6">
                                    <label>Paid Amount</label>
                                    <input type="number" className="form-control" name="paidAmount" value={studentData.paidAmount} onChange={handleChange} />
                                </div>
                                <div className="col-md-6">
                                    <label>Month</label>
                                    <select className="form-control" name="month" value={studentData.month} onChange={handleChange}>
                                        <option value="">Select Month</option>
                                        {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((m, i) => (
                                            <option key={i} value={m}>{m}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-md-6 mt-3">
                                    <button className="btn btn-success w-100" onClick={handleAddPayment}>Add Payment</button>
                                </div>
                            </div>
                        </div>

                        {/* ✅ Payment History Table */}
                        <table className="table table-bordered table-hover">
                            <thead className="table-dark">
                                <tr>
                                    <th>Installment No.</th>
                                    <th>Paid Amount</th>
                                    <th>Remaining Due</th>
                                    <th>Month</th>
                                    <th>Payment Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paymentHistory.length > 0 ? (
                                    paymentHistory.map((payment, index) => (
                                        <tr key={index}>
                                            <td>{payment.installmentNumber}</td>
                                            <td>{payment.paidAmount} TK</td>
                                            <td>{payment.remainingBalance} TK</td>
                                            <td>{payment.month}</td>
                                            <td>{new Date(payment.paymentDateTime).toLocaleString()}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center text-muted">
                                            No payments found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </>
                )}
            </div>
        </div>
    );
}
