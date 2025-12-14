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

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Admin Dashboard</h2>

      <input
        placeholder="YYYY-MM eg 2025-08"
        onChange={(e) => setMonth(e.target.value)}
        className="border p-2 mr-2"
      />
      <button
        onClick={fetchData}
        className="bg-purple-600 text-white px-4 py-2 rounded"
      >
        {loading ? 'Loading...' : 'Fetch'}
      </button>

      {data && (
        <div className="mt-4">
          <p>Total NGOs: {data.totalNGOs}</p>
          <p>People Helped: {data.peopleHelped}</p>
          <p>Events Conducted: {data.eventsConducted}</p>
          <p>Funds Utilized: {data.fundsUtilized}</p>
        </div>
      )}
    </div>
  );
}

export default Dashboard;