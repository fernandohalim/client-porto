import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

// The plain website — the fallback for anyone who would rather read than
// drive, and the only version phones get.
export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Nav />
      {children}
      <Footer />
    </>
  );
}
