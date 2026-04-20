// views/interests.js - Správa zájmů

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

function renderInterests() {
  const data = getData();
  const app = document.getElementById('app');

  app.innerHTML = `
    <section>
      <h2>Zájmy</h2>

      <div id="interests-list">
        ${data.interests.length > 0 ? `
          <ul>
            ${data.interests.map((interest, index) =>
              `<li>
                ${interest}
                <button onclick="editInterest(${index})" style="margin-left: 8px;">Upravit</button>
                <button onclick="deleteInterest(${index})" style="margin-left: 4px;" class="delete-btn">Smazat</button>
              </li>`
            ).join('')}
          </ul>
        ` : '<p>Žádné zájmy nebyly uvedeny.</p>'}
      </div>

      <div id="edit-form" style="display: none;">
        <h3>Upravit zájem</h3>
        <form onsubmit="saveEditInterest(event)">
          <input type="text" id="edit-input" required>
          <input type="hidden" id="edit-index">
          <button type="submit">Uložit změny</button>
          <button type="button" onclick="cancelEdit()">Zrušit</button>
        </form>
      </div>

      <h3>Přidat nový zájem</h3>
      <form onsubmit="addInterest(event)">
        <input type="text" id="new-interest" required>
        <button type="submit">Přidat zájem</button>
      </form>
    </section>
  `;

  // Připojení funkcí k window objektu pro onclick handlery
  window.editInterest = editInterest;
  window.deleteInterest = deleteInterest;
  window.saveEditInterest = saveEditInterest;
  window.cancelEdit = cancelEdit;
  window.addInterest = addInterest;
  window.renderInterests = renderInterests;
}

function addInterest(event) {
  event.preventDefault();
  const input = document.getElementById('new-interest');
  const newInterest = input.value.trim();

  if (!newInterest) {
    showMessage('Pole nesmí být prázdné.', 'error');
    return;
  }

  const data = getData();
  if (data.interests.includes(newInterest)) {
    showMessage('Tento zájem už existuje.', 'error');
    return;
  }

  data.interests.push(newInterest);
  saveData(data);
  showMessage('Zájem byl přidán.');
  input.value = '';
  renderInterests();
}

function editInterest(index) {
  const data = getData();
  const editForm = document.getElementById('edit-form');
  const editInput = document.getElementById('edit-input');
  const editIndex = document.getElementById('edit-index');

  editInput.value = data.interests[index];
  editIndex.value = index;
  editForm.style.display = 'block';
}

function saveEditInterest(event) {
  event.preventDefault();
  const editInput = document.getElementById('edit-input');
  const editIndex = document.getElementById('edit-index');
  const newValue = editInput.value.trim();
  const index = parseInt(editIndex.value);

  if (!newValue) {
    showMessage('Pole nesmí být prázdné.', 'error');
    return;
  }

  const data = getData();
  if (data.interests.includes(newValue) && data.interests.indexOf(newValue) !== index) {
    showMessage('Tento zájem už existuje.', 'error');
    return;
  }

  data.interests[index] = newValue;
  saveData(data);
  showMessage('Zájem byl upraven.');
  cancelEdit();
  renderInterests();
}

function cancelEdit() {
  const editForm = document.getElementById('edit-form');
  editForm.style.display = 'none';
}

function deleteInterest(index) {
  if (!confirm('Opravdu chcete odstranit tento zájem?')) {
    return;
  }

  const data = getData();
  data.interests.splice(index, 1);
  saveData(data);
  showMessage('Zájem byl odstraněn.');
  renderInterests();
}