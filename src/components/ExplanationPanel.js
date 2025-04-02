import React from "react";

const ExplanationPanel = ({ recommendations }) => {
    return (
        <div>
            <h3>Recommended Charts</h3>
            <ul>
                {recommendations.map((rec, index) => (
                    <li key={index}>
                        <strong>{rec.chart}:</strong> {rec.reason}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ExplanationPanel;
