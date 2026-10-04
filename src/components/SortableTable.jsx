import { FiArrowUp, FiArrowDown } from 'react-icons/fi';

const SortableTable = ({ columns, data, sortBy, sortOrder, onSort, renderRow, emptyMessage = 'No records found' }) => {
  const getSortIcon = (field) => {
    if (sortBy !== field) return <span style={{ opacity: 0.4, fontSize: '0.75rem' }}>↕</span>;
    return sortOrder === 'ASC' ? <FiArrowUp /> : <FiArrowDown />;
  };

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.field}
                className={col.sortable ? 'sortable' : ''}
                onClick={() => col.sortable && onSort(col.field)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  {col.label}
                  {col.sortable && getSortIcon(col.field)}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length}>
                <div className="empty-state">
                  <div className="empty-state-icon">📭</div>
                  <p>{emptyMessage}</p>
                </div>
              </td>
            </tr>
          ) : (
            data.map((row, index) => renderRow(row, index))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SortableTable;
