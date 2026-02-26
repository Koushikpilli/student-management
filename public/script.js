const API = `${window.location.origin}/api/students`;

// load students
async function loadStudents(search = "") {
  const res = await fetch(`${API}?search=${search}`);
  const data = await res.json();

  const grid = document.getElementById("studentGrid");
  grid.innerHTML = "";

  data.forEach(student => {
    grid.innerHTML += `
      <div class="card">
        <h3>${student.name}</h3>
        <p>Email: ${student.email}</p>
        <p>Course: ${student.course}</p>
        <p>Marks: ${student.marks}</p>

        <button class="edit-btn"
          onclick='editStudent(${JSON.stringify(student)})'>
          Edit
        </button>

        <button class="delete-btn"
          onclick="deleteStudent('${student._id}')">
          Delete
        </button>
      </div>
    `;
  });
}

// search
function searchStudents() {
  const value = document.getElementById("searchInput").value;
  loadStudents(value);
}

// submit handler
async function handleSubmit() {
  const id = document.getElementById("studentId").value;
  if (id) await updateStudent(id);
  else await addStudent();
}

// add student (FIXED)
async function addStudent() {
  const student = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    course: document.getElementById("course").value,
    marks: document.getElementById("marks").value
  };

  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(student)
  });

  const data = await res.json();
  if (!res.ok) return alert(data.error);

  resetForm();
  loadStudents();
}

// edit fill
function editStudent(student) {
  document.getElementById("studentId").value = student._id;
  document.getElementById("name").value = student.name;
  document.getElementById("email").value = student.email;
  document.getElementById("course").value = student.course;
  document.getElementById("marks").value = student.marks;

  document.getElementById("submitBtn").innerText = "Update Student";
  document.getElementById("formTitle").innerText = "Edit Student";
}

// update
async function updateStudent(id) {
  const student = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    course: document.getElementById("course").value,
    marks: document.getElementById("marks").value
  };

  await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(student)
  });

  resetForm();
  loadStudents();
}

// delete
async function deleteStudent(id) {
  await fetch(`${API}/${id}`, { method: "DELETE" });
  loadStudents();
}

// reset
function resetForm() {
  document.getElementById("studentId").value = "";
  document.getElementById("name").value = "";
  document.getElementById("email").value = "";
  document.getElementById("course").value = "";
  document.getElementById("marks").value = "";

  document.getElementById("submitBtn").innerText = "Add Student";
  document.getElementById("formTitle").innerText = "Add Student";
}

loadStudents();