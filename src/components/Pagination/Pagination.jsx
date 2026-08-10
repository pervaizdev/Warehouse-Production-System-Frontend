import React, { useState } from 'react';
import './Pagination.css';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  totalItems, 
  limit, 
  onPageChange, 
  onLimitChange 
}) => {
  const [goToPage, setGoToPage] = useState('');

  if (totalItems === 0) return null;

  // Calculate start and end entry numbers
  const startEntry = (currentPage - 1) * limit + 1;
  const endEntry = Math.min(currentPage * limit, totalItems);

  // Generate page numbers to show (up to 5)
  const getPageNumbers = () => {
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);

    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4);
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  const handleGoToPage = (e) => {
    if (e.key === 'Enter') {
      let pageNum = parseInt(goToPage, 10);
      if (!isNaN(pageNum)) {
        if (pageNum < 1) pageNum = 1;
        if (pageNum > totalPages) pageNum = totalPages;
        onPageChange(pageNum);
        setGoToPage('');
      }
    }
  };

  return (
    <div className="pagination-container">
      {/* Left side */}
      <div className="pagination-left">
        <span className="pagination-text">
          Showing {startEntry} to {endEntry} of {totalItems.toLocaleString()} entries
        </span>
        <div className="pagination-limit">
          <span className="pagination-text">Show:</span>
          <select 
            value={limit} 
            onChange={(e) => {
              onLimitChange(Number(e.target.value));
              onPageChange(1); // Reset to page 1 on limit change
            }}
            className="pagination-select"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      {/* Center - Controls */}
      <div className="pagination-center">
        <button 
          className="pagination-btn" 
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
        >
          &lt;&lt;
        </button>
        <button 
          className="pagination-btn" 
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          &lt;
        </button>
        
        {getPageNumbers().map(page => (
          <button
            key={page}
            className={`pagination-number ${currentPage === page ? 'active' : ''}`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}

        <button 
          className="pagination-btn" 
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          &gt;
        </button>
        <button 
          className="pagination-btn" 
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
        >
          &gt;&gt;
        </button>
      </div>

      {/* Right side */}
      <div className="pagination-right">
        <span className="pagination-text">
          Page {currentPage} of {totalPages}
        </span>
        <div className="pagination-goto">
          <span className="pagination-text">Go to page:</span>
          <input 
            type="number" 
            className="pagination-input" 
            value={goToPage}
            onChange={(e) => setGoToPage(e.target.value)}
            onKeyDown={handleGoToPage}
            min={1}
            max={totalPages}
          />
        </div>
      </div>
    </div>
  );
};

export default Pagination;
