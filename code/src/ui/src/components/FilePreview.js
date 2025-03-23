import React, { useState, useEffect } from "react";
import { Card, Table } from "react-bootstrap";
import * as XLSX from "xlsx";
import Papa from "papaparse";

const FilePreview = ({ file }) => {
  const [tableData, setTableData] = useState([]);
  const [tableHeaders, setTableHeaders] = useState([]);

  useEffect(() => {
    if (file) {
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
          setTableHeaders(Object.keys(result.data[0]));
          setTableData(result.data.slice(0, 5)); // Show only first 5 rows
        }
      };
      reader.readAsText(file);
    } else if (file.name.endsWith(".xlsx")) {
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
          header: 1,
        });
        if (sheet.length > 1) {
          setTableHeaders(sheet[0]);
          setTableData(sheet.slice(1, 6)); // Show only first 5 rows
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <>
      {tableData.length > 0 && (
        <Card className="p-4 shadow-lg mt-4" style={{ width: "600px" }}>
          <h5 className="text-center mb-3">File Preview</h5>
          <Table striped bordered hover>
            <thead>
              <tr>
                {tableHeaders.map((header, index) => (
                  <th key={index}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {tableHeaders.map((header, colIndex) => (
                    <td key={colIndex}>{row[header]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>
      )}
    </>
  );
};

export default FilePreview;
