import DecryptText from "../utilities/DecryptText";

export default function Footer() {
  const contactInfo = {
    email: "fernandohalim26@gmail.com",
    phone: "+62-896-0636-6647",
    waLink: "https://wa.me/6289606366647",
    location: "west jakarta, indonesia",
    linkedin: "linkedin.com/in/fernando-halimm",
    linkedinUrl: "https://www.linkedin.com/in/fernando-halimm",
    cvLink: "/fernando_halim_cv.pdf",
  };

  return (
    <footer
      id="contact"
      className="py-24 border-t border-zinc-900 bg-black relative overflow-hidden"
    >
      {/* background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-200 h-100 bg-green-900/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        {/* massive contact bento box */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 backdrop-blur-sm overflow-hidden mb-12 group">
          {/* mock window header */}
          <div className="flex items-center px-4 py-3 border-b border-zinc-800 bg-zinc-900/50">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
            <div className="mx-auto font-mono text-xs text-zinc-500">
              ~/connect.sh
            </div>
          </div>

          {/* main content area */}
          <div className="p-8 md:p-12 flex flex-col md:flex-row gap-12 items-center justify-between">
            {/* left side - message */}
            <div className="w-full md:w-1/2">
              <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full border border-zinc-800 bg-zinc-950/50 text-green-400 text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span>
                listening on port 8080...
              </div>
              <h2 className="text-4xl md:text-5xl font-mono font-bold tracking-tight text-white mb-4">
                <DecryptText text="let's build" />
                <DecryptText text="something_" />
              </h2>
              <p className="text-zinc-400 font-mono text-sm leading-relaxed mb-8 lowercase">
                whether you have a question about my work or just want to say
                hi, my inbox is always open.
              </p>
            </div>

            {/* right side - interactive links */}
            <div className="w-full md:w-1/2 flex flex-col gap-4 font-mono text-sm">
              <a
                href={`mailto:${contactInfo.email}`}
                className="group/btn flex items-center justify-between p-4 rounded-xl border border-zinc-800 bg-zinc-950/50 hover:bg-zinc-900 hover:border-zinc-500 transition-all"
              >
                <div className="flex items-center gap-4">
                  <span className="text-zinc-500 group-hover/btn:text-white transition-colors">
                    [@]
                  </span>
                  <span className="text-zinc-300 group-hover/btn:text-white transition-colors">
                    email
                  </span>
                </div>
                <span className="text-zinc-600 group-hover/btn:text-white transition-colors">
                  -&gt;
                </span>
              </a>

              <a
                href={contactInfo.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="group/btn flex items-center justify-between p-4 rounded-xl border border-zinc-800 bg-zinc-950/50 hover:bg-zinc-900 hover:border-blue-500/50 transition-all"
              >
                <div className="flex items-center gap-4">
                  <span className="text-zinc-500 group-hover/btn:text-blue-400 transition-colors">
                    [in]
                  </span>
                  <span className="text-zinc-300 group-hover/btn:text-white transition-colors">
                    linkedin
                  </span>
                </div>
                <span className="text-zinc-600 group-hover/btn:text-blue-400 transition-colors">
                  -&gt;
                </span>
              </a>

              <a
                href={contactInfo.waLink}
                target="_blank"
                rel="noreferrer"
                className="group/btn flex items-center justify-between p-4 rounded-xl border border-zinc-800 bg-zinc-950/50 hover:bg-zinc-900 hover:border-green-500/50 transition-all"
              >
                <div className="flex items-center gap-4">
                  <span className="text-zinc-500 group-hover/btn:text-green-400 transition-colors">
                    [wa]
                  </span>
                  <span className="text-zinc-300 group-hover/btn:text-white transition-colors">
                    phone
                  </span>
                </div>
                <span className="text-zinc-600 group-hover/btn:text-green-400 transition-colors">
                  -&gt;
                </span>
              </a>

              <a
                href={contactInfo.cvLink}
                target="_blank"
                rel="noreferrer"
                className="group/btn flex items-center justify-between p-4 rounded-xl border border-green-500/30 bg-green-500/5 hover:bg-green-500/10 hover:border-green-500/60 transition-all"
              >
                <div className="flex items-center gap-4">
                  <span className="text-green-500/70 group-hover/btn:text-green-400 transition-colors">
                    [cv]
                  </span>
                  <span className="text-green-400/90 group-hover/btn:text-green-400 transition-colors">
                    download_resume
                  </span>
                </div>
                <span className="text-green-500/50 group-hover/btn:text-green-400 transition-colors">
                  _&darr;
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* system sign off & copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-xs text-zinc-600">
          <p>
            <span className="text-green-500">root@portfolio</span> ~ # systemctl
            poweroff
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <p>loc: {contactInfo.location}</p>
            <p className="hidden sm:block">•</p>
            <p>© {new Date().getFullYear()} fernando halim.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
