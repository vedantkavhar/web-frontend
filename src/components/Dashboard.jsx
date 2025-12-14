import { useState } from "react";
import { API_BASE } from "../utils/constant";

const Dashboard = () => {
  const [month, setMonth] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const res = await fetch(`${API_BASE}/dashboard?month=${month}`);
    const json = await res.json();
    setData(json);
    setLoading(false);
  };

  const stats = [
    { label: "Total NGOs", value: data?.totalNGOs, color: "bg-blue-500" },
    { label: "People Helped", value: data?.peopleHelped, color: "bg-green-500" },
    { label: "Events Conducted", value: data?.eventsConducted, color: "bg-purple-500" },
    { label: "Funds Utilized", value: data?.fundsUtilized ? `Rs.${data.fundsUtilized}` : null, color: "bg-orange-500" }
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>

      <div className="flex gap-3 mb-6">
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          onClick={fetchData}
          disabled={!month || loading}
          className={`px-4 py-2 rounded font-medium ${
            !month || loading
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-purple-600 text-white hover:bg-purple-700'
          }`}
        >
          {loading ? 'Loading...' : 'Fetch Data'}
        </button>
      </div>

      {data && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4 border">
              <p className="text-xl text-gray-600">{stat.label}</p>
              <p className="text-xl  text-gray-900">{stat.value || 0}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;