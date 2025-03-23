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
    if (file) previewFile(file);
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

    tableRef.current?.addEventListener("scroll", handleScroll);
    return () => tableRef.current?.removeEventListener("scroll", handleScroll);
  }, [tableData]);

  const previewFile = (file) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      if (file.name.endsWith(".csv")) {
        const text = e.target.result;
        const result = Papa.parse(text, { header: true });
        const filteredData = result.data.filter((row) =>
          Object.values(row).some((val) => val !== "" && val !== null)
        );
        setTableHeaders(Object.keys(filteredData[0] || {}));
        setTableData(filteredData);
      } else if (file.name.endsWith(".xlsx")) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = XLSX.utils.sheet_to_json(
          workbook.Sheets[workbook.SheetNames[0]],
          { header: 1 }
        );
        const filteredData = sheet.slice(1).filter((row) =>
          row.some((val) => val !== undefined && val !== "")
        );
        setTableHeaders(sheet[0]);
        setTableData(filteredData);
      }
    };

    file.name.endsWith(".csv") ? reader.readAsText(file) : reader.readAsArrayBuffer(file);
  };

  return (
    <>
      {tableData.length > 0 ? (
        <Card className="p-4 shadow-lg bg-light position-relative" style={styles.card}>
          <div className="d-flex justify-content-start mb-3">
            <FileDownload tableData={tableData} tableHeaders={tableHeaders} />
          </div>
          <h5 className="mb-3 text-primary text-center">File Preview</h5>
          <div ref={tableRef} className="table-responsive flex-grow-1" style={styles.tableContainer}>
            <Table striped bordered hover size="sm" className="table-light" style={styles.table}>
              <thead className="bg-primary text-white" style={styles.thead}>
                <tr>
                  {tableHeaders.map((header, index) => (
                    <th key={index}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData.slice(0, visibleRows).map((row, rowIndex) => (
                  <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-white" : "bg-light"}>
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

const styles = {
  card: {
    width: "100%",
    maxWidth: "calc(100vw - 350px)",
    height: "100vh",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },
  tableContainer: {
    height: "calc(100vh - 150px)",
    maxWidth: "calc(100vw - 350px)",
    overflowY: "auto",
    overflowX: "auto",
    border: "1px solid #ddd",
    whiteSpace: "nowrap",
  },
  table: {
    minWidth: "800px",
    tableLayout: "auto",
  },
  thead: {
    position: "sticky",
    top: 0,
    zIndex: 2,
  },
};

export default FilePreview;
