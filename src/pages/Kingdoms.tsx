import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Landmark, Map, Users, ScrollText, Loader2 } from "lucide-react";
import { getAllDocuments } from "../services/db";

export default function Kingdoms() {
  const [kingdoms, setKingdoms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKingdoms = async () => {
      try {
        const data = await getAllDocuments("kingdoms");
        setKingdoms(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchKingdoms();
  }, []);

  return (
    <div className="min-h-screen bg-matte-black pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-24">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-cinzel text-gold-elegant mb-6"
          >
            Sejarah Kerajaan
          </motion.h1>
          <p className="text-cream/60 max-w-2xl mx-auto uppercase tracking-[0.3em] text-xs">
            Menghidupkan Kembali Kejayaan Dinasti Nusantara
          </p>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-6">
            <Loader2 className="animate-spin text-gold-elegant" size={40} />
            <span className="text-gold-elegant font-cinzel tracking-widest text-sm">MEMANGGIL KERAJAAN...</span>
          </div>
        ) : kingdoms.length === 0 ? (
          <div className="text-center py-32 glass rounded-3xl border border-white/5">
             <h3 className="text-2xl font-cinzel text-cream/40 px-4">ARSIP KERAJAAN BELUM DITEMUKAN</h3>
          </div>
        ) : (
          <div className="space-y-40">
            {kingdoms.map((kingdom, idx) => (
              <motion.div
                key={kingdom.id || idx}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="absolute -top-12 left-0 text-[10rem] font-cinzel text-white/5 font-bold pointer-events-none select-none">
                  {idx + 1}
                </div>

                <div className={`flex flex-col lg:flex-row gap-20 items-center ${idx % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
                  {/* Visual side */}
                  <div className="flex-1 w-full">
                    <div className="relative aspect-[4/3] rounded-3xl overflow-hidden glass border border-white/10 group shadow-2xl">
                      <img src={kingdom.imageUrl || kingdom.image} alt={kingdom.name} className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000" />
                      <div className="absolute inset-0 bg-gradient-to-t from-matte-black via-transparent to-transparent" />
                      <div className="absolute bottom-8 left-8">
                         <span className="text-gold-elegant font-cinzel text-sm tracking-widest block mb-2 uppercase">Core Territory</span>
                         <span className="text-white text-xl font-cinzel">{kingdom.region?.split('(')[0]}</span>
                      </div>
                    </div>
                  </div>

                  {/* Info side */}
                  <div className="flex-1 space-y-8">
                    <div>
                      <span className="text-gold-elegant font-cinzel text-lg tracking-[0.3em] block mb-4 uppercase">{kingdom.period}</span>
                      <h2 className="text-5xl md:text-7xl font-cinzel text-white mb-6 tracking-wider">{kingdom.name}</h2>
                      <p className="text-xl text-cream/70 leading-loose">
                        {kingdom.description || kingdom.desc}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-8 py-8 border-y border-white/5">
                      <div className="space-y-2">
                         <div className="flex items-center gap-2 text-gold-elegant/60 uppercase tracking-widest text-[10px]">
                           <Landmark size={12} />
                           <span>Peninggalan</span>
                         </div>
                         <ul className="text-sm text-cream/50 space-y-1">
                           {(kingdom.relics || []).map((r: string) => <li key={r}>• {r}</li>)}
                         </ul>
                      </div>
                      <div className="space-y-4">
                         <div className="flex items-center gap-4">
                           <Map className="text-gold-elegant" size={24} />
                           <span className="text-xs text-cream/40 uppercase tracking-widest">Peta Wilayah</span>
                         </div>
                         <div className="flex items-center gap-4">
                           <ScrollText className="text-gold-elegant" size={24} />
                           <span className="text-xs text-cream/40 uppercase tracking-widest">Silsilah Raja</span>
                         </div>
                      </div>
                    </div>

                    <button className="text-gold-elegant font-medium flex items-center gap-4 hover:gap-6 transition-all group">
                      <span className="h-px w-12 bg-gold-elegant group-hover:w-20 transition-all" />
                      Buka Arsip Dokumentasi
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
