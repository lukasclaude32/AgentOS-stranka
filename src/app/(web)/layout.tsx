import { Nav } from "@/components/shared/Nav";
import { Footer } from "@/components/shared/Footer";

export default function WebLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      <main style={{ paddingTop: 56 }}>{children}</main>
      <Footer />
    </>
  );
}
