
import ReportForm from "./components/ReportForm";
import CsvUpload from "./components/Csvupload";
import Dashboard from "./components/Dashboard";


function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-10 space-y-6">
      <ReportForm />
      <CsvUpload />
      <Dashboard />
    </div>
  );
}

export default App
