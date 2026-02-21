import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AddCampaign() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    campaignName: "",
    impressions: "",
    clicks: "",
    conversions: "",
    spend: "",
    revenue: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Convert numbers properly
    const numericFields = [
      "impressions",
      "clicks",
      "conversions",
      "spend",
      "revenue",
    ];

    setFormData({
      ...formData,
      [name]: numericFields.includes(name) ? Number(value) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("You must be logged in.");
        return;
      }

      await axios.post("http://localhost:5000/api/campaigns", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Success → redirect
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to create campaign. Please try again.",
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Add Campaign</h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="campaignName"
            placeholder="Campaign Name"
            value={formData.campaignName}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />

          <input
            type="number"
            name="impressions"
            placeholder="Impressions"
            value={formData.impressions}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />

          <input
            type="number"
            name="clicks"
            placeholder="Clicks"
            value={formData.clicks}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />

          <input
            type="number"
            name="conversions"
            placeholder="Conversions"
            value={formData.conversions}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />

          <input
            type="number"
            name="spend"
            placeholder="Spend ($)"
            value={formData.spend}
            onChange={handleChange}
            required
            step="0.01"
            className="w-full border p-2 rounded"
          />

          <input
            type="number"
            name="revenue"
            placeholder="Revenue ($)"
            value={formData.revenue}
            onChange={handleChange}
            required
            step="0.01"
            className="w-full border p-2 rounded"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Create Campaign
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          <a href="/dashboard" className="text-blue-600 hover:underline">
            Back to Dashboard
          </a>
        </p>
      </div>
    </div>
  );
}

export default AddCampaign;
