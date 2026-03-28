const grades = ["A+","A","A-","B+","B","C+","C","D","E","F"];

const subjects = [
"Bahasa Melayu","Bahasa Inggeris","Matematik","Matematik Tambahan",
"Sejarah","Pendidikan Islam","Biologi","Kimia","Fizik"
];

// ✅ FORCE INITIAL STATE (THIS FIXES YOUR BUG)
window.onload = function () {
  document.querySelectorAll(".page").forEach(p => p.classList.add("hidden"));
  document.getElementById("home").classList.remove("hidden");
};

// ---------- RESULT FORM ----------
const form = document.getElementById("resultForm");

subjects.forEach(sub => {
  let select = document.createElement("select");
  select.id = sub;

  grades.forEach(g => {
    let opt = document.createElement("option");
    opt.value = g;
    opt.innerText = sub + " - " + g;
    select.appendChild(opt);
  });

  form.appendChild(select);
});

// ---------- NAV ----------
function showPage(p){
  document.querySelectorAll(".page").forEach(x=>x.classList.add("hidden"));
  document.getElementById("home").classList.add("hidden");
  document.getElementById(p).classList.remove("hidden");

  renderScholarships();
  renderUPU();
}

function goHome(){
  document.querySelectorAll(".page").forEach(x=>x.classList.add("hidden"));
  document.getElementById("home").classList.remove("hidden");
}

// ---------- SAVE RESULTS ----------
function saveResults(){
  let data = {};
  subjects.forEach(s=>data[s]=document.getElementById(s).value);
  data.coco = Number(coco.value);

  localStorage.setItem("results", JSON.stringify(data));
  alert("Saved!");
}

// ---------- LOGIC ----------
function gradeValue(g){ return grades.indexOf(g); }

function check(student, req){
  if(!student) return false;

  if(req.min){
    let count = Object.values(student)
      .filter(g => grades.includes(g))
      .filter(g => gradeValue(g) <= gradeValue(req.min.grade)).length;

    if(count < req.min.count) return false;
  }

  if(req.sub){
    for(let s of req.sub){
      if(gradeValue(student[s.name]) > gradeValue(s.grade)){
        return false;
      }
    }
  }

  return true;
}

// ---------- SUBJECT ROW ----------
function createSubjectRow(container){
  let div = document.createElement("div");

  div.innerHTML = `
    <select class="subName">
      <option value="">Select Subject</option>
      ${subjects.map(s=>`<option>${s}</option>`).join("")}
    </select>

    <select class="subGrade">
      ${grades.map(g=>`<option>${g}</option>`).join("")}
    </select>
  `;

  div.querySelector(".subName").addEventListener("change", ()=>{
    if(div === container.lastChild){
      createSubjectRow(container);
    }
  });

  container.appendChild(div);
}

// ---------- SCHOLARSHIPS ----------
let docs = [];

function addDoc(){
  docs.push(docInput.value);
  docInput.value="";
  renderDocs();
}

function renderDocs(){
  docList.innerHTML="";
  docs.forEach(d=>{
    let li=document.createElement("li");
    li.innerText=d;
    docList.appendChild(li);
  });
}

function toggleMin(){ minBox.classList.toggle("hidden"); }

function toggleSub(){
  subBox.classList.toggle("hidden");
  if(!subBox.innerHTML) createSubjectRow(subBox);
}

function addScholarship(){
  let data = JSON.parse(localStorage.getItem("scholarships"))||[];
  let req = {};

  if(!minBox.classList.contains("hidden")){
    req.min = {
      count:Number(minCount.value),
      grade:minGrade.value
    };
  }

  if(!subBox.classList.contains("hidden")){
    let rows = subBox.querySelectorAll("div");
    let subReq=[];
    rows.forEach(r=>{
      let name=r.querySelector(".subName").value;
      let grade=r.querySelector(".subGrade").value;
      if(name) subReq.push({name,grade});
    });
    if(subReq.length) req.sub=subReq;
  }

  data.push({
    name:sName.value,
    req,
    docs:[...docs]
  });

  docs=[];
  renderDocs();
  subBox.innerHTML="";

  localStorage.setItem("scholarships",JSON.stringify(data));
  renderScholarships();
}

