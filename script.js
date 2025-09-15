(() => {
  const form         = document.getElementById('studentForm');
  const nameInput    = document.getElementById('name');
  const idInput      = document.getElementById('studentId');
  const emailInput   = document.getElementById('email');
  const contactInput = document.getElementById('contact');
  const studentList  = document.getElementById('studentList');

  // Debug overlay
  function debug(msg) {
    let el = document.getElementById('debug');
    if (!el) {
      el = document.createElement('div');
      el.id = 'debug';
      el.style.cssText = 'position:fixed;bottom:0;left:0;width:100%;background:#000;color:#0f0;font-size:12px;padding:4px;z-index:9999;white-space:pre-wrap;';
      document.body.appendChild(el);
    }
    el.textContent += msg + '\n';
  }

  // Safe storage wrapper
  const Storage = {
    get(key) {
      try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : null;
      } catch (err) {
        debug('localStorage read failed, trying sessionStorage');
        try {
          const raw = sessionStorage.getItem(key);
          return raw ? JSON.parse(raw) : null;
        } catch (e) {
          debug('sessionStorage read failed');
          return null;
        }
      }
    },
    set(key, value) {
      const str = JSON.stringify(value);
      try {
        localStorage.setItem(key, str);
      } catch (err) {
        debug('localStorage write failed, trying sessionStorage');
        try {
          sessionStorage.setItem(key, str);
        } catch (e) {
          debug('sessionStorage write failed');
        }
      }
    }
  };

  let students = Storage.get('students') || [];
  debug('Loaded students: ' + JSON.stringify(students));

  function saveStudents() {
    Storage.set('students', students);
    debug('Saved students: ' + JSON.stringify(students));
  }

  function validate({ name, studentId, email, contact }) {
    const nameRe    = /^[A-Za-z\s]+$/;
    const idRe      = /^\d+$/;
    const emailRe   = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const digitsOnly = contact.replace(/\D/g, '');
    const contactRe = /^\d{10,}$/;
    return (
      nameRe.test(name) &&
      idRe.test(studentId) &&
      emailRe.test(email) &&
      contactRe.test(digitsOnly)
    );
  }

  function renderStudents() {
    studentList.innerHTML = '';
    if (!Array.isArray(students) || students.length === 0) {
      studentList.innerHTML = '<p>No students registered yet.</p>';
      return;
    }
    students.forEach((stud, idx) => {
      const div = document.createElement('div');
      div.className = 'student-record';
      div.dataset.index = idx;
      div.innerHTML = `
        <p><strong>Name:</strong> ${stud.name}</p>
        <p><strong>ID:</strong> ${stud.studentId}</p>
        <p><strong>Email:</strong> ${stud.email}</p>
        <p><strong>Contact:</strong> ${stud.contact}</p>
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
      `;
      studentList.appendChild(div);
    });
  }

  function addStudent(data) {
    students.push(data);
    saveStudents();
    renderStudents();
  }

  function deleteStudent(index) {
    students.splice(index, 1);
    saveStudents();
    renderStudents();
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    const entry = {
      name:      nameInput.value.trim(),
      studentId: idInput.value.trim(),
      email:     emailInput.value.trim(),
      contact:   contactInput.value.trim(),
    };
    if (!validate(entry)) {
      alert('Please enter valid details.');
      debug('Validation failed: ' + JSON.stringify(entry));
      return;
    }
    addStudent(entry);
    form.reset();
    nameInput.focus();
  });

  studentList.addEventListener('click', e => {
    const record = e.target.closest('.student-record');
    if (!record) return;
    const idx = Number(record.dataset.index);
    if (e.target.matches('.edit-btn')) {
      const stud = students[idx];
      nameInput.value    = stud.name;
      idInput.value      = stud.studentId;
      emailInput.value   = stud.email;
      contactInput.value = stud.contact;
      deleteStudent(idx);
      nameInput.focus();
    } else if (e.target.matches('.delete-btn')) {
      deleteStudent(idx);
    }
  });

  // Run after everything loads
  window.addEventListener('load', () => {
    debug('Window loaded, rendering students');
    renderStudents();
  });
})();
