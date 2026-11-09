// src/pages/Home.jsx
import HomeBounceGallery from "../components/home/sections/HomeBounceGallery";
import HomeCircularGallery from "../components/home/sections/HomeCircularGallery";
import HomeDomeGallery from "../components/home/sections/HomeDomeGallery";
import HomeCardNav from "../components/home/sections/HomeCardNav";
import HomeRotatingText from "../components/home/sections/HomeRotatingText";
export default function Home() {
  return (
    <main style={{ background: "#0b0b12", minHeight: "100vh" }}>
      {/* ===== HERO SECTION (placeholder) ===== */}
      <section style={{ height: "90vh" }} />

      <HomeRotatingText />
      {/* ===== BOUNCE GALLERY SECTION ===== */}
      <HomeBounceGallery />

      <HomeCardNav />
      {/* ===== DOME GALLERY SECTION ===== */}
      <HomeDomeGallery />

      {/* ===== SERVICES SECTION (placeholder) ===== */}
      <section style={{ height: "80vh" }} />

      {/* ===== CONTACT SECTION (placeholder) ===== */}
      <section style={{ height: "70vh" }} />
    </main>
  );
}