function renderScholarships(){
  let list=document.getElementById("scholarshipList");
  list.innerHTML="";

  let data=JSON.parse(localStorage.getItem("scholarships"))||[];
  let student=JSON.parse(localStorage.getItem("results"));

  data.forEach(s=>{
    let ok = check(student,s.req);

    let div=document.createElement("div");
    div.className="card";

    div.innerHTML=`
      <h3>${s.name}</h3>
      <p class="${ok?"eligible":"not-eligible"}">
        ${ok?"✅ Eligible":"❌ Not Eligible"}
      </p>
      <p>Docs: ${s.docs.join(", ")}</p>
    `;

    list.appendChild(div);
  });
}

// ---------- UPU ----------
function toggleMinUPU(){ minBoxUPU.classList.toggle("hidden"); }

function toggleSubUPU(){
  subBoxUPU.classList.toggle("hidden");
  if(!subBoxUPU.innerHTML) createSubjectRow(subBoxUPU);
}

function addUPU(){
  let data=JSON.parse(localStorage.getItem("upu"))||[];
  let req={};

  if(!minBoxUPU.classList.contains("hidden")){
    req.min={
      count:Number(minCountUPU.value),
      grade:minGradeUPU.value
    };
  }

  if(!subBoxUPU.classList.contains("hidden")){
    let rows=subBoxUPU.querySelectorAll("div");
    let subReq=[];
    rows.forEach(r=>{
      let name=r.querySelector(".subName").value;
      let grade=r.querySelector(".subGrade").value;
      if(name) subReq.push({name,grade});
    });
    if(subReq.length) req.sub=subReq;
  }

  data.push({
    name:uName.value,
    uni:uUni.value,
    req
  });

  subBoxUPU.innerHTML="";
  localStorage.setItem("upu",JSON.stringify(data));
  renderUPU();
}

function renderUPU(){
  let list=document.getElementById("upuList");
  list.innerHTML="";

  let data=JSON.parse(localStorage.getItem("upu"))||[];
  let student=JSON.parse(localStorage.getItem("results"));

  data.forEach(u=>{
    let ok = check(student,u.req);

    let div=document.createElement("div");
    div.className="card";

    div.innerHTML=`
      <h3>${u.name}</h3>
      <p>${u.uni}</p>
      <p class="${ok?"eligible":"not-eligible"}">
        ${ok?"✅ Eligible":"❌ Not Eligible"}
      </p>
    `;

    list.appendChild(div);
  });
}  home.classList.remove("hidden");
}

// ---------- SAVE RESULTS ----------
function saveResults(){
  let data = {};
  subjects.forEach(s=>data[s]=document.getElementById(s).value);
  data.coco = Number(coco.value);

  localStorage.setItem("results", JSON.stringify(data));
  alert("Saved!");
}

// ---------- LOGIC ----------
function gradeValue(g){ return grades.indexOf(g); }

function check(student, req){
  if(!student) return false;

  if(req.min){
    let count = Object.values(student)
      .filter(g => grades.includes(g))
      .filter(g => gradeValue(g) <= gradeValue(req.min.grade)).length;

    if(count < req.min.count) return false;
  }

  if(req.sub){
    for(let s of req.sub){
      if(gradeValue(student[s.name]) > gradeValue(s.grade)){
        return false;
      }
    }
  }

  return true;
}

// ---------- SUBJECT ROW GENERATOR ----------
function createSubjectRow(container, prefix){
  let div = document.createElement("div");

  div.innerHTML = `
    <select class="subName">
      <option value="">Select Subject</option>
      ${subjects.map(s=>`<option>${s}</option>`).join("")}
    </select>

    <select class="subGrade">
      ${grades.map(g=>`<option>${g}</option>`).join("")}
    </select>
  `;

  div.querySelector(".subName").addEventListener("change", ()=>{
    if(div === container.lastChild){
      createSubjectRow(container, prefix);
    }
  });

  container.appendChild(div);
}

