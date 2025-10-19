import Footer from "../components/Footer";
import Navbar from "../components/NavBar";

export default function ProjectsLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="">{children}</main>
      <Footer />
    </>
  );
}
