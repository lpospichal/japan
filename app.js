
let trip = null;
let currentView = 'todayView';
let deferredPrompt = null;
const storeKey = 'japan-family-companion-state-v2';
const logKey = 'japan-family-companion-log-v2';

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

function loadLocalState() {
  const raw = localStorage.getItem(storeKey);
  return raw ? JSON.parse(raw) : null;
}
function saveLocalState() {
  localStorage.setItem(storeKey, JSON.stringify(trip));
}
function loadLog() {
  const raw = localStorage.getItem(logKey);
  return raw ? JSON.parse(raw) : [];
}
function addLog(message, kind = 'info') {
  const log = loadLog();
  log.unshift({ id: Date.now(), message, kind, time: new Date().toLocaleString() });
  localStorage.setItem(logKey, JSON.stringify(log.slice(0, 80)));
  if (currentView === 'updatesView') renderUpdates();
}

async function init() {
  const saved = loadLocalState();
  if (saved) {
    trip = saved;
  } else {
    trip = await fetch('./data/trip-data.json').then(r => r.json());
    saveLocalState();
  }
  bindNav();
  renderAll();
  setupInstall();
  setupSW();
}

function bindNav() {
  $$('.bottomnav button').forEach(btn => {
    btn.addEventListener('click', () => switchView(btn.dataset.view));
  });
}
function switchView(id) {
  currentView = id;
  $$('.view').forEach(v => v.classList.remove('active'));
  $(`#${id}`)?.classList.add('active');
  $$('.bottomnav button').forEach(b => b.classList.toggle('active', b.dataset.view === id));
}
function renderAll() {
  renderToday();
  renderTimeline();
  renderTickets();
  renderTravel();
  renderExplore();
  renderUpdates();
  renderHelp();
}
function cardLinks(links = []) {
  if (!links.length) return '';
  return `<div class="row">${links.slice(0,4).map((link, i) => `<a class="smallbtn" href="${link}" target="_blank" rel="noreferrer">Link ${i+1}</a>`).join('')}</div>`;
}
function editItemPrompt(collection, id, field) {
  const arr = trip[collection];
  const item = arr.find(x => x.id === id);
  if (!item) return;
  const next = prompt(`Edit ${field}`, item[field] || '');
  if (next === null) return;
  item[field] = next;
  saveLocalState();
  addLog(`Edited ${collection} → ${item.title || item.summary || item.city}`,'edit');
  renderAll();
}
function todayIndex() {
  const now = new Date();
  const current = trip.days.find(d => new Date(d.date) >= new Date('2026-03-19'));
  return trip.days.findIndex(d => d.date === '2026-03-28') >= 0 ? trip.days.findIndex(d => d.date === '2026-03-28') : 0;
}
function renderToday() {
  const idx = todayIndex();
  const day = trip.days[idx] || trip.days[0];
  const nextDay = trip.days[idx + 1];
  const stay = trip.stays.find(s => (s.city || '').toLowerCase() === (day.city || '').toLowerCase()) || trip.stays[0];
  const leg = trip.travelLegs.find(l => l.date === day.date);
  const attraction = trip.attractions.find(a => (a.city || '').toLowerCase().includes((day.city || '').toLowerCase()) || (day.city || '').toLowerCase().includes((a.city || '').toLowerCase())) || trip.attractions[0];
  const food = trip.foodCards.find(f => (f.city || '').toLowerCase() === (day.city || '').toLowerCase()) || trip.foodCards[0];
  $('#todayView').innerHTML = `
    <div class="stack">
      <section class="card hero">
        <p class="eyebrow">Today</p>
        <h2>${day.label} · ${day.city}</h2>
        <p>${day.details}</p>
        <div class="meta grid two">
          <div><strong>Stay</strong>${stay?.name || 'Shared lodging info loaded'}</div>
          <div><strong>Priority mode</strong>${leg ? 'Travel day' : 'Exploration day'}</div>
          <div><strong>Next anchor</strong>${leg ? leg.summary : attraction?.title || 'Neighborhood cluster'}</div>
          <div><strong>Backup mood</strong>${food?.title || 'Food on route'}</div>
        </div>
      </section>

      <section class="grid two">
        <article class="card">
          <p class="kicker">Ops</p>
          <h3>${leg ? 'Travel leg' : 'Main route'}</h3>
          <ul>${(leg ? leg.ops : [day.summary, 'Keep dawn priorities early', 'Use optional stops only if energy is good']).map(x => `<li>${x}</li>`).join('')}</ul>
        </article>
        <article class="card">
          <p class="kicker">What you need</p>
          <h3>${stay?.name || 'Lodging and bookings'}</h3>
          <ul>${(stay?.notes || ['Open Tickets for hotel details', 'Use Updates to import fresh bookings']).slice(0,4).map(x => `<li>${x}</li>`).join('')}</ul>
          ${cardLinks(stay?.links || [])}
        </article>
      </section>

      <section class="grid two">
        <article class="card">
          <p class="kicker">Attraction card</p>
          <h3>${attraction?.title || 'Inspiration'}</h3>
          <p>${attraction?.story || ''}</p>
          ${cardLinks(attraction?.links || [])}
        </article>
        <article class="card">
          <p class="kicker">Food on route</p>
          <h3>${food?.title || 'Food picks'}</h3>
          <p>${food?.why || ''}</p>
          ${cardLinks(food?.links || [])}
        </article>
      </section>

      <section class="card">
        <p class="kicker">Looking ahead</p>
        <h3>${nextDay ? `${nextDay.label} · ${nextDay.city}` : 'Trip nearly complete'}</h3>
        <p>${nextDay?.details || 'Use Timeline for the remaining days.'}</p>
      </section>
    </div>`;
}

