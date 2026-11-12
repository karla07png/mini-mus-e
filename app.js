
const systemState = document.getElementById("systemState");
const systemDetail = document.getElementById("systemDetail");
const diamondState = document.getElementById("diamondState");
const diamondDetail = document.getElementById("diamondDetail");
const alertCount = document.getElementById("alertCount");

const headerStatus = document.getElementById("headerStatus");
const statusDot = document.querySelector(".status-dot");

const securityDisplay = document.getElementById("securityDisplay");
const securityIcon = document.getElementById("securityIcon");
const securityTitle = document.getElementById("securityTitle");
const securityMessage = document.getElementById("securityMessage");

const showcaseDiamond = document.getElementById("showcaseDiamond");
const pieceStatus = document.getElementById("pieceStatus");
const monitoringLabel = document.getElementById("monitoringLabel");

const simulateBtn = document.getElementById("simulateBtn");
const resetBtn = document.getElementById("resetBtn");
const toggleBtn = document.getElementById("toggleBtn");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");

const historyList = document.getElementById("historyList");
const currentDate = document.getElementById("currentDate");
const toast = document.getElementById("toast");

let monitoring = true;
let alarmActive = false;
let alerts = 0;
let events = [];
let toastTimeout;

function formatTime() {
  return new Date().toLocaleTimeString("fr-CA", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
}

function formatDate() {
  return new Date().toLocaleDateString("fr-CA", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

function showToast(message, isError = false) {
  clearTimeout(toastTimeout);

  toast.textContent = message;
  toast.classList.toggle("error", isError);
  toast.classList.add("visible");

  toastTimeout = setTimeout(() => {
    toast.classList.remove("visible");
  }, 4000);
}

function addEvent(title, description, type = "normal") {
  events.unshift({
    title,
    description,
    type,
    time: formatTime()
  });

  renderHistory();
}

function renderHistory() {
  historyList.innerHTML = "";

  if (events.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-history";
    empty.textContent = "Aucun événement enregistré.";
    historyList.appendChild(empty);
    return;
  }

  events.forEach(event => {
    const item = document.createElement("div");
    item.className = "history-item";

    const icon = document.createElement("div");
    icon.className = "history-icon";

    if (event.type === "alert") {
      icon.classList.add("alert");
      icon.textContent = "!";
    } else {
      icon.textContent = "✓";
    }

    const text = document.createElement("div");
    text.className = "history-text";

    const title = document.createElement("strong");
    title.textContent = event.title;

    const description = document.createElement("span");
    description.textContent = event.description;

    text.appendChild(title);
    text.appendChild(description);

    const time = document.createElement("span");
    time.className = "history-time";
    time.textContent = event.time;

    item.appendChild(icon);
    item.appendChild(text);
    item.appendChild(time);

    historyList.appendChild(item);
  });
}

function updateInterface() {
  alertCount.textContent = alerts;

  securityDisplay.classList.remove("danger", "inactive");

  if (!monitoring) {
    systemState.textContent = "INACTIF";
    systemState.style.color = "var(--muted)";
    systemDetail.textContent = "Surveillance désactivée";

    diamondState.textContent = "INCONNU";
    diamondState.style.color = "var(--muted)";
    diamondDetail.textContent = "Aucune surveillance en cours";

    headerStatus.textContent = "Système inactif";
    headerStatus.style.color = "var(--muted)";
    statusDot.style.background = "var(--muted)";
    statusDot.style.boxShadow = "none";

    securityDisplay.classList.add("inactive");
    securityIcon.textContent = "—";
    securityTitle.textContent = "Surveillance désactivée";
    securityMessage.textContent =
      "Activez le système pour reprendre la surveillance.";

    pieceStatus.textContent = "● Non surveillé";
    pieceStatus.style.color = "var(--muted)";

    monitoringLabel.textContent = "Désactivée";
    monitoringLabel.style.color = "var(--muted)";

    toggleBtn.textContent = "Activer la surveillance";
    simulateBtn.disabled = true;
    resetBtn.disabled = true;

    return;
  }

  systemState.textContent = "ACTIF";
  systemState.style.color = "var(--green)";
  systemDetail.textContent = "Surveillance en cours";

  monitoringLabel.textContent = "Activée";
  monitoringLabel.style.color = "var(--green)";
  toggleBtn.textContent = "Désactiver la surveillance";

  simulateBtn.disabled = alarmActive;
  resetBtn.disabled = !alarmActive;

  if (alarmActive) {
    diamondState.textContent = "VOL DÉTECTÉ";
    diamondState.style.color = "var(--red)";
    diamondDetail.textContent = "La pièce a été retirée";

    headerStatus.textContent = "ALERTE DE SÉCURITÉ";
    headerStatus.style.color = "var(--red)";
    statusDot.style.background = "var(--red)";
    statusDot.style.boxShadow = "0 0 12px var(--red)";

    securityDisplay.classList.add("danger");
    securityIcon.textContent = "!";
    securityTitle.textContent = "🚨 VOL DÉTECTÉ !";
    securityMessage.textContent =
      "Attention ! Le diamant Éternité a été retiré de sa vitrine.";

    showcaseDiamond.classList.add("missing");

    pieceStatus.textContent = "● Pièce manquante";
    pieceStatus.style.color = "var(--red)";
  } else {
    diamondState.textContent = "SÉCURISÉ";
    diamondState.style.color = "var(--green)";
    diamondDetail.textContent = "Pièce présente dans la vitrine";

    headerStatus.textContent = "Système actif";
    headerStatus.style.color = "var(--green)";
    statusDot.style.background = "var(--green)";
    statusDot.style.boxShadow = "0 0 12px var(--green)";

    securityIcon.textContent = "✓";
    securityTitle.textContent = "Tout est sécurisé";
    securityMessage.textContent =
      "Aucun incident détecté. Votre collection est sous surveillance.";

    showcaseDiamond.classList.remove("missing");

    pieceStatus.textContent = "● En sécurité";
    pieceStatus.style.color = "var(--green)";
  }
}

function simulateTheft() {
  if (!monitoring || alarmActive) {
    return;
  }

  alarmActive = true;
  alerts++;

  addEvent(
    "🚨 Vol détecté",
    "Le diamant Éternité a été retiré de sa vitrine.",
    "alert"
  );

  updateInterface();

  showToast("🚨 ALERTE : VOL DU DIAMANT DÉTECTÉ !", true);
}

function resetAlarm() {
  if (!alarmActive) {
    return;
  }

  alarmActive = false;

  addEvent(
    "Alarme réinitialisée",
    "Le système est revenu à son état normal."
  );

  updateInterface();
  showToast("Alarme réinitialisée avec succès.");
}

function toggleMonitoring() {
  monitoring = !monitoring;

  if (!monitoring) {
    alarmActive = false;
    showcaseDiamond.classList.remove("missing");

    addEvent(
      "Surveillance désactivée",
      "Le système de sécurité a été arrêté."
    );

    showToast("Surveillance désactivée.");
  } else {
    addEvent(
      "Surveillance activée",
      "Le système de sécurité est opérationnel."
    );

    showToast("Surveillance activée.");
  }

  updateInterface();
}

function clearHistory() {
  events = [];
  renderHistory();
  showToast("Historique effacé.");
}

simulateBtn.addEventListener("click", simulateTheft);
resetBtn.addEventListener("click", resetAlarm);
toggleBtn.addEventListener("click", toggleMonitoring);
clearHistoryBtn.addEventListener("click", clearHistory);

currentDate.textContent = formatDate();

addEvent(
  "Système initialisé",
  "Tableau de bord de démonstration prêt."
);

updateInterface();
