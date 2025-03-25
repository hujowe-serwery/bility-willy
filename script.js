import { settingsConfig } from './config.js';
import { translations } from './translations.js';
import { initGoldenThings } from './goldenThings.js';
import { gameState } from './gameState.js';
import { enhancedClickHandler, initExtraUpgrades } from './extraUpgrades.js';

document.addEventListener("DOMContentLoaded", function() {
  // --- Tab switching and initial UI setup (unchanged) ---
  const tabClicker = document.getElementById("tab-clicker");
  const tabUpgrades = document.getElementById("tab-upgrades");
  const clickerPanel = document.getElementById("clicker-panel");
  const upgradesPanel = document.getElementById("upgrades-panel");

  tabClicker.addEventListener("click", function() {
    tabClicker.classList.add("active");
    tabUpgrades.classList.remove("active");
    clickerPanel.classList.remove("hidden");
    upgradesPanel.classList.add("hidden");
  });

  tabUpgrades.addEventListener("click", function() {
    tabUpgrades.classList.add("active");
    tabClicker.classList.remove("active");
    upgradesPanel.classList.remove("hidden");
    clickerPanel.classList.add("hidden");
  });

  // --- Loading and Credits screens (unchanged) ---
  const loadingScreen = document.getElementById("loading-screen");
  const loadingBar = document.getElementById("loading-bar");
  const loadingDuration = 5000; // 5 seconds
  const intervalDuration = 50;
  let elapsed = 0;

  const interval = setInterval(() => {
    elapsed += intervalDuration;
    let progress = Math.min((elapsed / loadingDuration) * 100, 100);
    loadingBar.style.width = progress + "%";
    if (progress >= 100) {
      clearInterval(interval);
      const creditsScreen = document.getElementById("credits-screen");
      creditsScreen.classList.remove("fade-out");
      creditsScreen.classList.add("fade-in");
      loadingScreen.classList.add("fade-out");
      setTimeout(() => {
        loadingScreen.style.display = "none";
        setTimeout(() => {
          creditsScreen.classList.remove("fade-in");
          creditsScreen.classList.add("fade-out");
          setTimeout(() => {
            creditsScreen.style.display = "none";
            initGame();
          }, 1000);
        }, 2000);
      }, 1000);
    }
  }, intervalDuration);

  // --- Translations Setup ---
  const languageSelect = document.getElementById("language-select");
  let currentLanguage = languageSelect ? languageSelect.value : "en";

  function updateTranslations() {
    document.title = translations[currentLanguage].title;
    if(document.getElementById("game-title")) {
      document.getElementById("game-title").textContent = translations[currentLanguage].title;
    }
    if(document.getElementById("loading-text")) {
      document.getElementById("loading-text").textContent = translations[currentLanguage].loading;
    }
    if(document.getElementById("credits-text")) {
      document.getElementById("credits-text").textContent = translations[currentLanguage].credits;
    }
    if(document.getElementById("settings-title")) {
      document.getElementById("settings-title").textContent = translations[currentLanguage].settings;
    }
    if(document.getElementById("dark-mode-label")) {
      document.getElementById("dark-mode-label").textContent = translations[currentLanguage].darkMode;
    }
    if(document.getElementById("sound-label")) {
      document.getElementById("sound-label").textContent = translations[currentLanguage].sound;
    }
    if(document.getElementById("language-label")) {
      document.getElementById("language-label").textContent = translations[currentLanguage].language;
    }
    if(document.getElementById("tab-clicker")) {
      document.getElementById("tab-clicker").textContent = translations[currentLanguage].clicker;
    }
    if(document.getElementById("tab-upgrades")) {
      document.getElementById("tab-upgrades").textContent = translations[currentLanguage].upgrades;
    }
    if(document.getElementById("unlock-overlay-text")) {
      document.getElementById("unlock-overlay-text").textContent = translations[currentLanguage].upgradesLocked;
    }
    if(document.getElementById("unlock-upgrades")) {
      document.getElementById("unlock-upgrades").textContent = translations[currentLanguage].unlockUpgrades;
    }
    if(document.getElementById("upgrades-header")) {
      document.getElementById("upgrades-header").textContent = translations[currentLanguage].upgrades;
    }
    if(document.getElementById("upgrade-click-value-label")) {
      document.getElementById("upgrade-click-value-label").textContent = translations[currentLanguage].upgradeClickValue;
    }
    if(document.getElementById("buy-auto-clicker-label")) {
      document.getElementById("buy-auto-clicker-label").textContent = translations[currentLanguage].buyAutoClicker;
    }
    if(document.getElementById("extra-upgrades-header")) {
      document.getElementById("extra-upgrades-header").textContent = translations[currentLanguage].extraUpgrades;
    }
    if(document.getElementById("upgrade-auto-eff-label")) {
      document.getElementById("upgrade-auto-eff-label").textContent = translations[currentLanguage].upgradeAutoEfficiency;
    }
    if(document.getElementById("upgrade-click-frenzy-label")) {
      document.getElementById("upgrade-click-frenzy-label").textContent = translations[currentLanguage].activateClickFrenzy;
    }
    if(document.getElementById("upgrade-auto-speed-label")) {
      document.getElementById("upgrade-auto-speed-label").textContent = translations[currentLanguage].upgradeAutoSpeed;
    }
    if(document.getElementById("upgrade-golden-bonus-label")) {
      document.getElementById("upgrade-golden-bonus-label").textContent = translations[currentLanguage].upgradeGoldenBonus;
    }
    if(document.getElementById("close-settings")) {
      document.getElementById("close-settings").textContent = translations[currentLanguage].close;
    }
    document.querySelectorAll(".pts-label").forEach(elem => {
      elem.textContent = translations[currentLanguage].pts;
    });
    if(document.getElementById("settings-button")) {
      document.getElementById("settings-button").textContent = translations[currentLanguage].settings;
    }
    if(document.getElementById("reset-game")) {
      document.getElementById("reset-game").textContent = translations[currentLanguage].resetGame;
    }
    if(window.updateScore) {
      window.updateScore();
    }
  }

  if (languageSelect) {
    languageSelect.addEventListener("change", function() {
      currentLanguage = languageSelect.value;
      updateTranslations();
      console.log("Language selected:", currentLanguage);
    });
  }

  // --- Game Initialization ---
  function initGame() {
    function formatNumber(num) {
      const isLarge = document.getElementById("large-numbers-toggle")?.checked;
      if (!isLarge) return num.toString();
      if (num >= 1e9) return (num / 1e9).toFixed(1).replace(/\.0$/, "") + "B";
      if (num >= 1e6) return (num / 1e6).toFixed(1).replace(/\.0$/, "") + "M";
      if (num >= 1e3) return (num / 1e3).toFixed(1).replace(/\.0$/, "") + "K";
      return num.toString();
    }

    function updateScore() {
      const scoreDisplay = document.getElementById("score");
      scoreDisplay.textContent = translations[currentLanguage].score + " " + formatNumber(gameState.score);
      const upgradeMultiplierButton = document.getElementById("upgrade-multiplier");
      upgradeMultiplierButton.disabled = gameState.score < gameState.clickUpgradeCost;
      const upgradeAutoButton = document.getElementById("upgrade-auto");
      upgradeAutoButton.disabled = gameState.score < gameState.autoClickerCost;
      document.getElementById("upgrade-auto-eff").disabled = gameState.score < gameState.autoClickerUpgradeCost;
      document.getElementById("upgrade-click-frenzy").disabled = gameState.score < gameState.clickFrenzyCost || gameState.clickFrenzyActive;
      document.getElementById("upgrade-auto-speed").disabled = gameState.score < gameState.autoSpeedUpgradeCost;
      document.getElementById("upgrade-golden-bonus").disabled = gameState.score < gameState.goldenBonusUpgradeCost;
    }
    window.updateScore = updateScore;

    // New: Update score when the Large Numbers toggle changes
    document.getElementById("large-numbers-toggle")?.addEventListener("change", updateScore);

    const clickButton = document.getElementById("click-button");
    clickButton.addEventListener("click", enhancedClickHandler);

    const upgradeMultiplierButton = document.getElementById("upgrade-multiplier");
    upgradeMultiplierButton.addEventListener("click", function() {
      if (gameState.score >= gameState.clickUpgradeCost) {
        gameState.score -= gameState.clickUpgradeCost;
        gameState.clickValue++;
        gameState.clickUpgradeCost += 10;
        const multiplierCostSpan = document.getElementById("multiplier-cost");
        multiplierCostSpan.textContent = formatNumber(gameState.clickUpgradeCost);
        updateScore();
      } else {
        alert("Not enough score for upgrade!");
      }
    });

    const upgradeAutoButton = document.getElementById("upgrade-auto");
    upgradeAutoButton.addEventListener("click", function() {
      if (gameState.score >= gameState.autoClickerCost) {
        gameState.score -= gameState.autoClickerCost;
        gameState.autoClickers++;
        const autoCursorCount = gameState.autoCursorCount;
        const container = document.createElement("div");
        container.className = "auto-cursor-container";
        const orbit = document.createElement("div");
        orbit.className = "auto-cursor-orbit";
        orbit.style.setProperty('--rotation-offset', (Math.random() * 360) + "deg");
        const autoCursor = document.createElement("div");
        autoCursor.className = "auto-cursor";
        const icon = document.createElement("img");
        icon.className = "auto-cursor-icon";
        icon.src = "/costume1.png";
        icon.alt = "Auto Cursor";
        autoCursor.appendChild(icon);
        orbit.appendChild(autoCursor);
        container.appendChild(orbit);
        clickButton.appendChild(container);
        gameState.autoCursorCount = autoCursorCount + 1;
        gameState.autoClickerCost = Math.floor(gameState.autoClickerCost * 1.5);
        const autoCostSpan = document.getElementById("auto-cost");
        autoCostSpan.textContent = formatNumber(gameState.autoClickerCost);
        updateScore();
      } else {
        alert("Not enough score for auto clicker!");
      }
    });

    const resetButton = document.getElementById("reset-game");
    resetButton.addEventListener("click", function() {
      if (confirm("Are you sure you want to reset the game?")) {
        gameState.score = 0;
        gameState.clickValue = 1;
        gameState.clickUpgradeCost = 10;
        gameState.autoClickers = 0;
        gameState.autoClickerCost = 50;
        gameState.autoClickerMultiplier = 1;
        gameState.autoClickerUpgradeCost = 150;
        gameState.clickFrenzyCost = 200;
        gameState.clickFrenzyActive = false;
        const multiplierCostSpan = document.getElementById("multiplier-cost");
        multiplierCostSpan.textContent = formatNumber(gameState.clickUpgradeCost);
        const autoCostSpan = document.getElementById("auto-cost");
        autoCostSpan.textContent = formatNumber(gameState.autoClickerCost);
        updateScore();
        document.querySelectorAll('.auto-cursor-container').forEach(el => el.remove());
        gameState.autoCursorCount = 0;
        const upgradesUnlocked = document.getElementById("unlock-overlay");
        if (upgradesUnlocked) {
          upgradesUnlocked.remove();
        }
        addLockOverlay();
      }
    });

    setInterval(function() {
      if (gameState.autoClickers > 0) {
        gameState.score += gameState.autoClickers * gameState.autoClickerMultiplier * gameState.autoSpeedMultiplier;
        updateScore();
      }
    }, 1000);

    updateScore();

    const upgradeAutoEffButton = document.getElementById("upgrade-auto-eff");
    upgradeAutoEffButton.addEventListener("click", function() {
      if(gameState.score >= gameState.autoClickerUpgradeCost) {
        gameState.score -= gameState.autoClickerUpgradeCost;
        gameState.autoClickerMultiplier++;
        gameState.autoClickerUpgradeCost = Math.floor(gameState.autoClickerUpgradeCost * 1.7);
        const autoEffCostSpan = document.getElementById("auto-eff-cost");
        autoEffCostSpan.textContent = formatNumber(gameState.autoClickerUpgradeCost);
        updateScore();
      } else {
        alert("Not enough score for Auto Efficiency upgrade!");
      }
    });

    const upgradeClickFrenzyButton = document.getElementById("upgrade-click-frenzy");
    upgradeClickFrenzyButton.addEventListener("click", function() {
      if(gameState.score >= gameState.clickFrenzyCost && !gameState.clickFrenzyActive) {
        gameState.score -= gameState.clickFrenzyCost;
        gameState.clickFrenzyActive = true;
        alert("Click Frenzy activated! Double clicks for 10 seconds.");
        gameState.clickFrenzyCost = Math.floor(gameState.clickFrenzyCost * 1.5);
        const clickFrenzyCostSpan = document.getElementById("click-frenzy-cost");
        clickFrenzyCostSpan.textContent = formatNumber(gameState.clickFrenzyCost);
        updateScore();
        setTimeout(function() {
          gameState.clickFrenzyActive = false;
          alert("Click Frenzy ended!");
          updateScore();
        }, 10000);
      } else {
        if(gameState.clickFrenzyActive) {
          alert("Click Frenzy already active!");
        } else {
          alert("Not enough score for Click Frenzy!");
        }
      }
    });

    const upgradeAutoSpeedButton = document.getElementById("upgrade-auto-speed");
    upgradeAutoSpeedButton.addEventListener("click", function() {
      if(gameState.score >= gameState.autoSpeedUpgradeCost) {
        gameState.score -= gameState.autoSpeedUpgradeCost;
        gameState.autoSpeedMultiplier += 1;
        gameState.autoSpeedUpgradeCost = Math.floor(gameState.autoSpeedUpgradeCost * 1.5);
        const autoSpeedCostSpan = document.getElementById("auto-speed-cost");
        autoSpeedCostSpan.textContent = formatNumber(gameState.autoSpeedUpgradeCost);
        updateScore();
      } else {
        alert("Not enough score for Auto Speed upgrade!");
      }
    });

    const upgradeGoldenBonusButton = document.getElementById("upgrade-golden-bonus");
    upgradeGoldenBonusButton.addEventListener("click", function() {
      if(gameState.score >= gameState.goldenBonusUpgradeCost) {
        gameState.score -= gameState.goldenBonusUpgradeCost;
        window.goldenThingBonusMultiplier = (window.goldenThingBonusMultiplier || 1) + 0.1;
        gameState.goldenBonusUpgradeCost = Math.floor(gameState.goldenBonusUpgradeCost * 1.5);
        const goldenBonusCostSpan = document.getElementById("golden-bonus-cost");
        goldenBonusCostSpan.textContent = formatNumber(gameState.goldenBonusUpgradeCost);
        updateScore();
      } else {
        alert("Not enough score for Golden Bonus upgrade!");
      }
    });

    // --- Initialize Golden Things via new module ---
    function addBonus(bonus, centerX, centerY) {
      gameState.score += bonus;
      updateScore();
    }
    initGoldenThings(addBonus);

    // --- Initialize Extra Upgrades ---
    initExtraUpgrades();

    // --- Upgrade locking variables
    let upgradesUnlocked = false;
    const upgradeUnlockCost = Infinity;
    function unlockUpgradesHandler() {
      if (gameState.score >= upgradeUnlockCost) {
        gameState.score -= upgradeUnlockCost;
        upgradesUnlocked = true;
        const overlay = document.getElementById("unlock-overlay");
        if (overlay) { overlay.remove(); }
        updateScore();
      } else {
        alert("Not enough score to unlock upgrades!");
      }
    }
    const unlockButton = document.getElementById("unlock-upgrades");
    if (unlockButton) {
      unlockButton.addEventListener("click", unlockUpgradesHandler);
    }
    function addLockOverlay() {
      if (!document.getElementById("unlock-overlay")) {
        const overlay = document.createElement("div");
        overlay.id = "unlock-overlay";
        overlay.innerHTML = '<p id="unlock-overlay-text">'+translations[currentLanguage].upgradesLocked+'</p><button id="unlock-upgrades">'+translations[currentLanguage].unlockUpgrades+'</button>';
        const upgradesPanel = document.getElementById("upgrades-panel");
        upgradesPanel.appendChild(overlay);
        overlay.querySelector("button").addEventListener("click", unlockUpgradesHandler);
      }
    }

    addLockOverlay();
  }

});