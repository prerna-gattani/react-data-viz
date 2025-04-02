import React, { useState } from "react";

const GEMINI_API_KEY = "AIzaSyAAAEBU9iArR9sBbK1QJV5nSCHav02qPQ8"; // 🔴 Replace with your actual API Key

const FileUploader = () => {
  const [jsonData, setJsonData] = useState(null);
  const [chartRecommendation, setChartRecommendation] = useState(null);
  const [error, setError] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          let data;
          if (file.name.endsWith(".json")) {
            data = JSON.parse(e.target.result); // ✅ Parse JSON
          } else if (file.name.endsWith(".csv")) {
            data = csvToJson(e.target.result); // ✅ Convert CSV to JSON
          } else {
            setError("Invalid file format. Please upload a CSV or JSON file.");
            return;
          }

          setJsonData(data);
          await fetchGeminiRecommendation(data);
        } catch (error) {
          console.error("Error parsing file:", error.message);
          setError("Invalid file format! Please check your file.");
        }
      };
      reader.readAsText(file);
    }
  };

  // Convert CSV to JSON (Assumes first row is headers)
  const csvToJson = (csvString) => {
    const [headers, ...rows] = csvString.trim().split("\n").map((row) => row.split(","));
    return rows.map((row) => Object.fromEntries(row.map((val, i) => [headers[i], val])));
  };

  // 🔥 Fetch Chart Recommendations from Gemini API
  const fetchGeminiRecommendation = async (data) => {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [
                  {
                    text: `Analyze the following dataset and recommend the best visualization types:
                    Dataset: ${JSON.stringify(data)}
                    Rules:
                    - Identify if data is univariate, bivariate, or multivariate.
                    - Suggest appropriate charts (histogram, scatter plot, line chart, etc.).
                    - Provide reasoning for your selection.`
                  }
                ]
              }
            ]
          })
        }
      );

      const result = await response.json();
      const recommendation = result?.candidates?.[0]?.content?.parts?.[0]?.text || "No recommendation found.";
      setChartRecommendation(recommendation);
    } catch (error) {
      console.error("Error fetching Gemini API:", error);
      setError("Failed to fetch recommendations. Please try again.");
    }
  };

  return (
    <div>
      <h2>Upload a Dataset (CSV or JSON)</h2>
      <input type="file" accept=".json, .csv" onChange={handleFileUpload} />
      {error && <p style={{ color: "red" }}>{error}</p>}
      
      {jsonData && (
        <div>
          <h3>📊 Uploaded Data:</h3>
          <pre>{JSON.stringify(jsonData, null, 2)}</pre>
        </div>
      )}

      {chartRecommendation && (
        <div>
          <h3>🎯 AI-Recommended Charts:</h3>
          <pre>{chartRecommendation}</pre>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
