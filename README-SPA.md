# IT Profil - Single Page Application (SPA)

Toto je Single Page Application verze IT profilu, která běží jako jedna HTML stránka s JavaScript routingem.

## Funkce

- **Single Page Application**: Jedna HTML stránka bez přenačítání
- **Hash-based routing**: URL ve formátu `#/home`, `#/interests`, `#/skills`
- **CRUD operace**: Přidávání, úprava a mazání zájmů, dovedností a projektů
- **localStorage persistence**: Data se ukládají do prohlížeče

## Struktura projektu

```
/
├── index.html          # Hlavní HTML stránka
├── app.js              # Router a hlavní logika aplikace
├── style.css           # Styly (zachovány z původní verze)
└── views/              # Moduly pro jednotlivé stránky
    ├── home.js         # Domovská stránka
    ├── interests.js    # Správa zájmů
    └── skills.js       # Správa dovedností a projektů
```

## Jak spustit

1. Spusťte HTTP server:
   ```bash
   python3 -m http.server 8000
   ```

2. Otevřete prohlížeč a přejděte na:
   ```
   http://localhost:8000
   ```

## Routing

- `#/home` - Domovská stránka s profilem, dovednostmi a projekty
- `#/interests` - Správa zájmů (CRUD operace)
- `#/skills` - Správa dovedností a projektů (CRUD operace)

## Data

Data se ukládají do `localStorage` prohlížeče pod klíčem `it-profile-data`. Výchozí data jsou:

- **Profil**: Marek Novák
- **Dovednosti**: PHP, HTML, CSS, Git, SQL
- **Projekty**: Webová prezentace, API pro správu úloh, Interní nástroj pro import dat
- **Zájmy**: Programování, Fotografie, Cestování

## Technologie

- **HTML5**: Sémantické značky
- **CSS3**: Responzivní design
- **Vanilla JavaScript**: Bez frameworku, localStorage API
- **Hash-based routing**: `window.addEventListener('hashchange', render)`

## Implementované funkce

### Router
- Hash-based routing bez přenačítání stránky
- Event listenery pro `hashchange` a `load` události
- Automatické přepínání obsahu podle URL

### CRUD operace
- **Přidávání**: Formuláře pro nové zájmy, dovednosti a projekty
- **Úprava**: Inline editace s potvrzením
- **Mazání**: S potvrzovacím dialogem
- **Validace**: Kontrola duplicit a prázdných polí

### Persistence
- localStorage pro ukládání dat
- Výchozí data při prvním spuštění
- Automatické ukládání při změnách

### UI/UX
- Zprávy o úspěchu/chybě
- Responzivní design
- Smooth transitions