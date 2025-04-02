import React from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, ScatterChart, Scatter, Tooltip, XAxis, YAxis } from "recharts";

const ChartRenderer = ({ data, chartType }) => {
    switch (chartType) {
        case "Bar Chart":
            return (
                <BarChart width={500} height={300} data={data}>
                    <XAxis dataKey="x" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="y" fill="#8884d8" />
                </BarChart>
            );

        case "Line Chart":
            return (
                <LineChart width={500} height={300} data={data}>
                    <XAxis dataKey="x" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="y" stroke="#8884d8" />
                </LineChart>
            );

        case "Scatter Plot":
            return (
                <ScatterChart width={500} height={300}>
                    <XAxis dataKey="x" />
                    <YAxis dataKey="y" />
                    <Tooltip />
                    <Scatter data={data} fill="#8884d8" />
                </ScatterChart>
            );

        default:
            return <p>No chart available for this dataset.</p>;
    }
};

export default ChartRenderer;
