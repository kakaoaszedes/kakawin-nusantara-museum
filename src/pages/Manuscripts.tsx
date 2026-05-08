import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Book, Music, Play, Pause, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "../components/ui/Button";
import { getAllDocuments } from "../services/db";

export default function Manuscripts() {
  const [manuscripts, setManuscripts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const fetchManuscripts = async () => {
      try {
        const data = await getAllDocuments("manuscripts");
        
        // Filter by kingdom if provided in URL
        const params = new URLSearchParams(window.location.search);
        const kingdomFilter = params.get('kingdom');
        
        const filteredData = kingdomFilter 
          ? data.filter(m => m.kingdomId === kingdomFilter)
          : data;

        setManuscripts(filteredData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchManuscripts();
  }, []);

  const active = manuscripts[currentIdx];

  if (loading) {
    return (
      <div className="min-h-screen bg-matte-black flex flex-col items-center justify-center gap-6">
        <Loader2 className="animate-spin text-gold-elegant" size={40} />
        <span className="text-gold-elegant font-cinzel tracking-widest text-sm uppercase">Membuka Gulungan Serat...</span>
      </div>
    );
  }

  if (manuscripts.length === 0) {
    return (
      <div className="min-h-screen bg-matte-black pt-32 pb-20 px-6 flex flex-col items-center">
        <header className="text-center mb-20">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-4xl md:text-7xl font-cinzel text-gold-elegant mb-6 italic"
          >
            Syair & Sastra
          </motion.h1>
        </header>
        <div className="max-w-7xl mx-auto w-full text-center py-40 glass rounded-3xl border border-white/5">
           <h3 className="text-2xl font-cinzel text-cream/40 px-4 uppercase tracking-[0.2em]">Belum ada manuskrip dalam arsip ini</h3>
           <p className="text-cream/20 mt-4">Silakan periksa kembali di lain waktu.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-matte-black pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-20">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-4xl md:text-7xl font-cinzel text-gold-elegant mb-6 italic"
          >
            Syair & Sastra
          </motion.h1>
          <div className="flex items-center justify-center gap-2 text-cream/40 uppercase tracking-[0.2em] text-[10px]">
             <Book size={14} />
             <span>Manuskrip Kuno & Puisi Budaya</span>
          </div>
        </header>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-3 space-y-4">
            {manuscripts.map((item, idx) => (
              <button
                key={item.id || idx}
                onClick={() => {
                  setCurrentIdx(idx);
                  setIsPlaying(false);
                }}
                className={`w-full text-left p-6 rounded-2xl border transition-all duration-500 ${
                  currentIdx === idx 
                  ? "bg-gold-elegant/10 border-gold-elegant text-gold-elegant shadow-[0_0_20px_rgba(212,175,55,0.1)]" 
                  : "border-white/5 text-cream/40 hover:border-white/10 hover:text-cream/70"
                }`}
              >
                <span className="text-[10px] uppercase tracking-widest block mb-2 opacity-60">{item.period || item.year}</span>
                <h3 className="font-cinzel text-lg line-clamp-1">{item.title}</h3>
              </button>
            ))}
          </div>

          {/* Reading Mode */}
          <div className="lg:col-span-9">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id || currentIdx}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
                className="glass rounded-3xl border border-white/5 p-12 md:p-20 relative overflow-hidden"
              >
                {/* Decorative background pattern */}
                <div className="absolute top-0 right-0 p-20 opacity-[0.03] select-none pointer-events-none">
                  <Book size={400} />
                </div>

                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-12">
                    <div className="flex-1 mr-8">
                      <h2 className="text-4xl md:text-5xl font-cinzel text-white mb-4">{active.title}</h2>
                      <div className="flex flex-wrap gap-x-6 gap-y-2 text-gold-elegant/70 font-cinzel">
                        {active.author && <span>Oleh: {active.author}</span>}
                        <span>•</span>
                        <span>{active.period || active.year}</span>
                      </div>
                    </div>
                    
                    {active.audioUrl && (
                      <button 
                        onClick={() => setIsPlaying(!isPlaying)}
                        className={`shrink-0 w-16 h-16 rounded-full border border-gold-elegant flex items-center justify-center transition-all ${
                          isPlaying ? "bg-gold-elegant text-matte-black" : "text-gold-elegant hover:bg-gold-elegant/10"
                        }`}
                      >
                        {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
                      </button>
                    )}
                  </div>

                  <div className="space-y-12">
                    <div className="max-w-4xl">
                      <h4 className="text-xs uppercase tracking-widest text-gold-elegant/60 mb-6 flex items-center gap-2">
                        <span className="w-8 h-px bg-gold-elegant/30" />
                        Isi Manuskrip
                      </h4>
                      <p className="text-xl md:text-2xl font-cinzel leading-[2] text-cream/90 whitespace-pre-wrap">
                        {active.description || active.content || active.desc}
                      </p>
                    </div>

                    {active.philosophy && (
                      <div className="pt-12 border-t border-white/5 max-w-2xl">
                        <h4 className="text-xs uppercase tracking-widest text-gold-elegant/60 mb-4 font-bold">Filosofi Luar Biasa</h4>
                        <p className="text-lg text-cream/60 leading-loose italic">
                          "{active.philosophy}"
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="mt-20 flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5 gap-6">
                  <div className="flex items-center gap-4 text-cream/30">
                    <Music size={18} />
                    <span className="text-xs tracking-widest uppercase">{isPlaying ? "Audio Berjalan: Gamelan Ambience" : "Latar Belakang: Gamelan Ambience"}</span>
                  </div>
                  
                  <div className="flex gap-4">
                    <button 
                      disabled={currentIdx === 0}
                      onClick={() => {
                        setCurrentIdx(prev => prev - 1);
                        setIsPlaying(false);
                      }}
                      className="p-3 rounded-full border border-white/5 hover:bg-white/5 disabled:opacity-20 transition-all"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button 
                      disabled={currentIdx === manuscripts.length - 1}
                      onClick={() => {
                        setCurrentIdx(prev => prev + 1);
                        setIsPlaying(false);
                      }}
                      className="p-3 rounded-full border border-white/5 hover:bg-white/5 disabled:opacity-20 transition-all"
                    >
                      <ChevronRight size={24} />
                    </button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
      {/* Invisible Audio Player for functionality */}
      {active.audioUrl && (
        <audio 
          controls={false}
          autoPlay={false}
          onEnded={() => setIsPlaying(false)}
          ref={(audio) => {
            if (audio) {
              if (isPlaying) {
                audio.play().catch(e => console.error("Audio play failed", e));
              } else {
                audio.pause();
              }
            }
          }}
          src={active.audioUrl}
        />
      )}
    </div>
  );
}