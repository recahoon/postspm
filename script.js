const grades = ["A+","A","A-","B+","B","C+","C","D","E","F"];

const subjects = [
"Bahasa Melayu","Bahasa Inggeris","Matematik","Matematik Tambahan",
"Sejarah","Pendidikan Islam","Biologi","Kimia","Fizik"
];

// RESULT FORM
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

// NAV
function showPage(p){
  document.querySelectorAll(".page").forEach(x=>x.classList.add("hidden"));
  home.classList.add("hidden");
  document.getElementById(p).classList.remove("hidden");

  renderScholarships();
  renderUPU();
}

function goHome(){
  document.querySelectorAll(".page").forEach(x=>x.classList.add("hidden"));
  home.classList.remove("hidden");
}

// SAVE RESULT
function saveResults(){
  let data = {};
  subjects.forEach(s=>data[s]=document.getElementById(s).value);
  data.coco = Number(coco.value);

  localStorage.setItem("results", JSON.stringify(data));
  alert("Saved!");
}

// GRADE LOGIC
function gradeValue(g){
  return grades.indexOf(g);
}

// CHECK ELIGIBILITY
function check(student, req){

  if(!student) return false;

  // Minimum
  if(req.min){
    let count = Object.values(student)
      .filter(g => gradeValue(g) <= gradeValue(req.min.grade)).length;

    if(count < req.min.count) return false;
  }

  // Subjects
  if(req.sub){
    for(let s of req.sub){
      if(gradeValue(student[s.name]) > gradeValue(s.grade)){
        return false;
      }
    }
  }

  return true;
}

// TOGGLES
function toggleMin(){ minBox.classList.toggle("hidden"); }
function toggleSub(){
  subBox.classList.toggle("hidden");
  if(!subBox.innerHTML){
    subjects.forEach(s=>{
      let row = document.createElement("div");
      row.innerHTML = `
        ${s}
        <select id="sub-${s}">
          ${grades.map(g=>`<option>${g}</option>`).join("")}
        </select>
      `;
      subBox.appendChild(row);
    });
  }
}

// DOCS
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

// ADD SCHOLARSHIP
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
    req.sub = subjects.map(s=>({
      name:s,
      grade:document.getElementById("sub-"+s).value
    }));
  }

  data.push({
    name:sName.value,
    req,
    docs:[...docs]
  });

  docs=[];
  renderDocs();

  localStorage.setItem("scholarships",JSON.stringify(data));
  renderScholarships();
}

// RENDER SCHOLARSHIP
function renderScholarships(){
  let list = document.getElementById("scholarshipList");
  list.innerHTML="";

  let data = JSON.parse(localStorage.getItem("scholarships"))||[];
  let student = JSON.parse(localStorage.getItem("results"));

  data.forEach(s=>{
    let div=document.createElement("div");
    div.className="card";

    let ok = check(student,s.req);

    div.innerHTML=`
      <h3>${s.name}</h3>
      <p>${ok?"✅ Eligible":"❌ Not Eligible"}</p>
      <p>Docs: ${s.docs.join(", ")}</p>
    `;

    list.appendChild(div);
  });
}

// UPU
function toggleMinUPU(){ minBoxUPU.classList.toggle("hidden"); }
function toggleSubUPU(){
  subBoxUPU.classList.toggle("hidden");
  if(!subBoxUPU.innerHTML){
    subjects.forEach(s=>{
      let row=document.createElement("div");
      row.innerHTML=`
        ${s}
        <select id="upu-${s}">
          ${grades.map(g=>`<option>${g}</option>`).join("")}
        </select>
      `;
      subBoxUPU.appendChild(row);
    });
  }
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
    req.sub=subjects.map(s=>({
      name:s,
      grade:document.getElementById("upu-"+s).value
    }));
  }

  data.push({
    name:uName.value,
    uni:uUni.value,
    req
  });

  localStorage.setItem("upu",JSON.stringify(data));
  renderUPU();
}

function renderUPU(){
  let list=document.getElementById("upuList");
  list.innerHTML="";

  let data=JSON.parse(localStorage.getItem("upu"))||[];
  let student=JSON.parse(localStorage.getItem("results"));

  data.forEach(u=>{
    let div=document.createElement("div");
    div.className="card";

    let ok = check(student,u.req);

    div.innerHTML=`
      <h3>${u.name}</h3>
      <p>${u.uni}</p>
      <p>${ok?"✅ Eligible":"❌ Not Eligible"}</p>
    `;

    list.appendChild(div);
  });
}
