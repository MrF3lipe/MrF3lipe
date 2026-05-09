import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import TechStack from "./components/TechStack";
import Projects from "./components/Projects";
import GitHubStats from "./components/GitHubStats";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

function Home() {
  return (
    <>
      <Hero />
      <About />
      <TechStack />
      <Projects />
      <Contact />
    </>
  );
}

export default function App() {
  return (
    <>
      <Navbar />
      {/* HashRouter: the app is always served from index.html, so any
          deep link like /#/anything resolves correctly on GitHub Pages. */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<Home />} />
      </Routes>
      <Footer />
    </>
  );
}
