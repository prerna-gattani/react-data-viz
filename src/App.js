import React, { useState } from 'react';
import DataUploader from './components/DataUploader';
import ChartSelector from './components/ChartSelector';
import DataVisualization from './components/DataVisualization';
import './styles.css';

const App = () => {
  const [data, setData] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [selectedChart, setSelectedChart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiKey, setApiKey] = useState('');

  const handleDataProcessed = ({ rawData, recommendations }) => {
    setData(rawData);
    setRecommendations(recommendations);
    setSelectedChart(recommendations[0] || null);
    setError(null);
  };

  const handleApiKeySubmit = (e) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      setError('Please enter a valid API key');
      return;
    }
    setError(null);
    // In a real app, you might want to validate the key here
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>AI-Powered Data Visualizer</h1>
        <p>Upload your data and get intelligent chart recommendations</p>
      </header>

      <main className="app-main">
        {!apiKey ? (
          <div className="api-key-form">
            <h2>Enter Your Gemini API Key</h2>
            <form onSubmit={handleApiKeySubmit}>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter Gemini API key"
                className="api-key-input"
              />
              <button type="submit" className="submit-button">
                Save Key
              </button>
            </form>
            <p className="api-key-note">
              Your API key is used only in the browser and never stored on our servers.
            </p>
          </div>
        ) : (
          <>
            <div className="upload-section">
              <DataUploader 
                onDataProcessed={handleDataProcessed}
                setLoading={setLoading}
                setError={setError}
              />
            </div>

            {loading && (
              <div className="status loading">
                <div className="spinner"></div>
                <p>Analyzing your data...</p>
              </div>
            )}

            {error && (
              <div className="status error">
                <p>{error}</p>
                <button 
                  onClick={() => setError(null)} 
                  className="dismiss-button"
                >
                  Dismiss
                </button>
              </div>
            )}

            {data && recommendations.length > 0 && (
              <div className="visualization-container">
                <div className="chart-controls">
                  <ChartSelector 
                    recommendations={recommendations}
                    selectedChart={selectedChart}
                    onSelectChart={setSelectedChart}
                  />
                </div>

                <div className="chart-display">
                  <DataVisualization 
                    data={data} 
                    chartType={selectedChart} 
                  />
                </div>
              </div>
            )}

            {data && recommendations.length === 0 && (
              <div className="status info">
                <p>No chart recommendations available for this data</p>
              </div>
            )}
          </>
        )}
      </main>

      <footer className="app-footer">
        <p>Need help? Contact support@dataviz.com</p>
        {apiKey && (
          <button 
            onClick={() => setApiKey('')} 
            className="change-key-button"
          >
            Change API Key
          </button>
        )}
      </footer>
    </div>
  );
};

export default App;