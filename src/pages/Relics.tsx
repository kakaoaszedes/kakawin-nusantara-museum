import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Info, Volume2, Video, MapPinned, Loader2 } from "lucide-react";
import { Button } from "../components/ui/Button";
import { getAllDocuments } from "../services/db";

export default function Relics() {
  const [relics, setRelics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelics = async () => {
      try {
        const data = await getAllDocuments("collections");
        setRelics(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRelics();
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
            Budaya & Pusaka
          </motion.h1>
          <p className="text-cream/60 max-w-2xl mx-auto uppercase tracking-[0.3em] text-xs">
            Menyelami Jiwa Nusantara melalui Objek-Objek Luhur
          </p>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-6">
            <Loader2 className="animate-spin text-gold-elegant" size={40} />
            <span className="text-gold-elegant font-cinzel tracking-widest text-sm">MEMANGGIL ARSIP...</span>
          </div>
        ) : (
          <div className="space-y-40">
            {relics.map((relic, i) => (
              <motion.div 
                key={relic.id || i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
                className={`flex flex-col lg:flex-row gap-20 items-center ${i % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}
              >
                {/* Image with Decorative Border */}
                <div className="flex-1 relative group">
                  <div className="absolute -inset-4 border border-gold-elegant/20 rounded-2xl group-hover:-inset-6 transition-all duration-700" />
                  <div className="relative aspect-square md:aspect-[4/3] rounded-xl overflow-hidden glass shadow-2xl">
                    <img src={relic.imageUrl || relic.image} alt={relic.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-matte-black/80 via-transparent to-transparent" />
                  </div>
                </div>

                {/* Text Content */}
                <div className="flex-1 space-y-8">
                  <div className="flex items-center gap-4 text-gold-elegant">
                    <MapPinned size={20} />
                    <span className="text-sm font-poppins tracking-[0.2em] uppercase">{relic.origin}</span>
                  </div>
                  
                  <h2 className="text-4xl md:text-6xl font-cinzel text-white leading-tight">{relic.title}</h2>
                  
                  <div className="p-8 bg-white/2 border-l-2 border-gold-elegant rounded-r-xl">
                    <h4 className="text-xs uppercase tracking-widest text-gold-elegant/60 mb-2">Filosofi</h4>
                    <p className="text-xl font-cinzel text-cream/90 italic leading-relaxed">
                      "{relic.philosophy}"
                    </p>
                  </div>

                  <p className="text-lg text-cream/60 leading-loose">
                    {relic.description || relic.desc} Setiap elemen pada pusaka ini dikerjakan dengan ritual dan keahlian tinggi oleh para leluhur, menjadikannya bukan sekadar benda, melainkan perwujudan doa dan harapan.
                  </p>

                  <div className="flex flex-wrap gap-4 pt-4">
                    <Button variant="outline" className="gap-2">
                      <Info size={18} />
                      Detail Lengkap
                    </Button>
                    <Button variant="ghost" className="gap-2">
                      <Volume2 size={18} />
                      Dengarkan Narasi
                    </Button>
                    <Button variant="ghost" className="gap-2">
                      <Video size={18} />
                      Dokumentasi
                    </Button>
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
