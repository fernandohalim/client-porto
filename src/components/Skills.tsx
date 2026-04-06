import Typewriter from "@/utilities/Typewriter";
import DecryptText from "../utilities/DecryptText";

export default function Skills() {
  const backendSkills = [
    "java",
    "javascript",
    "spring boot",
    "go",
    "node",
    "express",
  ];
  const frontendSkills = [
    "react",
    "next",
    "typescript",
    "flutter",
    "tailwind css",
    "react native",
  ];
  const dataToolsSkills = [
    "oracle sql",
    "redis",
    "git",
    "maven",
    "mysql",
    "firebase",
  ];

  return (
    <section className="py-24 border-t border-zinc-900 bg-black relative overflow-hidden">
      {/* background glow for the whole section */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-200 h-100 bg-zinc-700/20 rounded-full blur-[120px] pointer-events-none"></div>
      {/* crt scanlines overlay */}
      <div className="absolute inset-0 opacity-40 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,1)_50%)] bg-size-[100%_4px]"></div>

      {/* fisheye vignette shadow (darkens edges to create curved screen illusion) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_60%,rgba(0,0,0,0.8)_100%)]"></div>

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <div className="mb-12">
          <Typewriter command="./" args="skill_matrix.config" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* backend card */}
          <div className="p-8 rounded-2xl border border-zinc-800 bg-linear-to-br from-blue-900/20 to-transparent hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] duration-500 transition-all group relative overflow-hidden">
            {" "}
            <h3 className="text-lg font-mono font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]"></span>
              <DecryptText text="backend_&_core" />
            </h3>
            <div className="flex flex-wrap gap-3 relative z-10">
              {backendSkills.map((skill) => (
                <span
                  key={skill}
                  className="px-4 py-2 rounded-md bg-zinc-950/80 border border-zinc-800 text-zinc-300 font-mono text-sm group-hover:border-zinc-700 transition-colors"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* frontend card */}
          <div className="md:col-span-2 p-8 rounded-2xl border border-zinc-800 bg-linear-to-br from-purple-900/20 to-transparent hover:border-purple-500/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] duration-500 transition-all group relative overflow-hidden">
            {" "}
            <h3 className="text-lg font-mono font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.8)]"></span>
              <DecryptText text="frontend_&_ui" />
            </h3>
            <div className="flex flex-wrap gap-3 relative z-10">
              {frontendSkills.map((skill) => (
                <span
                  key={skill}
                  className="px-4 py-2 rounded-md bg-zinc-950/80 border border-zinc-800 text-zinc-300 font-mono text-sm group-hover:border-zinc-700 transition-colors"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* database & tools card */}
          <div className="md:col-span-3 p-8 rounded-2xl border border-zinc-800 bg-linear-to-br from-yellow-900/20 to-transparent hover:border-yellow-500/50 hover:shadow-[0_0_30px_rgba(234,179,8,0.15)] duration-500 transition-all group relative overflow-hidden">
            {" "}
            <h3 className="text-lg font-mono font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.8)]"></span>
              <DecryptText text="database_&_tool" />
            </h3>
            <div className="flex flex-wrap gap-3 relative z-10">
              {dataToolsSkills.map((skill) => (
                <span
                  key={skill}
                  className="px-4 py-2 rounded-md bg-zinc-950/80 border border-zinc-800 text-zinc-300 font-mono text-sm group-hover:border-zinc-700 transition-colors"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
