/* Coastal Dusk Editorial: editorial asymmetry, horizon lines, shell-paper palette, quiet motion. */
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowDown, ArrowUpRight, CalendarDays, Check, ChevronLeft, ChevronRight, Copy, Heart, MapPin, Music2, Pause, Play, X, ZoomIn } from "lucide-react";
import { toast } from "sonner";

const wedding = {
  couple: "Alya & Raka",
  shortNames: "Alya & Raka",
  parents: "Putri pertama Bapak Surya dan Ibu Ratih · Putra kedua Bapak Dimas dan Ibu Laras",
  date: "12 September 2026",
  isoDate: "2026-09-12T15:30:00+07:00",
  akad: { time: "08.00 WIB", venue: "Masjid Al-Hikmah", address: "Jl. Pesisir Timur No. 18, Yogyakarta" },
  reception: { time: "18.30–21.00 WIB", venue: "Teras Senja Amarta", address: "Jl. Parangtritis Km. 5, Yogyakarta" },
  mapsUrl: "https://maps.google.com/?q=Teras+Senja+Amarta+Yogyakarta",
  musicUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  wallet: { provider: "DANA", number: "0812 3456 7890", recipient: "Alya Pramesti" },
  bank: { name: "BCA", number: "1234567890", recipient: "Raka Adinata" },
  hero: "https://images.unsplash.com/photo-1507504031003-b417219a0fde?auto=format&fit=crop&w=1800&q=88",
};

const photos = [
  ["https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=85", "Menjelang sore di antara angin laut"],
  ["https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?auto=format&fit=crop&w=1100&q=85", "Langkah yang menemukan arah"],
  ["https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=900&q=85", "Cahaya kecil di hari yang besar"],
  ["https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1100&q=85", "Saling menggenggam, pelan-pelan"],
  ["https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=900&q=85", "Rumah yang kami pilih bersama"],
  ["https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=1100&q=85", "Satu garis, dua nama"],
];

function Emblem({ light = false }: { light?: boolean }) {
  return <svg className={`brand-emblem ${light ? "brand-emblem-light" : ""}`} viewBox="0 0 70 44" aria-label="Emblem dua cangkang dan garis horizon"><path d="M5 27C9 10 24 5 34 21C25 19 17 23 12 33" /><path d="M65 27C61 10 46 5 36 21C45 19 53 23 58 33" /><path d="M7 34H63" /></svg>;
}

type Guest = { name: string; status: string; message: string; time: string };

function getGuestName() {
  const value = new URLSearchParams(window.location.search).get("to")?.replace(/\s+/g, " ").trim();
  return (value || "Tamu undangan").slice(0, 60);
}

function calendarUrl() {
  const start = "20260912T083000";
  const end = "20260912T210000";
  const params = new URLSearchParams({ action: "TEMPLATE", text: `Pernikahan ${wedding.couple}`, dates: `${start}/${end}`, details: `Akad dan resepsi ${wedding.couple}.`, location: `${wedding.reception.venue}, ${wedding.reception.address}`, ctz: "Asia/Jakarta" });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function useReveal() {
  useEffect(() => {
    const nodes = document.querySelectorAll("[data-reveal]");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { nodes.forEach((n) => n.classList.add("is-visible")); return; }
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); } }), { threshold: 0.12 });
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);
}

function SectionLabel({ children }: { children: React.ReactNode }) { return <p className="eyebrow">{children}</p>; }

