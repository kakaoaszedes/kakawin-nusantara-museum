import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Info, Volume2, Video, MapPinned, Loader2, X, PlayCircle, BookOpen } from "lucide-react";
import { Button } from "../components/ui/Button";
import { getAllDocuments } from "../services/db";

export default function Relics() {
  const [relics, setRelics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [selectedRelic, setSelectedRelic] = useState<any>(null);
  const [activeVideo, setActiveVideo] = useState<any>(null);

  useEffect(() => {
    const fetchRelics = async () => {
      try {
        const data = await getAllDocuments("collections");
        
        // Filter by kingdom if provided in URL
        const params = new URLSearchParams(window.location.search);
        const kingdomFilter = params.get('kingdom');
        
        const filteredData = kingdomFilter 
          ? data.filter(p => p.kingdomId === kingdomFilter)
          : data;

        setRelics(filteredData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRelics();
  }, []);

  // Helper to format YouTube URLs for embedding
  const getEmbedUrl = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : url;
  };

  return (
    <div className="min-h-screen bg-matte-black pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-24">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-7xl font-cinzel text-gold-elegant mb-6"
          >
            Budaya & Pusaka
          </motion.h1>
          <p className="text-cream/60 max-w-2xl mx-auto uppercase tracking-[0.3em] text-xs">
            Menyelami Jiwa Nusantara melalui Objek-Objek Luhur
          </p>

          <div className="mt-16 flex flex-wrap justify-center gap-4">
             {["Semua", "Tari & Seni", "Budaya & Tradisi", "Rumah Adat", "Senjata & Pusaka"].map(cat => (
                <button 
                   key={cat}
                   onClick={() => setSelectedCategory(cat)}
                   className={`px-8 py-3 rounded-full border text-[10px] uppercase tracking-widest transition-all ${
                      selectedCategory === cat 
                      ? "bg-gold-elegant text-matte-black border-gold-elegant font-black" 
                      : "bg-transparent text-cream/40 border-white/10 hover:border-gold-elegant/50"
                   }`}
                >
                   {cat}
                </button>
             ))}
          </div>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-6">
            <Loader2 className="animate-spin text-gold-elegant" size={40} />
            <span className="text-gold-elegant font-cinzel tracking-widest text-sm">MEMANGGIL ARSIP...</span>
          </div>
        ) : relics.length === 0 ? (
          <div className="text-center py-32 glass rounded-3xl border border-white/5">
             <h3 className="text-2xl font-cinzel text-cream/40 px-4 uppercase tracking-[0.2em]">Belum ada koleksi budaya dalam arsip ini</h3>
             <p className="text-cream/20 mt-4 italic">Silakan periksa kembali di lain waktu.</p>
          </div>
        ) : (
          <div className="space-y-40">
            {relics
              .filter(r => selectedCategory === "Semua" || r.category === selectedCategory)
              .map((relic, i) => (
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
                    
                    <div className="absolute top-6 left-6">
                       <span className="px-4 py-2 bg-matte-black/60 backdrop-blur-md rounded-full border border-white/10 text-[8px] text-gold-elegant font-bold uppercase tracking-[0.2em]">
                          {relic.category || "Warisan"}
                       </span>
                    </div>
                  </div>
                </div>

                {/* Text Content */}
                <div className="flex-1 space-y-8">
                  <h2 className="text-4xl md:text-6xl font-cinzel text-white leading-tight">{relic.title}</h2>
                  
                  {relic.philosophy && (
                    <div className="p-8 bg-white/2 border-l-2 border-gold-elegant rounded-r-xl">
                      <h4 className="text-xs uppercase tracking-widest text-gold-elegant/60 mb-2">Filosofi</h4>
                      <p className="text-xl font-cinzel text-cream/90 italic leading-relaxed">
                        "{relic.philosophy}"
                      </p>
                    </div>
                  )}

                  <p className="text-lg text-cream/60 leading-loose">
                    {relic.description || relic.desc} Setiap elemen pada pusaka ini dikerjakan dengan ritual dan keahlian tinggi oleh para leluhur, menjadikannya bukan sekadar benda, melainkan perwujudan doa dan harapan.
                  </p>

                  <div className="flex flex-wrap gap-4 pt-4">
                    <Button 
                      onClick={() => setSelectedRelic(relic)}
                      variant="outline" 
                      className="gap-2 px-8 py-6 rounded-2xl group hover:bg-gold-elegant/10"
                    >
                      <Info size={18} className="group-hover:text-gold-elegant transition-colors" />
                      Detail Lengkap
                    </Button>
                    
                    <Button 
                      onClick={() => setActiveVideo(relic)}
                      variant="ghost" 
                      className={`gap-2 px-8 py-6 rounded-2xl group ${relic.videoUrl ? "text-gold-elegant border border-gold-elegant/20" : ""}`}
                    >
                      <PlayCircle size={18} className="group-hover:text-gold-elegant transition-colors" />
                      Video Dokumentasi
                    </Button>

                    {relic.audioUrl && (
                      <Button 
                        onClick={() => {
                          const audio = new Audio(relic.audioUrl);
                          audio.play();
                        }}
                        variant="ghost" 
                        className="gap-2 px-8 py-6 rounded-2xl group"
                      >
                        <Volume2 size={18} className="group-hover:text-gold-elegant transition-colors" />
                        Dengarkan Narasi
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedRelic && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedRelic(null)}
              className="absolute inset-0 bg-matte-black/95 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="relative w-full max-w-6xl bg-[#121212] rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
            >
              <div className="w-full md:w-1/2 h-64 md:h-auto relative">
                 <img src={selectedRelic.imageUrl || selectedRelic.image} alt="" className="w-full h-full object-cover" />
                 <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent md:bg-gradient-to-r" />
              </div>
              
              <div className="flex-1 p-8 md:p-16 overflow-y-auto custom-scrollbar">
                 <button 
                  onClick={() => setSelectedRelic(null)}
                  className="absolute top-8 right-8 text-cream/30 hover:text-white transition-colors"
                 >
                    <X size={24} />
                 </button>

                 <div className="space-y-10">
                    <div>
                       <span className="text-[10px] text-gold-elegant uppercase tracking-[0.4em] font-black block mb-4">Arsip Budaya Digital</span>
                       <h2 className="text-4xl md:text-5xl font-cinzel text-white mb-2">{selectedRelic.title}</h2>
                       <span className="text-cream/40 uppercase tracking-widest text-xs">{selectedRelic.category} — {selectedRelic.period || "Masa Nusantara"}</span>
                    </div>

                    <div className="prose prose-invert max-w-none">
                       <p className="text-cream/70 text-lg leading-loose font-light">
                          {selectedRelic.description || selectedRelic.desc}
                       </p>
                    </div>

                    {selectedRelic.philosophy && (
                      <div className="p-10 bg-white/5 rounded-[2rem] border-l-4 border-gold-elegant">
                         <h4 className="text-[10px] text-gold-elegant uppercase tracking-widest font-black mb-4">Filosofi & Makna</h4>
                         <p className="text-xl font-cinzel text-cream leading-relaxed italic">
                            "{selectedRelic.philosophy}"
                         </p>
                      </div>
                    )}

                    <div className="pt-10 border-t border-white/5 flex flex-wrap gap-8">
                       <div className="space-y-1">
                          <span className="text-[10px] text-cream/20 uppercase tracking-widest block font-bold">Asal Wilayah</span>
                          <span className="text-white font-cinzel uppercase">{selectedRelic.region || "Tidak Tercatat"}</span>
                       </div>
                       <div className="space-y-1">
                          <span className="text-[10px] text-cream/20 uppercase tracking-widest block font-bold">Kondisi Fisik</span>
                          <span className="text-white font-cinzel uppercase">Terawat</span>
                       </div>
                    </div>

                    <div className="pt-6">
                       <Button 
                        onClick={() => {
                          if (selectedRelic.videoUrl) {
                            setActiveVideo(selectedRelic);
                            setSelectedRelic(null);
                          } else {
                            alert("Dokumentasi video belum tersedia untuk koleksi ini.");
                          }
                        }}
                        className="w-full py-6 rounded-2xl gap-3 text-xs uppercase tracking-widest font-black"
                       >
                         <Video size={18} />
                         Lihat Dokumentasi Video
                       </Button>
                    </div>
                 </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Video Modal */}
      <AnimatePresence>
        {activeVideo && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 md:p-12">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveVideo(null)}
              className="absolute inset-0 bg-matte-black/98 backdrop-blur-2xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-5xl aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10"
            >
               <button 
                onClick={() => setActiveVideo(null)}
                className="absolute top-6 right-6 z-20 w-12 h-12 rounded-full bg-matte-black/60 text-white flex items-center justify-center hover:bg-gold-elegant hover:text-matte-black transition-all"
               >
                  <X size={24} />
               </button>

               {activeVideo.videoUrl ? (
                 <iframe 
                   src={getEmbedUrl(activeVideo.videoUrl)} 
                   className="w-full h-full"
                   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                   allowFullScreen
                   title={activeVideo.title}
                 />
               ) : (
                 <div className="w-full h-full flex flex-col items-center justify-center text-center p-12 space-y-6">
                    <Video size={64} className="text-gold-elegant/20 mb-4" />
                    <h3 className="text-3xl font-cinzel text-white">Video Belum Tersedia</h3>
                    <p className="text-cream/40 max-w-md uppercase tracking-widest text-[10px]">
                       Kami sedang memproses rekaman dokumentasi digital untuk {activeVideo.title}.
                    </p>
                    <Button variant="outline" onClick={() => setActiveVideo(null)} className="rounded-full">
                       Kembali ke Galeri
                    </Button>
                 </div>
               )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