// ---------- SCHOLARSHIPS ----------
let docs = [];

function addDoc(){
  docs.push(docInput.value);
  docInput.value="";
  renderDocs();
}

function renderDocs(){
  docList.innerHTML="";
  docs.forEach(d=>{
    let li=document.createElement("li");
    li.innerText=d;
    docList.appendChild(li);
  });
}

function toggleMin(){ minBox.classList.toggle("hidden"); }

function toggleSub(){
  subBox.classList.toggle("hidden");
  if(!subBox.innerHTML) createSubjectRow(subBox);
}

function addScholarship(){
  let data = JSON.parse(localStorage.getItem("scholarships"))||[];

  let req = {};

  if(!minBox.classList.contains("hidden")){
    req.min = {
      count:Number(minCount.value),
      grade:minGrade.value
    };
  }

  if(!subBox.classList.contains("hidden")){
    let rows = subBox.querySelectorAll("div");
    let subReq=[];

    rows.forEach(r=>{
      let name=r.querySelector(".subName").value;
      let grade=r.querySelector(".subGrade").value;
      if(name) subReq.push({name,grade});
    });

    if(subReq.length) req.sub=subReq;
  }

  data.push({
    name:sName.value,
    req,
    docs:[...docs]
  });

  docs=[];
  renderDocs();
  subBox.innerHTML="";

  localStorage.setItem("scholarships",JSON.stringify(data));
  renderScholarships();
}

function renderScholarships(){
  let list=document.getElementById("scholarshipList");
  list.innerHTML="";

  let data=JSON.parse(localStorage.getItem("scholarships"))||[];
  let student=JSON.parse(localStorage.getItem("results"));

  data.forEach(s=>{
    let ok = check(student,s.req);

    let div=document.createElement("div");
    div.className="card";

    div.innerHTML=`
      <h3>${s.name}</h3>
      <p class="${ok?"eligible":"not-eligible"}">
        ${ok?"✅ Eligible":"❌ Not Eligible"}
      </p>
      <p>Docs: ${s.docs.join(", ")}</p>
    `;

    list.appendChild(div);
  });
}

// ---------- UPU ----------
function toggleMinUPU(){ minBoxUPU.classList.toggle("hidden"); }

function toggleSubUPU(){
  subBoxUPU.classList.toggle("hidden");
  if(!subBoxUPU.innerHTML) createSubjectRow(subBoxUPU);
}

function addUPU(){
  let data=JSON.parse(localStorage.getItem("upu"))||[];

  let req={};

  if(!minBoxUPU.classList.contains("hidden")){
    req.min={
      count:Number(minCountUPU.value),
      grade:minGradeUPU.value
    };
  }

  if(!subBoxUPU.classList.contains("hidden")){
    let rows=subBoxUPU.querySelectorAll("div");
    let subReq=[];

    rows.forEach(r=>{
      let name=r.querySelector(".subName").value;
      let grade=r.querySelector(".subGrade").value;
      if(name) subReq.push({name,grade});
    });

    if(subReq.length) req.sub=subReq;
  }

  data.push({
    name:uName.value,
    uni:uUni.value,
    req
  });

  subBoxUPU.innerHTML="";
  localStorage.setItem("upu",JSON.stringify(data));
  renderUPU();
}

function renderUPU(){
  let list=document.getElementById("upuList");
  list.innerHTML="";

  let data=JSON.parse(localStorage.getItem("upu"))||[];
  let student=JSON.parse(localStorage.getItem("results"));

  data.forEach(u=>{
    let ok = check(student,u.req);

    let div=document.createElement("div");
    div.className="card";

    div.innerHTML=`
      <h3>${u.name}</h3>
      <p>${u.uni}</p>
      <p class="${ok?"eligible":"not-eligible"}">
        ${ok?"✅ Eligible":"❌ Not Eligible"}
      </p>
    `;

    list.appendChild(div);
  });
}
