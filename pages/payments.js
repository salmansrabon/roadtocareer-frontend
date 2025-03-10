import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function PaymentList() {
    const [payments, setPayments] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [totalPaidAmount, setTotalPaidAmount] = useState(0);
    const [totalPayments, setTotalPayments] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 10; // ✅ Set limit per page

    const [filters, setFilters] = useState({
        studentId: "",
        courseId: "",
        month: "",
    });

    useEffect(() => {
        fetchPayments();
        fetchCourses();
    }, [currentPage]); // ✅ Re-fetch payments when page changes

    // ✅ Fetch Payments from API with Pagination
    const fetchPayments = async () => {
        setLoading(true);
        setError("");

        try {
            const queryParams = new URLSearchParams({ ...filters, page: currentPage, limit }).toString();
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/payments?${queryParams}`);

            setPayments(response.data.payments);
            setTotalPayments(response.data.totalPayments);
            setTotalPaidAmount(response.data.totalPaidAmount);
            setTotalPages(response.data.totalPages);
        } catch (err) {
            setError("Failed to fetch payments.");
        }

        setLoading(false);
    };

    // ✅ Fetch Courses List
    const fetchCourses = async () => {
        try {
            const response = await axios.get(process.env.NEXT_PUBLIC_API_URL + "/courses/list");
            setCourses(response.data.courses.sort((a, b) => b.courseId.localeCompare(a.courseId)));
        } catch (err) {
            console.error("Failed to fetch courses.");
        }
    };

    // ✅ Handle Filter Change
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    // ✅ Handle Page Change
    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="fw-bold text-primary text-center mb-4">
                Payment List ({totalPayments})
            </h2>

            <h5 className="text-center text-success mb-4">
                Total Paid Amount: <strong>{totalPaidAmount.toFixed(2)} TK</strong>
            </h5>

            {/* ✅ Filters Section */}
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
                    <select className="form-control" name="courseId" value={filters.courseId} onChange={handleFilterChange}>
                        <option value="">All Courses</option>
                        {courses.map((course) => (
                            <option key={course.courseId} value={course.courseId}>
                                {course.courseId} - {course.course_title}
                            </option>
                        ))}
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

            {/* ✅ Show Loading/Error */}
            {loading && <div className="text-center"><strong>Loading...</strong></div>}
            {error && <div className="alert alert-danger">{error}</div>}

            {/* ✅ Payment Table */}
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
                    </tr>
                </thead>
                <tbody>
                    {payments.length > 0 ? (
                        payments.map((payment, index) => (
                            <tr key={payment.id}>
                                <td>{index + 1}</td>
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
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="9" className="text-center text-muted">No payments found</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* ✅ Pagination Controls */}
            <div className="pagination d-flex justify-content-center mt-4">
                <button className="btn btn-primary me-2" disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>Previous</button>
                <span className="fw-bold mx-3">Page {currentPage} of {totalPages}</span>
                <button className="btn btn-primary" disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)}>Next</button>
            </div>
        </div>
    );
}
