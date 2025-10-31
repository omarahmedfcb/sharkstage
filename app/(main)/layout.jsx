import Navbar from "@/app/components/NavBar";
import Footer from "@/app/components/Footer";

export default function MainLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
