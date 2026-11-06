import { PERSON } from "@/content/portfolio";

// Everything behind the content: two banks of mist drifting at different speeds,
// and the name in enormous letters on the far plane. Parallax moves it with scroll.
export default function Atmosphere() {
  return (
    <div aria-hidden className="atmosphere">
      <div className="mist-track" data-tile="1024">
        <i className="mist mist-a" />
      </div>
      <div className="mist-track" data-tile="1400">
        <i className="mist mist-b" />
      </div>
      <p className="far-name">{PERSON.name}</p>
    </div>
  );
}
