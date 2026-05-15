import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Globe, User } from "lucide-react";
import { Button } from "../ui/Button";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Tentang", path: "/about" },
  { name: "Timeline", path: "/timeline" },
  { name: "Budaya", path: "/relics" },
  { name: "Sastra", path: "/manuscripts" },
  { name: "Tokoh", path: "/figures" },
  { name: "Kingdom", path: "/kingdoms" },
  { name: "Pameran", path: "/exhibitions" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled ? "bg-matte-black/80 backdrop-blur-md py-4 shadow-lg border-b border-white/10" : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3 group">
          <motion.div 
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
            className="w-10 h-10 bg-gold-elegant rounded-full flex items-center justify-center p-2"
          >
            <Globe className="text-matte-black" />
          </motion.div>
          <div className="flex flex-col">
            <span className="text-xl font-cinzel font-bold text-gold-elegant tracking-widest leading-none">KAKAWIN</span>
            <span className="text-[10px] text-cream tracking-[0.2em] font-poppins">NUSANTARA</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              to={link.path}
              className={`text-sm font-medium transition-colors hover:text-gold-elegant ${
                location.pathname === link.path ? "text-gold-elegant" : "text-cream/80"
              }`}
            >
              <span className="relative">
                {link.name}
                {location.pathname === link.path && (
                  <motion.div 
                    layoutId="underline"
                    className="absolute -bottom-1 left-0 w-full h-0.5 bg-gold-elegant"
                  />
                )}
              </span>
            </Link>
          ))}
          
          <Link 
            to="/admin"
            className={`text-sm font-medium transition-colors hover:text-gold-elegant flex items-center gap-2 ${
              location.pathname === "/admin" ? "text-gold-elegant" : "text-cream/80"
            }`}
          >
            <User size={16} />
            Admin
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button className="lg:hidden text-cream" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-matte-black/95 backdrop-blur-xl border-b border-white/10 lg:hidden"
          >
            <div className="p-8 flex flex-col gap-6 items-center">
              {navLinks.map((link) => (
                <Link 
                  key={link.path} 
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`text-lg font-cinzel ${
                    location.pathname === link.path ? "text-gold-elegant" : "text-cream"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              
              <Link 
                to="/admin"
                onClick={() => setIsOpen(false)}
                className={`text-lg font-cinzel flex items-center gap-2 ${
                  location.pathname === "/admin" ? "text-gold-elegant" : "text-cream"
                }`}
              >
                <User size={18} />
                Admin
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
