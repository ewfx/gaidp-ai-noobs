import React from "react";
import { Button } from "react-bootstrap";
import * as XLSX from "xlsx";
import { FaDownload } from "react-icons/fa";

const FileDownload = ({ tableData, tableHeaders }) => {
  const handleDownload = () => {
    if (tableData.length === 0) return;

    const worksheet = XLSX.utils.json_to_sheet(tableData, {
      header: tableHeaders,
    });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "preview_data.xlsx");
  };

  return (
    <Button
      variant="success"
      onClick={handleDownload}
      className="position-absolute top-0 end-0 m-3"
    >
      <FaDownload className="me-2" /> Download
    </Button>
  );
};

export default FileDownload;
