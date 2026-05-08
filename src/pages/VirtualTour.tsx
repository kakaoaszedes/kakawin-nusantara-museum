import { motion, AnimatePresence } from "framer-motion";
import { Move, Info, ZoomIn, Compass, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "../components/ui/Button";
import { useEffect, useState, useRef } from "react";
import { getAllDocuments } from "../services/db";

// Declare pannellum for TypeScript
declare global {
  interface Window {
    pannellum: any;
  }
}

interface TourPoint {
  id: string;
  title: string;
  description: string;
  year: string;
  imageUrl: string;
  kingdomId?: string;
}

export default function VirtualTour() {
  const [points, setPoints] = useState<TourPoint[]>([]);
  const [activePoint, setActivePoint] = useState<TourPoint | null>(null);
  const [loading, setLoading] = useState(true);
  const viewerRef = useRef<any>(null);

  useEffect(() => {
    const fetchPoints = async () => {
      try {
        const data = await getAllDocuments<TourPoint>("virtual-tour");
        
        // Filter by kingdom if provided in URL
        const params = new URLSearchParams(window.location.search);
        const kingdomFilter = params.get('kingdom');
        
        const filteredData = kingdomFilter 
          ? data.filter(p => p.kingdomId === kingdomFilter)
          : data;

        setPoints(filteredData);
        if (filteredData.length > 0) setActivePoint(filteredData[0]);
      } catch (err) {
        console.error("Gagal memuat tour:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPoints();
  }, []);

  useEffect(() => {
    if (activePoint && !loading && window.pannellum) {
      if (viewerRef.current) {
        viewerRef.current.destroy();
      }
      
      try {
        viewerRef.current = window.pannellum.viewer('panorama-container', {
          type: 'equirectangular',
          panorama: activePoint.imageUrl,
          autoLoad: true,
          showZoomCtrl: false,
          showFullscreenCtrl: false,
          hfov: 110,
          pitch: 0,
          yaw: 0,
          mouseZoom: true,
          autoRotate: -1,
        });
      } catch (err) {
        console.error("Pannellum Init Error:", err);
      }
    }

    return () => {
      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
  }, [activePoint, loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-matte-black flex items-center justify-center">
        <Loader2 className="animate-spin text-gold-elegant" size={48} />
      </div>
    );
  }

  if (points.length === 0) {
    return (
      <div className="min-h-screen bg-matte-black pt-40 px-6 flex items-center justify-center text-center">
        <div className="max-w-md bg-white/5 p-12 rounded-[3rem] border border-white/10 backdrop-blur-xl">
          <Globe size={64} className="text-gold-elegant/20 mx-auto mb-6" />
          <h1 className="text-3xl font-cinzel text-white mb-4">Arsip 360 Masih Kosong</h1>
          <p className="text-cream/40 mb-8 font-light italic leading-relaxed">Belum ada titik Virtual Tour yang diunggah oleh kurator. Silakan unggah foto panorama melalui Dashboard Admin.</p>
          <Button onClick={() => window.location.href = '/admin'} variant="outline" className="rounded-full px-8">
            Ke Dashboard Admin
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-matte-black pt-32 pb-20 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col h-full">
        <header className="mb-12 flex justify-between items-end">
          <div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-3xl md:text-5xl font-cinzel text-gold-elegant mb-4"
            >
              Virtual Tour
            </motion.h1>
            <p className="text-cream/50 tracking-widest uppercase text-[10px] font-black leading-relaxed">
              Digitalisasi Arsitektur Nusantara dalam Pengalaman 360°
            </p>
          </div>
          <div className="text-right hidden md:block">
             <span className="text-gold-elegant/20 text-[10px] uppercase tracking-[0.4em] font-black block mb-1">Status Sesi</span>
             <span className="text-green-400/60 font-mono text-[10px] uppercase tracking-widest">Connected — 360.LIVE.STREAM</span>
          </div>
        </header>

        <div className="flex-1 relative glass rounded-[3rem] border border-white/10 overflow-hidden min-h-[600px] bg-black/40 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
           <div className="absolute inset-0 z-0">
              <div id="panorama-container" style={{ width: '100%', height: '100%' }} />
           </div>
           
           {/* UI Overlays */}
           <div className="absolute inset-x-0 bottom-12 px-12 flex justify-between items-end z-10 pointer-events-none">
              <div className="space-y-6 pointer-events-auto">
                 <AnimatePresence mode="wait">
                   <motion.div 
                     key={activePoint?.id}
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, y: -20 }}
                     className="text-white"
                   >
                      <span className="text-gold-elegant font-cinzel text-[10px] tracking-[0.4em] block mb-2 font-black">NAVIGASI RUANG</span>
                      <h2 className="text-4xl font-cinzel tracking-wider uppercase drop-shadow-lg">{activePoint?.title}</h2>
                   </motion.div>
                 </AnimatePresence>
                 
                 <div className="flex gap-4">
                    <div className="px-6 py-4 bg-matte-black/60 backdrop-blur-md rounded-2xl border border-white/10 flex items-center gap-6 text-cream/40">
                       <div className="flex items-center gap-2">
                          <Move size={14} className="text-gold-elegant" />
                          <span className="text-[10px] uppercase font-bold tracking-widest">Seret Mouse</span>
                       </div>
                       <div className="flex items-center gap-2">
                          <ZoomIn size={14} className="text-gold-elegant" />
                          <span className="text-[10px] uppercase font-bold tracking-widest">Scroll Zoom</span>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="flex flex-col gap-6 text-right w-full max-w-sm pointer-events-auto">
                 <AnimatePresence mode="wait">
                    <motion.div 
                      key={activePoint?.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.05 }}
                      className="glass bg-matte-black/40 p-8 rounded-[2rem] border border-gold-elegant/10 backdrop-blur-xl"
                    >
                       <p className="text-sm text-cream/70 leading-relaxed font-light italic mb-6">
                          "{activePoint?.description || "Deskripsi kuratorial belum tersedia untuk titik panorama ini."}"
                       </p>
                       <div className="flex items-center justify-between py-4 border-t border-white/5 mb-6">
                          <span className="text-[10px] uppercase tracking-widest font-black text-gold-elegant">Asal Era</span>
                          <span className="text-xs text-white font-cinzel">{activePoint?.year || "Tidak diketahui"}</span>
                       </div>
                       <Button variant="outline" className="w-full gap-3 py-6 rounded-2xl border-white/10 hover:border-gold-elegant/50 group">
                          <Info size={16} className="text-gold-elegant group-hover:scale-110 transition-transform" />
                          Detil Arsitektur
                       </Button>
                    </motion.div>
                 </AnimatePresence>

                 <div className="flex justify-end gap-4">
                    <div className="w-14 h-14 rounded-full bg-matte-black/80 flex items-center justify-center text-gold-elegant border border-white/10 hover:bg-gold-elegant hover:text-matte-black transition-all shadow-xl">
                       <Compass size={24} className="animate-spin-slow" />
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Navigation Selector */}
        <div className="mt-12 overflow-x-auto custom-scrollbar pb-4">
           <div className="flex gap-6 min-w-max">
              {points.map((point) => (
                <button 
                  key={point.id} 
                  onClick={() => setActivePoint(point)}
                  className={`group relative overflow-hidden h-28 w-72 rounded-[2rem] transition-all duration-500 border-2 ${
                    activePoint?.id === point.id 
                    ? 'border-gold-elegant scale-[1.02]' 
                    : 'border-white/5 grayscale opacity-40 hover:opacity-100 hover:grayscale-0'
                  }`}
                >
                   <img src={point.imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                   <div className="absolute inset-0 bg-matte-black/60 group-hover:bg-matte-black/20 transition-all flex items-center justify-center p-4">
                      <span className="relative z-10 font-cinzel text-[10px] tracking-[0.2em] text-center font-black leading-relaxed">{point.title.toUpperCase()}</span>
                   </div>
                   {activePoint?.id === point.id && (
                     <motion.div layoutId="active-nav-indicator" className="absolute bottom-0 inset-x-0 h-1 bg-gold-elegant" />
                   )}
                </button>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}

const Globe = ({ size, className }: { size: number, className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);
