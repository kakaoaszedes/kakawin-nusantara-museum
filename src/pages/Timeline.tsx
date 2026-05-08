import { motion, AnimatePresence } from "motion/react";
import { History, Shield, Flame, Anchor, Landmark, Cpu, Search, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getAllDocuments } from "../services/db";

interface TimelineEvent {
  id: string;
  year: string;
  title: string;
  description?: string;
  desc?: string;
  imageUrl?: string;
  image?: string;
  category?: string;
}

export default function Timeline() {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getAllDocuments<TimelineEvent>("timeline");
        
        // Filter by kingdom if provided in URL
        const params = new URLSearchParams(window.location.search);
        const kingdomFilter = params.get('kingdom');
        
        const filteredData = kingdomFilter 
          ? data.filter(e => e.kingdomId === kingdomFilter)
          : data;

        // Sorting logic: extract number from year string
        const sortedData = [...filteredData].sort((a, b) => {
          // Regular expression to find the first sequence of digits
          const yearA = parseInt(a.year?.match(/\d+/)?.[0] || "0") || 0;
          const yearB = parseInt(b.year?.match(/\d+/)?.[0] || "0") || 0;
          
          // Handle BC/BCE if needed (negative years) - simple heuristic
          const isBCE_A = a.year?.toLowerCase().includes("sm") || a.year?.toLowerCase().includes("bc") || a.year?.toLowerCase().includes("sebelum");
          const isBCE_B = b.year?.toLowerCase().includes("sm") || b.year?.toLowerCase().includes("bc") || b.year?.toLowerCase().includes("sebelum");
          
          const valA = isBCE_A ? -yearA : yearA;
          const valB = isBCE_B ? -yearB : yearB;
          
          return valA - valB;
        });

        setEvents(sortedData);
      } catch (err) {
        console.error("Gagal memuat timeline:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (event.description || event.desc || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.year.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-matte-black pt-32 pb-20 px-6 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-7xl font-cinzel text-gold-elegant mb-6"
          >
            Garis Waktu Peradaban
          </motion.h1>
          <p className="text-cream/60 max-w-2xl mx-auto uppercase tracking-widest text-[10px] mb-12">
            Menyusuri lorong waktu dari fajar sejarah hingga masa depan
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto relative group">
             <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-cream/20 group-focus-within:text-gold-elegant transition-colors" size={18} />
             <input 
                type="text"
                placeholder="Cari peristiwa atau tahun..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-full py-4 pl-16 pr-8 text-cream outline-none focus:border-gold-elegant transition-all text-sm"
             />
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-6">
            <Loader2 className="animate-spin text-gold-elegant" size={40} />
            <span className="text-gold-elegant font-cinzel tracking-widest text-sm uppercase">Membuka Gulungan Sejarah...</span>
          </div>
        ) : (
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-1/2 -translate-x-1/2 top-10 bottom-10 w-px bg-gradient-to-b from-gold-elegant/0 via-gold-elegant/40 to-gold-elegant/0 hidden md:block" />

            {filteredEvents.length > 0 ? (
              <div className="space-y-40">
                {filteredEvents.map((event, index) => (
                  <motion.div
                    key={event.id || index}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    className={`flex flex-col md:flex-row items-center gap-8 md:gap-24 ${
                      index % 2 === 0 ? "" : "md:flex-row-reverse"
                    }`}
                  >
                    {/* Content */}
                    <div className="flex-1 text-center md:text-right w-full">
                      <div className={`flex flex-col ${index % 2 === 0 ? "md:items-end text-right" : "md:items-start text-left"}`}>
                        <div className="inline-block px-4 py-1 bg-gold-elegant/10 border border-gold-elegant/30 rounded-full mb-6">
                          <span className="text-gold-elegant font-cinzel text-xl">{event.year}</span>
                        </div>
                        <h3 className="text-3xl md:text-4xl font-cinzel mb-6 text-white tracking-tight">{event.title}</h3>
                        <p className="text-cream/70 leading-loose max-w-lg italic font-light line-clamp-3">
                          {event.description || event.desc}
                        </p>
                        <button 
                          onClick={() => setSelectedEvent(event)}
                          className="mt-6 text-gold-elegant text-[10px] uppercase tracking-[0.2em] font-bold border-b border-gold-elegant/30 hover:border-gold-elegant transition-all pb-1"
                        >
                          Baca Selengkapnya
                        </button>
                      </div>
                    </div>

                    {/* Central Point */}
                    <div className="relative z-10 shrink-0">
                       <div className="w-12 h-12 rounded-full bg-matte-black border-2 border-gold-elegant flex items-center justify-center text-gold-elegant shadow-[0_0_30px_rgba(212,175,55,0.3)] animate-pulse">
                          <History size={20} />
                       </div>
                       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gold-elegant/5 rounded-full blur-xl -z-10" />
                    </div>

                    {/* Image */}
                    <div className="flex-1 w-full">
                      <div className="aspect-[4/3] md:aspect-square lg:aspect-video rounded-[3rem] overflow-hidden glass border border-white/10 group shadow-2xl">
                        <img 
                          src={event.imageUrl || event.image} 
                          alt={event.title} 
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[50%] group-hover:grayscale-0" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-matte-black/60 to-transparent pointer-events-none" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-40 glass rounded-[3rem] border border-white/5">
                <p className="text-cream/40 font-cinzel italic text-2xl">Jejak sejarah tidak ditemukan dalam pencarian...</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedEvent(null)}
              className="absolute inset-0 bg-matte-black/90 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-5xl bg-[#121212] rounded-[3rem] border border-white/10 overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] flex flex-col md:flex-row max-h-[90vh]"
            >
               <div className="w-full md:w-1/2 h-64 md:h-auto relative">
                  <img src={selectedEvent.imageUrl || selectedEvent.image} alt={selectedEvent.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent md:bg-gradient-to-r" />
               </div>
               <div className="flex-1 p-8 md:p-16 overflow-y-auto custom-scrollbar">
                  <button 
                    onClick={() => setSelectedEvent(null)}
                    className="absolute top-8 right-8 text-cream/30 hover:text-white transition-colors"
                  >
                    Tutup [X]
                  </button>
                  <div className="inline-block px-4 py-1 bg-gold-elegant/10 border border-gold-elegant/30 rounded-full mb-6">
                    <span className="text-gold-elegant font-cinzel text-lg">{selectedEvent.year}</span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-cinzel text-white mb-8">{selectedEvent.title}</h2>
                  <div className="prose prose-invert max-w-none">
                     <p className="text-cream/70 text-lg leading-relaxed whitespace-pre-wrap italic font-light">
                        {selectedEvent.description || selectedEvent.desc}
                     </p>
                  </div>
                  <div className="mt-12 pt-8 border-t border-white/5 flex gap-4">
                     <div className="w-12 h-12 rounded-full border border-gold-elegant/30 flex items-center justify-center text-gold-elegant">
                        <History size={20} />
                     </div>
                     <div>
                        <span className="block text-[10px] uppercase tracking-widest text-cream/30">Arsip Digital</span>
                        <span className="text-sm text-gold-elegant font-cinzel">Museum Kakawin Nusantara</span>
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