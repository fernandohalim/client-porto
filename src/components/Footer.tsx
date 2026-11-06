export default function Footer() {
  return (
    <footer className="label flex flex-col justify-end gap-3 p-5 h-scroll:h-full h-scroll:w-80 h-scroll:flex-none h-scroll:px-8 h-scroll:py-[var(--pad-y)]">
      <p>
        Fernando Halim — Fullstack developer producing considered software from
        West Jakarta, Indonesia.
      </p>
      <p>Open to work — taking on freelance builds for 2026.</p>
      <p>© {new Date().getFullYear()} — Designed and built by Fernando Halim</p>
    </footer>
  );
}
