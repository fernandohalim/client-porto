import { CLIENT_STATUS, FREELANCE } from "@/content/portfolio";
import Strip from "./Strip";
import Rise from "./Rise";

export default function Freelance() {
  const clients = FREELANCE.clients;
  return (
    <section id="freelance" className="panel">
      <div className="head">
        <h2 data-drift className="display reveal"><Rise text="Freelance" /></h2>
        <div className="reveal flex flex-col gap-3">
          <p className="lede">{FREELANCE.intro}</p>
          <p className="label">
            {clients.length} commissions — {clients.filter((c) => c.href).length} still live
          </p>
        </div>
      </div>

      <Strip
        label="Freelance"
        items={clients.map((c) => ({ ...c, status: CLIENT_STATUS[c.kind] }))}
      />
    </section>
  );
}
