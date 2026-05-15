/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { Navbar } from "./components/layout/Navbar";
import Home from "./pages/Home";
import Timeline from "./pages/Timeline";
import Collections from "./pages/Collections";
import About from "./pages/About";
import Relics from "./pages/Relics";
import Manuscripts from "./pages/Manuscripts";
import Figures from "./pages/Figures";
import Kingdoms from "./pages/Kingdoms";
import KingdomArchive from "./pages/KingdomArchive";
import Contact from "./pages/Contact";
import Exhibitions from "./pages/Exhibitions";
import AudioExperience from "./pages/AudioExperience";
import Gallery from "./pages/Gallery";
import { supabase } from "./lib/supabase"
import AdminLogin from "./pages/admin/AdminLogin";
import Dashboard from "./pages/admin/Dashboard";
console.log(supabase)

// AppContent component to use useLocation
function AppContent() {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith("/admin");

  return (
    <div className="min-h-screen bg-matte-black text-cream selection:bg-gold-elegant selection:text-matte-black h-full overflow-x-hidden">
      {!isAdminPath && <Navbar />}
      <main className="h-full">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/timeline" element={<Timeline />} />
          <Route path="/relics" element={<Relics />} />
          <Route path="/manuscripts" element={<Manuscripts />} />
          <Route path="/figures" element={<Figures />} />
          <Route path="/kingdoms" element={<Kingdoms />} />
          <Route path="/kingdom-archive" element={<KingdomArchive />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/audio-experience" element={<AudioExperience />} />
          <Route path="/exhibitions" element={<Exhibitions />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
        </Routes>
      </main>
      
      {!isAdminPath && (
        <footer className="py-12 px-6 border-t border-white/5 bg-matte-black text-center">
          <div className="max-w-7xl mx-auto">
            <h3 className="font-cinzel text-xl text-gold-elegant mb-4 uppercase tracking-[0.2em]">Kakawin Nusantara Museum</h3>
            <p className="text-cream/40 text-sm mb-8">© 2026 Pelestarian Digital Warisan Nusantara. All Rights Reserved.</p>
            <div className="flex justify-center gap-8">
              <a href="https://www.instagram.com/kakawin.id?igsh=MWQ4M2VlbTZqbWoyZQ==" target="_blank" rel="noopener noreferrer" className="text-cream/60 hover:text-gold-elegant transition-colors">Instagram</a>
              <a href="#" className="text-cream/60 hover:text-gold-elegant transition-colors">YouTube</a>
              <a href="#" className="text-cream/60 hover:text-gold-elegant transition-colors">X</a>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