function renderTimeline() {
  $('#timelineView').innerHTML = `
    <div class="stack">
      <section class="card"><h2 class="section-title">Trip timeline</h2><p class="kicker">Shared route across Tokyo, Matsumoto, Takayama, Kanazawa, Kyoto, and the final Tokyo stretch.</p></section>
      <section class="list">
        ${trip.days.map(day => `<article class="item">
          <div class="row"><span class="badge">${day.label}</span><span class="badge">${day.city}</span></div>
          <h4>${day.summary}</h4>
          <p>${day.details}</p>
          <div class="row"><button class="smallbtn" onclick="editItemPrompt('days','${day.date}','details')">Edit details</button></div>
        </article>`).join('')}
      </section>
    </div>`;
}

function renderTickets() {
  $('#ticketsView').innerHTML = `
    <div class="stack">
      <section class="card"><h2 class="section-title">Tickets and stays</h2><p class="kicker">Shared booking vault with notes, links, and manual edits.</p></section>
      <section class="list">
        ${trip.bookings.map(b => `<article class="item">
          <div class="row"><span class="badge">${b.kind}</span><span class="badge">${b.city}</span></div>
          <h4>${b.title}</h4>
          <p><strong>${b.dates}</strong></p>
          <p>${b.details}</p>
          <ul>${(b.notes || []).slice(0,4).map(n => `<li>${n}</li>`).join('')}</ul>
          ${cardLinks(b.links || [])}
          <div class="row"><button class="smallbtn" onclick="editItemPrompt('bookings','${b.id}','details')">Edit booking</button></div>
        </article>`).join('')}
      </section>
    </div>`;
}

function renderTravel() {
  $('#travelView').innerHTML = `
    <div class="stack">
      <section class="card"><h2 class="section-title">Travel assistant</h2><p class="kicker">Mission style leg cards for stations, buses, luggage, and arrival actions.</p></section>
      <section class="list">
        ${trip.travelLegs.map(leg => `<article class="item">
          <div class="row"><span class="badge">${leg.mode}</span><span class="badge">${leg.date}</span></div>
          <h4>${leg.from} → ${leg.to}</h4>
          <p>${leg.summary}</p>
          <ul>${leg.ops.map(op => `<li>${op}</li>`).join('')}</ul>
          ${cardLinks(leg.links || [])}
          <div class="row"><button class="smallbtn" onclick="editItemPrompt('travelLegs','${leg.id}','summary')">Edit summary</button></div>
        </article>`).join('')}
      </section>
    </div>`;
}

