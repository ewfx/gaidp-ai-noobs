import React, { useState, useEffect } from "react";
import { Card, Table } from "react-bootstrap";
import * as XLSX from "xlsx";
import Papa from "papaparse";

const FilePreview = ({ file }) => {
  const [tableData, setTableData] = useState([]);
  const [tableHeaders, setTableHeaders] = useState([]);

  useEffect(() => {
    if (file) {
      console.log("File detected:", file.name);
      previewFile(file);
    }
  }, [file]);

  const previewFile = (file) => {
    const reader = new FileReader();

    if (file.name.endsWith(".csv")) {
      reader.onload = (e) => {
        const text = e.target.result;
        const result = Papa.parse(text, { header: true });

        if (result.data.length > 0) {
          const filteredData = result.data.filter(row => Object.values(row).some(val => val !== "" && val !== null));
          console.log("CSV Data Parsed:", filteredData);
          setTableHeaders(Object.keys(filteredData[0] || {}));
          setTableData(filteredData);
        }
      };
      reader.readAsText(file);
    } else if (file.name.endsWith(".xlsx")) {
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });

        if (sheet.length > 1) {
          const filteredData = sheet.slice(1).filter(row => row.some(val => val !== undefined && val !== ""));
          console.log("Excel Data Parsed:", filteredData);
          setTableHeaders(sheet[0]);
          setTableData(filteredData);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <>
      {tableData.length > 0 ? (
        <Card className="p-4 shadow-lg mt-4" style={{ width: "1200px" }}>
          <h5 className="mb-3">File Preview</h5>
          <div style={{ maxHeight: "250px", overflowY: "auto", overflowX: "auto", border: "1px solid #ddd" }}>
            <Table striped bordered hover size="sm">
              <thead className="table-dark" style={{ position: "sticky", top: 0, zIndex: 2 }}>
                <tr>
                  {tableHeaders.map((header, index) => (
                    <th key={index}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData.slice(0, 20).map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {tableHeaders.map((header, colIndex) => (
                      <td key={colIndex}>{row[header] !== undefined ? row[header] : "-"}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card>
      ) : (
        <p className="text-muted text-center mt-3">No file preview available</p>
      )}
    </>
  );
};

export default FilePreview;
