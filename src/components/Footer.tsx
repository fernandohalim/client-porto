import Link from "next/link";
import JakartaTime from "@/utilities/JakartaTime";

// update this manually when you redeploy. format: 'YYYY-MM-DD'
const LAST_DEPLOYED = "2026-05-08";

export default function Footer() {
  const formattedDeploy = new Date(LAST_DEPLOYED).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <footer className="border-t border-zinc-900 bg-black relative z-10 mt-auto">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 font-mono text-xs">
          {/* sitemap */}
          <div>
            <p className="text-zinc-500 uppercase tracking-widest text-[10px] mb-4">
              [sitemap]
            </p>
            <ul className="space-y-2 text-zinc-400">
              <li>
                <Link
                  href="/"
                  className="hover:text-green-400 transition-colors inline-flex items-center gap-2 group"
                >
                  <span className="text-zinc-700 group-hover:text-green-500/60 transition-colors">
                    {">"}
                  </span>
                  cd ~/
                </Link>
              </li>
              <li>
                <Link
                  href="/#projects"
                  className="hover:text-green-400 transition-colors inline-flex items-center gap-2 group"
                >
                  <span className="text-zinc-700 group-hover:text-green-500/60 transition-colors">
                    {">"}
                  </span>
                  ls /projects
                </Link>
              </li>
              <li>
                <Link
                  href="/#experience"
                  className="hover:text-green-400 transition-colors inline-flex items-center gap-2 group"
                >
                  <span className="text-zinc-700 group-hover:text-green-500/60 transition-colors">
                    {">"}
                  </span>
                  tail journey.log
                </Link>
              </li>
              <li>
                <Link
                  href="/uses"
                  className="hover:text-green-400 transition-colors inline-flex items-center gap-2 group"
                >
                  <span className="text-zinc-700 group-hover:text-green-500/60 transition-colors">
                    {">"}
                  </span>
                  cat /uses
                </Link>
              </li>
              <li>
                <Link
                  href="/#contact"
                  className="hover:text-green-400 transition-colors inline-flex items-center gap-2 group"
                >
                  <span className="text-zinc-700 group-hover:text-green-500/60 transition-colors">
                    {">"}
                  </span>
                  ./connect.sh
                </Link>
              </li>
            </ul>
          </div>

          {/* built with */}
          <div>
            <p className="text-zinc-500 uppercase tracking-widest text-[10px] mb-4">
              [built_with]
            </p>
            <ul className="space-y-2 text-zinc-400">
              <li>
                <span className="text-zinc-600">→</span>{" "}
                <span className="text-zinc-300">next.js 16</span>
              </li>
              <li>
                <span className="text-zinc-600">→</span>{" "}
                <span className="text-zinc-300">react 19</span>
              </li>
              <li>
                <span className="text-zinc-600">→</span>{" "}
                <span className="text-zinc-300">tailwind v4</span>
              </li>
              <li>
                <span className="text-zinc-600">→</span>{" "}
                <span className="text-zinc-300">framer motion</span>
              </li>
              <li>
                <span className="text-zinc-600">→</span>{" "}
                <span className="text-zinc-300">typescript</span>
              </li>
            </ul>
          </div>

          {/* meta */}
          <div>
            <p className="text-zinc-500 uppercase tracking-widest text-[10px] mb-4">
              [system]
            </p>
            <ul className="space-y-2 text-zinc-400">
              <li>
                <span className="text-zinc-600">loc:</span>{" "}
                <span className="text-zinc-300">jakarta, id</span>
              </li>
              <li>
                <span className="text-zinc-600">time:</span> <JakartaTime />
              </li>
              <li>
                <span className="text-zinc-600">deploy:</span>{" "}
                <span className="text-zinc-300">{formattedDeploy}</span>
              </li>
              <li>
                <span className="text-zinc-600">status:</span>{" "}
                <span className="text-green-400 inline-flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_6px_rgba(34,197,94,0.8)]" />
                  online
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* bottom strip */}
        <div className="mt-10 pt-6 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-zinc-600 font-mono">
          <p>
            <span className="text-green-500">root@portfolio</span> ~ # systemctl
            poweroff
          </p>
          <p>
            © {new Date().getFullYear()} fernando halim. all rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
