// views/home.js - Domovská stránka

// Výchozí data (pokud není v localStorage)
const defaultData = {
  profile: { name: 'Marek Novák' },
  skills: ['PHP', 'HTML', 'CSS', 'Git', 'SQL'],
  projects: ['Webová prezentace', 'API pro správu úloh', 'Interní nástroj pro import dat'],
  interests: ['Programování', 'Fotografie', 'Cestování']
};

// Funkce pro získání dat z localStorage nebo výchozí hodnoty
function getData() {
  const data = localStorage.getItem('it-profile-data');
  return data ? JSON.parse(data) : defaultData;
}

// Funkce pro uložení dat do localStorage
function saveData(data) {
  localStorage.setItem('it-profile-data', JSON.stringify(data));
}

function renderHome() {
  const data = getData();
  const app = document.getElementById('app');

  app.innerHTML = `
    <section>
      <h2>Profil</h2>
      <p>Jméno: <strong>${data.profile.name}</strong></p>
    </section>

    <section>
      <h2>Dovednosti</h2>
      ${data.skills.length > 0 ? `
        <ul>
          ${data.skills.map(skill => `<li>${skill}</li>`).join('')}
        </ul>
      ` : '<p>Žádné dovednosti nebyly uvedeny.</p>'}
    </section>

    <section>
      <h2>Projekty</h2>
      ${data.projects.length > 0 ? `
        <ul>
          ${data.projects.map(project => `<li>${project}</li>`).join('')}
        </ul>
      ` : '<p>Žádné projekty nebyly uvedeny.</p>'}
    </section>
  `;
}

// Připojení funkce k window objektu
window.renderHome = renderHome;