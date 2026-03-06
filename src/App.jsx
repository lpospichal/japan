import React, { useEffect, useMemo, useRef, useState } from 'react';
import JSZip from 'jszip';
import mammoth from 'mammoth/mammoth.browser';
import { SEED_TRIP } from './seedData';
import docLibrary from './docLibrary.json';

const STORAGE_KEY = 'japan-family-companion-v1';
const TABS = ['today', 'timeline', 'tickets', 'travel', 'explore', 'updates', 'help'];

function cloneSeed() {
  return JSON.parse(JSON.stringify(SEED_TRIP));
}

function loadTrip() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return cloneSeed();
    return { ...cloneSeed(), ...JSON.parse(raw) };
  } catch {
    return cloneSeed();
  }
}

function formatLongDate(dateStr) {
  const d = new Date(`${dateStr}T12:00:00`);
  return d.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

function isoToday() {
  return new Date().toISOString().slice(0, 10);
}

function pickInitialDate(days) {
  const today = isoToday();
  const dates = days.map((d) => d.date).sort();
  const upcoming = dates.find((d) => d >= today);
  return upcoming || dates[0];
}

function classNames(...parts) {
  return parts.filter(Boolean).join(' ');
}

function compactText(value = '') {
  return value.replace(/\s+/g, ' ').trim();
}

function extractUrls(text = '') {
  const matches = text.match(/https?:\/\/[^\s)]+/g) || [];
  return [...new Set(matches)].slice(0, 12);
}

function extractDates(text = '') {
  const matches = text.match(/(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2}(?:,\s*\d{4})?|\d{4}-\d{2}-\d{2}|\b\d{1,2}:\d{2}\b/g) || [];
  return [...new Set(matches)].slice(0, 10);
}

