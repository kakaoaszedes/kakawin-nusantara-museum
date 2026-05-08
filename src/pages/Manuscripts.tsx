import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Book, Music, Play, Pause, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../components/ui/Button";

const manuscripts = [
  {
    title: "Kakawin Sutasoma",
    author: "Mpu Tantular",
    period: "Majapahit, Abad XIV",
    content: "Bhinneka tunggal ika tan hana dharma mangrwa. \n\nArtinya: Terpecah belah itu satu, tidak ada kebenaran yang mendua. \n\nBait legendaris ini menjadi pemersatu bangsa Indonesia hingga hari ini, mengajarkan bahwa di balik keragaman terdapat satu esensi yang sama.",
    philosophy: "Toleransi dan kesatuan dalam perbedaan spiritual.",
    audio: "/audio/sutasoma.mp3"
  },
  {
    title: "Nagarakretagama",
    author: "Mpu Prapanca",
    period: "Majapahit, 1365 M",
    content: "Mengisahkan tentang perjalanan Raja Hayam Wuruk dan kemakmuran wilayah Majapahit. \n\nPencatatan sejarah yang detail mengenai tata kota, upacara keagamaan, dan struktur pemerintahan yang sangat maju pada zamannya.",
    philosophy: "Tatanan negara yang adil dan makmur.",
    audio: "/audio/nagarakretagama.mp3"
  },
  {
    title: "Syair Perahu",
    author: "Hamzah Fansuri",
    period: "Kesultanan Aceh, Abad XVI",
    content: "Wahai muda kenali dirimu, \nialah perahu tamsil tubuhmu, \ntiadalah berapa lama hidupmu, \nke akhirat jua kekal diammu. \n\nInilah metafora perjalanan spiritual manusia menuju Sang Pencipta.",
    philosophy: "Perjalanan spiritual dan kefanaan dunia.",
    audio: "/audio/perahu.mp3"
  }
];

export default function Manuscripts() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const active = manuscripts[currentIdx];

  return (
    <div className="min-h-screen bg-matte-black pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-20">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-5xl md:text-7xl font-cinzel text-gold-elegant mb-6 italic"
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
                key={idx}
                onClick={() => setCurrentIdx(idx)}
                className={`w-full text-left p-6 rounded-2xl border transition-all duration-500 ${
                  currentIdx === idx 
                  ? "bg-gold-elegant/10 border-gold-elegant text-gold-elegant shadow-[0_0_20px_rgba(212,175,55,0.1)]" 
                  : "border-white/5 text-cream/40 hover:border-white/10 hover:text-cream/70"
                }`}
              >
                <span className="text-[10px] uppercase tracking-widest block mb-2 opacity-60">{item.period}</span>
                <h3 className="font-cinzel text-lg">{item.title}</h3>
              </button>
            ))}
          </div>

          {/* Reading Mode */}
          <div className="lg:col-span-9">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIdx}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="glass rounded-3xl border border-white/5 p-12 md:p-20 relative overflow-hidden"
              >
                {/* Decorative background pattern */}
                <div className="absolute top-0 right-0 p-20 opacity-[0.03] select-none pointer-events-none">
                  <Book size={400} />
                </div>

                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-12">
                    <div>
                      <h2 className="text-4xl md:text-5xl font-cinzel text-white mb-4">{active.title}</h2>
                      <div className="flex gap-6 text-gold-elegant/70 font-cinzel">
                        <span>Oleh: {active.author}</span>
                        <span>•</span>
                        <span>{active.period}</span>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => setIsPlaying(!isPlaying)}
                      className={`w-16 h-16 rounded-full border border-gold-elegant flex items-center justify-center transition-all ${
                        isPlaying ? "bg-gold-elegant text-matte-black" : "text-gold-elegant hover:bg-gold-elegant/10"
                      }`}
                    >
                      {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
                    </button>
                  </div>

                  <div className="space-y-12">
                    <div className="max-w-3xl">
                      <h4 className="text-xs uppercase tracking-widest text-gold-elegant/60 mb-6 flex items-center gap-2">
                        <span className="w-8 h-px bg-gold-elegant/30" />
                        Isi Manuskrip
                      </h4>
                      <p className="text-2xl md:text-3xl font-cinzel leading-[2] text-cream/90 whitespace-pre-line">
                        {active.content}
                      </p>
                    </div>

                    <div className="pt-12 border-t border-white/5 max-w-2xl">
                      <h4 className="text-xs uppercase tracking-widest text-gold-elegant/60 mb-4">Filosofi Luar Biasa</h4>
                      <p className="text-lg text-cream/60 leading-loose italic">
                        "{active.philosophy}"
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="mt-20 flex justify-between items-center pt-8 border-t border-white/5">
                  <div className="flex items-center gap-4 text-cream/30">
                    <Music size={18} />
                    <span className="text-xs tracking-widest uppercase">Latar Belakang: Gamelan Ambience</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <button 
                      disabled={currentIdx === 0}
                      onClick={() => setCurrentIdx(prev => prev - 1)}
                      className="p-3 rounded-full hover:bg-white/5 disabled:opacity-20"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button 
                      disabled={currentIdx === manuscripts.length - 1}
                      onClick={() => setCurrentIdx(prev => prev + 1)}
                      className="p-3 rounded-full hover:bg-white/5 disabled:opacity-20"
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
    </div>
  );
}
