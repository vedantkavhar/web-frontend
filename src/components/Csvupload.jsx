import { useState, useRef } from "react";
import { API_BASE } from "../utils/constant";

const CsvUpload = () => {
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState("");
    const [progress, setProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);
    const [error, setError] = useState("");
    const [uploadComplete, setUploadComplete] = useState(false);
    const fileInputRef = useRef(null);

    const validateFile = (selectedFile) => {
        if (!selectedFile) return false;
        if (!selectedFile.name.endsWith('.csv')) {
            setError('Please select a valid CSV file');
            return false;
        }
        if (selectedFile.size > 10 * 1024 * 1024) { // 10MB limit
            setError('File size must be less than 10MB');
            return false;
        }
        setError('');
        return true;
    };

    const handleFileSelect = (selectedFile) => {
        if (validateFile(selectedFile)) {
            setFile(selectedFile);
            setUploadComplete(false);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);
        const droppedFile = e.dataTransfer.files[0];
        handleFileSelect(droppedFile);
    };

    const upload = async () => {
        if (!file) {
            setError('Please select a CSV file first');
            return;
        }

        setIsUploading(true);
        setError('');
        setProgress(0);
        setUploadComplete(false);

        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch(`${API_BASE}/reports/upload`, {
                method: "POST",
                body: formData
            });

            if (!res.ok) {
                throw new Error('Upload failed');
            }

            const data = await res.json();
            pollStatus(data.jobId);
        } catch (err) {
            setError('Upload failed. Please try again.');
            setIsUploading(false);
        }
    };

    const pollStatus = (jobId) => {
        const interval = setInterval(async () => {
            try {
                const res = await fetch(`${API_BASE}/job-status/${jobId}`);
                const data = await res.json();
                const progressPercent = Math.floor((data.processed / data.total) * 100);
                setProgress(progressPercent);
                setStatus(`${data.processed}/${data.total} records processed`);

                if (data.status === "COMPLETED") {
                    clearInterval(interval);
                    setIsUploading(false);
                    setUploadComplete(true);
                    setStatus('Upload completed successfully!');
                } else if (data.status === "FAILED") {
                    clearInterval(interval);
                    setIsUploading(false);
                    setError('Processing failed. Please try again.');
                }
            } catch (err) {
                clearInterval(interval);
                setIsUploading(false);
                setError('Failed to check status. Please refresh.');
            }
        }, 2000);
    };

    const resetUpload = () => {
        setFile(null);
        setProgress(0);
        setStatus('');
        setError('');
        setUploadComplete(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="max-w-2xl mx-auto p-8 bg-white rounded-xl shadow-lg border border-gray-100">
            {/* Header */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload CSV File</h2>
                <p className="text-gray-600">Select or drag and drop your CSV file to process</p>
            </div>

            {/* Drag & Drop Zone */}
            <div
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                    isDragOver
                        ? 'border-blue-400 bg-blue-50'
                        : file
                        ? 'border-green-400 bg-green-50'
                        : 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100'
                } focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={(e) => handleFileSelect(e.target.files[0])}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={isUploading}
                />
                
                <div className="space-y-4">
                    {/* Upload Icon */}
                    <div className="mx-auto w-16 h-16 flex items-center justify-center">
                        {file ? (
                            <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        ) : (
                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                        )}
                    </div>
                    
                    {file ? (
                        <div className="space-y-2">
                            <p className="text-lg font-medium text-green-700">{file.name}</p>
                            <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                            <button
                                onClick={resetUpload}
                                className="text-sm text-blue-600 hover:text-blue-800 underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                                disabled={isUploading}
                            >
                                Choose different file
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <p className="text-lg font-medium text-gray-700">
                                {isDragOver ? 'Drop your CSV file here' : 'Drag and drop your CSV file here'}
                            </p>
                            <p className="text-sm text-gray-500">or click to browse files</p>
                            <p className="text-xs text-gray-400">Maximum file size: 10MB</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                        <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-red-700 font-medium">{error}</p>
                    </div>
                </div>
            )}

            {/* Progress Section */}
            {(isUploading || progress > 0) && (
                <div className="mt-8 space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Upload Progress</span>
                        <span className="text-sm font-bold text-blue-600">{progress}%</span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                            className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    
                    {status && (
                        <div className="flex items-center space-x-2">
                            {isUploading && (
                                <svg className="animate-spin w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            )}
                            <p className="text-sm text-gray-600">{status}</p>
                        </div>
                    )}
                </div>
            )}

            {/* Success Message */}
            {uploadComplete && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <p className="text-green-700 font-medium">File uploaded and processed successfully!</p>
                    </div>
                </div>
            )}

            {/* Upload Button */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <button
                    onClick={upload}
                    disabled={!file || isUploading}
                    className={`flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                        !file || isUploading
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-md hover:shadow-lg'
                    }`}
                >
                    {isUploading ? (
                        <>
                            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Processing...</span>
                        </>
                    ) : (
                        <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <span>Upload & Process</span>
                        </>
                    )}
                </button>
                
                {(file || uploadComplete) && (
                    <button
                        onClick={resetUpload}
                        disabled={isUploading}
                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Reset
                    </button>
                )}
            </div>
        </div>
    );
}

export default CsvUpload;
