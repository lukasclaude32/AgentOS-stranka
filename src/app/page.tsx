import { Nav } from "@/components/shared/Nav";
import { Footer } from "@/components/shared/Footer";
import { HomePage } from "@/components/landing/HomePage";

export default function RootPage() {
  return (
    <>
      <Nav onViolet />
      <main>
        <HomePage />
      </main>
      <Footer />
    </>
  );
}
