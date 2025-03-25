export function initGoldenThings(addBonus) {
  let goldenThingActive = false;

  function spawnParticles(x, y, count) {
    for (let i = 0; i < count; i++) {
      const particle = document.createElement("span");
      particle.className = "particle";
      particle.style.left = x + "px";
      particle.style.top = y + "px";
      const angle = Math.random() * 2 * Math.PI;
      const distance = Math.random() * 30; 
      const dx = Math.cos(angle) * distance + "px";
      const dy = Math.sin(angle) * distance + "px";
      particle.style.setProperty('--dx', dx);
      particle.style.setProperty('--dy', dy);
      document.body.appendChild(particle);
      particle.addEventListener("animationend", () => particle.remove());
    }
  }

  function spawnGoldenThing() {
    if (goldenThingActive) return;
    if (!window.goldenThingsEnabled) return; 
    goldenThingActive = true;

    const goldenThing = document.createElement("img");
    goldenThing.src = "/goldenthing.png";
    goldenThing.alt = "Golden Thing";
    goldenThing.className = "golden-thing";
    goldenThing.style.top = (Math.random() * 70 + 10) + "vh";
    goldenThing.style.left = (Math.random() * 70 + 10) + "vw";
    goldenThing.style.opacity = "1";
    document.body.appendChild(goldenThing);

    goldenThing.addEventListener("click", function() {
      const bonus = Math.floor((Math.random() * 100 + 100) * (window.goldenThingBonusMultiplier || 1));
      const rect = goldenThing.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      addBonus(bonus, centerX, centerY);
      let floatingNumber = document.createElement("span");
      floatingNumber.className = "floating-number";
      floatingNumber.textContent = "+" + bonus;
      floatingNumber.style.left = centerX + "px";
      floatingNumber.style.top = centerY + "px";
      document.body.appendChild(floatingNumber);
      floatingNumber.addEventListener("animationend", function() {
        floatingNumber.remove();
      });
      if (window.settingsConfig ? window.settingsConfig.particleEffects : true) {
        spawnParticles(centerX, centerY, 10);
      }
      goldenThing.style.opacity = "0";
      setTimeout(() => {
        goldenThing.remove();
        goldenThingActive = false;
      }, 300);
    });

    setTimeout(() => {
      if (document.body.contains(goldenThing)) {
        goldenThing.style.opacity = "0";
        setTimeout(() => {
          goldenThing.remove();
          goldenThingActive = false;
        }, 300);
      }
    }, 8000);
  }
  
  function scheduleGoldenThing() {
    let delay = Math.random() * 20000 + 20000; 
    setTimeout(() => {
      if (window.goldenThingsEnabled && !goldenThingActive) {
        spawnGoldenThing();
      }
      scheduleGoldenThing();
    }, delay);
  }

  scheduleGoldenThing();
}