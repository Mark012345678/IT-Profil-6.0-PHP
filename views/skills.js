// views/skills.js - Správa dovedností a projektů

// Funkce pro získání dat z localStorage
function getData() {
  const data = localStorage.getItem('it-profile-data');
  const defaultData = {
    profile: { name: 'Marek Novák' },
    skills: ['PHP', 'HTML', 'CSS', 'Git', 'SQL'],
    projects: ['Webová prezentace', 'API pro správu úloh', 'Interní nástroj pro import dat'],
    interests: ['Programování', 'Fotografie', 'Cestování']
  };
  return data ? JSON.parse(data) : defaultData;
}

// Funkce pro uložení dat do localStorage
function saveData(data) {
  localStorage.setItem('it-profile-data', JSON.stringify(data));
}

// Funkce pro zobrazení zprávy
function showMessage(message, type = 'success') {
  const messageDiv = document.createElement('div');
  messageDiv.className = type;
  messageDiv.textContent = message;
  messageDiv.style.cssText = `
    padding: 8px;
    border-radius: 4px;
    margin-bottom: 16px;
    color: ${type === 'success' ? '#155724' : '#721c24'};
    background-color: ${type === 'success' ? '#d4edda' : '#f8d7da'};
  `;

  const app = document.getElementById('app');
  const firstSection = app.querySelector('section');
  app.insertBefore(messageDiv, firstSection);

  // Automatické skrytí po 3 sekundách
  setTimeout(() => {
    if (messageDiv.parentNode) {
      messageDiv.remove();
    }
  }, 3000);
}

function renderSkills() {
  const data = getData();
  const app = document.getElementById('app');

  app.innerHTML = `
    <section>
      <h2>Dovednosti</h2>

      <div id="skills-list">
        ${data.skills.length > 0 ? `
          <ul>
            ${data.skills.map((skill, index) =>
              `<li>
                ${skill}
                <button onclick="editSkill(${index})" style="margin-left: 8px;">Upravit</button>
                <button onclick="deleteSkill(${index})" style="margin-left: 4px;" class="delete-btn">Smazat</button>
              </li>`
            ).join('')}
          </ul>
        ` : '<p>Žádné dovednosti nebyly uvedeny.</p>'}
      </div>

      <div id="edit-skill-form" style="display: none;">
        <h3>Upravit dovednost</h3>
        <form onsubmit="saveEditSkill(event)">
          <input type="text" id="edit-skill-input" required>
          <input type="hidden" id="edit-skill-index">
          <button type="submit">Uložit změny</button>
          <button type="button" onclick="cancelEditSkill()">Zrušit</button>
        </form>
      </div>

      <h3>Přidat novou dovednost</h3>
      <form onsubmit="addSkill(event)">
        <input type="text" id="new-skill" required>
        <button type="submit">Přidat dovednost</button>
      </form>
    </section>

    <section>
      <h2>Projekty</h2>

      <div id="projects-list">
        ${data.projects.length > 0 ? `
          <ul>
            ${data.projects.map((project, index) =>
              `<li>
                ${project}
                <button onclick="editProject(${index})" style="margin-left: 8px;">Upravit</button>
                <button onclick="deleteProject(${index})" style="margin-left: 4px;" class="delete-btn">Smazat</button>
              </li>`
            ).join('')}
          </ul>
        ` : '<p>Žádné projekty nebyly uvedeny.</p>'}
      </div>

      <div id="edit-project-form" style="display: none;">
        <h3>Upravit projekt</h3>
        <form onsubmit="saveEditProject(event)">
          <input type="text" id="edit-project-input" required>
          <input type="hidden" id="edit-project-index">
          <button type="submit">Uložit změny</button>
          <button type="button" onclick="cancelEditProject()">Zrušit</button>
        </form>
      </div>

      <h3>Přidat nový projekt</h3>
      <form onsubmit="addProject(event)">
        <input type="text" id="new-project" required>
        <button type="submit">Přidat projekt</button>
      </form>
    </section>
  `;

  // Připojení funkcí k window objektu pro onclick handlery
  window.editSkill = editSkill;
  window.deleteSkill = deleteSkill;
  window.saveEditSkill = saveEditSkill;
  window.cancelEditSkill = cancelEditSkill;
  window.addSkill = addSkill;
  window.editProject = editProject;
  window.deleteProject = deleteProject;
  window.saveEditProject = saveEditProject;
  window.cancelEditProject = cancelEditProject;
  window.addProject = addProject;
  window.renderSkills = renderSkills;
}

