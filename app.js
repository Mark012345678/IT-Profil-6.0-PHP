// app.js - Hlavní aplikace s routerem

// Reference na DOM elementy
const app = document.getElementById('app');

// Router funkce
function render() {
  const route = location.hash || '#/home';
  console.log('Routing to:', route); // Debug log

  // Vyčištění obsahu
  app.innerHTML = '';

  // Routing podle hash
  if (route === '#/home') {
    console.log('Rendering home');
    renderHome();
  } else if (route === '#/interests') {
    console.log('Rendering interests');
    renderInterests();
  } else if (route === '#/skills') {
    console.log('Rendering skills');
    renderSkills();
  } else {
    console.log('Rendering not found');
    renderNotFound();
  }
}

// Event listenery pro změnu hash a načtení stránky
window.addEventListener('hashchange', render);
window.addEventListener('load', render);

// Fallback pro stránku nenalezeno
function renderNotFound() {
  app.innerHTML = `
    <section>
      <h2>Stránka nenalezena</h2>
      <p>Požadovaná stránka neexistuje.</p>
      <p><a href="#/home">Zpět na domovskou stránku</a></p>
    </section>
  `;
}