// Generate organic palette based on dataset values
function generateOrganicPalette(dataSet) {
    console.log("Generating palette for dataset:", dataSet);
  let healthIndex = calculateHealthIndex(dataSet);

  let startHue = map(
    dataSet.labs.glucose,
    minMaxValues.glucose.min,
    minMaxValues.glucose.max,
    30,
    300
  );
  let endHue = map(
    dataSet.ecg.qtcInterval,
    minMaxValues.qtcInterval.min,
    minMaxValues.qtcInterval.max,
    40,
    320
  );

  let saturation = map(healthIndex, 0, 1, 30, 70);
  let brightnessStart = map(healthIndex, 0, 1, 50, 80);
  let brightnessEnd = map(healthIndex, 0, 1, 20, 50);

  let startColor = color(startHue, saturation, brightnessStart);
  let endColor = color(endHue, saturation, brightnessEnd);

  return { start: startColor, end: endColor };
}

// Blend colors dynamically based on health
function blendColors(startColor, endColor, health) {
  let blended = lerpColor(startColor, endColor, 1 - health);
  let brightness = map(health, 0, 1, 20, 80);
    return color(hue(blended), saturation(blended), brightness);
}

// Provide a fallback palette for missing data
function getFallbackPalette() {
  return {
    start: color(0, 50, 50), // Muted starting color
    end: color(0, 0, 0), // Black for decay
  };
}

// Validate palette to ensure all necessary properties exist
function validatePalette(palette) {
  if (!palette || !palette.start || !palette.end) {
    console.error("Invalid palette detected. Using fallback palette.");
    return getFallbackPalette();
  }
  return palette;
}
