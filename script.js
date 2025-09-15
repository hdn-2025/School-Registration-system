const form = document.getElementById('studentForm');
const studentList = document.getElementById('studentList');
let students = JSON.parse(localStorage.getItem('students')) || [];

function validateInput(name, studentId, email, contact) {
  const nameRegex = /^[A-Za-z\s]+$/;
  const idRegex = /^\d+$/; // ✅ Only numbers allowed
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const contactRegex = /^\d{10,}$/;

  return (
    nameRegex.test(name) &&
    idRegex.test(studentId) &&
    emailRegex.test(email) &&
    contactRegex.test(contact)
  );
}

function renderStudents() {
  studentList.innerHTML = '';
  if (students.length === 0) {
    studentList.innerHTML = '<p>No students registered yet.</p>';
    return;
  }

  students.forEach((student, index) => {
    const div = document.createElement('div');
    div.className = 'student-record';
    div.innerHTML = `
      <p><strong>Name:</strong> ${student.name}</p>
      <p><strong>ID:</strong> ${student.studentId}</p>
      <p><strong>Email:</strong> ${student.email}</p>
      <p><strong>Contact:</strong> ${student.contact}</p>
      <button onclick="editStudent(${index})">Edit</button>
      <button onclick="deleteStudent(${index})">Delete</button>
    `;
    studentList.appendChild(div);
  });

  if (studentList.scrollHeight > studentList.clientHeight) {
    studentList.style.overflowY = 'scroll';
  }
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const studentId = document.getElementById('studentId').value.trim();
  const email = document.getElementById('email').value.trim();
  const contact = document.getElementById('contact').value.trim();

  if (!validateInput(name, studentId, email, contact)) {
    alert('Please enter valid details.');
    return;
  }

  students.push({ name, studentId, email, contact });
  localStorage.setItem('students', JSON.stringify(students));
  renderStudents();
  form.reset();
});

function editStudent(index) {
  const student = students[index];
  document.getElementById('name').value = student.name;
  document.getElementById('studentId').value = student.studentId;
  document.getElementById('email').value = student.email;
  document.getElementById('contact').value = student.contact;
  students.splice(index, 1);
  localStorage.setItem('students', JSON.stringify(students));
  renderStudents();
}

function deleteStudent(index) {
  students.splice(index, 1);
  localStorage.setItem('students', JSON.stringify(students));
  renderStudents();
}

// Initial render on page load
renderStudents();
