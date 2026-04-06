import DecryptText from "../utilities/DecryptText";

// Renamed from Footer to Contact
export default function Contact() {
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
    <section
      id="contact"
      className="py-24 border-t border-zinc-900 bg-black relative overflow-hidden"
    >
      {/* --- background combined effects --- */}
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-size-[24px_24px] mask-[radial-gradient(ellipse_50%_50%_at_50%_50%,#000_0%,transparent_80%)]"></div>
        <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-75 md:w-125 h-75 md:h-125 bg-green-600/20 rounded-full blur-[100px] md:blur-[120px]"></div>
        <div className="absolute top-1/3 left-2/3 -translate-x-1/2 w-62.5 md:w-100 h-62.5 md:h-100 bg-emerald-800/20 rounded-full blur-[100px] md:blur-[120px]"></div>
      </div>

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        {/* massive contact bento box */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 overflow-hidden group">
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
              {/* email - white/silver glow */}
              <a
                href={`mailto:${contactInfo.email}`}
                className="group/btn flex items-center justify-between p-4 rounded-xl border border-zinc-800 bg-zinc-950/50 hover:bg-zinc-900 hover:border-zinc-400 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-all duration-500"
              >
                <div className="flex items-center gap-4">
                  <span className="text-zinc-500 group-hover/btn:text-white transition-colors duration-500">
                    [@]
                  </span>
                  <span className="text-zinc-300 group-hover/btn:text-white transition-colors duration-500">
                    email
                  </span>
                </div>
                <span className="text-zinc-600 group-hover/btn:text-white transition-colors duration-500">
                  -&gt;
                </span>
              </a>

              {/* linkedin - blue glow */}
              <a
                href={contactInfo.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="group/btn flex items-center justify-between p-4 rounded-xl border border-zinc-800 bg-zinc-950/50 hover:bg-zinc-900 hover:border-blue-500/60 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] transition-all duration-500"
              >
                <div className="flex items-center gap-4">
                  <span className="text-zinc-500 group-hover/btn:text-blue-400 transition-colors duration-500">
                    [in]
                  </span>
                  <span className="text-zinc-300 group-hover/btn:text-white transition-colors duration-500">
                    linkedin
                  </span>
                </div>
                <span className="text-zinc-600 group-hover/btn:text-blue-400 transition-colors duration-500">
                  -&gt;
                </span>
              </a>

              {/* whatsapp/phone - green glow */}
              <a
                href={contactInfo.waLink}
                target="_blank"
                rel="noreferrer"
                className="group/btn flex items-center justify-between p-4 rounded-xl border border-zinc-800 bg-zinc-950/50 hover:bg-zinc-900 hover:border-green-500/60 hover:shadow-[0_0_30px_rgba(34,197,94,0.2)] transition-all duration-500"
              >
                <div className="flex items-center gap-4">
                  <span className="text-zinc-500 group-hover/btn:text-green-400 transition-colors duration-500">
                    [wa]
                  </span>
                  <span className="text-zinc-300 group-hover/btn:text-white transition-colors duration-500">
                    phone
                  </span>
                </div>
                <span className="text-zinc-600 group-hover/btn:text-green-400 transition-colors duration-500">
                  -&gt;
                </span>
              </a>

              {/* cv - brighter green glow */}
              <a
                href={contactInfo.cvLink}
                target="_blank"
                rel="noreferrer"
                className="group/btn flex items-center justify-between p-4 rounded-xl border border-green-500/30 bg-green-500/5 hover:bg-green-500/10 hover:border-green-500/80 hover:shadow-[0_0_30px_rgba(34,197,94,0.3)] transition-all duration-500"
              >
                <div className="flex items-center gap-4">
                  <span className="text-green-500/70 group-hover/btn:text-green-400 transition-colors duration-500">
                    [cv]
                  </span>
                  <span className="text-green-400/90 group-hover/btn:text-green-400 transition-colors duration-500">
                    resume
                  </span>
                </div>
                <span className="text-green-500/50 group-hover/btn:text-green-400 transition-colors duration-500">
                  -&gt;
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