function extractCodes(text = '') {
  const matches = text.match(/(?:reservation|reference|confirmation|booking|pin|code)\s*(?:number|no\.?|#|:)?\s*([A-Z0-9-]{4,})/gi) || [];
  return [...new Set(matches)].slice(0, 8);
}

function looksLikeBooking(text = '') {
  return /(reservation|check-?in|check-?out|room|flight|ticket|seat|hotel|shinkansen|museum|qr code|confirmation)/i.test(text);
}

function todayStatus(day) {
  const today = isoToday();
  if (day.date === today) return 'today';
  if (day.date > today) return 'upcoming';
  return 'past';
}

function downloadFile(filename, content, type = 'application/json') {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function App() {
  const [trip, setTrip] = useState(loadTrip);
  const [tab, setTab] = useState('today');
  const [selectedDate, setSelectedDate] = useState(() => pickInitialDate(loadTrip().days));
  const [editing, setEditing] = useState(null);
  const [importResults, setImportResults] = useState([]);
  const [busyImport, setBusyImport] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trip));
  }, [trip]);

  useEffect(() => {
    if (!trip.days.find((d) => d.date === selectedDate)) {
      setSelectedDate(pickInitialDate(trip.days));
    }
  }, [trip.days, selectedDate]);

  const currentDay = useMemo(() => trip.days.find((d) => d.date === selectedDate) || trip.days[0], [trip.days, selectedDate]);
  const currentStay = trip.stays.find((s) => s.id === currentDay?.hotelId);
  const currentTravelLeg = trip.travelLegs.find((leg) => leg.date === selectedDate);
  const todayReminders = trip.reminders.filter((item) => item.date === selectedDate);

  const groupedAttractions = useMemo(() => groupBy(trip.attractions, 'city'), [trip.attractions]);
  const groupedFood = useMemo(() => groupBy(trip.foodSpots, 'city'), [trip.foodSpots]);
  const docsByFolder = useMemo(() => {
    const groups = {};
    for (const doc of docLibrary) {
      const [folder] = doc.path.includes('/') ? doc.path.split('/') : ['Trip-wide'];
      const key = doc.path.includes('/') ? folder : 'Trip-wide';
      if (!groups[key]) groups[key] = [];
      groups[key].push(doc);
    }
    return groups;
  }, []);

  const applyUpdate = (updater, logNote = 'Updated trip data') => {
    setTrip((prev) => {
      const next = updater(structuredClone ? structuredClone(prev) : JSON.parse(JSON.stringify(prev)));
      next.changeLog = [
        {
          id: `log-${Date.now()}`,
          at: new Date().toLocaleString(),
          note: logNote
        },
        ...(next.changeLog || [])
      ];
      return next;
    });
  };

  const handleImport = async (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    setBusyImport(true);
    try {
      const proposals = [];
      for (const file of files) {
        const result = await parseFile(file);
        proposals.push(result);
      }
      setImportResults(proposals);
      setTab('updates');
    } finally {
      setBusyImport(false);
      event.target.value = '';
    }
  };

  const approveImport = (proposal) => {
    applyUpdate((draft) => {
      if (proposal.kind === 'bundle' && proposal.bundleState) {
        Object.assign(draft, proposal.bundleState);
      } else {
        draft.inbox = [
          {
            id: proposal.id,
            title: proposal.name,
            summary: proposal.summary,
            kind: proposal.kind,
            detectedDates: proposal.detectedDates,
            detectedLinks: proposal.detectedLinks,
            detectedCodes: proposal.detectedCodes,
            preview: proposal.preview,
            importedAt: new Date().toLocaleString()
          },
          ...draft.inbox
        ];
        if (proposal.bookingLike) {
          draft.bookings = [
            {
              id: `booking-${Date.now()}`,
              kind: 'Imported',
              title: proposal.suggestedTitle || proposal.name,
              date: proposal.detectedDates?.find((d) => /^\d{4}-\d{2}-\d{2}$/.test(d)) || proposal.detectedDates?.[0] || 'Review import',
              time: proposal.detectedDates?.find((d) => /^\d{1,2}:\d{2}$/.test(d)) || 'Check file',
              location: proposal.detectedLinks?.[0] || 'Imported document',
              code: proposal.detectedCodes?.[0] || 'See imported file',
              details: proposal.summary,
              reveal: proposal.preview
            },
            ...draft.bookings
          ];
        }
      }
      draft.updatesHistory = [
        {
          id: proposal.id,
          importedAt: new Date().toLocaleString(),
          ...proposal,
          approved: true
        },
        ...(draft.updatesHistory || [])
      ];
      return draft;
    }, `Imported ${proposal.name}`);
    setImportResults((prev) => prev.filter((item) => item.id !== proposal.id));
  };

  const dismissImport = (proposalId) => setImportResults((prev) => prev.filter((item) => item.id !== proposalId));

  const exportBundle = () => {
    downloadFile('japan-family-companion-bundle.json', JSON.stringify(trip, null, 2));
  };

  const resetTrip = () => {
    if (!window.confirm('Reset the app back to the seeded Japan archive version?')) return;
    const fresh = cloneSeed();
    setTrip(fresh);
    setSelectedDate(pickInitialDate(fresh.days));
  };

  const saveEdit = (collection, item) => {
    applyUpdate((draft) => {
      draft[collection] = draft[collection].map((entry) => (entry.id === item.id ? item : entry));
      return draft;
    }, `Edited ${item.title || item.name || item.id}`);
    setEditing(null);
  };

  return (
    <div className="app-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">Japan Family Companion</p>
          <h1>{trip.meta.title}</h1>
          <p className="hero-copy">Shared trip workspace with calm ops tools, richer companion cards, offline support, and a manual import path for future email exports and updated trip bundles.</p>
        </div>
        <div className="hero-side">
          <div className="status-pill">Installable PWA</div>
          <div className="status-pill">Offline ready</div>
          <div className="status-pill">Shared by bundle import/export</div>
        </div>
      </header>

      <section className="date-strip">
        <div className="date-strip-head">
          <div>
            <h2>Trip timeline</h2>
            <p>{trip.meta.subtitle}</p>
          </div>
          <div className="date-actions">
            <button className="ghost-btn" onClick={() => fileRef.current?.click()}>{busyImport ? 'Reading files...' : 'Import update'}</button>
            <button className="ghost-btn" onClick={exportBundle}>Export shared bundle</button>
          </div>
        </div>
        <div className="date-chip-row">
          {trip.days.map((day) => (
            <button
              key={day.id}
              onClick={() => setSelectedDate(day.date)}
              className={classNames('date-chip', selectedDate === day.date && 'active', todayStatus(day))}
            >
              <span>{new Date(`${day.date}T12:00:00`).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
              <small>{day.city}</small>
            </button>
          ))}
        </div>
      </section>

      <nav className="tabbar">
        {TABS.map((entry) => (
          <button key={entry} className={classNames('tab-btn', tab === entry && 'active')} onClick={() => setTab(entry)}>
            {labelForTab(entry)}
          </button>
        ))}
      </nav>

      <main className="content-grid">
        {tab === 'today' && (
          <TodayView
            trip={trip}
            day={currentDay}
            stay={currentStay}
            leg={currentTravelLeg}
            reminders={todayReminders}
            onEdit={(item) => setEditing({ collection: 'days', item })}
          />
        )}
        {tab === 'timeline' && <TimelineView days={trip.days} stays={trip.stays} onEdit={(item) => setEditing({ collection: 'days', item })} />}
        {tab === 'tickets' && <TicketsView bookings={trip.bookings} stays={trip.stays} onEdit={setEditing} />}
        {tab === 'travel' && <TravelView legs={trip.travelLegs} onEdit={(item) => setEditing({ collection: 'travelLegs', item })} />}
        {tab === 'explore' && (
          <ExploreView
            attractions={trip.attractions}
            food={trip.foodSpots}
            phrases={trip.phraseCards}
            docsByFolder={docsByFolder}
            groupedAttractions={groupedAttractions}
            groupedFood={groupedFood}
            onEdit={setEditing}
          />
        )}
        {tab === 'updates' && (
          <UpdatesView
            importResults={importResults}
            inbox={trip.inbox}
            history={trip.updatesHistory}
            changeLog={trip.changeLog}
            onApprove={approveImport}
            onDismiss={dismissImport}
            onOpenFilePicker={() => fileRef.current?.click()}
            onExport={exportBundle}
            onReset={resetTrip}
          />
        )}
        {tab === 'help' && <HelpView trip={trip} />}
      </main>

      <input ref={fileRef} type="file" multiple hidden onChange={handleImport} accept=".json,.zip,.docx,.pdf,.html,.htm,.eml,.mbox,.txt,.jpg,.jpeg,.png,.webp" />

      {editing && (
        <EditModal
          item={editing.item}
          collection={editing.collection}
          onClose={() => setEditing(null)}
          onSave={(item) => saveEdit(editing.collection, item)}
        />
      )}
    </div>
  );
}

