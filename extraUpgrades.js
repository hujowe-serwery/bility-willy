import { gameState } from './gameState.js';
import { translations } from './translations.js';

// Initialize extra upgrade globals if not already set
if (typeof window.comboMultiplierUpgrade === "undefined") {
  window.comboMultiplierUpgrade = 0.1;     // Base combo multiplier (unused as combo no longer accumulates)
  window.comboCount = 0;
  window.lastClickTime = 0;
  window.comboMultiplierCost = 300;
}

export function enhancedClickHandler(e) {
  let points = gameState.clickValue;
  if (gameState.clickFrenzyActive) {
    points = gameState.clickValue * 2;
  }
  // Removed critical hit and combo accumulation logic:
  // No combo count is incremented on continuous clicks, and the extra multiplier is omitted.
  gameState.score += Math.floor(points);
  window.updateScore();
  
  // Floating number effect remains unchanged
  const floatingNumber = document.createElement("span");
  floatingNumber.className = "floating-number";
  floatingNumber.textContent = "+" + Math.floor(points);
  floatingNumber.style.left = e.clientX + "px";
  floatingNumber.style.top = e.clientY + "px";
  document.body.appendChild(floatingNumber);
  floatingNumber.addEventListener("animationend", () => floatingNumber.remove());
}

export function initExtraUpgrades() {
  const language = document.getElementById("language-select")
                      ? document.getElementById("language-select").value
                      : "en";

  // Removed Critical Chance upgrade functionality.

  const comboBtn = document.getElementById("upgrade-combo-multiplier");
  if (comboBtn) {
    comboBtn.addEventListener("click", () => {
      if (gameState.score >= window.comboMultiplierCost) {
        gameState.score -= window.comboMultiplierCost;
        window.comboMultiplierUpgrade += 0.05; // Increase bonus by 5%
        window.comboMultiplierCost = Math.floor(window.comboMultiplierCost * 1.8);
        comboBtn.innerHTML = `<span id="upgrade-combo-multiplier-label">${translations[language].upgradeComboMultiplier}</span> ( <span id="combo-multiplier-cost">${window.comboMultiplierCost}</span> <span class="pts-label">${translations[language].pts}</span> )`;
        window.updateScore();
      } else {
        alert("Not enough score for Combo Multiplier upgrade!");
      }
    });
  }
}