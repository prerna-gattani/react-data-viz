import React, { useCallback } from 'react';
import { getChartRecommendations } from '../services/geminiService';

const DataUploader = ({ onDataProcessed, setLoading, setError }) => {
  const parseCSV = (csvString) => {
    const lines = csvString.split('\n').filter(line => line.trim() !== '');
    const headers = lines[0].split(',').map(h => h.trim());
    return lines.slice(1).map(line => {
      const values = line.split(',');
      return headers.reduce((obj, header, i) => {
        obj[header] = values[i]?.trim();
        return obj;
      }, {});
    });
  };

  const parseFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target.result;
          if (file.name.endsWith('.json')) {
            resolve(JSON.parse(content));
          } else if (file.name.endsWith('.csv')) {
            resolve(parseCSV(content));
          } else {
            reject(new Error('Only CSV or JSON files are supported'));
          }
        } catch (err) {
          reject(new Error('Failed to parse file: ' + err.message));
        }
      };
      reader.onerror = () => reject(new Error('Error reading file'));
      reader.readAsText(file);
    });
  };

  const handleFileUpload = useCallback(async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      // Step 1: Parse the uploaded file
      const parsedData = await parseFile(file);
      
      if (!parsedData || parsedData.length === 0) {
        throw new Error('File contains no valid data');
      }

      // Step 2: Get AI recommendations from Gemini
      const recommendations = await getChartRecommendations(parsedData);
      
      if (!recommendations || recommendations.length === 0) {
        throw new Error('Could not generate chart recommendations');
      }

      // Step 3: Pass data to parent component
      onDataProcessed({
        rawData: parsedData,
        recommendations
      });

    } catch (err) {
      setError(err.message);
      console.error("File processing error:", err);
    } finally {
      setLoading(false);
    }
  }, [onDataProcessed, setError, setLoading]);

  return (
    <div className="uploader">
      <label className="upload-label">
        <span className="upload-text">Choose CSV or JSON File</span>
        <input 
          type="file" 
          accept=".csv,.json" 
          onChange={handleFileUpload} 
          className="file-input"
          aria-label="Select data file"
        />
        <div className="file-requirements">
          (Maximum file size: 5MB)
        </div>
      </label>
    </div>
  );
};

export default DataUploader;