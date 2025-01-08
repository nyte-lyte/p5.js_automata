// Utility: Create a 2D array
function make2DArray(cols, rows) {
  let arr = new Array(cols);
  for (let i = 0; i < cols; i++) {
    arr[i] = new Array(rows);
  }
  return arr;
}

// Utility: Shuffle array for random data point assignment
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Function to initialize the grid
function initializeGrid(cols, rows, resolution, selectedDataSet) {
  let grid = make2DArray(cols, rows);

  // Combine ECG and lab data points into one array
  let dataPoints = Object.entries(selectedDataSet.labs).concat(
    Object.entries(selectedDataSet.ecg)
  );

  // Shuffle dataPoints for randomness
  dataPoints = shuffleArray(dataPoints);

  // Calculate health index for the dataset
  let healthIndex = calculateHealthIndex(selectedDataSet);
  console.log('Health Index for Dataset 5:', calculateHealthIndex(healthDataSets[5]));

  // Initialize grid with groups
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let index = (i * rows + j) % dataPoints.length;
      let [dataKey, dataValue] = dataPoints[index];

      // Validate minMaxValues before using
      if (
        !minMaxValues[dataKey] ||
        typeof minMaxValues[dataKey].min === "undefined" ||
        typeof minMaxValues[dataKey].max === "undefined"
      ) {
        console.warn(
          `Skipping cell (${i}, ${j}) due to missing min/max for key: ${dataKey}`
        );
        grid[i][j] = null; // Mark cell as invalid
        continue;
      }

      // Normalize dataValue
      let normalizedValue = normalize(
        dataValue,
        minMaxValues[dataKey].min,
        minMaxValues[dataKey].max
      );

      // Group cells with shared data values
      let group = Math.floor(normalizedValue * 10);

      // Assign grid cell properties
      grid[i][j] = {
        x: i * resolution + resolution / 2,
        y: j * resolution + resolution / 2,
        health: healthIndex * normalizedValue || 0.5, // Initial health
        decayRate: selectedDataSet.decayRate * normalizedValue || 0.01, // Decay
        palette: selectedDataSet.palette,
        dataKey: dataKey,
        dataValue: normalizedValue || 0,
        group: group,
      };

      // Log each cell's initialization details
      console.log(
        `Cell initialized at (${i}, ${j}):`,
        `Health: ${grid[i][j].health}, DecayRate: ${grid[i][j].decayRate}, Group: ${grid[i][j].group}`
      );
    }
  }

  return grid;
}
