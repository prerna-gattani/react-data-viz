import axios from "axios";

const API_KEY = "YOUR_GEMINI_API_KEY";
const API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent";

export const getChartRecommendations = async (datasetInfo) => {
    const prompt = `
      Given the dataset with columns: ${datasetInfo.columns.join(", ")},
      their types: ${JSON.stringify(datasetInfo.types)},
      suggest the best visualization type(s) from:
      [Histogram, Boxplot, Density Plot, Scatter Plot, Line Chart, Bar Chart, Pie Chart, Radar Chart, Pair Plot, Composed Chart].
      Also, explain why each is chosen.
    `;

    try {
        const response = await axios.post(`${API_URL}?key=${API_KEY}`, {
            contents: [{ role: "user", parts: [{ text: prompt }] }],
        });

        return response.data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error("Error fetching chart recommendations:", error);
        return [];
    }
};
