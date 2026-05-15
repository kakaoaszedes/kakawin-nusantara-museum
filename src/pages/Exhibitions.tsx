import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Calendar, Ticket, ArrowRight, History, Loader2 } from "lucide-react";
import { Button } from "../components/ui/Button";
import { getAllDocuments, getImageUrl } from "../services/db";

export default function Exhibitions() {
  const [exhibitions, setExhibitions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  useEffect(() => {
    const fetchExhibitions = async () => {
      try {
        const data = await getAllDocuments("pameran");
        setExhibitions(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchExhibitions();
  }, []);

  const now = new Date();
  
  const activeEvents = exhibitions.filter(e => {
    const isMatchingDate = (() => {
      if (e.status === 'active') return true;
      if (e.startDate && e.endDate) {
        const start = new Date(e.startDate);
        const end = new Date(e.endDate);
        end.setHours(23, 59, 59, 999);
        return now >= start && now <= end;
      }
      return e.isActive;
    })();

    if (!isMatchingDate) return false;
    if (selectedCategory === "Semua") return true;
    return e.category === selectedCategory;
  });

  const upcomingEvents = exhibitions.filter(e => {
    if (activeEvents.some(ae => ae.id === e.id)) return false;
    if (e.status === 'upcoming') return true;
    if (e.startDate) {
      const start = new Date(e.startDate);
      return start > now;
    }
    return false;
  });

  const archive = exhibitions.filter(e => {
    if (activeEvents.some(ae => ae.id === e.id)) return false;
    if (e.status === 'archive') return true;
    if (e.endDate) {
      const end = new Date(e.endDate);
      end.setHours(23, 59, 59, 999);
      return end < now;
    }
    return false;
  });

  return (
    <div className="min-h-screen bg-matte-black pt-32 pb-20 px-6 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-24">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-cinzel text-gold-elegant mb-6"
          >
            Agenda Pameran
          </motion.h1>
          <p className="text-cream/60 max-w-2xl mx-auto uppercase tracking-[0.3em] text-[10px]">
             Ruang Eksibisi Tematik & Event Kebudayaan Digital
          </p>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-6">
            <Loader2 className="animate-spin text-gold-elegant" size={40} />
            <span className="text-gold-elegant font-cinzel tracking-widest text-sm">MEMANGGIL AGENDA...</span>
          </div>
        ) : (
          <>
            <section className="mb-40">
              <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-8">
                <div className="text-xs uppercase tracking-[0.5em] text-gold-elegant flex items-center gap-6">
                  <span className="w-12 h-px bg-gold-elegant" />
                  Sedang Berlangsung ({activeEvents.length})
                  <span className="hidden md:block w-12 h-px bg-gold-elegant" />
                </div>

                <div className="flex gap-4 overflow-x-auto pb-4 w-full md:w-auto px-4 custom-scrollbar lg:justify-end">
                   {["Semua", "Sastra & Syair", "Tokoh Sejarah", "Seni Lukis", "Manuskrip Kuno", "Artefak & Senjata"].map(cat => (
                     <button 
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-6 py-2 rounded-full border text-[10px] uppercase tracking-widest transition-all whitespace-nowrap ${
                          selectedCategory === cat 
                          ? "border-gold-elegant bg-gold-elegant text-matte-black font-black" 
                          : "border-white/10 text-cream/40 hover:border-gold-elegant/50 hover:text-gold-elegant"
                        }`}
                     >
                        {cat}
                     </button>
                   ))}
                </div>
              </div>

              {activeEvents.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-12">
                  {activeEvents.map((event, idx) => (
                    <motion.div 
                      key={event.id || idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="relative h-[550px] rounded-[3rem] overflow-hidden group shadow-2xl border border-white/5 bg-[#121212]"
                    >
                      <img 
                        src={getImageUrl(event)} 
                        alt={event.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-60" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-matte-black via-matte-black/60 to-transparent" />
                      
                      <div className="absolute inset-x-0 top-0 p-12 flex justify-between items-start pointer-events-none">
                         <div className="px-4 py-2 bg-matte-black/40 backdrop-blur-md rounded-full border border-white/10 text-[10px] text-gold-elegant font-bold tracking-[0.2em] uppercase">
                           {event.category || "Pameran Umum"}
                         </div>
                      </div>

                      <div className="absolute inset-x-0 bottom-0 p-12 flex flex-col justify-end h-full">
                         <div className="flex items-center gap-3 mb-6">
                            <div className="bg-gold-elegant text-matte-black px-3 py-1 rounded-full flex items-center gap-2">
                               <div className="w-1.5 h-1.5 rounded-full bg-matte-black animate-pulse" />
                               <span className="text-[8px] font-black uppercase tracking-widest">AKTIF</span>
                            </div>
                            <span className="text-xs text-gold-elegant font-mono italic">
                               {event.startDate} — {event.endDate}
                            </span>
                         </div>
                         
                         <h2 className="text-3xl font-cinzel text-white mb-4 leading-tight">{event.title}</h2>
                         <div className="prose prose-invert max-w-none">
                            <div 
                              className="text-sm text-cream/70 mb-8 leading-relaxed line-clamp-3 italic"
                              dangerouslySetInnerHTML={{ __html: event.description || event.desc }}
                            />
                         </div>

                         <div className="flex items-center justify-between pt-6 border-t border-white/10">
                            <Button variant="outline" className="gap-2 rounded-full px-6 group/btn">
                               Explore Exhibition
                               <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                            </Button>
                            <div className="text-right">
                               <span className="block text-[8px] uppercase tracking-widest text-cream/30">Lokasi</span>
                               <span className="text-[10px] text-gold-elegant uppercase font-bold tracking-widest">Ruang Virtual 1</span>
                            </div>
                         </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-32 glass rounded-3xl border border-white/5">
                   <h3 className="text-2xl font-cinzel text-cream/40 px-4 italic">Belum ada pameran yang dibuka hari ini.</h3>
                </div>
              )}
            </section>

            <div className="grid lg:grid-cols-12 gap-20">
              {/* Upcoming Section */}
              <div className="lg:col-span-8">
                <h3 className="text-3xl font-cinzel text-white mb-12 flex items-center gap-4">
                  Pameran Mendatang
                  <span className="h-px flex-1 bg-white/5" />
                </h3>
                
                <div className="space-y-8">
                  {upcomingEvents.length > 0 ? upcomingEvents.map((event, idx) => (
                    <div key={event.id || idx} className="glass p-8 rounded-3xl border border-white/5 flex flex-col md:flex-row gap-8 group hover:bg-white/5 transition-all">
                      <div className="w-full md:w-64 h-48 rounded-2xl overflow-hidden shrink-0">
                        <img src={getImageUrl(event)} alt={event.title} className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" />
                      </div>
                      <div className="flex-1 space-y-4">
                        <span className="text-gold-elegant font-cinzel text-sm">{event.date || event.startDate}</span>
                        <h4 className="text-2xl font-cinzel text-white">{event.title}</h4>
                        <div className="prose prose-invert max-w-none">
                           <div 
                             className="text-cream/60 text-sm leading-relaxed"
                             dangerouslySetInnerHTML={{ __html: event.description || event.desc }}
                           />
                        </div>
                        <button className="text-gold-elegant text-xs uppercase tracking-widest font-bold flex items-center gap-2 pt-2">
                           Set Remainder
                           <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  )) : (
                    <p className="text-cream/30 italic">Belum ada agenda mendatang.</p>
                  )}
                </div>
              </div>

              {/* Archive Section */}
              <div className="lg:col-span-4">
                <h3 className="text-3xl font-cinzel text-white mb-12 flex items-center gap-4">
                  Arsip
                  <span className="h-px flex-1 bg-white/5" />
                </h3>

                <div className="space-y-6">
                  {archive.length > 0 ? archive.map((item, idx) => (
                    <div key={item.id || idx} className="p-6 border-b border-white/5 hover:bg-white/2 transition-all flex justify-between items-center group cursor-pointer">
                      <div>
                        <h5 className="text-cream/80 group-hover:text-gold-elegant transition-colors mb-1">{item.title}</h5>
                        <span className="text-[10px] uppercase tracking-widest text-cream/30">{item.date || item.endDate}</span>
                      </div>
                      <History className="text-cream/10 group-hover:text-gold-elegant transition-colors" size={20} />
                    </div>
                  )) : (
                    <p className="text-cream/30 italic">Arsip masih kosong.</p>
                  )}
                </div>
                
                <Button variant="ghost" className="w-full mt-10">Lihat Semua Arsip</Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
