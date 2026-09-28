import React, { useMemo } from "react";
import "./pagination.css";

const getVisiblePages = (current, total, maxVisible = 5) => {
    if (total <= maxVisible) {
        return Array.from({ length: total }, (_, i) => i + 1);
    }

    const half = Math.floor(maxVisible / 2);
    let start = Math.max(1, current - half);
    let end = Math.min(total, start + maxVisible - 1);
    start = Math.max(1, end - maxVisible + 1);

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
};

export default function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    totalItems = 0,
}) {
    const pages = useMemo(
        () => getVisiblePages(currentPage, totalPages),
        [currentPage, totalPages]
    );

    if (totalPages <= 1) return null;

    return (
        <div className="pagination-container">
            <span className="pagination-info">
                صفحة {currentPage} من {totalPages}
                {totalItems > 0 ? ` (${totalItems})` : ""}
            </span>
            <div className="pagination-controls">
                <button
                    type="button"
                    className="page-nav-btn"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    aria-label="الصفحة السابقة"
                >
                    &lsaquo;
                </button>

                {pages[0] > 1 && (
                    <>
                        <button
                            type="button"
                            className="page-num-btn"
                            onClick={() => onPageChange(1)}
                        >
                            1
                        </button>
                        {pages[0] > 2 && <span className="pagination-ellipsis">…</span>}
                    </>
                )}

                {pages.map((page) => (
                    <button
                        key={page}
                        type="button"
                        className={`page-num-btn ${page === currentPage ? "active" : ""}`}
                        onClick={() => onPageChange(page)}
                    >
                        {page}
                    </button>
                ))}

                {pages[pages.length - 1] < totalPages && (
                    <>
                        {pages[pages.length - 1] < totalPages - 1 && (
                            <span className="pagination-ellipsis">…</span>
                        )}
                        <button
                            type="button"
                            className="page-num-btn"
                            onClick={() => onPageChange(totalPages)}
                        >
                            {totalPages}
                        </button>
                    </>
                )}

                <button
                    type="button"
                    className="page-nav-btn"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    aria-label="الصفحة التالية"
                >
                    &rsaquo;
                </button>
            </div>
        </div>
    );
}
