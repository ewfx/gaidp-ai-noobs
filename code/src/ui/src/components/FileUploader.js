import React, { useState } from "react";
import { Container, Card, Button, Form, Alert } from "react-bootstrap";
import { FaFileUpload } from "react-icons/fa";
import FilePreview from "./FilePreview";

const FileUploader = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("primary");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && [".csv", ".xlsx"].some((ext) => file.name.endsWith(ext))) {
      setSelectedFile(file);
      setMessage("");
    } else {
      showMessage("Please upload a valid XLSX or CSV file.", "danger");
      setSelectedFile(null);
    }
  };

  const handleOptionChange = (event) => setSelectedOption(event.target.value);

  const handleSubmit = () => {
    if (!selectedFile || !selectedOption) {
      showMessage("Please select a file and an option before submitting.", "warning");
    } else {
      showMessage(`File ${selectedFile.name} uploaded successfully with option ${selectedOption}!`, "success");
    }
  };

  const showMessage = (text, type) => {
    setMessage(text);
    setMessageType(type);
  };

  return (
    <Container fluid className="d-flex" style={styles.container}>
      <div className="p-4 bg-light" style={styles.sidebar}>
        <Card className="p-3 shadow-sm h-100 d-flex flex-column justify-content-between">
          <div>
            <h5 className="mb-3 text-primary text-center">Upload an XLSX or CSV</h5>
            {message && <Alert variant={messageType}>{message}</Alert>}
            <Form>
              <Form.Group controlId="formFile" className="mb-3">
                <Form.Label className="fw-bold">Choose a file</Form.Label>
                <Form.Control type="file" onChange={handleFileChange} accept=".csv, .xlsx" />
              </Form.Group>
              <Form.Group controlId="formOptions" className="mb-3">
                <Form.Label className="fw-bold">Select Data Schedule</Form.Label>
                <Form.Select value={selectedOption} onChange={handleOptionChange}>
                  <option value="">-- Select an Option --</option>
                  <option value="H.1">H.1 (Corporate Loan Data Schedule)</option>
                  <option value="H.2">H.2 (CRE Loan Data Schedule)</option>
                </Form.Select>
              </Form.Group>
            </Form>
          </div>
          <Button variant="primary" onClick={handleSubmit} className="w-100">
            <FaFileUpload className="me-2" /> Submit
          </Button>
        </Card>
      </div>
      <div className="flex-grow-1 p-4" style={styles.previewArea}>
        {selectedFile && <FilePreview file={selectedFile} />}
      </div>
    </Container>
  );
};

const styles = {
  container: {
    height: "100vh",
    overflow: "hidden",
  },
  sidebar: {
    width: "300px",
    height: "100vh",
    overflow: "hidden",
  },
  previewArea: {
    height: "100vh",
    overflow: "hidden",
  },
};

export default FileUploader;
