import { PERSON } from "@/content/portfolio";

// Only on a phone-sized page: from h-scroll up, the Contact screen carries these lines
// itself, so the page ends on it cleanly.
export default function Footer() {
  return (
    <footer className="label flex flex-col gap-1 p-5 pt-16 h-scroll:hidden">
      <p>
        {PERSON.name}, {PERSON.role.toLowerCase()} in West Jakarta
      </p>
      <p>© {new Date().getFullYear()} · Designed and built by me</p>
    </footer>
  );
}
