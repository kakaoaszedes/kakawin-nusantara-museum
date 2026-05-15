import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin } from "lucide-react";
import { getAllDocuments, getImageUrl } from "../services/db";

interface Artefact {
  id: string;
  title: string;
  description: string;
  image_url: string;
  thumbnail?: string;
  category: string;
  region?: string;
  origin?: string;
  kingdomId?: string;
  created_at: string;
  updated_at: string;
}

const CATEGORIES = ["Semua", "Keris", "Batik", "Wayang", "Rumah Adat", "Alat Musik", "Tarian"];

export default function Collections() {
  const [artefacts, setArtefacts] = useState<Artefact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [selectedItem, setSelectedItem] = useState<Artefact | null>(null);

  useEffect(() => {
    const fetchArtefacts = async () => {
      try {
        console.log('Fetching artefacts from contents table...');
        const data = await getAllDocuments<Artefact>("budaya");
        console.log('Fetched data:', data);

        if (data.length > 0) {
          console.log('Found', data.length, 'collections in database');
          setArtefacts(data);
        } else {
          console.log('No collections found in database, using fallback data');
          setArtefacts([
            {
              id: "1",
              title: "Keris Kyai Naga Sasra",
              description: "Salah satu keris paling legendaris dengan luk 13 dan hiasan naga yang sangat detail.",
              image_url: "https://images.unsplash.com/photo-1596431969248-18e3a2b72ce2?q=80&w=800",
              category: "Keris",
              region: "Jawa Tengah",
              origin: "Majapahit",
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            },
            {
              id: "2",
              title: "Wayang Kulit Purwa",
              description: "Pementasan Wayang Kulit yang merupakan warisan budaya dunia takbenda dari UNESCO.",
              image_url: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=800",
              category: "Wayang",
              region: "DI Yogyakarta",
              origin: "Mataram",
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            },
            {
              id: "3",
              title: "Gamelan Ageng",
              description: "Perangkat musik tradisional yang menghasilkan harmoni suara spiritual Nusantara.",
              image_url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800",
              category: "Alat Musik",
              region: "Bali",
              origin: "Bali",
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ]);
        }
      } catch (error) {
        console.error("Failed to load artefacts:", error);
        console.log('Using fallback data due to error');
        setArtefacts([
          {
            id: "1",
            title: "Keris Kyai Naga Sasra",
            description: "Salah satu keris paling legendaris dengan luk 13 dan hiasan naga yang sangat detail.",
            image_url: "https://images.unsplash.com/photo-1596431969248-18e3a2b72ce2?q=80&w=800",
            category: "Keris",
            region: "Jawa Tengah",
            origin: "Majapahit",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: "2",
            title: "Wayang Kulit Purwa",
            description: "Pementasan Wayang Kulit yang merupakan warisan budaya dunia takbenda dari UNESCO.",
            image_url: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=800",
            category: "Wayang",
            region: "DI Yogyakarta",
            origin: "Mataram",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: "3",
            title: "Gamelan Ageng",
            description: "Perangkat musik tradisional yang menghasilkan harmoni suara spiritual Nusantara.",
            image_url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800",
            category: "Alat Musik",
            region: "Bali",
            origin: "Bali",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchArtefacts();
  }, []);

  const filteredArtefacts = artefacts.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Semua" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-matte-black pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-12">
          <div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-4xl md:text-6xl font-cinzel text-gold-elegant mb-4"
            >
              Koleksi Digital
            </motion.h1>
            <p className="text-cream/60 font-light tracking-wide">Menjelajahi pusaka dan warisan luhur yang dikurasi secara digital.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-cream/30 group-focus-within:text-gold-elegant transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Cari pusaka..."
                className="bg-white/5 border border-white/10 rounded-full py-3 pl-12 pr-6 outline-none focus:border-gold-elegant w-full sm:w-64 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-4 mb-12 overflow-x-auto pb-4 no-scrollbar">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2 rounded-full border transition-all whitespace-nowrap ${
                selectedCategory === cat 
                ? "bg-gold-elegant border-gold-elegant text-matte-black shadow-[0_0_15px_rgba(212,175,55,0.4)]" 
                : "border-white/10 text-cream/60 hover:border-gold-elegant/50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArtefacts.map((item, idx) => (
            <motion.div
              key={item.id}
              layoutId={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => setSelectedItem(item)}
              className="group cursor-pointer glass rounded-2xl overflow-hidden border border-white/5 hover:border-gold-elegant/30 transition-all duration-500"
            >
              <div className="aspect-[4/5] relative overflow-hidden">
                <img 
                  src={getImageUrl(item)} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-matte-black via-transparent to-transparent opacity-80" />
                <div className="absolute top-4 right-4 bg-matte-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] uppercase tracking-widest text-gold-elegant border border-gold-elegant/30">
                  {item.category}
                </div>
              </div>
              <div className="p-8">
                <div className="flex items-center gap-2 text-gold-elegant/60 text-[10px] uppercase tracking-widest mb-3">
                  <MapPin size={12} />
                  {item.region || "Nusantara"}
                </div>
                <h3 className="text-2xl font-cinzel mb-3 text-white group-hover:text-gold-elegant transition-colors">{item.title}</h3>
                <p className="text-sm text-cream/60 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Detail Modal */}
        <AnimatePresence>
          {selectedItem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12 md:p-20"
            >
              <div className="absolute inset-0 bg-matte-black/95 backdrop-blur-xl" onClick={() => setSelectedItem(null)} />
              
              <motion.div
                layoutId={selectedItem.id}
                className="relative w-full max-w-6xl glass rounded-3xl overflow-hidden shadow-2xl border border-white/10 flex flex-col md:flex-row h-full max-h-[800px]"
              >
                <div className="md:w-1/2 h-64 md:h-auto relative">
                  <img src={getImageUrl(selectedItem)} alt={selectedItem.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-matte-black opacity-30" />
                </div>
                
                <div className="md:w-1/2 p-8 md:p-16 overflow-y-auto">
                  <button 
                    className="absolute top-8 right-8 text-cream/40 hover:text-white transition-colors"
                    onClick={() => setSelectedItem(null)}
                  >
                    Tutup [ESC]
                  </button>
                  
                  <span className="text-gold-elegant font-cinzel text-sm tracking-[0.3em] uppercase mb-4 block">{selectedItem.category}</span>
                  <h2 className="text-4xl md:text-5xl font-cinzel text-white mb-8">{selectedItem.title}</h2>
                  
                  <div className="flex gap-12 mb-10 border-b border-white/5 pb-8">
                    <div>
                      <span className="text-xs text-cream/30 uppercase tracking-widest block mb-1">Region</span>
                      <span className="text-gold-elegant">{selectedItem.region}</span>
                    </div>
                    <div>
                      <span className="text-xs text-cream/30 uppercase tracking-widest block mb-1">Origin</span>
                      <span className="text-gold-elegant">{selectedItem.origin}</span>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div>
                      <h4 className="font-cinzel text-lg text-white mb-3">Deskripsi</h4>
                      <p className="text-cream/70 leading-loose">{selectedItem.description}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-cinzel text-lg text-white mb-3">Filosofi</h4>
                      <p className="text-cream/70 leading-loose italic">
                        {selectedItem.description} {/* Use description for philosophy in mock */}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-12 flex gap-4">
                    <button className="flex-1 bg-gold-elegant text-matte-black py-4 rounded-xl font-bold hover:bg-white transition-all">Audio Narasi</button>
                    <button className="flex-1 border border-white/10 py-4 rounded-xl font-bold hover:bg-white/5 transition-all">Lihat 3D Model</button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
