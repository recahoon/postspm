const subjects = [
  "Bahasa Melayu","Bahasa Inggeris","Matematik","Matematik Tambahan",
  "Sejarah","Pendidikan Islam","Biologi","Kimia","Fizik"
];

// Create form
const form = document.getElementById("resultForm");

subjects.forEach(sub => {
  let select = document.createElement("select");
  select.id = sub;

  ["A","B","C","D","E","F"].forEach(g => {
    let opt = document.createElement("option");
    opt.value = g;
    opt.innerText = sub + " - " + g;
    select.appendChild(opt);
  });

  form.appendChild(select);
});

// Navigation
function showPage(page) {
  document.querySelectorAll(".page").forEach(p => p.classList.add("hidden"));
  document.getElementById("home").classList.add("hidden");
  document.getElementById(page).classList.remove("hidden");

  renderScholarships();
  renderUPU();
}

function goHome() {
  document.querySelectorAll(".page").forEach(p => p.classList.add("hidden"));
  document.getElementById("home").classList.remove("hidden");
}

// Save results
function saveResults() {
  let data = {};

  subjects.forEach(sub => {
    data[sub] = document.getElementById(sub).value;
  });

  data.coco = Number(document.getElementById("coco").value);
  data.merit = Number(document.getElementById("merit").value);

  localStorage.setItem("results", JSON.stringify(data));
  alert("Saved!");
}

// Count A's
function countAs(student) {
  return Object.values(student).filter(g => g === "A").length;
}

// Scholarships
function addScholarship() {
  let data = JSON.parse(localStorage.getItem("scholarships")) || [];

  data.push({
    name: sName.value,
    deadline: sDeadline.value,
    minAs: Number(sMinAs.value),
    minMerit: Number(sMerit.value)
  });

  localStorage.setItem("scholarships", JSON.stringify(data));
  renderScholarships();
}

function renderScholarships() {
  let list = document.getElementById("scholarshipList");
  list.innerHTML = "";

  let data = JSON.parse(localStorage.getItem("scholarships")) || [];
  let student = JSON.parse(localStorage.getItem("results"));

  data.forEach(s => {
    let eligible = false;

    if (student) {
      eligible =
        countAs(student) >= s.minAs &&
        student.merit >= s.minMerit;
    }

    let div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <h3>${s.name}</h3>
      <p>Deadline: ${s.deadline}</p>
      <p class="${eligible ? "eligible" : "not-eligible"}">
        ${eligible ? "✅ Eligible" : "❌ Not Eligible"}
      </p>
    `;

    list.appendChild(div);
  });
}

// UPU
function addUPU() {
  let data = JSON.parse(localStorage.getItem("upu")) || [];

  data.push({
    name: uName.value,
    minAs: Number(uMinAs.value),
    minMerit: Number(uMerit.value)
  });

  localStorage.setItem("upu", JSON.stringify(data));
  renderUPU();
}

function renderUPU() {
  let list = document.getElementById("upuList");
  list.innerHTML = "";

  let data = JSON.parse(localStorage.getItem("upu")) || [];
  let student = JSON.parse(localStorage.getItem("results"));

  data.forEach(u => {
    let eligible = false;

    if (student) {
      eligible =
        countAs(student) >= u.minAs &&
        student.merit >= u.minMerit;
    }

    let div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <h3>${u.name}</h3>
      <p class="${eligible ? "eligible" : "not-eligible"}">
        ${eligible ? "✅ Eligible" : "❌ Not Eligible"}
      </p>
    `;

    list.appendChild(div);
  });
}