function TodayView({ trip, day, stay, leg, reminders, onEdit }) {
  return (
    <section className="pane two-column">
      <div className="stack">
        <div className="card highlight-card">
          <div className="card-topline">Today</div>
          <div className="title-row">
            <div>
              <h2>{day.title}</h2>
              <p className="muted">{formatLongDate(day.date)} · {day.city}</p>
            </div>
            <button className="mini-btn" onClick={() => onEdit(day)}>Edit</button>
          </div>
          <p>{day.focus}</p>
          <div className="info-grid">
            <InfoBlock label="Leave by" value={day.leaveBy || 'Flexible'} />
            <InfoBlock label="Hotel" value={stay?.title || 'Not set'} />
            <InfoBlock label="Backup" value={day.backup} />
            <InfoBlock label="Blossom note" value={day.blossom} />
          </div>
        </div>

        <div className="card">
          <h3>Must happen</h3>
          <Checklist items={day.fixed} />
        </div>

        <div className="card split-card">
          <div>
            <h3>Flexible branch points</h3>
            <Checklist items={day.optional} emptyText="No optional items for this day." />
          </div>
          <div>
            <h3>Food on route</h3>
            <Checklist items={day.food} emptyText="No meal notes yet." />
          </div>
        </div>
      </div>

      <div className="stack">
        <div className="card ops-card">
          <div className="card-topline">Ops</div>
          <h3>Stay details</h3>
          <p className="muted strong">{stay?.title}</p>
          <p>{stay?.note}</p>
          <Checklist items={stay?.ops || []} emptyText="No stay ops notes." />
          {stay?.sensitive && <RevealBlock title="Sensitive details" text={stay.sensitive} />}
        </div>

        <div className="card ops-card">
          <div className="card-topline">Travel</div>
          <h3>Today’s major move</h3>
          {leg ? (
            <>
              <p className="muted strong">{leg.title}</p>
              <p>{leg.note}</p>
              <Checklist items={leg.steps} />
              <InfoBlock label="Backup path" value={leg.backup} />
            </>
          ) : (
            <p>No intercity leg today. Stay focused on the route cluster and the calm version of the day.</p>
          )}
        </div>

        <div className="card warm-card">
          <div className="card-topline">Shared reminders</div>
          <h3>Things not to forget</h3>
          <Checklist items={reminders.map((r) => `${r.title}: ${r.note}`)} emptyText="No special reminders on this day." />
        </div>
      </div>
    </section>
  );
}

