import React, { useState, useEffect, useRef } from "react";
import { Card, Table } from "react-bootstrap";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import FileDownload from "./FileDownload";

const FilePreview = ({ file }) => {
  const [tableData, setTableData] = useState([]);
  const [tableHeaders, setTableHeaders] = useState([]);
  const [visibleRows, setVisibleRows] = useState(50);
  const tableRef = useRef(null);

  useEffect(() => {
    if (file) {
      previewFile(file);
    }
  }, [file]);

  useEffect(() => {
    const handleScroll = () => {
      if (tableRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = tableRef.current;
        if (scrollTop + clientHeight >= scrollHeight - 20) {
          setVisibleRows((prev) => Math.min(prev + 50, tableData.length));
        }
      }
    };

    if (tableRef.current) {
      tableRef.current.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (tableRef.current) {
        tableRef.current.removeEventListener("scroll", handleScroll);
      }
    };
  }, [tableData]);

  const previewFile = (file) => {
    const reader = new FileReader();

    if (file.name.endsWith(".csv")) {
      reader.onload = (e) => {
        const text = e.target.result;
        const result = Papa.parse(text, { header: true });

        if (result.data.length > 0) {
          const filteredData = result.data.filter((row) =>
            Object.values(row).some((val) => val !== "" && val !== null)
          );
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
        const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
          header: 1,
        });

        if (sheet.length > 1) {
          const filteredData = sheet
            .slice(1)
            .filter((row) =>
              row.some((val) => val !== undefined && val !== "")
            );
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
        <Card
          className="p-4 shadow-lg mt-4 bg-light position-relative"
          style={{ width: "100%" }}
        >
          <FileDownload tableData={tableData} tableHeaders={tableHeaders} />
          <h5 className="mb-3 text-primary">File Preview</h5>
          <div
            ref={tableRef}
            className="table-responsive"
            style={{
              maxHeight: "500px",
              overflowY: "auto",
              border: "1px solid #ddd",
            }}
          >
            <Table striped bordered hover size="sm" className="table-light">
              <thead
                className="bg-primary text-white"
                style={{ position: "sticky", top: 0, zIndex: 2 }}
              >
                <tr>
                  {tableHeaders.map((header, index) => (
                    <th key={index}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData.slice(0, visibleRows).map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className={rowIndex % 2 === 0 ? "bg-white" : "bg-light"}
                  >
                    {tableHeaders.map((header, colIndex) => (
                      <td key={colIndex}>
                        {row[header] !== undefined ? row[header] : "-"}
                      </td>
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
