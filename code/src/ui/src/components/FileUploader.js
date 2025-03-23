// import React, { useState } from "react";
// import { Container, Card, Button, Form, Alert } from "react-bootstrap";
// import { FaFileUpload } from "react-icons/fa";

// const FileUploader = () => {
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [selectedOption, setSelectedOption] = useState("");
//   const [message, setMessage] = useState("");
//   const [messageType, setMessageType] = useState("danger");

//   const handleFileChange = (event) => {
//     const file = event.target.files[0];
//     if (file && (file.type === "text/csv" || file.name.endsWith(".csv") || file.name.endsWith(".xlsx"))) {
//       setSelectedFile(file);
//       setMessage("");
//     } else {
//       setMessage("Please upload a valid XLSX or CSV file.");
//       setMessageType("danger");
//       setSelectedFile(null);
//     }
//   };

//   const handleOptionChange = (event) => {
//     setSelectedOption(event.target.value);
//   };

//   const handleSubmit = () => {
//     if (!selectedFile && !selectedOption) {
//       setMessage("Please select a file and an option before submitting.");
//       setMessageType("danger");
//     } else if (!selectedFile) {
//       setMessage("Please select a file before submitting.");
//       setMessageType("danger");
//     } else if (!selectedOption) {
//       setMessage("Please select an option before submitting.");
//       setMessageType("danger");
//     } else {
//       setMessage(`File ${selectedFile.name} uploaded successfully with option ${selectedOption}!`);
//       setMessageType("success");
//     }
//   };

//   return (
//     <Container className="mt-5 d-flex justify-content-center">
//       <Card className="p-4 shadow-lg text-center" style={{ width: "400px" }}>
//         <h2 className="mb-3">Upload an XLSX or CSV Document</h2>
//         {message && <Alert variant={messageType}>{message}</Alert>}
//         <Form>
//           <Form.Group controlId="formFile" className="mb-3">
//             <Form.Label className="fw-bold">Choose a file</Form.Label>
//             <Form.Control type="file" onChange={handleFileChange} accept=".csv, .xlsx" />
//           </Form.Group>
//           <Form.Group controlId="formOptions" className="mb-3">
//             <Form.Label className="fw-bold">Select Data Schedule</Form.Label>
//             <Form.Select value={selectedOption} onChange={handleOptionChange}>
//               <option value="">-- Select an Option --</option>
//               <option value="H.1">H.1 (Corporate Loan Data Schedule)</option>
//               <option value="H.2">H.2 (CRE Loan Data Schedule)</option>
//             </Form.Select>
//           </Form.Group>
//         </Form>
//         {selectedFile && <p className="text-success fw-bold">Selected File: {selectedFile.name}</p>}
//         <Button variant="primary" onClick={handleSubmit} className="w-100">
//           <FaFileUpload className="me-2" /> Submit
//         </Button>
//       </Card>
//     </Container>
//   );
// };

// export default FileUploader;

import React, { useState } from "react";
import { Container, Card, Button, Form, Alert } from "react-bootstrap";
import { FaFileUpload } from "react-icons/fa";
import FilePreview from "./FilePreview"; // Import the new component

const FileUploader = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("danger");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && (file.name.endsWith(".csv") || file.name.endsWith(".xlsx"))) {
      setSelectedFile(file);
      setMessage("");
    } else {
      setMessage("Please upload a valid XLSX or CSV file.");
      setMessageType("danger");
      setSelectedFile(null);
    }
  };

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleSubmit = () => {
    if (!selectedFile || !selectedOption) {
      setMessage("Please select a file and an option before submitting.");
      setMessageType("danger");
    } else {
      setMessage(`File ${selectedFile.name} uploaded successfully with option ${selectedOption}!`);
      setMessageType("success");
    }
  };

  return (
    <Container className="mt-5 d-flex flex-column align-items-center">
      <Card className="p-4 shadow-lg text-center" style={{ width: "400px" }}>
        <h2 className="mb-3">Upload an XLSX or CSV Document</h2>
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
        {selectedFile && <p className="text-success fw-bold">Selected File: {selectedFile.name}</p>}
        <Button variant="primary" onClick={handleSubmit} className="w-100">
          <FaFileUpload className="me-2" /> Submit
        </Button>
      </Card>

      {/* Pass selectedFile to FilePreview */}
      {selectedFile && <FilePreview file={selectedFile} />}
    </Container>
  );
};

export default FileUploader;
