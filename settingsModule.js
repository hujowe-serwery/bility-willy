/* New file: settingsModule.js
   This module handles the event listeners and behavior for the settings modal,
   including the new options (vibration and particle effects).

   It is imported separately so that script.js remains refactored and within file-length limits.
*/
import { settingsConfig } from './config.js';

document.addEventListener("DOMContentLoaded", () => {
  // Get settings modal elements
  const settingsButton = document.getElementById("settings-button");
  const settingsScreen = document.getElementById("settings-screen");
  const closeSettingsButton = document.getElementById("close-settings");

  const darkModeToggle = document.getElementById("dark-mode-toggle");
  const soundToggle = document.getElementById("sound-toggle");
  const largeNumbersToggle = document.getElementById("large-numbers-toggle");
  const disableGoldenThingsToggle = document.getElementById("disable-golden-things-toggle");
  const particlesToggle = document.getElementById("particles-toggle");

  // Initialize toggles with values from settingsConfig and defaults
  darkModeToggle.checked = settingsConfig.darkMode;
  soundToggle.checked = settingsConfig.sound;
  largeNumbersToggle.checked = settingsConfig.largeNumbers;
  particlesToggle.checked = settingsConfig.particleEffects;
  // For disable golden things, default is golden things enabled (checkbox unchecked)
  if (disableGoldenThingsToggle) {
    disableGoldenThingsToggle.checked = false;
  }

  // Open and close settings modal
  settingsButton.addEventListener("click", () => {
    settingsScreen.classList.add("show");
  });
  closeSettingsButton.addEventListener("click", () => {
    settingsScreen.classList.remove("show");
  });

  // Dark Mode toggle
  darkModeToggle.addEventListener("change", () => {
    settingsConfig.darkMode = darkModeToggle.checked;
    document.body.classList.toggle("dark-mode", settingsConfig.darkMode);
  });

  // Sound toggle
  soundToggle.addEventListener("change", () => {
    settingsConfig.sound = soundToggle.checked;
    console.log("Sound set to", settingsConfig.sound);
  });

  // Large Numbers toggle – update display if applicable
  largeNumbersToggle.addEventListener("change", () => {
    settingsConfig.largeNumbers = largeNumbersToggle.checked;
    if (window.updateScore) window.updateScore();
  });

  // Disable Golden Things toggle
  if (disableGoldenThingsToggle) {
    disableGoldenThingsToggle.addEventListener("change", () => {
      window.goldenThingsEnabled = !disableGoldenThingsToggle.checked;
      console.log("Golden Things enabled:", window.goldenThingsEnabled);
    });
  }

  // Particle Effects toggle
  particlesToggle.addEventListener("change", () => {
    settingsConfig.particleEffects = particlesToggle.checked;
    console.log("Particle Effects set to", settingsConfig.particleEffects);
  });
});