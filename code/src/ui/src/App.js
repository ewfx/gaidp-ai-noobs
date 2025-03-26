import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import FileUploader from "./components/FileUploader";
import FilePreview from "./components/FilePreview";

const App = () => {
  return (
    <div className="mt-5">
      <FileUploader />
      <FilePreview />
    </div>
  );
};

export default App;
