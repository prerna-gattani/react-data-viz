// geminiService.js
const GEMINI_API_KEY = "AIzaSyAAAEBU9iArR9sBbK1QJV5nSCHav02qPQ8"; // Fallback for development

export const getChartRecommendations = async (data) => {
  if (!data || data.length === 0) {
    throw new Error('No data provided for analysis');
  }

  try {
    // Prepare the prompt for Gemini
    const columns = Object.keys(data[0]);
    const sampleData = JSON.stringify(data.slice(0, 3), null, 2); // First 3 rows
    
    const prompt = `
      Analyze this dataset and recommend the most appropriate visualization types.
      Consider the data structure, column types, and potential relationships.

      Dataset Columns: ${columns.join(', ')}
      Sample Data:
      ${sampleData}

      Respond with a JSON object containing:
      - recommendations: Array of chart recommendations with type, reason, and required options
      - insights: Any interesting patterns or observations

      Required JSON format:
      {
        "recommendations": [
          {
            "type": "chart type (e.g., Bar Chart, Line Chart)",
            "reason": "why this chart is appropriate",
            "options": {
              "xKey": "column_name",
              "yKey": "column_name",
              "colorKey": "column_name" // optional
            }
          }
        ],
        "insights": {
          "patterns": [],
          "warnings": []
        }
      }

      Important rules:
      1. Only respond with valid JSON
      2. Include at least 3 different chart types
      3. For each recommendation, specify exactly which columns to use
    `;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }]
        })
      }
    );

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const result = await response.json();
    const responseText = result.candidates[0].content.parts[0].text;

    // Extract JSON from the response
    const jsonStart = responseText.indexOf('{');
    const jsonEnd = responseText.lastIndexOf('}') + 1;
    const jsonString = responseText.slice(jsonStart, jsonEnd);

    try {
      const parsedResponse = JSON.parse(jsonString);
      
      // Validate the response structure
      if (!parsedResponse.recommendations || !Array.isArray(parsedResponse.recommendations)) {
        throw new Error('Invalid response format from Gemini API');
      }

      return parsedResponse.recommendations.map(rec => ({
        type: rec.type || 'Unknown Chart',
        reason: rec.reason || 'No explanation provided',
        options: rec.options || {}
      }));

    } catch (parseError) {
      console.error('Failed to parse Gemini response:', parseError);
      throw new Error('Received invalid response from Gemini API');
    }

  } catch (error) {
    console.error('Gemini API error:', error);
    
    // Fallback to default recommendations if API fails
    return getFallbackRecommendations(data);
  }
};

// Fallback recommendations when API fails
const getFallbackRecommendations = (data) => {
  if (!data || data.length === 0) return [];
  
  const columns = Object.keys(data[0]);
  if (columns.length < 2) return [];

  // Basic recommendations based on data structure
  return [
    {
      type: "Bar Chart",
      reason: "Effective for comparing values across different categories",
      options: {
        xKey: columns[0],
        yKey: columns[1]
      }
    },
    {
      type: "Line Chart",
      reason: "Ideal for showing trends or changes over time/order",
      options: {
        xKey: columns[0],
        yKey: columns[1]
      }
    },
    {
      type: "Scatter Plot",
      reason: "Useful for examining relationships between two variables",
      options: {
        xKey: columns[0],
        yKey: columns[1]
      }
    }
  ];
};