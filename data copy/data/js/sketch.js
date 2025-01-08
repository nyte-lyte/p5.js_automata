let grid;
let cols, rows;
let resolution = 20;
let selectedDataSet;
let time = 0;

function setup() {
  createCanvas(600, 600);
  colorMode(HSB, 360, 100, 100);

  cols = floor(width / resolution);
  rows = floor(height / resolution);

  // Select a dataset
  selectedDataSet = healthDataSets[5]; // Pick one dataset
  console.log(`Using dataset for date: ${selectedDataSet.date}`);
  console.log('Decay Rate for Dataset 5:', selectedDataSet.decayRate);

  selectedDataSet.palette = validatePalette(
    generateOrganicPalette(selectedDataSet)
  );
  if (!selectedDataSet.palette) {
    console.error("Failed to assign palette to dataset:", selectedDataSet);
  }

  if (selectedDataSet === healthDataSets[5]) {
    // Check for dataset 5
    selectedDataSet.palette = {
      start: color(60, 100, 100), // Bright yellow
      end: color(0, 100, 100), // Bright red
    };
    console.log(
      "Forced bright palette for Dataset 5:",
      selectedDataSet.palette
    ); // Log the palette
  }

  // Initialize the grid
  grid = initializeGrid(cols, rows, resolution, selectedDataSet);
}

function draw() {
  background(0);

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let cell = grid[i][j];

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