// Funkce pro dovednosti
function addSkill(event) {
  event.preventDefault();
  const input = document.getElementById('new-skill');
  const newSkill = input.value.trim();

  if (!newSkill) {
    showMessage('Pole nesmí být prázdné.', 'error');
    return;
  }

  const data = getData();
  if (data.skills.includes(newSkill)) {
    showMessage('Tato dovednost už existuje.', 'error');
    return;
  }

  data.skills.push(newSkill);
  saveData(data);
  showMessage('Dovednost byla přidána.');
  input.value = '';
  renderSkills();
}

function editSkill(index) {
  const data = getData();
  const editForm = document.getElementById('edit-skill-form');
  const editInput = document.getElementById('edit-skill-input');
  const editIndex = document.getElementById('edit-skill-index');

  editInput.value = data.skills[index];
  editIndex.value = index;
  editForm.style.display = 'block';
}

function saveEditSkill(event) {
  event.preventDefault();
  const editInput = document.getElementById('edit-skill-input');
  const editIndex = document.getElementById('edit-skill-index');
  const newValue = editInput.value.trim();
  const index = parseInt(editIndex.value);

  if (!newValue) {
    showMessage('Pole nesmí být prázdné.', 'error');
    return;
  }

  const data = getData();
  if (data.skills.includes(newValue) && data.skills.indexOf(newValue) !== index) {
    showMessage('Tato dovednost už existuje.', 'error');
    return;
  }

  data.skills[index] = newValue;
  saveData(data);
  showMessage('Dovednost byla upravena.');
  cancelEditSkill();
  renderSkills();
}

function cancelEditSkill() {
  const editForm = document.getElementById('edit-skill-form');
  editForm.style.display = 'none';
}

function deleteSkill(index) {
  if (!confirm('Opravdu chcete odstranit tuto dovednost?')) {
    return;
  }

  const data = getData();
  data.skills.splice(index, 1);
  saveData(data);
  showMessage('Dovednost byla odstraněna.');
  renderSkills();
}

// Funkce pro projekty
function addProject(event) {
  event.preventDefault();
  const input = document.getElementById('new-project');
  const newProject = input.value.trim();

  if (!newProject) {
    showMessage('Pole nesmí být prázdné.', 'error');
    return;
  }

  const data = getData();
  if (data.projects.includes(newProject)) {
    showMessage('Tento projekt už existuje.', 'error');
    return;
  }

  data.projects.push(newProject);
  saveData(data);
  showMessage('Projekt byl přidán.');
  input.value = '';
  renderSkills();
}

function editProject(index) {
  const data = getData();
  const editForm = document.getElementById('edit-project-form');
  const editInput = document.getElementById('edit-project-input');
  const editIndex = document.getElementById('edit-project-index');

  editInput.value = data.projects[index];
  editIndex.value = index;
  editForm.style.display = 'block';
}

function saveEditProject(event) {
  event.preventDefault();
  const editInput = document.getElementById('edit-project-input');
  const editIndex = document.getElementById('edit-project-index');
  const newValue = editInput.value.trim();
  const index = parseInt(editIndex.value);

  if (!newValue) {
    showMessage('Pole nesmí být prázdné.', 'error');
    return;
  }

  const data = getData();
  if (data.projects.includes(newValue) && data.projects.indexOf(newValue) !== index) {
    showMessage('Tento projekt už existuje.', 'error');
    return;
  }

  data.projects[index] = newValue;
  saveData(data);
  showMessage('Projekt byl upraven.');
  cancelEditProject();
  renderSkills();
}

function cancelEditProject() {
  const editForm = document.getElementById('edit-project-form');
  editForm.style.display = 'none';
}

function deleteProject(index) {
  if (!confirm('Opravdu chcete odstranit tento projekt?')) {
    return;
  }

  const data = getData();
  data.projects.splice(index, 1);
  saveData(data);
  showMessage('Projekt byl odstraněn.');
  renderSkills();
}