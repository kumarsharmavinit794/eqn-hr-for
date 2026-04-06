import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileText,
  X,
  Scan,
  CheckCircle,
  AlertCircle,
  XCircle,
  Download,
  RefreshCw,
  Eye,
  FileImage,
  File,
} from "lucide-react";

export default function OCRVerification() {
  // State
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);
  const [showComparison, setShowComparison] = useState(true);
  const fileInputRef = useRef(null);

  // Simulate OCR extraction
  const simulateOCR = (fileObj) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Generate random but plausible data
        const names = ["John Doe", "Jane Smith", "Robert Johnson", "Emily Davis", "Michael Brown"];
        const ids = ["ID123456", "DOC789012", "PASSPT345", "DRV567890", "EMP901234"];
        const randomName = names[Math.floor(Math.random() * names.length)];
        const randomID = ids[Math.floor(Math.random() * ids.length)];
        const randomDOB = `${Math.floor(Math.random() * 12) + 1}/${Math.floor(
          Math.random() * 28 + 1
        )}/${Math.floor(Math.random() * 30) + 1980}`;
        const randomConfidence = Math.floor(Math.random() * 30) + 70; // 70-99%

        // Verification status based on confidence
        let status = "verified";
        if (randomConfidence < 80) status = "review";
        if (randomConfidence < 70) status = "invalid";

        resolve({
          name: randomName,
          idNumber: randomID,
          dateOfBirth: randomDOB,
          confidence: randomConfidence,
          status,
        });
      }, 2000);
    });
  };

  // Handle file drop
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && isValidFile(droppedFile)) {
      processFile(droppedFile);
    } else {
      setError("Please upload an image (JPG/PNG) or PDF file.");
    }
  }, []);

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const isValidFile = (file) => {
    const validTypes = ["image/jpeg", "image/png", "application/pdf"];
    return validTypes.includes(file.type);
  };

  const processFile = (file) => {
    setError("");
    setFile(file);
    setResult(null);

    // Create preview URL
    if (file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      // For PDF, we can show a PDF icon or just file name
      setPreviewUrl(null);
    }
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && isValidFile(selectedFile)) {
      processFile(selectedFile);
    } else {
      setError("Invalid file type. Please upload JPG, PNG, or PDF.");
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setPreviewUrl(null);
    setResult(null);
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleScan = async () => {
    if (!file) {
      setError("Please select a file first.");
      return;
    }
    setScanning(true);
    setError("");
    try {
      const extracted = await simulateOCR(file);
      setResult(extracted);

      // Add to history
      setHistory((prev) => [
        {
          id: Date.now(),
          fileName: file.name,
          timestamp: new Date().toLocaleString(),
          ...extracted,
        },
        ...prev.slice(0, 9), // keep last 10
      ]);
    } catch (err) {
      setError("OCR processing failed. Please try again.");
    } finally {
      setScanning(false);
    }
  };

  const handleRescan = () => {
    if (file) {
      handleScan();
    } else {
      setError("No file to rescan.");
    }
  };

  const handleDownloadResult = () => {
    if (!result) return;
    const data = {
      fileName: file?.name,
      scanDate: new Date().toISOString(),
      ...result,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ocr_result_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "review":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case "invalid":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "verified":
        return "Verified";
      case "review":
        return "Needs Review";
      case "invalid":
        return "Invalid Document";
      default:
        return "";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "verified":
        return "bg-green-50 text-green-700 border-green-200";
      case "review":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "invalid":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-4">
          <div className="flex items-center gap-3">
            <FileText className="h-7 w-7 text-white" />
            <h1 className="text-2xl font-bold text-white">Document OCR Verification</h1>
          </div>
          <p className="text-indigo-100 text-sm mt-1">
            Upload an image or PDF to extract and verify document information
          </p>
        </div>

        {/* Main Content */}
        <div className="p-6 md:p-8 space-y-6">
          {/* Drag & Drop Area */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className={`border-2 border-dashed rounded-xl p-6 text-center transition ${
              file
                ? "border-indigo-300 bg-indigo-50"
                : "border-gray-300 hover:border-indigo-400 hover:bg-gray-50"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,application/pdf"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer block">
              {!file ? (
                <>
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-gray-600">Drag & drop or click to upload</p>
                  <p className="text-xs text-gray-400 mt-1">JPG, PNG, PDF (max 10MB)</p>
                </>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="h-12 w-12 object-cover rounded"
                      />
                    ) : (
                      <File className="h-12 w-12 text-indigo-500" />
                    )}
                    <div className="text-left">
                      <p className="font-medium text-gray-700">{file.name}</p>
                      <p className="text-xs text-gray-500">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleRemoveFile}
                    className="p-1 rounded-full hover:bg-gray-200"
                  >
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
              )}
            </label>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 text-red-700 p-3 rounded-lg text-sm"
            >
              {error}
            </motion.div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleScan}
              disabled={!file || scanning}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg font-medium ${
                !file || scanning
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white"
              }`}
            >
              {scanning ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <Scan className="h-4 w-4" />
                  Scan Document
                </>
              )}
            </motion.button>
            {result && (
              <>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleRescan}
                  className="flex items-center gap-2 px-5 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
                >
                  <RefreshCw className="h-4 w-4" />
                  Re-scan
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDownloadResult}
                  className="flex items-center gap-2 px-5 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
                >
                  <Download className="h-4 w-4" />
                  Download Result
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowComparison(!showComparison)}
                  className="flex items-center gap-2 px-5 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
                >
                  <Eye className="h-4 w-4" />
                  {showComparison ? "Hide Comparison" : "Show Comparison"}
                </motion.button>
              </>
            )}
          </div>

          {/* Progress Bar while scanning */}
          <AnimatePresence>
            {scanning && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                  <motion.div
                    className="bg-indigo-500 h-full"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2 }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Processing document...</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* OCR Result */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-gray-50 rounded-xl p-5 border border-gray-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">Extracted Data</h2>
                  <div
                    className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      result.status
                    )}`}
                  >
                    {getStatusIcon(result.status)}
                    {getStatusText(result.status)}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Full Name</p>
                      <p className="font-medium text-gray-800">{result.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">ID Number</p>
                      <p className="font-medium text-gray-800">{result.idNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Date of Birth</p>
                      <p className="font-medium text-gray-800">{result.dateOfBirth}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Confidence Score</p>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-800">
                          {result.confidence}%
                        </span>
                        <div className="flex-1 h-1.5 bg-gray-200 rounded-full">
                          <div
                            className="h-full rounded-full bg-indigo-500"
                            style={{ width: `${result.confidence}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Side-by-Side Comparison (Uploaded vs Extracted) */}
          {result && showComparison && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <FileImage className="h-4 w-4" />
                  Uploaded Document
                </h3>
                {previewUrl ? (
                  <img src={previewUrl} alt="Uploaded" className="max-h-48 rounded-lg mx-auto" />
                ) : (
                  <div className="flex items-center justify-center h-48 bg-gray-100 rounded-lg">
                    <FileText className="h-12 w-12 text-gray-400" />
                  </div>
                )}
                <p className="text-xs text-gray-400 mt-2 text-center">{file?.name}</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Extracted Data
                </h3>
                <dl className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <dt className="text-gray-500">Name:</dt>
                    <dd className="font-medium text-gray-800">{result.name}</dd>
                  </div>
                  <div className="flex justify-between text-sm">
                    <dt className="text-gray-500">ID Number:</dt>
                    <dd className="font-medium text-gray-800">{result.idNumber}</dd>
                  </div>
                  <div className="flex justify-between text-sm">
                    <dt className="text-gray-500">Date of Birth:</dt>
                    <dd className="font-medium text-gray-800">{result.dateOfBirth}</dd>
                  </div>
                  <div className="flex justify-between text-sm">
                    <dt className="text-gray-500">Status:</dt>
                    <dd className={`font-medium ${getStatusColor(result.status).split(" ")[1]}`}>
                      {getStatusText(result.status)}
                    </dd>
                  </div>
                </dl>
              </div>
            </motion.div>
          )}

          {/* History */}
          {history.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Recent Scans</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-md transition"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-700">{item.fileName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">{item.timestamp}</span>
                        <div className={`w-2 h-2 rounded-full ${item.status === "verified" ? "bg-green-500" : item.status === "review" ? "bg-yellow-500" : "bg-red-500"}`} />
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {item.name} | {item.idNumber}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}