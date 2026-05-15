import { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { 
  Landmark, 
  Map as MapIcon, 
  Users, 
  BookMarked, 
  Clock, 
  ChevronLeft, 
  Loader2,
  ScrollText,
  AudioLines
} from "lucide-react";
import { getAllDocuments, getDocument, getImageUrl } from "../services/db";

export default function KingdomArchive() {
  const [searchParams] = useSearchParams();
  const kingdomId = searchParams.get("id");
  const navigate = useNavigate();

  const [kingdom, setKingdom] = useState<any>(null);
  const [collections, setCollections] = useState<any[]>([]);
  const [figures, setFigures] = useState<any[]>([]);
  const [manuscripts, setManuscripts] = useState<any[]>([]);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!kingdomId) {
      navigate("/kingdoms");
      return;
    }

    const fetchData = async () => {
      try {
        const [kData, allC, allF, allM, allT] = await Promise.all([
          getDocument<any>("kingdoms", kingdomId),
          getAllDocuments<any>("budaya"),
          getAllDocuments<any>("tokoh"),
          getAllDocuments<any>("syair"),
          getAllDocuments<any>("timeline")
        ]);

        setKingdom(kData);
        setCollections(allC.filter((c: any) => c.kingdomId === kingdomId));
        setFigures(allF.filter((f: any) => f.kingdomId === kingdomId));
        setManuscripts(allM.filter((m: any) => m.kingdomId === kingdomId));
        setTimeline(allT.filter((t: any) => t.kingdomId === kingdomId));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [kingdomId, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-matte-black flex flex-col items-center justify-center gap-6">
        <Loader2 className="animate-spin text-gold-elegant" size={40} />
        <span className="text-gold-elegant font-cinzel tracking-widest text-sm uppercase">Membuka Gerbang Arsip...</span>
      </div>
    );
  }

  if (!kingdom) {
    return (
      <div className="min-h-screen bg-matte-black pt-40 px-6 text-center">
        <h2 className="text-3xl font-cinzel text-cream/40 mb-8 uppercase tracking-widest">Arsip Tidak Ditemukan</h2>
        <button 
          onClick={() => navigate("/kingdoms")}
          className="text-gold-elegant flex items-center gap-2 mx-auto uppercase tracking-widest text-xs font-bold"
        >
          <ChevronLeft size={16} /> Kembali ke Kerajaan
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0C0C0C] pb-32">
      {/* Hero Section */}
      <div className="relative h-[60vh] overflow-hidden">
        <div className="absolute inset-0 bg-matte-black/60 z-10" />
        <img 
          src={getImageUrl(kingdom)} 
          alt={kingdom.name || kingdom.title} 
          className="w-full h-full object-cover blur-sm scale-110" 
        />
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center p-6 bg-gradient-to-t from-matte-black via-transparent to-transparent">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <span className="text-gold-elegant font-cinzel text-lg tracking-[0.5em] block uppercase">{kingdom.period}</span>
            <h1 className="text-5xl md:text-7xl font-cinzel text-white tracking-widest">{kingdom.name || kingdom.title}</h1>
            <div className="w-24 h-px bg-gold-elegant/50 mx-auto" />
            <p className="text-cream/60 max-w-2xl mx-auto uppercase tracking-widest text-xs">Pusat Dokumentasi Digital Dinasti Nusantara</p>
          </motion.div>
        </div>
        
        <button 
          onClick={() => navigate("/kingdoms")}
          className="absolute top-32 left-10 z-30 flex items-center gap-3 text-white/40 hover:text-gold-elegant transition-all text-[10px] uppercase tracking-widest font-bold group"
        >
          <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-gold-elegant">
            <ChevronLeft size={16} />
          </div>
          Kembali
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-20 relative z-30">
        <div className="grid lg:grid-cols-12 gap-12">
          {/* Summary Card */}
          <div className="lg:col-span-4">
             <div className="glass rounded-[3rem] border border-white/10 p-10 space-y-10 sticky top-32 shadow-2xl">
                <div>
                   <span className="text-[10px] text-gold-elegant uppercase tracking-widest font-black block mb-4">Sejarah Singkat</span>
                   <div className="prose prose-invert max-w-none">
                      <div 
                        className="text-cream/70 leading-loose italic font-light"
                        dangerouslySetInnerHTML={{ __html: kingdom.description || kingdom.desc }}
                      />
                   </div>
                </div>

                <div className="space-y-6 pt-10 border-t border-white/5">
                   <div className="flex justify-between items-center">
                      <span className="text-[10px] text-cream/30 uppercase tracking-widest">Ibu Kota</span>
                      <span className="text-gold-elegant font-cinzel">
                        {kingdom.capital ||
                          kingdom.origin ||
                          kingdom.capitals?.[0] ||
                          "Tidak Diketahui"}
                      </span>
                   </div>
                   <div className="flex justify-between items-center">
                      <span className="text-[10px] text-cream/30 uppercase tracking-widest">Wilayah</span>
                      <span className="text-white font-cinzel">{kingdom.region || "Nusantara"}</span>
                   </div>
                   <div className="flex justify-between items-center">
                      <span className="text-[10px] text-cream/30 uppercase tracking-widest">Artefak Terdaftar</span>
                      <span className="text-white font-cinzel">{collections.length} Data</span>
                   </div>
                   <div className="flex justify-between items-center">
                      <span className="text-[10px] text-cream/30 uppercase tracking-widest">Tokoh Arsitek</span>
                      <span className="text-white font-cinzel">{figures.length} Tokoh</span>
                   </div>
                </div>


             </div>
          </div>

          {/* Archive Sections */}
          <div className="lg:col-span-8 space-y-24">
             {/* Collections */}
             <section>
                <div className="flex items-center gap-6 mb-12">
                   <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-gold-elegant">
                      <Landmark size={24} />
                   </div>
                   <div>
                      <h2 className="text-3xl font-cinzel text-white tracking-widest">Koleksi & Pusaka</h2>
                      <p className="text-[10px] text-cream/30 uppercase tracking-[0.3em]">Harta Karun {kingdom.name || kingdom.title}</p>
                   </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                   {collections.slice(0, 4).map(item => (
                      <div key={item.id} className="group cursor-pointer" onClick={() => navigate(`/relics?kingdom=${kingdomId}`)}>
                         <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-white/5 mb-6">
                            <img src={getImageUrl(item)} alt={item.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-matte-black via-transparent to-transparent opacity-60" />
                         </div>
                         <h4 className="font-cinzel text-xl text-white group-hover:text-gold-elegant transition-colors">{item.title}</h4>
                         <p className="text-xs text-cream/40 mt-1 uppercase tracking-widest">{item.category}</p>
                      </div>
                   ))}
                   {collections.length === 0 && <p className="text-cream/20 italic">Belum ada koleksi terdaftar untuk kerajaan ini.</p>}
                </div>
                {collections.length > 0 && (
                   <button onClick={() => navigate(`/relics?kingdom=${kingdomId}`)} className="mt-12 text-[10px] text-gold-elegant uppercase font-bold tracking-[0.2em] border-b border-gold-elegant/20 pb-1 hover:border-gold-elegant transition-all">Lihat Semua Koleksi</button>
                )}
             </section>

             {/* Figures */}
             <section className="p-12 glass rounded-[3rem] border border-white/5">
                <div className="flex items-center gap-6 mb-12">
                   <div className="w-12 h-12 bg-gold-elegant/10 border border-gold-elegant/20 rounded-2xl flex items-center justify-center text-gold-elegant">
                      <Users size={24} />
                   </div>
                   <div>
                      <h2 className="text-3xl font-cinzel text-white tracking-widest">Tokoh Sejarah</h2>
                      <p className="text-[10px] text-cream/30 uppercase tracking-[0.3em]">Arsitek Peradaban</p>
                   </div>
                </div>

                <div className="space-y-4">
                   {figures.map(item => (
                      <div key={item.id} className="flex items-center gap-6 p-6 rounded-2xl hover:bg-white/5 transition-all group" onClick={() => navigate(`/figures?kingdom=${kingdomId}`)}>
                         <div className="w-16 h-16 rounded-full overflow-hidden border border-white/10 group-hover:border-gold-elegant transition-all grayscale group-hover:grayscale-0">
                            <img src={getImageUrl(item)} alt="" className="w-full h-full object-cover" />
                         </div>
                         <div className="flex-1">
                            <h4 className="text-xl font-cinzel text-white group-hover:text-gold-elegant transition-colors">{item.name || item.title}</h4>
                            <span className="text-[10px] text-cream/40 uppercase tracking-widest">{item.title}</span>
                         </div>
                      </div>
                   ))}
                   {figures.length === 0 && <p className="text-cream/20 italic">Arsip tokoh belum tersedia.</p>}
                </div>
             </section>

             {/* Manuscripts */}
             <section>
                <div className="flex items-center gap-6 mb-12">
                   <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-gold-elegant">
                      <BookMarked size={24} />
                   </div>
                   <div>
                      <h2 className="text-3xl font-cinzel text-white tracking-widest">Sastra</h2>
                      <p className="text-[10px] text-cream/30 uppercase tracking-[0.3em]">Rekaman Budaya Tertulis</p>
                   </div>
                </div>

                <div className="space-y-6">
                   {manuscripts.map(item => (
                      <div key={item.id} className="p-8 border border-white/5 rounded-[2rem] hover:border-gold-elegant/30 transition-all group" onClick={() => navigate(`/manuscripts?kingdom=${kingdomId}`)}>
                         <div className="flex items-center justify-between mb-4">
                            <h4 className="text-2xl font-cinzel text-white group-hover:text-gold-elegant transition-colors">{item.title}</h4>
                            <AudioLines className="text-gold-elegant opacity-0 group-hover:opacity-100 transition-all" size={20} />
                         </div>
                         <p className="text-cream/60 line-clamp-2 italic font-light leading-relaxed">{item.description || item.content}</p>
                      </div>
                   ))}
                   {manuscripts.length === 0 && <p className="text-cream/20 italic">Belum ada manuskrip terdokumentasi.</p>}
                </div>
             </section>

             {/* timeline */}
             <section className="p-12 glass rounded-[3rem] border border-white/5 bg-gradient-to-br from-gold-elegant/[0.03] to-transparent">
                <div className="flex items-center gap-6 mb-12">
                   <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-gold-elegant">
                      <Clock size={24} />
                   </div>
                   <div>
                      <h2 className="text-3xl font-cinzel text-white tracking-widest">Garis Waktu Peristiwa</h2>
                      <p className="text-[10px] text-cream/30 uppercase tracking-[0.3em]">Kronologi Kejayaan {kingdom.name || kingdom.title}</p>
                   </div>
                </div>

                <div className="relative pl-8 border-l border-white/10 space-y-12">
                   {timeline.map(item => (
                      <div key={item.id} className="relative group cursor-pointer" onClick={() => navigate(`/timeline?kingdom=${kingdomId}`)}>
                         <div className="absolute -left-[41px] top-1 w-4 h-4 rounded-full bg-[#0C0C0C] border-2 border-gold-elegant shadow-[0_0_10px_rgba(212,175,55,0.5)] group-hover:scale-125 transition-all" />
                         <span className="text-gold-elegant font-cinzel text-xs tracking-widest mb-1 block">{item.year}</span>
                         <h4 className="text-xl font-cinzel text-white group-hover:text-gold-elegant transition-colors">{item.title}</h4>
                         <p className="text-xs text-cream/40 mt-2 line-clamp-2">{item.description || item.desc}</p>
                      </div>
                   ))}
                   {timeline.length === 0 && <p className="text-cream/20 italic">Data kronologi belum diperbarui.</p>}
                </div>
             </section>
          </div>
        </div>
      </div>
    </div>
  );
}
