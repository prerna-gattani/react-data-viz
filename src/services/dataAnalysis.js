export const analyzeDataset = (data) => {
    const columns = Object.keys(data[0]);
    const types = {};

    columns.forEach(col => {
        const sampleValues = data.map(row => row[col]);
        const isNumeric = sampleValues.every(val => !isNaN(parseFloat(val)));

        types[col] = isNumeric ? "Numeric" : "Categorical";
    });

    return { columns, types };
};
