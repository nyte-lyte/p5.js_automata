let grid;
let cols, rows;
let resolution = 20;
let selectedDataSet;
let time = 0;

function setup() {
  createCanvas(600, 600);
  colorMode(HSB, 360, 100, 100);

  // Select dataset 5 for testing
  let dataSet5 = healthDataSets[5]; // Dataset 5 is index 5 (0-based index)

  console.log("Testing Dataset 5:", dataSet5);

  Object.entries(dataSet5.ecg).forEach(([key, value]) => {
    if (!minMaxValues[key]) {
      console.warn(`Key ${key} is missing in minMaxValues.`);
    } else {
      let min = minMaxValues[key].min;
      let max = minMaxValues[key].max;
      console.log(
        `ECG Key: ${key}, Value: ${value}, Min: ${min}, Max: ${max}, Normalized: ${normalize(
          value,
          min,
          max
        )}`
      );
    }
  });

  Object.entries(dataSet5.labs).forEach(([key, value]) => {
    if (!minMaxValues[key]) {
      console.warn(`Key ${key} is missing in minMaxValues.`);
    } else {
      let min = minMaxValues[key].min;
      let max = minMaxValues[key].max;
      console.log(
        `Lab Key: ${key}, Value: ${value}, Min: ${min}, Max: ${max}, Normalized: ${normalize(
          value,
          min,
          max
        )}`
      );
    }
  });

  cols = floor(width / resolution);
  rows = floor(height / resolution);

  // Select a dataset
  selectedDataSet = healthDataSets[5]; // Pick one dataset
  console.log(`Using dataset for date: ${selectedDataSet.date}`);

  selectedDataSet.palette = validatePalette(
    generateOrganicPalette(selectedDataSet)
  );
  if (!selectedDataSet.palette) {
    console.error("Failed to assign palette to dataset:", selectedDataSet);
  }

  // Initialize the grid
  grid = initializeGrid(cols, rows, resolution, selectedDataSet);
}

function draw() {
  background(0);

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let cell = grid[i][j];

      //if (!cell) {
       // console.warn('Skipping null cell at (${i}, ${j})');
       // continue;
     // }

      if (cell.health > 0) {
        // Calculate blended color based on health
        let blendedColor = lerpColor(
          cell.palette.start,
          cell.palette.end,
          1 - cell.health
        );

        let darkerBlendedColor = lerpColor(cell.palette.start, cell.palette.end, 1 - cell.health + 0.1);

        if (cell.group === 1) {
         fill(blendedColor); 
        } else if (cell.group === 2) {
          fill(darkerBlendedColor);
        } else {
          fill(0);
        }
        
        noStroke();
        rect(
          cell.x - resolution / 2,
          cell.y - resolution / 2,
          resolution,
          resolution
        );

        // Apply decay
        cell.health -= cell.decayRate * 0.0001; // Adjust decay rate for visible change
        if (cell.health < 0) {
          cell.health = 0;
        }
      } else {
        // Cell has "died"; it turns black
        fill(0);
        noStroke();
        rect(
          cell.x - resolution / 2,
          cell.y - resolution / 2,
          resolution,
          resolution
        );
      }
    }
  }
}
