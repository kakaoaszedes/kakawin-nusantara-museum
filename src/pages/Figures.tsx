import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { User, Award, ExternalLink, Loader2 } from "lucide-react";
import { getAllDocuments } from "../services/db";

export default function Figures() {
  const [figures, setFigures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFigures = async () => {
      try {
        const data = await getAllDocuments("figures");
        
        // Filter by kingdom if provided in URL
        const params = new URLSearchParams(window.location.search);
        const kingdomFilter = params.get('kingdom');
        
        const filteredData = kingdomFilter 
          ? data.filter(f => f.kingdomId === kingdomFilter)
          : data;

        setFigures(filteredData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFigures();
  }, []);

  return (
    <div className="min-h-screen bg-matte-black pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-24">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-4xl md:text-7xl font-cinzel text-gold-elegant mb-6 italic"
          >
            Tokoh Sejarah
          </motion.h1>
          <p className="text-cream/60 max-w-2xl mx-auto uppercase tracking-[0.3em] text-[10px]">
            Barisan Arsitek Peradaban & Jiwa-Jiwa Agung Nusantara
          </p>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-6">
            <Loader2 className="animate-spin text-gold-elegant" size={40} />
            <span className="text-gold-elegant font-cinzel tracking-widest text-sm">MEMANGGIL TOKOH...</span>
          </div>
        ) : figures.length === 0 ? (
          <div className="text-center py-32 glass rounded-3xl border border-white/5">
             <h3 className="text-2xl font-cinzel text-cream/40 px-4">ARSIP TOKOH BELUM DITEMUKAN</h3>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {figures.map((figure, idx) => (
              <motion.div
                key={figure.id || idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="group relative h-[600px] rounded-3xl overflow-hidden glass border border-white/5"
              >
                <div className="absolute inset-0 bg-cover bg-center grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110" style={{ backgroundImage: `url(${figure.imageUrl})` }} />
                <div className="absolute inset-0 bg-gradient-to-t from-matte-black via-matte-black/40 to-transparent" />
                
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                   <div className="mb-6 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gold-elegant flex items-center justify-center text-matte-black shadow-lg">
                        <User size={20} />
                      </div>
                      <span className="text-[10px] uppercase tracking-[0.2em] text-gold-elegant font-bold">{figure.period}</span>
                   </div>
                   
                   <h3 className="text-3xl font-cinzel text-white mb-2 group-hover:text-gold-elegant transition-colors">{figure.name}</h3>
                   <span className="text-cream/50 uppercase tracking-widest font-poppins text-[10px] block mb-6">{figure.title}</span>
                   
                   <p className="text-sm text-cream/70 leading-relaxed translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                      {figure.biography || figure.bio}
                   </p>

                   <div className="mt-8 flex gap-4 opacity-0 group-hover:opacity-100 transition-all duration-500">
                      <button className="flex items-center gap-2 text-[10px] text-gold-elegant uppercase tracking-widest font-bold">
                        <Award size={14} />
                        Prestasi
                      </button>
                      <button className="flex items-center gap-2 text-[10px] text-white uppercase tracking-widest font-bold">
                        <ExternalLink size={14} />
                        Detail
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
