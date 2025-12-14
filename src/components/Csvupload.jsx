import { useState } from "react";
import { API_BASE } from "../utils/constant";

const CsvUpload = () => {
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState("");
    const [progress, setProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);

    const upload = async () => {
        if (!file) {
            alert("Please select a CSV file first");
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch(`${API_BASE}/reports/upload`, {
            method: "POST",
            body: formData
        });

        const data = await res.json();
        pollStatus(data.jobId);
    };

    const pollStatus = (jobId) => {
        const interval = setInterval(async () => {
            const res = await fetch(`${API_BASE}/job-status/${jobId}`);
            const data = await res.json();
            setProgress(Math.floor((data.processed / data.total) * 100));
            setStatus(`${data.processed}/${data.total} (${data.status})`);

            if (data.status === "COMPLETED") {
                clearInterval(interval);
                setIsUploading(false);
            }
        }, 2000);
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
            <h2 className="text-xl font-bold mb-4">Upload CSV</h2>

            <div className="mb-4">
                <label className="block">
                    <input
                        type="file"
                        accept=".csv"
                        onChange={(e) => setFile(e.target.files[0])}
                        className="hidden"
                    />
                    <div className="border-2 border-dashed border-gray-300 rounded p-4 text-center cursor-pointer hover:border-gray-400">
                        {file ? (
                            <div>
                                <p className="text-green-600 font-medium">✓ {file.name}</p>
                                <p className="text-sm text-gray-500">Click to change file</p>
                            </div>
                        ) : (
                            <div>
                                <p className="text-gray-600">Click to choose CSV file</p>
                                <p className="text-sm text-gray-400">or drag and drop</p>
                            </div>
                        )}
                    </div>
                </label>
            </div>
            
            <div className="w-full bg-gray-200 rounded mb-4">
                <div
                    className="bg-green-600 h-4 rounded"
                    style={{ width: `${progress}%` }}
                />
            </div>

            <p className="mb-4">{progress}%  {status}</p>

            <button
                onClick={upload}
                disabled={isUploading}
                className={`px-4 py-2 rounded ${
                    isUploading 
                        ? 'bg-gray-400 text-white cursor-not-allowed' 
                        : 'bg-green-600 text-white hover:bg-green-700'
                }`}
            >
                {isUploading ? 'Uploading...' : 'Upload'}
            </button>
        </div>
    );
}

export default CsvUpload;
