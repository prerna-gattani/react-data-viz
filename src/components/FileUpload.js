import React, { useState } from "react";
import Papa from "papaparse";
import { analyzeDataset } from "../services/dataAnalysis";
import { getChartRecommendations } from "../services/geminiAPI";

const FileUpload = ({ setRecommendations }) => {
    const [file, setFile] = useState(null);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleFileUpload = async () => {
        if (!file) return alert("Please select a file.");

        const reader = new FileReader();
        reader.onload = async ({ target }) => {
            let data;
            if (file.name.endsWith(".csv")) {
                data = Papa.parse(target.result, { header: true }).data;
            } else {
                data = JSON.parse(target.result);
            }

            const datasetInfo = analyzeDataset(data);
            const recommendations = await getChartRecommendations(datasetInfo);
            setRecommendations(JSON.parse(recommendations));
        };

        reader.readAsText(file);
    };

    return (
        <div>
            <input type="file" accept=".json,.csv" onChange={handleFileChange} />
            <button onClick={handleFileUpload}>Upload & Analyze</button>
        </div>
    );
};

export default FileUpload;
