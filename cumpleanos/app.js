const BIRTHDAY_DAY = "11";
const BIRTHDAY_MONTH = "03";
const BIRTH_YEAR = 2002;
const FIXED_USER = "nuria";

const form = document.getElementById("loginForm");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const togglePasswordBtn = document.getElementById("togglePasswordBtn");
const loginBtn = document.getElementById("loginBtn");
const forgotBtn = document.getElementById("forgotBtn");
const forgotHint = document.getElementById("forgotHint");
const statusLine = document.getElementById("statusLine");
const message = document.getElementById("message");
const bootLine = document.getElementById("bootLine");
const systemVersion = document.getElementById("systemVersion");

const currentVersion = getCurrentBirthdayVersion();
systemVersion.textContent = `v${currentVersion}`;
typeText(bootLine, "initializing system...", 35);

togglePasswordBtn.addEventListener("click", () => {
  const isHidden = passwordInput.type === "password";
  passwordInput.type = isHidden ? "text" : "password";
  togglePasswordBtn.classList.toggle("is-visible", isHidden);
  togglePasswordBtn.setAttribute("aria-label", isHidden ? "Ocultar contrasena" : "Mostrar contrasena");
  togglePasswordBtn.setAttribute("title", isHidden ? "Ocultar contrasena" : "Mostrar contrasena");
});

forgotBtn.addEventListener("click", () => {
  forgotHint.textContent = "> pista: piensa en un dia que siempre trae tarta";
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  message.textContent = "";
  forgotHint.textContent = "";
  statusLine.className = "status-line";
  statusLine.textContent = "";
  loginBtn.disabled = true;
  await appendTypedLine(statusLine, "validando credenciales...", 30);
  await sleep(800);

  const username = usernameInput.value.trim().toLowerCase();
  const pass = passwordInput.value.trim();

  if (username !== FIXED_USER) {
    message.textContent = "";
    statusLine.className = "status-line error";
    statusLine.textContent = "";
    await appendTypedLine(statusLine, "acceso denegado", 28);
    await typeText(message, "error: usuario incorrecto", 24);
    loginBtn.disabled = false;
    return;
  }

  const match = /^([0-9]{2})([0-9]{2})([0-9]{2})$/.exec(pass);

  if (!match) {
    message.textContent = "";
    statusLine.className = "status-line error";
    statusLine.textContent = "";
    await appendTypedLine(statusLine, "acceso denegado", 28);
    await typeText(message, "Introduce 6 numeros (DDMMYY).", 20);
    loginBtn.disabled = false;
    return;
  }

  const [, dd, mm, yy] = match;

  if (dd !== BIRTHDAY_DAY || mm !== BIRTHDAY_MONTH) {
    message.textContent = "";
    statusLine.className = "status-line error";
    statusLine.textContent = "";
    await appendTypedLine(statusLine, "acceso denegado", 28);
    await typeText(message, "error: credenciales incorrectas", 24);
    loginBtn.disabled = false;
    return;
  }

  const fullYear = `20${yy}`;
  const accessYear = Number(fullYear);

  if (accessYear < BIRTH_YEAR) {
    statusLine.className = "status-line error";
    statusLine.textContent = "";
    await appendTypedLine(statusLine, "Error", 28);
    await sleep(220);
    await appendTypedLine(statusLine, "Version no encontrada", 28);
    await sleep(220);
    await appendTypedLine(statusLine, "Humana aun no instalada", 28);
    loginBtn.disabled = false;
    return;
  }

  const versionLabel = getVersionForYear(accessYear);

  statusLine.className = "status-line success";
  statusLine.textContent = "";
  await appendTypedLine(statusLine, "acceso concedido", 28);
  await sleep(500);
  await appendTypedLine(statusLine, `cambiando a la version ${versionLabel}...`, 28);
  await sleep(500);
  await appendTypedLine(statusLine, "iniciando sistema...", 28);
  await sleep(1500);
  window.location.href = `./${fullYear}/index.html`;
});

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function typeText(element, text, delayMs) {
  element.textContent = "";
  for (const char of text) {
    element.textContent += char;
    await sleep(delayMs);
  }
}

async function appendTypedLine(element, text, delayMs) {
  if (element.textContent.length > 0) {
    element.textContent += "\n";
  }

  for (const char of text) {
    element.textContent += char;
    await sleep(delayMs);
  }
}

function getCurrentBirthdayVersion() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();

  let age = year - BIRTH_YEAR;
  if (month < Number(BIRTHDAY_MONTH) || (month === Number(BIRTHDAY_MONTH) && day < Number(BIRTHDAY_DAY))) {
    age -= 1;
  }

  return formatVersionFromAge(Math.max(age, 0));
}

function getVersionForYear(fullYear) {
  const age = fullYear - BIRTH_YEAR;
  return formatVersionFromAge(Math.max(age, 0));
}

function formatVersionFromAge(age) {
  const major = Math.floor(age / 10);
  const minor = age % 10;
  return `${major}.${minor}`;
}
