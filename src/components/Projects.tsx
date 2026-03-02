import Typewriter from "@/utilities/Typewriter";
import DecryptText from "../utilities/DecryptText";

export default function Projects() {
  const projects = [
    {
      title: "company_profile_website",
      client: "PT Maju Jaya Arkananta",
      date: "jul 2024 - aug 2024",
      description: "catalogue api and product management.",
      tech: ["express", "node"],
      status: "live",
    },
    {
      title: "financial_record_app",
      client: "Company X",
      date: "jun 2024 - jul 2024",
      description:
        "chart of account web-based app, multi-layer user management and auto-generated financial recap.",
      tech: ["react", "tailwind css", "express", "node"],
      status: "live",
    },
    {
      title: "web_based_erp",
      client: "Company X",
      date: "feb 2024 - may 2024",
      description:
        "responsive design and clean user interface web for inventory, transaction and project management.",
      tech: ["react", "node", "material ui"],
      status: "live",
    },
    {
      title: "community_catalogue",
      client: "Rawa Belong Community",
      date: "aug 2023 - nov 2023",
      description:
        "responsive design and clean user interface web for flower shop community catalogue.",
      tech: ["react", "flutter", "node", "webview"],
      status: "inactive",
    },
    {
      title: "company_profile_website",
      client: "LeSeen Electronics",
      date: "feb 2023 - mar 2023",
      description:
        "responsive design and clean user interface web for videotron company profile and products.",
      tech: ["react", "node", "material ui"],
      status: "inactive",
    },
  ];

  return (
    <section
      id="projects"
      className="py-24 border-t border-zinc-900 bg-black relative overflow-hidden"
    >
      {/* subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-100 bg-green-900/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <div className="mb-12">
          <Typewriter command="ls -la " args="./projects" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project, index) => {
            // this specifically checks if the array length is odd AND if it's the very last item
            const isLastOddItem =
              projects.length % 2 !== 0 && index === projects.length - 1;

            return (
              <div
                key={index}
                className={`p-8 rounded-2xl border border-zinc-800 bg-zinc-900/20 hover:bg-zinc-900/40 hover:border-green-500/30 transition-all group relative overflow-hidden backdrop-blur-sm flex flex-col h-full ${
                  isLastOddItem ? "md:col-span-2" : ""
                }`}
              >
                {/* layout fix applied here with gap-4, break-all, and shrink-0 */}
                <div className="flex justify-between items-start mb-4 gap-4">
                  <h3 className="text-lg font-mono text-zinc-100 font-bold group-hover:text-green-400 transition-colors break-all">
                    <DecryptText text={project.title} />
                  </h3>
                  <span className="text-xs font-mono text-zinc-500 bg-zinc-950 px-2 py-1 rounded border border-zinc-800 shrink-0 whitespace-nowrap">
                    {project.date}
                  </span>
                </div>

                <p className="font-mono text-sm text-green-500/70 mb-4">
                  @ {project.client}
                </p>

                <p className="text-zinc-400 font-mono text-sm mb-8 grow">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="text-xs font-mono text-zinc-400 bg-zinc-800/30 px-2 py-1 rounded border border-zinc-700/30"
                    >
                      [{t}]
                    </span>
                  ))}
                </div>

                {/* mock button showing status */}
                <div className="mt-auto pt-4 border-t border-zinc-800/50 flex items-center justify-between">
                  <span className="text-xs font-mono text-zinc-500">
                    status:{" "}
                    <span className="text-yellow-500/70">{project.status}</span>
                  </span>
                  <span
                    className="text-xs font-mono text-zinc-600 group-hover:text-green-500/50 transition-colors cursor-not-allowed"
                    title="Detailed case study coming in Phase 2"
                  >
                    [view_details]
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
