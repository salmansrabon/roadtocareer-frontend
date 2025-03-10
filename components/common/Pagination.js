import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const maxPageButtons = 5; // Show only 5 page numbers before truncating
    const pageNumbers = [];

    // Generate Pagination Range
    if (totalPages <= maxPageButtons) {
        for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
    } else {
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, currentPage + 2);

        if (startPage > 1) pageNumbers.push(1, "...");

        for (let i = startPage; i <= endPage; i++) pageNumbers.push(i);

        if (endPage < totalPages) pageNumbers.push("...", totalPages);
    }

    return (
        <nav>
            <ul className="pagination justify-content-center">
                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                    <button className="page-link" onClick={() => onPageChange(currentPage - 1)}>
                        Previous
                    </button>
                </li>

                {pageNumbers.map((page, index) => (
                    <li key={index} className={`page-item ${page === currentPage ? "active" : ""}`}>
                        {page === "..." ? (
                            <span className="page-link">...</span>
                        ) : (
                            <button className="page-link" onClick={() => onPageChange(page)}>
                                {page}
                            </button>
                        )}
                    </li>
                ))}

                <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                    <button className="page-link" onClick={() => onPageChange(currentPage + 1)}>
                        Next
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default Pagination;
