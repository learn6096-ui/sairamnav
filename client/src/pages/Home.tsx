import { useEffect, useMemo, useState } from "react";
import {
  ArrowDown,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  ExternalLink,
  Flame,
  MapPin,
  Menu,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  SunMedium,
  X,
} from "lucide-react";

type ScheduleItem = {
  id: number;
  day: number;
  month: string;
  dateLabel: string;
  isoDate: string;
  weekday: string;
  time?: string;
  host: string;
  address: string;
  mapUrl: string;
  note: string;
  color: string;
  colorName: string;
};

const scheduleSeed: ScheduleItem[] = [
  { id: 1, day: 11, month: "OCT", dateLabel: "11 OCT 2026", isoDate: "2026-10-11", weekday: "Sunday", host: "Smt. Vijaya", address: "J-212", mapUrl: "https://maps.app.goo.gl/L5DQQWvdCVXtma5BA", note: "May every note become a small flame of joy.", color: "#f0c419", colorName: "Sun gold" },
  { id: 2, day: 12, month: "OCT", dateLabel: "12 OCT 2026", isoDate: "2026-10-12", weekday: "Monday", host: "Smt. Udaya", address: "Pratham Apartments", mapUrl: "https://maps.app.goo.gl/GTAJ6SSbQiS1PExi9", note: "A gentle evening of gratitude and togetherness.", color: "#f3a6b9", colorName: "Lotus pink" },
  { id: 3, day: 13, month: "OCT", dateLabel: "13 OCT 2026", isoDate: "2026-10-13", weekday: "Tuesday", host: "Smt. Thulasi", address: "K-109", mapUrl: "https://maps.app.goo.gl/M9fpvzrmtJUkvASH7", note: "Let the rhythm of bhajan steady the heart.", color: "#d33b4b", colorName: "Vermilion" },
  { id: 4, day: 14, month: "OCT", dateLabel: "14 OCT 2026", isoDate: "2026-10-14", weekday: "Wednesday", host: "Smt. Sudha", address: "M.S. Palya", mapUrl: "https://maps.app.goo.gl/zeNYhFdWYyF3qaSu5?g_st=ac", note: "In every chorus, a prayer for peace.", color: "#6aa9dc", colorName: "Sky blue" },
  { id: 5, day: 15, month: "OCT", dateLabel: "15 OCT 2026", isoDate: "2026-10-15", weekday: "Thursday", host: "Sri. Rajeshwari", address: "Dasarahalli", mapUrl: "https://maps.app.goo.gl/1a67nFjGELY7ssGe9?g_st=aw", note: "A mid-festival pause to breathe and receive.", color: "#f7a643", colorName: "Marigold" },
  { id: 6, day: 16, month: "OCT", dateLabel: "16 OCT 2026", isoDate: "2026-10-16", weekday: "Friday", host: "Smt. Nirupama", address: "L-101", mapUrl: "https://maps.app.goo.gl/T8rboDFYU3fXtDzt7", note: "May devotion soften the edges of the day.", color: "#8b5bb8", colorName: "Royal violet" },
  { id: 7, day: 17, month: "OCT", dateLabel: "17 OCT 2026", isoDate: "2026-10-17", weekday: "Saturday", host: "Smt. Parvathi", address: "Dasarahalli", mapUrl: "https://maps.app.goo.gl/wQT7LeoStvRUwP8U9", note: "Together, we carry the light a little farther.", color: "#2a9d8f", colorName: "Sacred teal" },
  { id: 8, day: 18, month: "OCT", dateLabel: "18 OCT 2026", isoDate: "2026-10-18", weekday: "Sunday", host: "Smt. Gayathri", address: "C-306", mapUrl: "https://maps.app.goo.gl/oWwavQHufm5qGAt86", note: "A Sunday offering of melody, silence and love.", color: "#e7d9be", colorName: "Ivory" },
  { id: 9, day: 19, month: "OCT", dateLabel: "19 OCT 2026", isoDate: "2026-10-19", weekday: "Monday", host: "Smt. Lalitha", address: "Vidyaranyapura", mapUrl: "https://goo.gl/maps/HKc7HRszx7jF3vSS6?g_st=aw", note: "The final bhajan evening before we walk together.", color: "#e07248", colorName: "Coral flame" },
  { id: 10, day: 20, month: "OCT", dateLabel: "20 OCT 2026", isoDate: "2026-10-20", weekday: "Tuesday", time: "Tuesday Morning Bhajans", host: "Tuesday Morning Bhajans · Nagar Sankeertan", address: "Sai Nilayam", mapUrl: "https://maps.app.goo.gl/C2VZxTQHJXHNrT116", note: "Tuesday morning bhajans: sacred chanting to greet the dawn together.", color: "#c9973c", colorName: "Temple brass" },
];

