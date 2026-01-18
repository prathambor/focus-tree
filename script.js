/* ================== IMAGES ================== */
const STAGES = [
  "https://i.ibb.co/b5TWrWnT/seed.png",
  "https://i.ibb.co/RkvyfX9c/sapling.png",
  "https://i.ibb.co/DxDS24Z/plant.png",
  "https://i.ibb.co/bjNVZcMj/bigger-plant.png",
  "https://i.ibb.co/k27Nj0dJ/tree.png"
];
const WILT = "https://i.ibb.co/3YMwBG1j/wilted-tree.png";

const tree = document.getElementById("tree");
tree.src = STAGES[0];
tree.style.transform = "scale(0.6)";

/* ================== TIMER ================== */
const timerEl = document.getElementById("timer");
const slider = document.getElementById("timeSlider");
const minutesEl = document.getElementById("minutes");
const statusEl = document.getElementById("status");

let TOTAL = slider.value * 60;
let remaining = TOTAL;
let interval = null;
let completed = false;

slider.oninput = () => {
  if (interval) return;
  TOTAL = slider.value * 60;
  remaining = TOTAL;
  minutesEl.textContent = slider.value;
  updateTimer();
};

function updateTimer() {
  timerEl.textContent =
    String(Math.floor(remaining / 60)).padStart(2, "0") +
    ":" +
    String(remaining % 60).padStart(2, "0");
}

/* ================== TREE LOGIC ================== */
function updateTree() {
  if (completed) return;

  const progress = 1 - remaining / TOTAL;
  const index = Math.min(
    STAGES.length - 2,
    Math.floor(progress * (STAGES.length - 1))
  );

  tree.style.opacity = 0;
  setTimeout(() => {
    tree.src = STAGES[index];
    tree.style.opacity = 1;
    tree.style.transform = `scale(${0.6 + index * 0.1})`;
  }, 250);
}

/* ================== CONTROLS ================== */
document.getElementById("start").onclick = () => {
  if (interval) return;

  completed = false;
  statusEl.textContent = "🌱 Stay focused";

  interval = setInterval(() => {
    remaining--;

    if (remaining <= 0) {
      clearInterval(interval);
      interval = null;

      completed = true;
      remaining = 0;
      updateTimer();

      tree.src = STAGES[STAGES.length - 1];
      tree.style.opacity = 1;
      tree.style.transform = "scale(1)";

      statusEl.textContent = "🌳 Session complete!";
      confettiBurst();
      incrementStreak();
      return;
    }

    updateTimer();
    updateTree();
  }, 1000);
};

document.getElementById("pause").onclick = () => {
  clearInterval(interval);
  interval = null;
  statusEl.textContent = "⏸ Paused";
};

document.getElementById("reset").onclick = () => {
  clearInterval(interval);
  interval = null;
  completed = false;
  remaining = TOTAL;
  tree.src = STAGES[0];
  tree.style.transform = "scale(0.6)";
  updateTimer();
  statusEl.textContent = "Ready 🌱";
};

/* ================== FOCUS LOSS ================== */
document.addEventListener("visibilitychange", () => {
  if (document.hidden && interval) {
    clearInterval(interval);
    interval = null;
    completed = false;
    remaining = TOTAL;
    tree.src = WILT;
    tree.style.transform = "scale(0.85)";
    updateTimer();
    statusEl.textContent = "⚠ Focus lost — start over";
  }
});

/* ================== NIGHT MODE ================== */
document.getElementById("nightToggle").onchange = () => {
  document.body.classList.toggle("night");
  if (document.body.classList.contains("night")) spawnNight();
};

function spawnNight() {
  const layer = document.getElementById("night-layer");
  layer.innerHTML = "";

  for (let i = 0; i < 40; i++) {
    const s = document.createElement("div");
    s.className = "star";
    s.style.left = Math.random() * 100 + "%";
    s.style.top = Math.random() * 100 + "%";
    layer.appendChild(s);
  }

  for (let i = 0; i < 15; i++) {
    const g = document.createElement("div");
    g.className = "glow";
    g.style.left = Math.random() * 100 + "%";
    g.style.top = Math.random() * 100 + "%";
    layer.appendChild(g);
  }
}

/* ================== TASKS ================== */
document.getElementById("addTask").onclick = () => {
  const input = document.getElementById("taskInput");
  if (!input.value.trim()) return;

  const li = document.createElement("li");
  const cb = document.createElement("input");
  cb.type = "checkbox";
  const span = document.createElement("span");
  span.textContent = input.value;

  cb.onchange = () => span.classList.toggle("done", cb.checked);

  li.append(cb, span);
  document.getElementById("taskList").appendChild(li);
  input.value = "";
};

/* ================== STREAK ================== */
let streak = Number(localStorage.getItem("focusTreeStreak")) || 0;
document.getElementById("streak").textContent = streak;

function incrementStreak() {
  streak++;
  localStorage.setItem("focusTreeStreak", streak);
  document.getElementById("streak").textContent = streak;
}

/* ================== CONFETTI (GUARANTEED) ================== */
function confettiBurst() {
  const canvas = document.getElementById("confetti");
  const ctx = canvas.getContext("2d");

  canvas.width = innerWidth;
  canvas.height = innerHeight;

  const particles = Array.from({ length: 100 }, () => ({
    x: canvas.width / 2,
    y: canvas.height / 2,
    vx: (Math.random() - 0.5) * 10,
    vy: Math.random() * -10 - 5,
    r: Math.random() * 6 + 3,
    life: 0
  }));

  let frames = 0;
  const anim = setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.3;

      ctx.beginPath();
      ctx.fillStyle = "rgba(255,183,197,0.9)";
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });

    frames++;
    if (frames > 120) {
      clearInterval(anim);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, 16);
}
