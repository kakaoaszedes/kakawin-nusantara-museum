import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Calendar, Ticket, ArrowRight, History, Loader2 } from "lucide-react";
import { Button } from "../components/ui/Button";
import { getAllDocuments } from "../services/db";

export default function Exhibitions() {
  const [exhibitions, setExhibitions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExhibitions = async () => {
      try {
        const data = await getAllDocuments("exhibitions");
        setExhibitions(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchExhibitions();
  }, []);

  const activeEvent = exhibitions.find(e => e.isActive || e.status === 'active');
  const upcomingEvents = exhibitions.filter(e => e.status === 'upcoming' || (!e.isActive && new Date(e.startDate) > new Date()));
  const archive = exhibitions.filter(e => e.status === 'archive' || (!e.isActive && new Date(e.endDate) < new Date()));

  return (
    <div className="min-h-screen bg-matte-black pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-24">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-cinzel text-gold-elegant mb-6"
          >
            Pameran Digital
          </motion.h1>
          <p className="text-cream/60 max-w-2xl mx-auto uppercase tracking-[0.3em] text-[10px]">
             Ruang Eksibisi Tematik & Event Kebudayaan
          </p>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-6">
            <Loader2 className="animate-spin text-gold-elegant" size={40} />
            <span className="text-gold-elegant font-cinzel tracking-widest text-sm">MEMANGGIL AGENDA...</span>
          </div>
        ) : (
          <>
            {activeEvent ? (
              <section className="mb-40">
                <div className="text-xs uppercase tracking-[0.5em] text-gold-elegant mb-12 flex items-center gap-6">
                  <span className="w-12 h-px bg-gold-elegant" />
                  Pameran Berlangsung
                  <span className="w-12 h-px bg-gold-elegant" />
                </div>

                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative h-[600px] rounded-[3rem] overflow-hidden group shadow-[0_0_100px_rgba(212,175,55,0.15)]"
                >
                  <div className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105" style={{ backgroundImage: `url(${activeEvent.imageUrl || activeEvent.image})` }} />
                  <div className="absolute inset-0 bg-gradient-to-r from-matte-black via-matte-black/40 to-transparent" />
                  
                  <div className="absolute inset-y-0 left-0 p-12 md:p-20 flex flex-col justify-center max-w-2xl">
                     <div className="bg-gold-elegant text-matte-black px-4 py-2 rounded-full w-fit flex items-center gap-2 mb-8 animate-pulse">
                        <div className="w-2 h-2 rounded-full bg-matte-black animate-ping" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">LIVE NOW</span>
                     </div>
                     
                     <h2 className="text-4xl md:text-6xl font-cinzel text-white mb-6 leading-tight">{activeEvent.title}</h2>
                     <p className="text-lg text-cream/70 mb-10 leading-relaxed font-light">
                       {activeEvent.description || activeEvent.desc}
                     </p>

                     <div className="flex flex-wrap gap-6 items-center">
                        <div className="flex items-center gap-3 text-gold-elegant">
                           <Calendar size={20} />
                           <span className="font-medium">{activeEvent.date || `${activeEvent.startDate.toDate?.()?.toLocaleDateString() || activeEvent.startDate} - ${activeEvent.endDate.toDate?.()?.toLocaleDateString() || activeEvent.endDate}`}</span>
                        </div>
                        <Button size="lg" className="gap-3">
                           Dapatkan Tiket Virtual
                           <Ticket size={20} />
                        </Button>
                     </div>
                  </div>

                  <div className="absolute bottom-12 right-12 text-right">
                     <span className="text-cream/30 uppercase tracking-[0.3em] text-[10px] block mb-2">Pameran Aktif</span>
                     <span className="text-4xl font-cinzel text-gold-elegant font-bold">TERBUKA</span>
                  </div>
                </motion.div>
              </section>
            ) : (
              <div className="text-center py-32 glass rounded-3xl border border-white/5 mb-40">
                 <h3 className="text-2xl font-cinzel text-cream/40 px-4">Tidak ada pameran yang sedang berlangsung saat ini.</h3>
              </div>
            )}

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
                        <img src={event.imageUrl || event.image} alt={event.title} className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" />
                      </div>
                      <div className="flex-1 space-y-4">
                        <span className="text-gold-elegant font-cinzel text-sm">{event.date || event.startDate}</span>
                        <h4 className="text-2xl font-cinzel text-white">{event.title}</h4>
                        <p className="text-cream/60 text-sm leading-relaxed">{event.description || event.desc}</p>
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