const getDayState = (isoDate: string) => {
  const today = new Date();
  const localToday = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const itemDate = new Date(`${isoDate}T00:00:00`).getTime();
  if (itemDate === localToday) return "today";
  return itemDate < localToday ? "past" : "upcoming";
};

// Check if 24 hours have elapsed for this event (event ends at 8:00 PM)
const isPast24Hours = (isoDate: string) => {
  const now = new Date().getTime();
  const eventEndTime = new Date(`${isoDate}T20:00:00`).getTime();
  return now >= eventEndTime;
};

export default function Home() {
  const [welcomeOpen, setWelcomeOpen] = useState(true);
  const [welcomeFading, setWelcomeFading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const schedule = scheduleSeed;

  // Automatically showcase the card based on current date & day
  const [selectedId, setSelectedId] = useState<number>(() => {
    const todayCard = scheduleSeed.find((item) => getDayState(item.isoDate) === "today");
    if (todayCard) return todayCard.id;
    const now = new Date().getTime();
    const firstDay = new Date(`${scheduleSeed[0].isoDate}T00:00:00`).getTime();
    if (now < firstDay) return 1;
    return scheduleSeed[scheduleSeed.length - 1].id;
  });

  const [cardAnimating, setCardAnimating] = useState(false);
  const [chanting, setChanting] = useState(false);
  const [chantCount, setChantCount] = useState(0);
  const [chantComplete, setChantComplete] = useState(false);

  // Manual done state overrides (persisted to localStorage)
  const [manualDone, setManualDone] = useState<Record<number, boolean>>(() => {
    try {
      const saved = localStorage.getItem("sai_done_items");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const isItemDone = (item: ScheduleItem) => {
    if (manualDone[item.id] !== undefined) {
      return manualDone[item.id];
    }
    return isPast24Hours(item.isoDate);
  };

  const toggleItemDone = (id: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setManualDone((prev) => {
      const item = schedule.find((s) => s.id === id);
      const current = prev[id] !== undefined ? prev[id] : (item ? isPast24Hours(item.isoDate) : false);
      const next = { ...prev, [id]: !current };
      try {
        localStorage.setItem("sai_done_items", JSON.stringify(next));
      } catch { }
      return next;
    });
  };

  const completedCount = useMemo(
    () => schedule.filter((item) => isItemDone(item)).length,
    [schedule, manualDone]
  );
  const progressPercent = Math.round((completedCount / schedule.length) * 100);

  const selected = useMemo(
    () => schedule.find((item) => item.id === selectedId) ?? schedule[0],
    [schedule, selectedId],
  );

  useEffect(() => {
    if (!chanting) return;
    const timer = window.setInterval(() => {
      setChantCount((current) => {
        if (current >= 3) {
          setChanting(false);
          setChantComplete(true);
          return 3;
        }
        return current + 1;
      });
    }, 2300);
    return () => window.clearInterval(timer);
  }, [chanting]);

  const closeWelcome = () => {
    setWelcomeFading(true);
    window.setTimeout(() => {
      setWelcomeOpen(false);
      setWelcomeFading(false);
    }, 700);
  };

  useEffect(() => {
    const timer = window.setTimeout(() => closeWelcome(), 5000);
    return () => window.clearTimeout(timer);
  }, []);

  const changeCard = (newId: number) => {
    setCardAnimating(true);
    window.setTimeout(() => {
      setSelectedId(newId);
      window.setTimeout(() => setCardAnimating(false), 50);
    }, 400);
  };

  // Auto-transition to showcase each card in order every 6.5s
  useEffect(() => {
    const timer = window.setInterval(() => {
      setSelectedId((currentId) => {
        const currentIndex = scheduleSeed.findIndex((item) => item.id === currentId);
        const nextId = scheduleSeed[(currentIndex + 1) % scheduleSeed.length].id;
        setCardAnimating(true);
        window.setTimeout(() => setCardAnimating(false), 50);
        return nextId;
      });
    }, 6500);
    return () => window.clearInterval(timer);
  }, []);

  const moveSelected = (direction: 1 | -1) => {
    const currentIndex = schedule.findIndex((item) => item.id === selectedId);
    const nextIndex = (currentIndex + direction + schedule.length) % schedule.length;
    changeCard(schedule[nextIndex].id);
  };

  const startChant = () => {
    setChantComplete(false);
    setChantCount(0);
    setChanting(true);
  };

  return (
    <main className="site-shell">
      <div className="ambient ambient-one" aria-hidden="true" />
      <div className="ambient ambient-two" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />

      <header className="site-header">
        <a className="brand" href="#top" aria-label="Aum Sri Sai Ram home">
          <span className="brand-mark" aria-hidden="true"><span>ॐ</span></span>
          <span className="brand-copy"><strong>Aum Sri Sai Ram</strong><small>Navarathri Bhajans · 2026</small></span>
        </a>
        <button className="menu-button" type="button" aria-expanded={menuOpen} aria-controls="main-navigation" onClick={() => setMenuOpen((open) => !open)}>
          <Menu size={18} /> <span>Menu</span>
        </button>
        <nav id="main-navigation" className={`site-nav ${menuOpen ? "is-open" : ""}`} aria-label="Main navigation">
          <a href="#invitation" onClick={() => setMenuOpen(false)}>The invitation</a>
          <a href="#schedule" onClick={() => setMenuOpen(false)}>Bhajan schedule</a>
          <a href="#prayer" onClick={() => setMenuOpen(false)}>Prayer moment</a>
          <a className="nav-cta" href="#schedule" onClick={() => setMenuOpen(false)}>Find your evening <ChevronRight size={15} /></a>
        </nav>
      </header>

      <section id="top" className="hero-section" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow"><Sparkles size={15} /> An evening of light, music & seva</p>
          <h1 id="hero-title">Nine colours.<br /><em>One sacred rhythm.</em></h1>
          <p className="hero-lede">With the choicest blessings of our Lord, come together for our annual Navarathri &amp; Dussehra Bhajans.</p>
          <div className="hero-actions">
            <a className="button button-primary" href="#schedule">Explore the evenings <ArrowDown size={16} /></a>
            <button className="text-button" type="button" onClick={() => { setWelcomeFading(false); setWelcomeOpen(true); }}><SunMedium size={17} /> Reopen welcome</button>
          </div>
          <div className="hero-meta" aria-label="Festival details">
            <div><span>11—20</span><small>October 2026</small></div>
            <div><span>7—8</span><small>in the evening</small></div>
            <div><span>10</span><small>loving gatherings</small></div>
          </div>
        </div>
        <div className="hero-art" aria-label="Sai blessing image">
          <div className="halo halo-large" />
          <div className="halo halo-small" />
          <div className="hero-photo-frame"><img className="hero-photo" src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663668025941/ymweeXQJlxicmhbY.jpg" alt="Sai Baba blessing devotees with raised hands" /></div>
        </div>
      </section>

      <section id="invitation" className="invitation-section content-section">
        <div className="section-kicker"><span>01</span><span className="kicker-line" /><span>The invitation</span></div>
        <div className="invitation-grid">
          <div>
            <h2>Come as you are.<br /><em>Leave with light.</em></h2>
          </div>
          <div className="invitation-body">
            <p className="large-copy">A bhajan is not only a song. It is a soft place to put the heart down. For ten evenings, our homes become little sanctuaries of sound, remembrance and friendship.</p>
            <p>Join us from <strong>7:00 P.M. to 8:00 P.M.</strong> each evening. Bring a flower, bring your voice, or simply bring your presence. Every offering is welcome.</p>
            <blockquote className="love-quote">“Love All, Serve All.” <cite>— A reminder for every evening</cite></blockquote>
            <div className="invitation-signoff"><span>All are invited</span><b>Jai Sai Ram</b></div>
          </div>
        </div>
      </section>

      {/* Focus Showcase Card Section - Driven by Date and Day */}
      <section className="focus-section content-section" aria-labelledby="focus-title">
        <div key={selected.id} className={`focus-card focus-card-transition ${cardAnimating ? "card-exit" : "card-enter"}`} style={{ "--focus-color": selected.color } as React.CSSProperties} aria-live="polite">
          <div className="focus-orbit orbit-one" aria-hidden="true" />
          <div className="focus-orbit orbit-two" aria-hidden="true" />
          <div className="focus-date"><span>{selected.month}</span><strong>{selected.day}</strong><small>{selected.weekday}</small></div>
          <div className="focus-details">
            <p className="eyebrow">
              <span className="status-dot" />{" "}
              {isItemDone(selected)
                ? "Completed Bhajan Offering"
                : getDayState(selected.isoDate) === "today"
                ? selected.id === 10
                  ? "🌟 Today's Morning Gathering"
                  : "🌟 Tonight's Sacred Gathering"
                : selected.id === 10
                ? "Tuesday Morning Bhajans"
                : `${selected.weekday} Evening Bhajan`}
              {isItemDone(selected) && <span className="focus-done-pill"><Check size={11} /> Done</span>}
            </p>
            <h2 id="focus-title">{selected.host}</h2>
            <p className="focus-note">“{selected.note}”</p>
            <div className="focus-facts">
              <div className="focus-facts-meta">
                <span><Clock3 size={16} /> {selected.time || "7:00—8:00 P.M."}</span>
                <span><MapPin size={16} /> {selected.address}</span>
              </div>
              {selected.mapUrl && (
                <a
                  href={selected.mapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="focus-map-btn"
                  aria-label={`Open Google Maps for ${selected.address}`}
                >
                  <span className="map-om-symbol" aria-hidden="true">ॐ</span>
                  <span>Open in Google Maps</span>
                  <ExternalLink size={14} />
                </a>
              )}
            </div>
          </div>
          <div className="focus-chant" aria-hidden="true"><span>ॐ</span><small>SAI RAM</small></div>
          <button className="slider-arrow slider-prev" type="button" onClick={() => moveSelected(-1)} aria-label="Previous bhajan card">←</button>
          <button className="slider-arrow slider-next" type="button" onClick={() => moveSelected(1)} aria-label="Next bhajan card">→</button>
        </div>
        <div className="slider-footer">
          <span className="slider-count">{String(selected.id).padStart(2, "0")} <i>/ 10 evenings</i></span>
          <div className="slider-dots" role="tablist" aria-label="Choose a bhajan card">
            {schedule.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={selected.id === item.id}
                aria-label={`Show ${item.host}`}
                className={selected.id === item.id ? "is-active" : ""}
                style={{ "--dot-color": item.color } as React.CSSProperties}
                onClick={() => setSelectedId(item.id)}
              />
            ))}
          </div>
          <span className="slider-hint">Use the arrows or choose a colour</span>
        </div>
      </section>

      <section id="schedule" className="schedule-section content-section" aria-labelledby="schedule-title">
        <div className="section-heading-row">
          <div><div className="section-kicker"><span>02</span><span className="kicker-line" /><span>The sacred calendar</span></div><h2 id="schedule-title">Choose an evening<br /><em>to sing together.</em></h2></div>
        </div>
        <div className="schedule-intro"><p>Each colour carries a different mood of devotion. Select a day to spotlight it above, or open the map link to find your way there.</p><div className="time-pill"><Clock3 size={16} /><span>Every day · 7:00—8:00 P.M.</span></div></div>

        {/* Festival Progress Tracker (Timer UI hidden, internal time retained) */}
        <div className="countdown-section">
          <div className="progress-card">
            <div className="progress-card-head">
              <div>
                <p className="eyebrow"><CheckCircle2 size={14} /> Navarathri Bhajan Offerings</p>
                <h3 style={{ margin: "4px 0 0", color: "var(--maroon)", fontSize: "19px", fontFamily: "'Playfair Display', serif" }}>
                  Festival Progress · 11—20 OCT 2026
                </h3>
              </div>
              <div className="progress-fraction">
                <strong>{completedCount}</strong>/10
              </div>
            </div>
            <div className="progress-bar-track">
              <div
                className="progress-bar-fill"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="progress-legend">
              <span><b>{completedCount}</b> completed</span>
              <span><b>{10 - completedCount}</b> remaining</span>
              <span><b>{progressPercent}%</b> accomplished</span>
            </div>
          </div>
        </div>

        <div className="calendar-legend" aria-label="Nine Navarathri colours">
          {schedule.slice(0, 9).map((item) => <span key={item.id}><i style={{ backgroundColor: item.color }} />{item.colorName}</span>)}
        </div>

        <div className="schedule-table-wrap">
          <table className="schedule-table">
            <caption className="sr-only">Navarathri and Dussehra bhajan schedule from 11 October to 20 October 2026</caption>
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Date</th>
                <th scope="col">Bhajan host / offering</th>
                <th scope="col">Location &amp; map</th>
                <th scope="col">Status</th>
                <th scope="col" style={{ textAlign: "right", paddingRight: "18px" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((item) => {
                const state = getDayState(item.isoDate);
                const done = isItemDone(item);
                return (
                  <tr
                    key={item.id}
                    className={`schedule-row ${selectedId === item.id ? "is-selected" : ""} ${state === "today" ? "is-today" : ""} ${done ? "is-done" : ""}`}
                    onClick={() => setSelectedId(item.id)}
                  >
                    <td>
                      <button
                        className="number-button"
                        type="button"
                        aria-label={`Select ${item.dateLabel}`}
                        onClick={() => setSelectedId(item.id)}
                        style={{ "--row-color": item.color } as React.CSSProperties}
                      >
                        {String(item.id).padStart(2, "0")}
                      </button>
                    </td>
                    <td>
                      <div className="date-cell">
                        <strong>{item.day}</strong>
                        <span>{item.month} <i>{item.weekday}</i></span>
                      </div>
                    </td>
                    <td>
                      <button className="host-button" type="button" onClick={() => setSelectedId(item.id)}>
                        <strong>{item.host}</strong>
                        <span>{item.note}</span>
                      </button>
                    </td>
                    <td>
                      <div className="location-cell">
                        <span>{item.address}</span>
                        {item.mapUrl && (
                          <a href={item.mapUrl} target="_blank" rel="noreferrer" aria-label={`Open Google Maps for ${item.address}`}>
                            <span className="map-om-symbol" aria-hidden="true">ॐ</span> Open map <ExternalLink size={12} />
                          </a>
                        )}
                      </div>
                    </td>
                    <td>
                      {done ? (
                        <span className="status-badge status-done">
                          <Check size={10} /> Done
                        </span>
                      ) : (
                        <span className={`status-badge status-${state}`}>
                          {state === "today" ? (item.id === 10 ? "Morning" : "Tonight") : state === "past" ? "Completed" : "Upcoming"}
                        </span>
                      )}
                    </td>
                    <td style={{ textAlign: "right", paddingRight: "18px" }}>
                      <button
                        className={`done-toggle-btn ${done ? "is-completed" : "is-pending"}`}
                        type="button"
                        onClick={(e) => toggleItemDone(item.id, e)}
                        title={done ? "Mark as pending" : "Mark as completed (after 24h event)"}
                      >
                        {done ? <CheckCircle2 size={13} /> : <Check size={13} />}
                        <span>{done ? "Completed" : "Mark Done"}</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section id="prayer" className="prayer-section content-section" aria-labelledby="prayer-title">
        <div className="prayer-copy"><div className="section-kicker"><span>03</span><span className="kicker-line" /><span>A small prayer</span></div><h2 id="prayer-title">Take one quiet<br /><em>minute with Sai.</em></h2><p>Before you continue, let the room become still. Repeat “Om Sai Ram” three times, at your own pace. There is no perfect way to pray.</p></div>
        <div className={`chant-card ${chanting ? "is-chanting" : ""} ${chantComplete ? "is-complete" : ""}`}>
          <div className="chant-ring ring-outer" /><div className="chant-ring ring-inner" />
          <div className="chant-center"><span className="chant-symbol">ॐ</span><strong>{chantComplete ? "Aum" : chanting ? "Om Sai Ram" : "Ready when you are"}</strong><small>{chantComplete ? "Your prayer is complete" : `${chantCount} of 3 recitations`}</small></div>
          <div className="chant-actions">{chanting ? <button className="button button-soft" type="button" onClick={() => setChanting(false)}><Pause size={15} /> Pause</button> : chantComplete ? <button className="button button-soft" type="button" onClick={startChant}><RotateCcw size={15} /> Begin again</button> : <button className="button button-primary" type="button" onClick={startChant}><Play size={15} /> Begin chant</button>}{chantComplete && <span className="chant-check"><Check size={15} /> With love</span>}</div>
        </div>
      </section>

      <footer className="site-footer"><div className="footer-mantra"><span className="brand-mark small" aria-hidden="true"><span>ॐ</span></span><p>May every home become a mandir,<br />and every voice become a blessing.</p></div><div className="footer-right"><span>All are invited</span><strong>Jai Sai Ram</strong></div></footer>

      {welcomeOpen && <div className={`welcome-backdrop ${welcomeFading ? "is-fading" : ""}`} role="presentation"><div className={`welcome-modal ${welcomeFading ? "is-fading" : ""}`} role="dialog" aria-modal="true" aria-labelledby="welcome-title"><button className="modal-close" type="button" aria-label="Close welcome message" onClick={closeWelcome}><X size={18} /></button><div className="welcome-glow" aria-hidden="true" /><div className="welcome-symbol">ॐ</div><p className="eyebrow"><Sparkles size={14} /> A loving invitation</p><h2 id="welcome-title">AUM<br /><em>SRI SAI RAM</em></h2><p>May the light of Navarathri enter your home gently, and may each bhajan bring us closer in love.</p><button className="button button-primary welcome-button" type="button" onClick={closeWelcome}>Enter with devotion <ChevronRight size={16} /></button><span className="welcome-foot">11—20 October 2026 · 7:00 P.M.</span></div></div>}

    </main>
  );
}
