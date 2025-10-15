import Footer from "../components/Footer";
import Navbar from "../components/NavBar";

export default function ProjectsLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="pt-20">{children}</main>
      <Footer />
    </>
  );
}

