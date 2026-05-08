import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music, Play, Pause, SkipBack, SkipForward, Volume2, ListMusic, Headphones } from "lucide-react";

const tracks = [
  {
    title: "Gamelan Ambience: Kraton",
    category: "Atmosphere",
    duration: "4:32",
    desc: "Suara gamelan lembut yang direkam langsung di pelataran Keraton pada pagi hari.",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800"
  },
  {
    title: "Narasi: Kejayaan Majapahit",
    category: "Storytelling",
    duration: "12:15",
    desc: "Kisah epik penyatuan Nusantara yang dinarasikan dengan aksen Kawi kental.",
    image: "https://images.unsplash.com/photo-1596431969248-18e3a2b72ce2?q=80&w=800"
  },
  {
    title: "Kidun: Pangkur Jawi",
    category: "Poetry",
    duration: "6:45",
    desc: "Lantunan tembang Pangkur yang menceritakan tentang kearifan hidup dan spiritualitas.",
    image: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=800"
  }
];

export default function AudioExperience() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const active = tracks[currentIdx];

  return (
    <div className="min-h-screen bg-matte-black pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-24">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-cinzel text-gold-elegant mb-6 italic"
          >
            Audio Experience
          </motion.h1>
          <div className="flex items-center justify-center gap-4 text-cream/40 uppercase tracking-[0.3em] text-[10px]">
             <Headphones size={18} />
             <span>Immersive Soundscapes of Nusantara</span>
          </div>
        </header>

        <div className="grid lg:grid-cols-2 gap-20 items-center">
           {/* Player Visualizer side */}
           <motion.div
             key={currentIdx}
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             className="relative aspect-square rounded-[3rem] overflow-hidden glass border border-white/10 group shadow-2xl"
           >
              <img src={active.image} alt={active.title} className="w-full h-full object-cover grayscale opacity-40 transition-all duration-1000 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-matte-black via-matte-black/40 to-transparent" />
              
              {/* Visualizer bars placeholder */}
              <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex items-end gap-1 h-32">
                 {[...Array(20)].map((_, i) => (
                   <motion.div
                     key={i}
                     animate={isPlaying ? { height: [20, Math.random() * 80 + 20, 20] } : { height: 10 }}
                     transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.05 }}
                     className="w-1.5 bg-gold-elegant/60 rounded-full"
                   />
                 ))}
              </div>

              <div className="absolute bottom-8 left-0 w-full text-center">
                 <span className="text-gold-elegant font-cinzel text-sm tracking-widest uppercase">{active.category}</span>
              </div>
           </motion.div>

           {/* Controls side */}
           <div className="space-y-12">
              <div className="space-y-4">
                 <h2 className="text-4xl md:text-6xl font-cinzel text-white leading-tight">{active.title}</h2>
                 <p className="text-lg text-cream/60 leading-relaxed max-w-lg">
                   {active.desc}
                 </p>
              </div>

              {/* Player UI */}
              <div className="space-y-8 glass p-10 rounded-3xl border border-white/5 shadow-xl">
                 <div className="space-y-2">
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                       <motion.div 
                         initial={{ width: "0%" }}
                         animate={isPlaying ? { width: "100%" } : {}}
                         transition={{ duration: 100, ease: "linear" }}
                         className="h-full bg-gold-elegant shadow-[0_0_10px_rgba(212,175,55,0.5)]" 
                       />
                    </div>
                    <div className="flex justify-between text-[10px] uppercase tracking-widest text-cream/30">
                       <span>1:24</span>
                       <span>{active.duration}</span>
                    </div>
                 </div>

                 <div className="flex items-center justify-between">
                    <button className="text-cream/40 hover:text-white transition-colors">
                       <ListMusic size={24} />
                    </button>
                    
                    <div className="flex items-center gap-10">
                       <button 
                         onClick={() => setCurrentIdx(prev => prev > 0 ? prev - 1 : tracks.length - 1)}
                         className="text-white/60 hover:text-gold-elegant transition-colors"
                        >
                          <SkipBack size={32} />
                       </button>
                       <button 
                         onClick={() => setIsPlaying(!isPlaying)}
                         className="w-20 h-20 rounded-full bg-gold-elegant text-matte-black flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.3)] hover:scale-105 transition-all"
                       >
                          {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
                       </button>
                       <button 
                         onClick={() => setCurrentIdx(prev => (prev + 1) % tracks.length)}
                         className="text-white/60 hover:text-gold-elegant transition-colors"
                       >
                          <SkipForward size={32} />
                       </button>
                    </div>

                    <button className="text-cream/40 hover:text-gold-elegant transition-colors">
                       <Volume2 size={24} />
                    </button>
                 </div>
              </div>

              {/* More tracks */}
              <div>
                 <h4 className="text-xs uppercase tracking-[0.3em] text-cream/30 mb-6 px-4">Selanjutnya dalam Playlist</h4>
                 <div className="space-y-4">
                    {tracks.filter((_, i) => i !== currentIdx).map((track, i) => (
                      <button 
                         key={i} 
                         onClick={() => setCurrentIdx(tracks.indexOf(track))}
                         className="w-full flex items-center justify-between p-4 rounded-xl border border-white/5 hover:bg-white/5 transition-all group"
                      >
                         <div className="flex items-center gap-4 text-left">
                            <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0">
                               <img src={track.image} alt="" className="w-full h-full object-cover grayscale" />
                            </div>
                            <div>
                               <span className="text-white text-sm block group-hover:text-gold-elegant transition-colors">{track.title}</span>
                               <span className="text-[10px] text-cream/30 uppercase tracking-widest">{track.category}</span>
                            </div>
                         </div>
                         <span className="text-cream/30 text-[10px]">{track.duration}</span>
                      </button>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
