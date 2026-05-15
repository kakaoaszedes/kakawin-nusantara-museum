import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { User, Award, ExternalLink, Loader2, X, Search } from "lucide-react";
import { getAllDocuments, getImageUrl } from "../services/db";
import { Button } from "../components/ui/Button";

export default function tokoh() {
  const [tokoh, settokoh] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFigure, setSelectedFigure] = useState<any>(null);

  useEffect(() => {
    const fetchtokoh = async () => {
      try {
        const data = await getAllDocuments<any>("tokoh");
        
        // Filter by kingdom if provided in URL
        const params = new URLSearchParams(window.location.search);
        const kingdomFilter = params.get('kingdom');
        
        const filteredData = kingdomFilter 
          ? data.filter((f: any) => f.kingdomId === kingdomFilter)
          : data;

        settokoh(filteredData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchtokoh();
  }, []);

  const filteredTokoh = tokoh.filter((figure) => {
    const keyword = searchQuery.toLowerCase();
    return [
      figure.name,
      figure.title,
      figure.period,
      figure.year,
      figure.biography,
      figure.bio,
      figure.description,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(keyword);
  });

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

          <div className="max-w-md mx-auto relative group mt-10">
            <Search
              className="absolute left-6 top-1/2 -translate-y-1/2 text-cream/20 group-focus-within:text-gold-elegant transition-colors"
              size={18}
            />

            <input
              type="text"
              placeholder="Cari tokoh sejarah..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full py-4 pl-16 pr-8 text-cream outline-none focus:border-gold-elegant transition-all text-sm"
            />
          </div>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-6">
            <Loader2 className="animate-spin text-gold-elegant" size={40} />
            <span className="text-gold-elegant font-cinzel tracking-widest text-sm">MEMANGGIL TOKOH...</span>
          </div>
        ) : tokoh.length === 0 ? (
          <div className="text-center py-32 glass rounded-3xl border border-white/5">
             <h3 className="text-2xl font-cinzel text-cream/40 px-4">ARSIP TOKOH BELUM DITEMUKAN</h3>
          </div>
        ) : filteredTokoh.length === 0 ? (
          <div className="text-center py-32 glass rounded-3xl border border-white/5">
             <h3 className="text-2xl font-cinzel text-cream/40 px-4">TOKOH TIDAK DITEMUKAN</h3>
             <p className="text-cream/20 mt-4 italic">Coba kata kunci lain.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 px-4">
            {filteredTokoh.map((figure, idx) => (
              <motion.div
                key={figure.id || idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                viewport={{ once: true }}
                className="group relative h-[480px] rounded-[2.5rem] overflow-hidden glass border border-white/5 flex flex-col"
              >
                <div className="absolute inset-0 bg-cover bg-center grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" style={{ backgroundImage: `url(${getImageUrl(figure)})` }} />
                <div className="absolute inset-0 bg-gradient-to-t from-matte-black via-matte-black/60 to-transparent" />
                
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                   <div className="mb-4 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gold-elegant flex items-center justify-center text-matte-black shadow-lg">
                        <User size={14} />
                      </div>
                      <span className="text-[9px] uppercase tracking-[0.2em] text-gold-elegant font-bold">{figure.period}</span>
                   </div>
                   
                   <h3 className="text-xl md:text-2xl font-cinzel text-white mb-1 group-hover:text-gold-elegant transition-colors leading-tight">{figure.name || figure.title}</h3>
                   <span className="text-cream/50 uppercase tracking-widest font-poppins text-[9px] block mb-4">{figure.title}</span>
                   
                   <div className="prose prose-invert max-w-none">
                      <div 
                        className="text-[13px] text-cream/70 leading-relaxed md:translate-y-4 opacity-100 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 transition-all duration-500 line-clamp-3 font-light"
                        dangerouslySetInnerHTML={{ __html: figure.biography || figure.bio || figure.description }}
                      />
                   </div>
 
                   <div className="mt-4 flex gap-4 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-500">
                      <button 
                        onClick={() => setSelectedFigure(figure)}
                        className="flex items-center gap-2 text-[9px] text-gold-elegant uppercase tracking-widest font-bold border-b border-gold-elegant/20 hover:border-gold-elegant transition-all pb-1"
                      >
                        Detail Tokoh
                      </button>
                   </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedFigure && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedFigure(null)}
              className="absolute inset-0 bg-matte-black/95 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="relative w-full max-w-4xl bg-[#121212] rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[85vh]"
            >
              <div className="w-full md:w-2/5 h-64 md:h-auto relative">
                 <img src={getImageUrl(selectedFigure)} alt="" className="w-full h-full object-cover grayscale" />
                 <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent md:bg-gradient-to-r" />
              </div>
              
              <div className="flex-1 p-8 md:p-16 overflow-y-auto custom-scrollbar">
                 <button 
                  onClick={() => setSelectedFigure(null)}
                  className="absolute top-8 right-8 text-cream/30 hover:text-white transition-colors"
                 >
                    <X size={24} />
                 </button>

                 <div className="space-y-10">
                    <div>
                       <span className="text-[10px] text-gold-elegant uppercase tracking-[0.4em] font-black block mb-4">{selectedFigure.period}</span>
                       <h2 className="text-4xl font-cinzel text-white mb-2">{selectedFigure.name || selectedFigure.title}</h2>
                       <span className="text-cream/40 uppercase tracking-widest text-xs font-bold">{selectedFigure.title}</span>
                    </div>

                    <div className="prose prose-invert max-w-none">
                       <div 
                        className="text-cream/70 text-lg leading-loose font-light"
                        dangerouslySetInnerHTML={{ __html: selectedFigure.biography || selectedFigure.bio || selectedFigure.description }}
                       />
                    </div>

                    <div className="pt-10 border-t border-white/5">
                       <Button onClick={() => setSelectedFigure(null)} className="w-full rounded-2xl py-6 uppercase tracking-widest text-[10px]">
                          Tutup Galeri Tokoh
                       </Button>
                    </div>
                 </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