function TimelineView({ days, stays, onEdit }) {
  return (
    <section className="pane stack">
      {days.map((day) => {
        const stay = stays.find((s) => s.id === day.hotelId);
        return (
          <article key={day.id} className="card timeline-card">
            <div className="timeline-left">
              <div className="date-pill">{formatLongDate(day.date)}</div>
              <div className="city-chip">{day.city}</div>
            </div>
            <div className="timeline-main">
              <div className="title-row">
                <div>
                  <h3>{day.title}</h3>
                  <p className="muted">{day.focus}</p>
                </div>
                <button className="mini-btn" onClick={() => onEdit(day)}>Edit</button>
              </div>
              <div className="info-grid">
                <InfoBlock label="Stay" value={stay?.title || 'Not set'} />
                <InfoBlock label="Leave by" value={day.leaveBy || 'Flexible'} />
                <InfoBlock label="Backup" value={day.backup} />
              </div>
              <div className="split-card compact-split">
                <div>
                  <h4>Fixed</h4>
                  <Checklist items={day.fixed} />
                </div>
                <div>
                  <h4>Optional</h4>
                  <Checklist items={day.optional} emptyText="No optional branch points." />
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}

function TicketsView({ bookings, stays, onEdit }) {
  return (
    <section className="pane stack">
      <div className="card banner-card">
        <h2>Tickets and stays vault</h2>
        <p>Keep the practical details here. Sensitive items stay hidden until revealed, and future email exports can be merged from the Updates tab.</p>
      </div>
      {bookings.map((item) => (
        <article key={item.id} className="card">
          <div className="title-row">
            <div>
              <div className="card-topline">{item.kind}</div>
              <h3>{item.title}</h3>
            </div>
            <button className="mini-btn" onClick={() => onEdit({ collection: 'bookings', item })}>Edit</button>
          </div>
          <div className="info-grid">
            <InfoBlock label="Date" value={item.date} />
            <InfoBlock label="Time" value={item.time} />
            <InfoBlock label="Where" value={item.location} />
            <InfoBlock label="Code" value={item.code} />
          </div>
          <p>{item.details}</p>
          {item.reveal && <RevealBlock title="Reveal sensitive or pending detail" text={item.reveal} />}
        </article>
      ))}

      <div className="card">
        <h3>Stay cards</h3>
        <div className="grid-two">
          {stays.map((stay) => (
            <article key={stay.id} className="mini-panel">
              <div className="title-row small-gap">
                <div>
                  <div className="card-topline">{stay.city}</div>
                  <h4>{stay.title}</h4>
                </div>
                <button className="mini-btn" onClick={() => onEdit({ collection: 'stays', item: stay })}>Edit</button>
              </div>
              <p className="muted">{stay.dates}</p>
              <p>{stay.note}</p>
              <Checklist items={stay.ops} />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function TravelView({ legs, onEdit }) {
  return (
    <section className="pane stack">
      {legs.map((leg) => (
        <article key={leg.id} className="card">
          <div className="title-row">
            <div>
              <div className="card-topline">{formatLongDate(leg.date)}</div>
              <h3>{leg.title}</h3>
              <p className="muted">{leg.from} → {leg.to} · {leg.duration}</p>
            </div>
            <button className="mini-btn" onClick={() => onEdit(leg)}>Edit</button>
          </div>
          <div className="split-card compact-split">
            <div>
              <h4>Steps</h4>
              <Checklist items={leg.steps} />
            </div>
            <div>
              <h4>Ops notes</h4>
              <InfoBlock label="Booking source" value={leg.bookingSource} />
              <InfoBlock label="Backup" value={leg.backup} />
              <InfoBlock label="Why this matters" value={leg.note} />
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}

function ExploreView({ attractions, food, phrases, docsByFolder, groupedAttractions, groupedFood, onEdit }) {
  const [section, setSection] = useState('attractions');
  const [search, setSearch] = useState('');
  const filteredDocs = useMemo(() => {
    const all = Object.entries(docsByFolder).flatMap(([folder, docs]) => docs.map((doc) => ({ ...doc, folder })));
    if (!search.trim()) return all;
    const q = search.toLowerCase();
    return all.filter((doc) => `${doc.title} ${doc.snippet} ${doc.path}`.toLowerCase().includes(q));
  }, [docsByFolder, search]);

  return (
    <section className="pane stack">
      <div className="subtab-bar">
        {['attractions', 'food', 'phrases', 'sources'].map((entry) => (
          <button key={entry} className={classNames('subtab-btn', section === entry && 'active')} onClick={() => setSection(entry)}>{capitalize(entry)}</button>
        ))}
      </div>

      {section === 'attractions' && (
        <>
          {Object.entries(groupedAttractions).map(([city, items]) => (
            <div className="card" key={city}>
              <div className="title-row">
                <div>
                  <div className="card-topline">{city}</div>
                  <h3>Attraction cards</h3>
                </div>
              </div>
              <div className="grid-two">
                {items.map((item) => (
                  <article key={item.id} className="story-card">
                    <div className="story-hero"><span>{city[0]}</span></div>
                    <div className="title-row small-gap">
                      <div>
                        <h4>{item.title}</h4>
                        <p className="muted">{item.category}</p>
                      </div>
                      <button className="mini-btn" onClick={() => onEdit({ collection: 'attractions', item })}>Edit</button>
                    </div>
                    <InfoBlock label="Ops" value={item.ops} />
                    <InfoBlock label="Best when" value={item.bestWhen} />
                    <InfoBlock label="Companion note" value={item.story} />
                    <InfoBlock label="Best tip" value={item.tip} />
                  </article>
                ))}
              </div>
            </div>
          ))}
        </>
      )}

      {section === 'food' && (
        <>
          {Object.entries(groupedFood).map(([city, items]) => (
            <div className="card" key={city}>
              <div className="card-topline">{city}</div>
              <h3>Food on route</h3>
              <div className="grid-two">
                {items.map((item) => (
                  <article key={item.id} className="mini-panel">
                    <div className="title-row small-gap">
                      <div>
                        <h4>{item.title}</h4>
                        <p className="muted">{item.route}</p>
                      </div>
                      <button className="mini-btn" onClick={() => onEdit({ collection: 'foodSpots', item })}>Edit</button>
                    </div>
                    <InfoBlock label="Why it fits" value={item.why} />
                    <InfoBlock label="Try" value={item.try} />
                    <InfoBlock label="Effort" value={item.effort} />
                    <InfoBlock label="Note" value={item.note} />
                  </article>
                ))}
              </div>
            </div>
          ))}
        </>
      )}

      {section === 'phrases' && (
        <div className="grid-two">
          {phrases.map((item) => (
            <article key={item.id} className="card">
              <div className="card-topline">{item.category}</div>
              <h3>{item.en}</h3>
              <p className="jp-line">{item.jp}</p>
              <p className="muted">{item.romaji}</p>
              <p>{item.use}</p>
            </article>
          ))}
        </div>
      )}

      {section === 'sources' && (
        <>
          <div className="card banner-card">
            <h3>Trip notes library from the uploaded archive</h3>
            <p>This is a browsable view of the 46 source documents already folded into the app. Use the search to rediscover restaurant lists, route notes, phrase collections, and external links you saved for the trip.</p>
            <input className="search-input" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search source notes" />
          </div>
          <div className="grid-two">
            {filteredDocs.map((doc) => (
              <article key={doc.path} className="mini-panel">
                <div className="card-topline">{doc.folder}</div>
                <h4>{doc.title}</h4>
                <p className="muted small-text">{doc.path}</p>
                <p>{doc.snippet || 'No preview text found.'}</p>
                <p className="muted small-text">Saved links: {doc.linkCount}</p>
                {!!doc.links?.length && (
                  <details>
                    <summary>Show saved links</summary>
                    <ul className="link-list">
                      {doc.links.map((link) => (
                        <li key={link}><a href={link} target="_blank" rel="noreferrer">{link}</a></li>
                      ))}
                    </ul>
                  </details>
                )}
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  );
}

function UpdatesView({ importResults, inbox, history, changeLog, onApprove, onDismiss, onOpenFilePicker, onExport, onReset }) {
  return (
    <section className="pane stack">
      <div className="card banner-card">
        <h2>Manual update pathway</h2>
        <p>Upload future email exports, updated planning bundles, ticket PDFs, or screenshots here. The app will propose a merge, then any family member can approve it. Because this first build is local first, use Export shared bundle to sync the latest trip state across phones.</p>
        <div className="date-actions">
          <button className="ghost-btn" onClick={onOpenFilePicker}>Import update</button>
          <button className="ghost-btn" onClick={onExport}>Export shared bundle</button>
          <button className="ghost-btn danger" onClick={onReset}>Reset to seeded version</button>
        </div>
      </div>

      {!!importResults.length && (
        <div className="stack">
          <h3>Pending import review</h3>
          {importResults.map((proposal) => (
            <article key={proposal.id} className="card">
              <div className="title-row">
                <div>
                  <div className="card-topline">{proposal.kind}</div>
                  <h3>{proposal.name}</h3>
                </div>
                <div className="date-actions">
                  <button className="mini-btn" onClick={() => onApprove(proposal)}>Approve</button>
                  <button className="mini-btn secondary" onClick={() => onDismiss(proposal.id)}>Dismiss</button>
                </div>
              </div>
              <p>{proposal.summary}</p>
              <div className="info-grid">
                <InfoBlock label="Detected dates" value={proposal.detectedDates?.join(' · ') || 'None found'} />
                <InfoBlock label="Detected codes" value={proposal.detectedCodes?.join(' · ') || 'None found'} />
                <InfoBlock label="Detected links" value={proposal.detectedLinks?.slice(0, 3).join(' · ') || 'None found'} />
                <InfoBlock label="Booking-like" value={proposal.bookingLike ? 'Yes' : 'No'} />
              </div>
              <details>
                <summary>Preview</summary>
                <p className="preview-text">{proposal.preview}</p>
              </details>
            </article>
          ))}
        </div>
      )}

      <div className="card">
        <h3>Imported inbox</h3>
        {inbox.length ? (
          <div className="stack small-stack">
            {inbox.map((item) => (
              <article key={item.id} className="mini-panel">
                <div className="title-row small-gap">
                  <div>
                    <div className="card-topline">{item.kind}</div>
                    <h4>{item.title}</h4>
                  </div>
                  <span className="muted small-text">{item.importedAt}</span>
                </div>
                <p>{item.summary}</p>
                <p className="muted small-text">{item.preview}</p>
              </article>
            ))}
          </div>
        ) : (
          <p>No imported review items yet.</p>
        )}
      </div>

      <div className="grid-two">
        <div className="card">
          <h3>Import history</h3>
          <Checklist items={history.map((item) => `${item.importedAt}: ${item.name}`)} emptyText="Nothing imported yet." />
        </div>
        <div className="card">
          <h3>Shared change log</h3>
          <Checklist items={changeLog.map((item) => `${item.at}: ${item.note}`)} emptyText="No logged changes yet." />
        </div>
      </div>
    </section>
  );
}

function HelpView({ trip }) {
  return (
    <section className="pane stack">
      <div className="card banner-card">
        <h2>Help and calm fallback tools</h2>
        <p>This screen keeps the practical rescue information available offline, even when the family is tired or signal is weak.</p>
      </div>
      <div className="grid-two">
        <div className="card">
          <h3>When something goes wrong</h3>
          <Checklist
            items={[
              'Missed train: open Travel, find the current leg, and use the backup path note first.',
              'Late to a stay: open Tickets and reveal the stay details before calling or messaging the property.',
              'Too tired for the plan: on Today, follow the backup version and preserve only the highest-value item.',
              'Lost in a station: show the phrase card “We are looking for this place” with the saved address or station name.',
              'Need to sync other phones: export the latest shared bundle from Updates and import it on the other devices.'
            ]}
          />
        </div>
        <div className="card">
          <h3>Shared quick facts</h3>
          <Checklist
            items={[
              `Trip dates: ${trip.meta.startDate} to ${trip.meta.endDate}`,
              'Kyoto days are early-start critical. Prepare the night before.',
              'Apr 3 should stay emotionally generous so the final sakura night still feels good.',
              'Sensitive hotel access details remain behind reveal toggles in Tickets and Today.',
              'Manual import is the main path for future email exports and updated trip bundles.'
            ]}
          />
        </div>
      </div>
    </section>
  );
}

function EditModal({ item, collection, onClose, onSave }) {
  const [draft, setDraft] = useState(() => ({ ...item }));
  const update = (key, value) => setDraft((prev) => ({ ...prev, [key]: value }));

  const arrayField = (key) => (
    <label className="field">
      <span>{humanize(key)}</span>
      <textarea value={(draft[key] || []).join('\n')} onChange={(e) => update(key, e.target.value.split('\n').map((line) => compactText(line)).filter(Boolean))} rows={4} />
    </label>
  );

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="title-row">
          <div>
            <div className="card-topline">Edit {collection}</div>
            <h3>{item.title || item.name || item.id}</h3>
          </div>
          <button className="mini-btn secondary" onClick={onClose}>Close</button>
        </div>
        <div className="modal-grid">
          {Object.entries(draft)
            .filter(([key]) => key !== 'id' && key !== 'hotelId')
            .map(([key, value]) =>
              Array.isArray(value) ? (
                <React.Fragment key={key}>{arrayField(key)}</React.Fragment>
              ) : (
                <label className="field" key={key}>
                  <span>{humanize(key)}</span>
                  {String(value || '').length > 90 ? (
                    <textarea value={value || ''} onChange={(e) => update(key, e.target.value)} rows={4} />
                  ) : (
                    <input value={value || ''} onChange={(e) => update(key, e.target.value)} />
                  )}
                </label>
              )
            )}
        </div>
        <div className="date-actions">
          <button className="ghost-btn" onClick={() => onSave(draft)}>Save changes</button>
        </div>
      </div>
    </div>
  );
}

function InfoBlock({ label, value }) {
  return (
    <div className="info-block">
      <span>{label}</span>
      <strong>{value || '—'}</strong>
    </div>
  );
}

function RevealBlock({ title, text }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="reveal-block">
      <button className="reveal-btn" onClick={() => setOpen((v) => !v)}>{open ? 'Hide' : 'Reveal'} {title}</button>
      {open && <p className="preview-text">{text}</p>}
    </div>
  );
}

function Checklist({ items = [], emptyText = 'Nothing added yet.' }) {
  if (!items?.length) return <p className="muted">{emptyText}</p>;
  return (
    <ul className="checklist">
      {items.map((item, index) => (
        <li key={`${index}-${item}`}>{item}</li>
      ))}
    </ul>
  );
}

function groupBy(items, key) {
  return items.reduce((acc, item) => {
    const bucket = item[key] || 'Other';
    acc[bucket] = acc[bucket] || [];
    acc[bucket].push(item);
    return acc;
  }, {});
}

function humanize(key) {
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase());
}

function labelForTab(tab) {
  return {
    today: 'Today',
    timeline: 'Timeline',
    tickets: 'Tickets',
    travel: 'Travel',
    explore: 'Explore',
    updates: 'Updates',
    help: 'Help'
  }[tab];
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

async function parseFile(file) {
  const ext = file.name.split('.').pop()?.toLowerCase();
  const base = {
    id: `import-${crypto.randomUUID()}`,
    name: file.name,
    kind: 'file',
    summary: 'Imported file ready for review.',
    detectedDates: [],
    detectedLinks: [],
    detectedCodes: [],
    bookingLike: false,
    preview: ''
  };

  if (ext === 'json') {
    const text = await file.text();
    try {
      const parsed = JSON.parse(text);
      if (parsed?.days && parsed?.bookings) {
        return {
          ...base,
          kind: 'bundle',
          summary: 'Recognized an exported trip bundle. Approving it will replace the current local state with this bundle.',
          preview: compactText(text).slice(0, 600),
          bundleState: parsed,
          detectedDates: parsed.days.slice(0, 8).map((d) => d.date),
          bookingLike: true,
          suggestedTitle: 'Imported trip bundle'
        };
      }
      return summarizeText(base, text, 'json');
    } catch {
      return { ...base, kind: 'json', summary: 'This JSON file could not be parsed.', preview: text.slice(0, 400) };
    }
  }

  if (ext === 'docx') {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return summarizeText({ ...base, kind: 'docx' }, result.value, 'docx');
  }

  if (ext === 'zip') {
    const zip = await JSZip.loadAsync(file);
    const names = Object.keys(zip.files).filter((name) => !zip.files[name].dir).slice(0, 50);
    let previewParts = [];
    for (const name of names.slice(0, 5)) {
      const entry = zip.files[name];
      if (name.toLowerCase().endsWith('.docx')) {
        const arrayBuffer = await entry.async('arraybuffer');
        const result = await mammoth.extractRawText({ arrayBuffer });
        previewParts.push(`${name}: ${result.value.slice(0, 350)}`);
      } else if (/\.(txt|html|htm|eml|mbox|md)$/i.test(name)) {
        const text = await entry.async('text');
        previewParts.push(`${name}: ${text.slice(0, 350)}`);
      }
    }
    const bundlePreview = `Zip contains ${names.length} files. ${previewParts.join(' ')}`;
    return summarizeText({ ...base, kind: 'zip' }, bundlePreview, 'zip');
  }

  if (['html', 'htm', 'eml', 'mbox', 'txt', 'md'].includes(ext)) {
    const text = await file.text();
    return summarizeText({ ...base, kind: ext }, text, ext);
  }

  if (['pdf', 'jpg', 'jpeg', 'png', 'webp'].includes(ext)) {
    return {
      ...base,
      kind: ext,
      summary: `Stored ${ext.toUpperCase()} file for manual review. This first build records metadata and keeps the file ready to be paired with imported notes or email exports.`,
      preview: `${file.name} · ${(file.size / 1024).toFixed(1)} KB`,
      bookingLike: /ticket|reservation|hotel|flight/i.test(file.name)
    };
  }

  const text = await file.text().catch(() => '');
  return summarizeText(base, text || file.name, ext || 'file');
}

function summarizeText(base, text, kind) {
  const clean = compactText(text || '');
  const detectedLinks = extractUrls(clean);
  const detectedDates = extractDates(clean);
  const detectedCodes = extractCodes(clean);
  const bookingLike = looksLikeBooking(clean) || /reservation|ticket|hotel|flight/i.test(base.name);
  return {
    ...base,
    kind,
    summary: bookingLike
      ? 'This file looks booking-related and is a good candidate to merge into the trip vault.'
      : 'This file looks like planning or reference material and can be added to the shared imported inbox.',
    detectedLinks,
    detectedDates,
    detectedCodes,
    bookingLike,
    suggestedTitle: clean.split(/[.!?\n]/).find(Boolean)?.slice(0, 80) || base.name,
    preview: clean.slice(0, 1000)
  };
}

export default App;
