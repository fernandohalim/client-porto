export default function Footer() {
  const location = "west jakarta, indonesia";

  return (
    <footer className="py-8 border-t border-zinc-900 bg-black relative z-10 mt-auto">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-xs text-zinc-600">
          <p>
            <span className="text-green-500">root@portfolio</span> ~ # systemctl
            poweroff
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <p>loc: {location}</p>
            <p className="hidden sm:block">•</p>
            <p>© {new Date().getFullYear()} fernando halim.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
