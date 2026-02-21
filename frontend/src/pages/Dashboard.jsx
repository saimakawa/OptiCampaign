import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Dashboard() {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get("http://localhost:5000/api/campaigns", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("API Response:", res.data);

        // Safe handling
        if (Array.isArray(res.data)) {
          setCampaigns(res.data);
        } else if (Array.isArray(res.data.campaigns)) {
          setCampaigns(res.data.campaigns);
        } else {
          setCampaigns([]);
        }
      } catch (err) {
        console.log(err);
        setCampaigns([]);
      }
    };

    fetchCampaigns();
  }, []);

  // Summary Calculations
  const totalRevenue = campaigns.reduce((sum, c) => sum + c.revenue, 0);

  const totalSpend = campaigns.reduce((sum, c) => sum + c.spend, 0);

  const avgCTR =
    campaigns.length > 0
      ? (
          campaigns.reduce(
            (sum, c) =>
              sum + (c.impressions > 0 ? (c.clicks / c.impressions) * 100 : 0),
            0,
          ) / campaigns.length
        ).toFixed(2)
      : 0;

  const avgROI =
    campaigns.length > 0
      ? (
          campaigns.reduce(
            (sum, c) =>
              sum + (c.spend > 0 ? ((c.revenue - c.spend) / c.spend) * 100 : 0),
            0,
          ) / campaigns.length
        ).toFixed(2)
      : 0;

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Marketing Dashboard</h1>

      {/* Add Campaign Button */}
      <div className="mb-6">
        <Link
          to="/add-campaign"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Campaign
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white p-4 rounded shadow">
          <p>Campaigns</p>
          <h2 className="text-xl font-bold">{campaigns.length}</h2>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p>Revenue</p>
          <h2 className="text-xl font-bold">${totalRevenue}</h2>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p>Spend</p>
          <h2 className="text-xl font-bold">${totalSpend}</h2>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p>Avg CTR</p>
          <h2 className="text-xl font-bold">{avgCTR}%</h2>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p>Avg ROI</p>
          <h2 className="text-xl font-bold">{avgROI}%</h2>
        </div>
      </div>

      {/* Campaign Table */}
      <div className="bg-white p-4 rounded shadow">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="p-2">Campaign</th>
              <th className="p-2">Impressions</th>
              <th className="p-2">Clicks</th>
              <th className="p-2">CTR</th>
              <th className="p-2">ROI</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((c) => (
              <tr key={c._id} className="border-b">
                <td className="p-2">{c.campaignName}</td>
                <td className="p-2">{c.impressions}</td>
                <td className="p-2">{c.clicks}</td>
                <td className="p-2">
                  {c.impressions > 0
                    ? ((c.clicks / c.impressions) * 100).toFixed(2)
                    : 0}
                  %
                </td>
                <td className="p-2">
                  {c.spend > 0
                    ? (((c.revenue - c.spend) / c.spend) * 100).toFixed(2)
                    : 0}
                  %
                </td>
              </tr>
            ))}

            {campaigns.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center p-4 text-gray-500">
                  No campaigns found. Add one!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;
