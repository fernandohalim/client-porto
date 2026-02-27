import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 border-b border-zinc-900 bg-black/60 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* macos style window controls */}
        <div className="flex gap-2 items-center">
          <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
          <span className="ml-4 font-mono text-xs text-zinc-600 hidden sm:block">
            fernando@macbook-pro:~
          </span>
        </div>

        {/* navigation links / directory paths */}
        <div className="flex gap-6 font-mono text-sm text-zinc-400">
          <Link
            href="#about"
            className="hover:text-green-400 transition-colors"
          >
            ./about
          </Link>
          <Link
            href="#skills"
            className="hover:text-green-400 transition-colors"
          >
            ./skills
          </Link>
          <Link
            href="#experience"
            className="hover:text-green-400 transition-colors"
          >
            ./experience
          </Link>
          <Link
            href="#projects"
            className="hover:text-green-400 transition-colors"
          >
            ./projects
          </Link>
        </div>
      </div>
    </nav>
  );
}
