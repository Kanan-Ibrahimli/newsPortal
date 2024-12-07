import React, { useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import SkeletonLoader from "./SkeletonLoader"; // Import the SkeletonLoader component

const Table = ({ columns, data, loading, error }) => {
  const [expandedRows, setExpandedRows] = useState([]);

  const handleRowClick = (rowIndex) => {
    const isRowCurrentlyExpanded = expandedRows.includes(rowIndex);
    const newExpandedRows = isRowCurrentlyExpanded
      ? expandedRows.filter((index) => index !== rowIndex)
      : [...expandedRows, rowIndex];

    setExpandedRows(newExpandedRows);
  };

  return (
    <div className="overflow-x-scroll w-full pb-32">
      <table className="min-w-full border-collapse table">
        <thead className="table-header-group">
          <tr className="border bg-white table-row">
            {columns.map((col, index) => (
              <th
                key={index}
                className="p-2  font-semibold text-left table-cell"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        {loading ? (
          <SkeletonLoader rows={5} columns={columns} />
        ) : error ? (
          <tbody>
            <tr>
              <td
                colSpan={columns.length + 1}
                className="text-red-800 bg-yellow-300 p-1 px-2 text-center"
              >
                {error}
              </td>
            </tr>
          </tbody>
        ) : data.length > 0 ? (
          <tbody className="bg-white table-row-group">
            {data.map((row, rowIndex) => (
              <React.Fragment key={rowIndex}>
                <tr className="border table-row">
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} className="p-2 relative table-cell">
                      {row[col]}
                    </td>
                  ))}
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        ) : (
          <tbody>
            <tr>
              <td
                colSpan={columns.length + 1}
                className="text-red-800 bg-yellow-300 p-1 px-2 text-center"
              >
                No data found
              </td>
            </tr>
          </tbody>
        )}
      </table>
    </div>
  );
};

export default Table;