function renderExplore(filter = 'all') {
  const attractionHtml = trip.attractions
    .filter(a => filter === 'all' || a.city === filter)
    .map(a => `<article class="item"><div class="row"><span class="badge">${a.city}</span><span class="badge">Attraction</span></div><h4>${a.title}</h4><p>${a.story}</p><ul>${(a.ops || []).slice(0,4).map(op => `<li>${op}</li>`).join('')}</ul>${cardLinks(a.links || [])}</article>`).join('');
  const foodHtml = trip.foodCards
    .filter(f => filter === 'all' || f.city === filter)
    .map(f => `<article class="item"><div class="row"><span class="badge">${f.city}</span><span class="badge">Food</span></div><h4>${f.title}</h4><p>${f.why}</p>${cardLinks(f.links || [])}</article>`).join('');
  const docs = trip.docs.slice(0, 16).map(d => `<article class="item"><div class="row"><span class="badge">${d.city}</span><span class="badge">${d.linkCount} links</span></div><h4>${d.title}</h4><p>${d.excerpt}</p>${cardLinks(d.links || [])}</article>`).join('');
  $('#exploreView').innerHTML = `
    <div class="stack">
      <section class="card">
        <h2 class="section-title">Explore</h2>
        <p class="kicker">Companion layer for attraction cards, food on route, cherry blossom notes, and source material.</p>
        <div class="toolbar">
          ${['all','Tokyo','Matsumoto','Takayama','Kanazawa','Kyoto'].map(city => `<button class="smallbtn" onclick="renderExplore('${city}')">${city === 'all' ? 'All cities' : city}</button>`).join('')}
        </div>
      </section>
      <section class="card"><h3>Attraction cards</h3><div class="list">${attractionHtml}</div></section>
      <section class="card"><h3>Food on route</h3><div class="list">${foodHtml}</div></section>
      <section class="card"><h3>Source notes library</h3><div class="list">${docs}</div></section>
    </div>`;
}

function handleImport(files, type) {
  if (!files?.length) return;
  Array.from(files).forEach(file => {
    const reader = new FileReader();
    reader.onload = () => {
      if (file.name.endsWith('.json') || file.name.endsWith('.tripbundle')) {
        try {
          const imported = JSON.parse(reader.result);
          if (imported.days && imported.bookings) {
            trip = imported;
            saveLocalState();
            addLog(`Imported shared bundle: ${file.name}`, 'import');
            renderAll();
            return;
          }
        } catch (err) {}
      }
      addLog(`Queued ${type}: ${file.name} (${Math.round(file.size/1024)} KB)`, 'import');
    };
    reader.readAsText(file.slice(0, 100000));
  });
}
function exportBundle() {
  const blob = new Blob([JSON.stringify(trip, null, 2)], {type: 'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'japan-trip-shared-bundle.json';
  a.click();
  URL.revokeObjectURL(url);
  addLog('Exported shared bundle', 'export');
}

function renderUpdates() {
  const log = loadLog();
  $('#updatesView').innerHTML = `
    <div class="stack">
      <section class="card">
        <h2 class="section-title">Manual updates</h2>
        <p class="kicker">Upload future email exports, updated trip bundles, ticket PDFs, screenshots, and planning docs. All three family members can import or approve updates.</p>
        <div class="row"><button class="cta" onclick="exportBundle()">Export shared bundle</button></div>
      </section>
      <section class="grid two">
        <label class="filebox">
          <h3>Import trip bundle</h3>
          <p class="kicker">Use for updated shared bundles or JSON exports.</p>
          <input type="file" onchange="handleImport(this.files, 'trip bundle')" />
        </label>
        <label class="filebox">
          <h3>Import email export</h3>
          <p class="kicker">Accepts EML, HTML, PDF, MBOX, screenshots, and ticket files.</p>
          <input type="file" multiple onchange="handleImport(this.files, 'email export')" />
        </label>
      </section>
      <section class="card">
        <h3>Shared change log</h3>
        <div class="log">${log.length ? log.map(entry => `<div class="log-entry"><strong>${entry.time}</strong><p>${entry.message}</p></div>`).join('') : '<p class="kicker">No shared updates yet.</p>'}</div>
      </section>
    </div>`;
}

function renderHelp() {
  $('#helpView').innerHTML = `
    <div class="stack">
      <section class="card"><h2 class="section-title">Help</h2><p class="kicker">Offline ready support cards for addresses, phrases, and practical trip recovery.</p></section>
      <section class="grid two">
        ${trip.phraseCards.map(card => `<article class="card"><p class="kicker">${card.context}</p><h3>${card.context} phrases</h3><ul>${card.items.map(item => `<li>${item}</li>`).join('')}</ul></article>`).join('')}
      </section>
      <section class="card">
        <h3>Accommodation quick list</h3>
        <div class="list">${trip.stays.map(stay => `<article class="item"><h4>${stay.city} · ${stay.name || 'Stay'}</h4><p>${stay.address || 'Open Tickets for the saved details.'}</p>${cardLinks(stay.links || [])}</article>`).join('')}</div>
      </section>
    </div>`;
}

function setupInstall() {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    $('#installBtn').classList.remove('hidden');
  });
  $('#installBtn').addEventListener('click', async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
    $('#installBtn').classList.add('hidden');
  });
}

function setupSW() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js'));
  }
}

window.editItemPrompt = editItemPrompt;
window.renderExplore = renderExplore;
window.handleImport = handleImport;
window.exportBundle = exportBundle;
init();
