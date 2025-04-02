import React from 'react';
import {
  BarChart, LineChart, PieChart, ScatterChart,
  Bar, Line, Pie, Scatter, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const DataVisualization = ({ data, chartType }) => {
  if (!data || !chartType) return null;

  const renderChart = () => {
    switch (chartType.type) {
      case 'Bar Chart':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={chartType.options.xKey} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={chartType.options.yKey} fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'Line Chart':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={chartType.options.xKey} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey={chartType.options.yKey} 
                stroke="#8884d8" 
              />
            </LineChart>
          </ResponsiveContainer>
        );
      
      case 'Pie Chart':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={data}
                dataKey={chartType.options.valueKey}
                nameKey={chartType.options.nameKey}
                cx="50%"
                cy="50%"
                outerRadius={150}
                fill="#8884d8"
                label
              />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );
      
      case 'Scatter Plot':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart>
              <CartesianGrid />
              <XAxis dataKey={chartType.options.xKey} />
              <YAxis dataKey={chartType.options.yKey} />
              <Tooltip />
              <Scatter 
                data={data} 
                fill="#8884d8" 
              />
            </ScatterChart>
          </ResponsiveContainer>
        );
      
      default:
        return <div>Chart type not supported</div>;
    }
  };

  return (
    <div className="visualization">
      <h2>{chartType.type}</h2>
      {renderChart()}
    </div>
  );
};

export default DataVisualization;