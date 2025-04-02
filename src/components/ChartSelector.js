import React from 'react';

const ChartSelector = ({ recommendations, selectedChart, onSelectChart }) => {
  return (
    <div className="chart-selector">
      <label>
        Select Chart Type:
        <select
          value={selectedChart?.type || ''}
          onChange={(e) => {
            const selected = recommendations.find(r => r.type === e.target.value);
            onSelectChart(selected);
          }}
        >
          {recommendations.map((rec, i) => (
            <option key={i} value={rec.type}>
              {rec.type} - {rec.reason}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};

export default ChartSelector;