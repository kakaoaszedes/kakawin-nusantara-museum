import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Maximize2, X, Camera, Film, Loader2 } from "lucide-react";
import { getAllDocuments, getImageUrl } from "../services/db";

export default function Gallery() {
  const [galleryItems, setGalleryItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any>(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const data = await getAllDocuments("gallery");
        setGalleryItems(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
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
            Galeri Visual
          </motion.h1>
          <p className="text-cream/60 max-w-2xl mx-auto uppercase tracking-[0.3em] text-[10px]">
             Dokumentasi Abadi Warisan Nusantara dalam Definisi Tinggi
          </p>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-6">
            <Loader2 className="animate-spin text-gold-elegant" size={40} />
            <span className="text-gold-elegant font-cinzel tracking-widest text-sm">MEMANGGIL VISUAL...</span>
          </div>
        ) : galleryItems.length === 0 ? (
          <div className="text-center py-32 glass rounded-3xl border border-white/5">
             <h3 className="text-2xl font-cinzel text-cream/40 px-4">ARSIP VISUAL BELUM DITEMUKAN</h3>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryItems.map((item, idx) => (
              <motion.div
                key={item.id || idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                viewport={{ once: true }}
                onClick={() => setSelected(item)}
                className="group relative aspect-square md:aspect-[4/5] rounded-2xl overflow-hidden glass border border-white/5 cursor-pointer"
              >
                <img 
                  src={getImageUrl(item)} 
                  alt={item.title} 
                  loading="lazy"
                  className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-matte-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                
                <div className="absolute inset-0 p-8 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 text-center">
                   <span className="text-gold-elegant font-cinzel text-[10px] uppercase tracking-[0.3em] mb-2">{item.category}</span>
                   <h3 className="text-2xl font-cinzel text-white mb-6 leading-tight">{item.title}</h3>
                   <div className="w-12 h-12 rounded-full border border-gold-elegant mx-auto flex items-center justify-center text-gold-elegant mt-2">
                      <Maximize2 size={18} />
                   </div>
                </div>

                {/* Icon Indicator */}
                <div className="absolute top-6 left-6 p-2 bg-matte-black/40 backdrop-blur-md rounded-lg text-cream/40 border border-white/5">
                  {item.type === 'video' ? <Film size={16} /> : <Camera size={16} />}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Lightbox */}
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12"
            >
              <div className="absolute inset-0 bg-matte-black/95 backdrop-blur-2xl" onClick={() => setSelected(null)} />
              
              <button 
                className="absolute top-12 right-12 z-[110] p-4 bg-white/5 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-all"
                onClick={() => setSelected(null)}
              >
                <X size={32} />
              </button>

              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative z-[105] max-w-6xl w-full h-full flex flex-col items-center justify-center"
              >
                 <div className="relative w-full h-[80%] rounded-3xl overflow-hidden glass border border-white/10 shadow-[0_0_100px_rgba(212,175,55,0.1)]">
                    <img src={getImageUrl(selected)} alt={selected.title} className="w-full h-full object-contain" />
                 </div>
                 <div className="mt-8 text-center" onClick={(e) => e.stopPropagation()}>
                    <span className="text-gold-elegant font-cinzel text-xs tracking-[0.3em] mb-2 uppercase block">{selected.category}</span>
                    <h2 className="text-4xl font-cinzel text-white tracking-widest">{selected.title}</h2>
                 </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
