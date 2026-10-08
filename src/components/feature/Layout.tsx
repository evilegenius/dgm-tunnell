import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import FloatingButtons from "./FloatingButtons";
import ScrollToTop from "./ScrollToTop";

export default function Layout() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background-50">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <FloatingButtons />
    </div>
  );
}