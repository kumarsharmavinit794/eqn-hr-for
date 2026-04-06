import { useState } from "react";
import { TrendingDown } from "lucide-react";

export default function Attrition() {
  const [employee, setEmployee] = useState("");
  const [result, setResult] = useState(null);

  const handlePredict = () => {
    if (!employee) return;

    // 🔥 Fake prediction (later ML model connect karenge)
    const risk = Math.random() > 0.5 ? "High Risk ⚠️" : "Low Risk ✅";

    setResult({
      name: employee,
      risk,
    });
  };

  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <TrendingDown className="w-6 h-6 text-red-500" />
          Attrition Prediction
        </h1>
        <p className="text-sm text-gray-500">
          Identify employees who are likely to leave the organization
        </p>
      </div>

      {/* INPUT CARD */}
      <div className="bg-white p-6 rounded-xl shadow space-y-4">
        <h2 className="font-semibold">Enter Employee Details</h2>

        <input
          type="text"
          placeholder="Enter Employee Name / ID"
          value={employee}
          onChange={(e) => setEmployee(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 text-sm"
        />

        <button
          onClick={handlePredict}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
        >
          Predict Attrition
        </button>
      </div>

      {/* RESULT */}
      {result && (
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-semibold mb-2">Prediction Result</h2>

          <p className="text-sm">
            Employee: <span className="font-medium">{result.name}</span>
          </p>

          <p className="text-sm mt-1">
            Risk Level:{" "}
            <span
              className={`font-semibold ${
                result.risk.includes("High")
                  ? "text-red-500"
                  : "text-green-500"
              }`}
            >
              {result.risk}
            </span>
          </p>
        </div>
      )}

    </div>
  );
}