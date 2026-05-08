import { motion } from "framer-motion";
import { Move, Info, ZoomIn, Compass, ArrowRight } from "lucide-react";
import { Button } from "../components/ui/Button";

export default function VirtualTour() {
  return (
    <div className="min-h-screen bg-matte-black pt-32 pb-20 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col h-full">
        <header className="mb-12">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-5xl font-cinzel text-gold-elegant mb-4"
          >
            Virtual Tour
          </motion.h1>
          <p className="text-cream/50 tracking-widest uppercase text-xs">Jelajahi Ruang Kurasi dalam Pengalaman 360°</p>
        </header>

        <div className="flex-1 relative glass rounded-[3rem] border border-white/10 overflow-hidden min-h-[600px]">
           {/* Simulated 360 Background */}
           <motion.div 
             animate={{ scale: [1, 1.1, 1] }}
             transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
             className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1596431969248-18e3a2b72ce2?q=80&w=2670')] bg-cover bg-center grayscale opacity-40 blur-sm scale-110" 
           />
           
           <div className="absolute inset-0 bg-gradient-to-t from-matte-black via-transparent to-matte-black/60" />

           {/* UI Overlays */}
           <div className="absolute inset-x-0 bottom-12 px-12 flex justify-between items-end">
              <div className="space-y-4">
                 <div className="text-white">
                    <span className="text-gold-elegant font-cinzel text-xs tracking-widest block mb-2">SEKARANG DI</span>
                    <h2 className="text-4xl font-cinzel tracking-wider">RUANG UTAMA: <span className="text-gold-elegant">MAJAPAHIT</span></h2>
                 </div>
                 <div className="flex gap-4">
                    <button className="p-3 bg-white/10 rounded-full text-white hover:bg-gold-elegant hover:text-matte-black transition-all">
                       <Move size={20} />
                    </button>
                    <button className="p-3 bg-white/10 rounded-full text-white hover:bg-gold-elegant hover:text-matte-black transition-all">
                       <ZoomIn size={20} />
                    </button>
                 </div>
              </div>

              <div className="flex flex-col gap-4 text-right">
                 <div className="glass p-6 rounded-2xl border border-white/10 max-w-xs ml-auto">
                    <p className="text-sm text-cream/70 leading-relaxed mb-4">
                       "Anda sedang melihat rekonstruksi digital Balairung Kerajaan pada abad ke-14."
                    </p>
                    <Button variant="outline" size="sm" className="w-full gap-2">
                       <Info size={14} />
                       Info Objek Terdekat
                    </Button>
                 </div>
                 <Button className="gap-2">
                    Masuk ke Ruang Berikutnya
                    <ArrowRight size={18} />
                 </Button>
              </div>
           </div>

           {/* Interactive Points */}
           <div className="absolute top-1/2 left-1/3 group cursor-pointer">
              <motion.div 
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-8 h-8 rounded-full border-2 border-gold-elegant bg-gold-elegant/20 flex items-center justify-center"
              />
              <div className="absolute top-10 left-1/2 -translate-x-1/2 whitespace-nowrap glass px-4 py-2 rounded-lg text-xs font-cinzel text-gold-elegant opacity-0 group-hover:opacity-100 transition-all">
                 Singgasana Raja
              </div>
           </div>

           <div className="absolute top-1/3 right-1/4 group cursor-pointer">
              <motion.div 
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                className="w-8 h-8 rounded-full border-2 border-gold-elegant bg-gold-elegant/20 flex items-center justify-center transition-all"
              />
               <div className="absolute top-10 left-1/2 -translate-x-1/2 whitespace-nowrap glass px-4 py-2 rounded-lg text-xs font-cinzel text-gold-elegant opacity-0 group-hover:opacity-100 transition-all">
                 Panji Gula Kelapa
              </div>
           </div>

           {/* Controls overlay centrally */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-20">
              <Compass size={120} className="text-gold-elegant animate-spin" style={{ animationDuration: '20s' }} />
           </div>
        </div>

        <div className="mt-12 grid grid-cols-4 gap-4">
           {['Gerbang Utama', 'Ruang Senjata', 'Galeri Sastra', 'Peta Wilayah'].map((room, i) => (
             <button key={i} className={`p-4 rounded-xl border font-cinzel text-xs tracking-widest transition-all ${i === 0 ? 'bg-gold-elegant border-gold-elegant text-matte-black' : 'bg-white/2 border-white/10 text-cream/40 hover:border-gold-elegant/30 hover:text-white'}`}>
                {room.toUpperCase()}
             </button>
           ))}
        </div>
      </div>
    </div>
  );
}
