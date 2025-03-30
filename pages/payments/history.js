import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Link from "next/link";
import { CSVLink } from "react-csv";

export default function PaymentList() {
    const [payments, setPayments] = useState([]);
    const [exportData, setExportData] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [totalPaidAmount, setTotalPaidAmount] = useState(0);
    const [totalPayments, setTotalPayments] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 10;
    const router = useRouter();

    const [filters, setFilters] = useState({
        studentId: "",
        courseId: "",
        month: "",
    });

    useEffect(() => {
        fetchPayments();
        fetchExportData();
        fetchCourses();
    }, [currentPage, filters]);

    const fetchPayments = async () => {
        setLoading(true);
        setError("");

        try {
            const token = localStorage.getItem("token");
            const queryParams = new URLSearchParams({ ...filters, page: currentPage, limit }).toString();

            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/payments/paid?${queryParams}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                setPayments(response.data.payments);
                setTotalPayments(response.data.totalPayments);
                setTotalPaidAmount(response.data.totalPaidAmount);
                setTotalPages(response.data.totalPages);
                setError("");
            }
        } catch (err) {
            if (err.response) {
                if (err.response.status === 401) {
                    setError("Unauthorized Access: " + err.response.data.message);
                    localStorage.removeItem("token");
                    router.push("/login");
                } else if (err.response.status === 403) {
                    setError("Forbidden: " + err.response.data.message);
                    router.push("/403");
                } else {
                    setError("Failed to fetch payments: " + err.response.data.message);
                }
            } else {
                setError("Failed to fetch payments. Please check your connection.");
            }
        }

        setLoading(false);
    };

    const fetchExportData = async () => {
        try {
            const token = localStorage.getItem("token");
            const params = { ...filters, limit: 1000, offset: 0 };
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/payments/paid`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params,
            });
            setExportData(response.data.payments || []);
        } catch (err) {
            console.error("Failed to fetch export data.");
        }
    };

    const fetchCourses = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/courses/list`);
            setCourses(response.data.courses.sort((a, b) => b.courseId.localeCompare(a.courseId)));
        } catch (err) {
            console.error("Failed to fetch courses.");
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };
    const handleDeletePayment = async (id) => {
        if (!confirm("Are you sure you want to delete this payment?")) return;
    
        try {
            const token = localStorage.getItem("token");
    
            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/payments/delete/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
    
            // Refresh data after deletion
            fetchPayments();
            fetchExportData();
        } catch (err) {
            alert("❌ Failed to delete payment.");
            console.error(err);
        }
    };
    

    const exportHeaders = [
        { label: "Student ID", key: "studentId" },
        { label: "Student Name", key: "studentName" },
        { label: "Course ID", key: "courseId" },
        { label: "Installment Amount", key: "installmentAmount" },
        { label: "Paid Amount", key: "paidAmount" },
        { label: "Remaining Balance", key: "remainingBalance" },
        { label: "Month", key: "month" },
        { label: "Payment Date", key: "paymentDateTime" },
    ];

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="fw-bold text-primary">Payment List ({totalPayments})</h2>
                <CSVLink
                    data={exportData}
                    headers={exportHeaders}
                    filename={`payments_export_${new Date().toISOString()}.csv`}
                    className="btn btn-success"
                >
                    Export to Excel
                </CSVLink>
            </div>

            <h5 className="text-center text-success mb-4">
                Total Paid Amount: <strong>{totalPaidAmount.toFixed(2)} TK</strong>
            </h5>

            <div className="row mb-3">
                <div className="col-md-4">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Student ID"
                        name="studentId"
                        value={filters.studentId}
                        onChange={handleFilterChange}
                    />
                </div>
                <div className="col-md-4">
                    <select
                        className="form-control"
                        name="courseId"
                        value={filters.courseId}
                        onChange={handleFilterChange}
                    >
                        <option value="">All Courses</option>
                        {courses
                            .slice() // make a copy to avoid mutating the original
                            .sort((a, b) => parseInt(b.batch_no) - parseInt(a.batch_no)) // ✅ sort descending numerically
                            .map((course) => (
                                <option key={course.courseId} value={course.courseId}>
                                    {course.courseId} - Batch-{course.batch_no}
                                </option>
                            ))
                        }
                    </select>
                </div>

                <div className="col-md-4">
                    <select className="form-control" name="month" value={filters.month} onChange={handleFilterChange}>
                        <option value="">All Months</option>
                        {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((month) => (
                            <option key={month} value={month}>{month}</option>
                        ))}
                    </select>
                </div>
            </div>

            <button className="btn btn-primary mb-3 w-100" onClick={fetchPayments}>Apply Filters</button>

            {loading && <div className="text-center"><strong>Loading...</strong></div>}
            {error && <div className="alert alert-danger">{error}</div>}

            <table className="table table-bordered table-striped shadow-sm">
                <thead className="table-dark">
                    <tr>
                        <th>#</th>
                        <th>Student ID</th>
                        <th>Student Name</th>
                        <th>Course ID</th>
                        <th>Installment Amount</th>
                        <th>Paid Amount</th>
                        <th>Remaining Due</th>
                        <th>Month</th>
                        <th>Payment Date</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {payments.length > 0 ? (
                        payments.map((payment, index) => (
                            <tr key={payment.id}>
                                <td>{(currentPage - 1) * limit + index + 1}</td>
                                <td>
                                    <Link href={`/students/payments/history/${payment.studentId}`} passHref>
                                        {payment.studentId}
                                    </Link>
                                </td>
                                <td>{payment.studentName}</td>
                                <td>{payment.courseId}</td>
                                <td>{payment.installmentAmount} TK</td>
                                <td>{payment.paidAmount} TK</td>
                                <td>{payment.remainingBalance} TK</td>
                                <td>{payment.month}</td>
                                <td>{new Date(payment.paymentDateTime).toLocaleString()}</td>
                                <td>
                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => handleDeletePayment(payment.id)}
                                    >
                                        Delete
                                    </button>
                                </td>


                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="9" className="text-center text-muted">No payments found</td>
                        </tr>
                    )}
                </tbody>
            </table>

            <div className="pagination d-flex justify-content-center mt-4">
                <button className="btn btn-primary me-2" disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>Previous</button>
                <span className="fw-bold mx-3">Page {currentPage} of {totalPages}</span>
                <button className="btn btn-primary" disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)}>Next</button>
            </div>
        </div>
    );
}
