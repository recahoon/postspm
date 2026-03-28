const subjects = [
  "Bahasa Melayu","Bahasa Inggeris","Matematik","Matematik Tambahan",
  "Sejarah","Pendidikan Islam","Biologi","Kimia","Fizik"
];

const grades = ["A+","A","A-","B+","B","C+","C","D","E","F"];

let results = JSON.parse(localStorage.getItem("results")) || {};
let scholarships = JSON.parse(localStorage.getItem("scholarships")) || [];
let upu = JSON.parse(localStorage.getItem("upu")) || [];

/* PAGE NAV */
function showPage(page) {
  document.getElementById("home").style.display = "none";
  document.querySelectorAll(".page").forEach(p => p.classList.add("hidden"));
  document.getElementById(page).classList.remove("hidden");
  renderAll();
}

/* INIT SUBJECTS */
function initSubjects() {
  let container = document.getElementById("subjects");
  container.innerHTML = "";

  subjects.forEach(sub => {
    let select = document.createElement("select");
    select.id = sub;

    grades.forEach(g => {
      let opt = document.createElement("option");
      opt.value = g;
      opt.text = g;
      select.appendChild(opt);
    });

    container.innerHTML += `<label>${sub}</label><br>`;
    container.appendChild(select);
    container.innerHTML += "<br>";
  });
}

/* SAVE RESULTS */
function saveResults() {
  subjects.forEach(sub => {
    results[sub] = document.getElementById(sub).value;
  });

  results.coco = document.getElementById("coco").value;
  results.merit = document.getElementById("merit").value;

  localStorage.setItem("results", JSON.stringify(results));
  alert("Saved!");
}

/* FORM */
let useMin = false;
let useSpec = false;

function openScholarshipForm() {
  openForm("scholarship");
}

function openUPUForm() {
  openForm("upu");
}

function openForm(type) {
  let modal = document.getElementById("formModal");
  modal.classList.remove("hidden");

  modal.innerHTML = `
    <div class="card">
      <h3>Add ${type}</h3>

      <input id="name" placeholder="Name"><br>
      ${type==="upu" ? '<input id="uni" placeholder="University"><br>' : ""}
      ${type==="scholarship" ? '<input id="dateline" type="date"><br>' : ""}

      <h4>Requirement Type</h4>

      <button onclick="toggleMin()">Minimum A</button>
      <button onclick="toggleSpec()">Specific Subjects</button>

      <div id="minBox" class="hidden">
        <input id="minCount" type="number" placeholder="How many A's">
        <select id="minGrade">
          <option>A+</option><option>A</option><option>A-</option>
        </select>
      </div>

      <div id="specBox" class="hidden"></div>

      <h4>Documents</h4>
      <div id="docs"></div>
      <button onclick="addDoc()">Add Document</button>

      <br><br>
      <button onclick="saveItem('${type}')">Save</button>
      <button onclick="closeForm()">Cancel</button>
    </div>
  `;

  renderSpecInputs();
}

/* REQUIREMENTS */
function toggleMin() {
  useMin = !useMin;
  document.getElementById("minBox").classList.toggle("hidden");
}

function toggleSpec() {
  useSpec = !useSpec;
  document.getElementById("specBox").classList.toggle("hidden");
}

function renderSpecInputs() {
  let box = document.getElementById("specBox");
  box.innerHTML = "";

  subjects.forEach(sub => {
    box.innerHTML += `
      <div>
        ${sub}
        <select id="spec-${sub}">
          <option value="">--</option>
          ${grades.map(g=>`<option>${g}</option>`).join("")}
        </select>
      </div>
    `;
  });
}

/* DOCUMENTS */
function addDoc() {
  let docs = document.getElementById("docs");
  let input = document.createElement("input");
  input.placeholder = "Document name";
  docs.appendChild(input);
}

/* SAVE ITEM */
function saveItem(type) {
  let item = {
    name: document.getElementById("name").value,
    min: null,
    spec: {},
    docs: []
  };

  if(type==="scholarship"){
    item.dateline = document.getElementById("dateline").value;
  } else {
    item.uni = document.getElementById("uni").value;
  }

  if(useMin){
    item.min = {
      count: Number(document.getElementById("minCount").value),
      grade: document.getElementById("minGrade").value
    };
  }

  if(useSpec){
    subjects.forEach(sub=>{
      let val = document.getElementById("spec-"+sub).value;
      if(val) item.spec[sub] = val;
    });
  }

  document.querySelectorAll("#docs input").forEach(d=>{
    if(d.value) item.docs.push(d.value);
  });

  if(type==="scholarship"){
    scholarships.push(item);
    localStorage.setItem("scholarships", JSON.stringify(scholarships));
  } else {
    upu.push(item);
    localStorage.setItem("upu", JSON.stringify(upu));
  }

  closeForm();
  renderAll();
}

/* CLOSE */
function closeForm() {
  document.getElementById("formModal").classList.add("hidden");
  useMin = false;
  useSpec = false;
}

/* ELIGIBILITY */
function checkEligibility(item){
  let pass = true;

  if(item.min){
    let count = 0;
    subjects.forEach(sub=>{
      if(["A+","A","A-"].includes(results[sub])) count++;
    });
    if(count < item.min.count) pass = false;
  }

  for(let sub in item.spec){
    if(results[sub] !== item.spec[sub]) pass = false;
  }

  return pass;
}

/* RENDER */
function renderAll(){
  renderList("scholarshipList", scholarships);
  renderList("upuList", upu);
}

function renderList(id, list){
  let container = document.getElementById(id);
  container.innerHTML = "";

  list.forEach(item=>{
    let eligible = checkEligibility(item);

    container.innerHTML += `
      <div class="card ${eligible ? "eligible":"not-eligible"}">
        <h3>${item.name}</h3>
        ${item.uni ? `<p>${item.uni}</p>` : ""}
        ${item.dateline ? `<p>${item.dateline}</p>` : ""}
        <p>${eligible ? "✅ Eligible" : "❌ Not Eligible"}</p>
      </div>
    `;
  });
}

/* INIT */
initSubjects();
renderAll();