export default function Home() {
  const [opened, setOpened] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [guest, setGuest] = useState<Guest[]>(() => JSON.parse(localStorage.getItem("alya-raka-guestbook") || "[]"));
  const [selected, setSelected] = useState<number | null>(null);
  const [copied, setCopied] = useState("");
  const audio = useRef<HTMLAudioElement>(null);
  const guestName = useMemo(getGuestName, []);
  useReveal();

  const [remaining, setRemaining] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => { const tick = () => { const diff = Math.max(0, new Date(wedding.isoDate).getTime() - Date.now()); setRemaining({ days: Math.floor(diff / 86400000), hours: Math.floor(diff / 3600000) % 24, minutes: Math.floor(diff / 60000) % 60, seconds: Math.floor(diff / 1000) % 60 }); }; tick(); const id = window.setInterval(tick, 1000); return () => clearInterval(id); }, []);
  useEffect(() => { document.body.style.overflow = selected !== null ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [selected]);

  const openInvite = () => { setOpened(true); audio.current?.play().then(() => setPlaying(true)).catch(() => setPlaying(false)); };
  const toggleMusic = () => { if (!audio.current) return; if (playing) { audio.current.pause(); setPlaying(false); } else { audio.current.play().then(() => setPlaying(true)).catch(() => toast.error("Musik belum dapat diputar di browser ini.")); } };
  const copyValue = async (key: string, value: string) => { try { await navigator.clipboard.writeText(value); } catch { const input = document.createElement("textarea"); input.value = value; document.body.appendChild(input); input.select(); document.execCommand("copy"); input.remove(); } setCopied(key); window.setTimeout(() => setCopied(""), 2000); };

  return <div className={`site ${opened ? "is-open" : ""}`}>
    <audio ref={audio} src={wedding.musicUrl} loop preload="none" />
    <div className="cover" aria-hidden={opened}>
      <div className="cover-image" style={{ backgroundImage: `url(${wedding.hero})` }} />
      <div className="cover-shade" />
      <div className="cover-content">
        <Emblem light />
        <SectionLabel>sebuah undangan · 12.09.26</SectionLabel>
        <h1>{wedding.couple}</h1>
        <p className="cover-date">Sabtu, 12 September 2026</p>
        <div className="guest-note"><span>Untuk</span><strong>{guestName}</strong></div>
        <button className="button button-light" onClick={openInvite}>Buka undangan <ArrowUpRight size={16} /></button>
      </div>
      <div className="cover-footer"><span>Yogyakarta</span><span>Scroll to discover</span></div>
    </div>

    <header className="topbar"><a href="#top" className="brand"><Emblem /><span>{wedding.shortNames}</span></a><nav><a href="#story">Cerita</a><a href="#event">Detail acara</a><a href="#gallery">Galeri</a><a href="#rsvp">RSVP</a><a href="#gift">Tanda kasih</a></nav><span className="top-date">12 · 09 · 26</span></header>

    <main id="top">
      <section className="hero-section"><div className="hero-copy" data-reveal><SectionLabel>the beginning of forever</SectionLabel><h2>Dari satu garis pantai,<br /><em>kami menemukan</em><br />arah pulang.</h2><p>Dengan penuh syukur, kami mengundang Anda untuk hadir dan merayakan hari ketika dua perjalanan menjadi satu.</p><a className="text-link" href="#story">Temui cerita kami <ArrowDown size={16} /></a></div><div className="hero-mark" data-reveal><span>01</span><div className="horizon" /><span>12.09<br />2026</span></div></section>

      <section id="story" className="story-section section-pad"><div className="section-index">01 <span>cerita kami</span></div><div className="story-grid"><div className="story-photo photo-frame" data-reveal><img src={photos[1][0]} alt="Alya dan Raka berjalan bersama di tepi pantai" /><span className="photo-caption">the long way home</span></div><div className="story-copy" data-reveal><SectionLabel>our story</SectionLabel><h2>Yang dimulai<br /><em>dengan percakapan</em><br />sederhana.</h2><p>Barangkali memang begitu cara hal-hal besar dimulai: tanpa rencana, di antara obrolan yang tak terasa sudah berjam-jam lamanya.</p><p>Sejak hari itu, kami belajar bahwa pulang bukan selalu tentang tempat. Kadang ia adalah seseorang yang membuat kita ingin tinggal, tumbuh, dan berjalan lebih jauh.</p><div className="signature">Alya <span>×</span> Raka</div></div></div></section>

      <section id="event" className="event-section section-pad"><div className="section-index">02 <span>hari yang dinanti</span></div><div className="event-intro" data-reveal><SectionLabel>save the date</SectionLabel><h2>Satu hari,<br /><em>dua perayaan.</em></h2><a className="button button-dark" href={calendarUrl()} target="_blank" rel="noreferrer"><CalendarDays size={16} /> Simpan ke kalender</a></div><div className="event-details"><div className="event-item" data-reveal><span className="event-num">01</span><div><SectionLabel>akad nikah</SectionLabel><h3>{wedding.akad.time}</h3><p>{wedding.akad.venue}<br />{wedding.akad.address}</p></div></div><div className="event-line" /><div className="event-item" data-reveal><span className="event-num">02</span><div><SectionLabel>resepsi</SectionLabel><h3>{wedding.reception.time}</h3><p>{wedding.reception.venue}<br />{wedding.reception.address}</p><a className="text-link" href={wedding.mapsUrl} target="_blank" rel="noreferrer">Lihat lokasi <MapPin size={15} /></a></div></div></div><div className="countdown" data-reveal>{[[remaining.days,"hari"],[remaining.hours,"jam"],[remaining.minutes,"menit"],[remaining.seconds,"detik"]].map(([value,label]) => <div key={label}><strong>{String(value).padStart(2,"0")}</strong><span>{label}</span></div>)}</div></section>

      <section id="gallery" className="gallery-section section-pad"><div className="section-index">03 <span>fragmen</span></div><div className="gallery-head" data-reveal><SectionLabel>pre-wedding notes</SectionLabel><h2>Potongan kecil<br />dari <em>perjalanan kami.</em></h2><p>Enam bingkai, satu cerita yang masih terus kami tulis.</p></div><div className="masonry">{photos.map(([src, alt], i) => <button className={`gallery-item item-${i + 1}`} key={src} onClick={() => setSelected(i)} aria-label={`Lihat foto: ${alt}`} data-reveal><img src={src} alt={alt} /><span><ZoomIn size={14} /> Lihat foto</span></button>)}</div></section>

      <section id="rsvp" className="rsvp-section section-pad"><div className="section-index">04 <span>konfirmasi</span></div><div className="rsvp-grid"><div data-reveal><SectionLabel>will you join us?</SectionLabel><h2>Kehadiranmu<br /><em>berarti.</em></h2><p>Mohon isi konfirmasi kehadiran dan titipkan satu kalimat untuk kami simpan.</p></div><RsvpForm onSubmit={(item) => { const next = [item, ...guest]; setGuest(next); localStorage.setItem("alya-raka-guestbook", JSON.stringify(next)); }} /></div><div className="guestbook" data-reveal><SectionLabel>guestbook</SectionLabel>{guest.length === 0 ? <p className="empty-state">Pesan ucapanmu akan muncul di sini setelah dikirim.</p> : guest.map((item, i) => <article key={`${item.name}-${i}`}><div><strong>{item.name}</strong><span>{item.status} · {item.time}</span></div><p>“{item.message}”</p></article>)}</div></section>

      <section id="gift" className="gift-section section-pad"><div className="section-index">05 <span>tanda kasih</span></div><div className="gift-grid"><div data-reveal><SectionLabel>with gratitude</SectionLabel><h2>Doa dan hadirmu<br /><em>adalah hadiah.</em></h2><p>Bila berkenan berbagi tanda kasih, berikut detail yang dapat digunakan.</p></div><div className="gift-card" data-reveal><img src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(`${wedding.wallet.provider}:${wedding.wallet.number}`)}`} alt={`QR code ${wedding.wallet.provider} ${wedding.wallet.recipient}`} /><div><SectionLabel>{wedding.wallet.provider}</SectionLabel><h3>{wedding.wallet.number}</h3><p>{wedding.wallet.recipient}</p><button className="copy-button" onClick={() => copyValue("wallet", wedding.wallet.number)}>{copied === "wallet" ? <><Check size={14} /> Tersalin</> : <><Copy size={14} /> Salin nomor</>}</button></div></div><div className="bank-card" data-reveal><SectionLabel>{wedding.bank.name}</SectionLabel><h3>{wedding.bank.number}</h3><p>{wedding.bank.recipient}</p><button className="copy-button" onClick={() => copyValue("bank", wedding.bank.number)}>{copied === "bank" ? <><Check size={14} /> Tersalin</> : <><Copy size={14} /> Salin nomor</>}</button></div></div></section>
    </main>

    <footer><Emblem /><h2>{wedding.couple}</h2><p>Terima kasih telah menjadi bagian dari hari kami.</p><div className="footer-bottom"><span>Yogyakarta · 2026</span><Heart size={14} fill="currentColor" /><span>with love</span></div></footer>
    <button className="music-button" onClick={toggleMusic} aria-label={playing ? "Jeda musik" : "Putar musik"}>{playing ? <Pause size={16} /> : <Play size={16} />}<span>{playing ? "Jeda musik" : "Putar musik"}</span></button>
    <nav className="mobile-nav"><a href="#story">Cerita</a><a href="#event">Acara</a><a href="#gallery">Galeri</a><a href="#rsvp">RSVP</a><a href="#gift">Kasih</a></nav>
    {selected !== null && <div className="lightbox" role="dialog" aria-modal="true" aria-label="Galeri foto" onClick={() => setSelected(null)}><button className="lightbox-close" onClick={() => setSelected(null)} aria-label="Tutup"><X /></button><button className="lightbox-prev" onClick={(e) => { e.stopPropagation(); setSelected((selected - 1 + photos.length) % photos.length); }} aria-label="Foto sebelumnya"><ChevronLeft /></button><figure onClick={(e) => e.stopPropagation()}><img src={photos[selected][0]} alt={photos[selected][1]} /><figcaption>{String(selected + 1).padStart(2, "0")} · {photos[selected][1]}</figcaption></figure><button className="lightbox-next" onClick={(e) => { e.stopPropagation(); setSelected((selected + 1) % photos.length); }} aria-label="Foto berikutnya"><ChevronRight /></button></div>}
  </div>;
}

function RsvpForm({ onSubmit }: { onSubmit: (guest: Guest) => void }) {
  const [name, setName] = useState(""); const [status, setStatus] = useState("Saya akan hadir"); const [message, setMessage] = useState(""); const [sent, setSent] = useState(false);
  const submit = (e: React.FormEvent) => { e.preventDefault(); if (!name.trim() || !message.trim()) { toast.error("Mohon lengkapi nama dan pesan ucapan."); return; } onSubmit({ name: name.trim().slice(0, 60), status, message: message.trim().slice(0, 240), time: new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric" }).format(new Date()) }); setSent(true); setName(""); setMessage(""); };
  if (sent) return <div className="success-box" data-reveal><Check size={22} /><h3>Terima kasih, pesannya sudah kami terima.</h3><p>Konfirmasi tersimpan di perangkat ini sebagai buku tamu sementara.</p><button className="text-link" onClick={() => setSent(false)}>Kirim pesan lain</button></div>;
  return <form className="rsvp-form" onSubmit={submit} data-reveal><label>Nama lengkap<input value={name} onChange={(e) => setName(e.target.value)} placeholder="Tulis namamu" /></label><fieldset><legend>Konfirmasi kehadiran</legend>{["Saya akan hadir", "Belum bisa memastikan", "Tidak dapat hadir"].map((item) => <label className="radio" key={item}><input type="radio" name="status" checked={status === item} onChange={() => setStatus(item)} /> <span>{item}</span></label>)}</fieldset><label>Pesan ucapan<textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Satu kalimat untuk kami..." rows={4} /></label><button className="button button-dark" type="submit">Kirim konfirmasi <ArrowUpRight size={16} /></button></form>;
}
