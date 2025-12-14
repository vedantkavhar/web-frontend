import { useState } from "react";
import ReportForm from "./components/ReportForm";
import CsvUpload from "./components/Csvupload";
import Dashboard from "./components/Dashboard";

function App() {
  const [activeTab, setActiveTab] = useState('ngo');

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">NGO Report Manager</h1>
        <p className="text-gray-600">Submit monthly reports and track impact data</p>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setActiveTab('ngo')}
            className={`px-6 py-2 mr-2 rounded ${
              activeTab === 'ngo'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border'
            }`}
          >
            NGO Portal
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`px-6 py-2 rounded ${
              activeTab === 'admin'
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-700 border'
            }`}
          >
            Admin Dashboard
          </button>
        </div>

        {activeTab === 'ngo' && (
          <div className="space-y-6">
            <div className="text-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Submit Your Reports</h2>
              <p className="text-gray-600">Choose how you want to submit your monthly impact data</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-3 text-center">Single Report</h3>
                <ReportForm />
              </div>
              <div>
                <h3 className="text-lg font-medium mb-3 text-center">Bulk Upload</h3>
                <CsvUpload />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'admin' && (
          <div>
            <div className="text-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Analytics & Reports</h2>
              <p className="text-gray-600">View aggregated data and insights</p>
            </div>
            <Dashboard />
          </div>
        )}
      </div>
    </div>
  );
}

export default App
