import './Table.css';

const Table = ({
  data = [],
  columns = [],
  totalEntries = 0,
  onActionClick,
  showActions = true,
  showPagination = true,
  currentPage = 1,
  pageSize = 10,
  onPageChange,
  onItemsPerPageChange,
  actionLabels = { info: 'Info', list: 'List', check: 'Check', delete: 'Delete' },
}) => {
  const totalPages = Math.ceil(totalEntries / pageSize) || 1;

  const handleAction = (action, row) => {
    if (onActionClick) {
      onActionClick(action, row);
    }
  };

  return (
    <div className="dome-table-container">
      <div className="dome-table-wrapper">
        <table className="dome-table">
          <thead>
            <tr>
              {columns.map((col, index) => (
                <th key={index}>{col.header}</th>
              ))}
              {showActions && <th className="dome-table-actions-header">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((rowItem, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map((col, colIndex) => (
                    <td key={colIndex}>
                      {col.render ? col.render(rowItem) : rowItem[col.key]}
                    </td>
                  ))}
                  {showActions && (
                    <td className="dome-table-actions">
                      <button 
                        className="dome-table-action-btn dome-table-action-btn--info"
                        onClick={() => handleAction('info', rowItem)}
                        title="Info"
                      >
                        {actionLabels.info}
                      </button>
                      <button 
                        className="dome-table-action-btn dome-table-action-btn--list"
                        onClick={() => handleAction('list', rowItem)}
                        title="List"
                      >
                        {actionLabels.list}
                      </button>
                      <button 
                        className="dome-table-action-btn dome-table-action-btn--check"
                        onClick={() => handleAction('check', rowItem)}
                        title="Check"
                      >
                        {actionLabels.check}
                      </button>
                      <button 
                        className="dome-table-action-btn dome-table-action-btn--delete"
                        onClick={() => handleAction('delete', rowItem)}
                        title="Delete"
                      >
                        {actionLabels.delete}
                      </button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + (showActions ? 1 : 0)} className="dome-table-empty">
                  No data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showPagination && (
        <div className="dome-table-pagination">
          <div className="pagination-info">
            Showing {(currentPage - 1) * pageSize + (data.length > 0 ? 1 : 0)} to {Math.min(currentPage * pageSize, totalEntries)} of {totalEntries} entries
          </div>
          <div className="pagination-controls">
            <select 
              value={pageSize} 
              onChange={(e) => onItemsPerPageChange && onItemsPerPageChange(Number(e.target.value))}
              className="pagination-select"
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
              <option value={50}>50 per page</option>
            </select>
            <div className="pagination-buttons">
              <button 
                disabled={currentPage <= 1} 
                onClick={() => onPageChange && onPageChange(currentPage - 1)}
              >
                Prev
              </button>
              <span className="pagination-current">{currentPage} / {totalPages}</span>
              <button 
                disabled={currentPage >= totalPages} 
                onClick={() => onPageChange && onPageChange(currentPage + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
