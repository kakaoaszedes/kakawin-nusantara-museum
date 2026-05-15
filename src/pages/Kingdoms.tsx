import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Landmark, Map, Loader2, X, Info, Search } from "lucide-react";
import { getAllDocuments, getImageUrl } from "../services/db";
import { Button } from "../components/ui/Button";

export default function Kerajaan() {
  const [kerajaan, setKerajaan] = useState<any[]>([]);
  const [budaya, setBudaya] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedKerajaan, setSelectedKerajaan] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [kData, bData] = await Promise.all([
          getAllDocuments("kerajaan"),
          getAllDocuments("budaya")
        ]);

        setKerajaan(kData || []);
        setBudaya(bData || []);
      } catch (err) {
        console.error("Error fetching kerajaan:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredKerajaan = kerajaan.filter((item) => {
    const keyword = searchQuery.toLowerCase();

    return [
      item.name,
      item.title,
      item.period,
      item.year,
      item.region,
      item.capital,
      item.origin,
      item.capitals?.[0],
      item.description,
      item.content,
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-7xl font-cinzel text-gold-elegant mb-6"
          >
            Sejarah Kerajaan
          </motion.h1>

          <p className="text-cream/60 max-w-2xl mx-auto uppercase tracking-[0.3em] text-xs">
            Menghidupkan Kembali Kejayaan Dinasti Nusantara
          </p>

          <div className="max-w-md mx-auto relative group mt-10">
            <Search
              className="absolute left-6 top-1/2 -translate-y-1/2 text-cream/20 group-focus-within:text-gold-elegant transition-colors"
              size={18}
            />

            <input
              type="text"
              placeholder="Cari kerajaan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full py-4 pl-16 pr-8 text-cream outline-none focus:border-gold-elegant transition-all text-sm"
            />
          </div>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-6">
            <Loader2 className="animate-spin text-gold-elegant" size={40} />
            <span className="text-gold-elegant font-cinzel tracking-widest text-sm">
              MEMANGGIL KERAJAAN...
            </span>
          </div>
        ) : kerajaan.length === 0 ? (
          <div className="text-center py-32 glass rounded-3xl border border-white/5">
            <h3 className="text-2xl font-cinzel text-cream/40 px-4">
              ARSIP KERAJAAN BELUM DITEMUKAN
            </h3>
          </div>
        ) : filteredKerajaan.length === 0 ? (
          <div className="text-center py-32 glass rounded-3xl border border-white/5">
            <h3 className="text-2xl font-cinzel text-cream/40 px-4">
              KERAJAAN TIDAK DITEMUKAN
            </h3>

            <p className="text-cream/20 mt-4 italic">
              Coba kata kunci lain.
            </p>
          </div>
        ) : (
          <div className="space-y-40">
            {filteredKerajaan.map((item, idx) => (
              <motion.div
                key={item.id || idx}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="absolute -top-12 left-0 text-[10rem] font-cinzel text-white/5 font-bold pointer-events-none select-none">
                  {idx + 1}
                </div>

                <div
                  className={`flex flex-col lg:flex-row gap-20 items-center ${
                    idx % 2 !== 0 ? "lg:flex-row-reverse" : ""
                  }`}
                >
                  {/* Visual */}
                  <div className="flex-1 w-full">
                    <div className="relative aspect-[4/3] rounded-3xl overflow-hidden glass border border-white/10 group shadow-2xl">
                      <img
                        src={getImageUrl(item)}
                        alt={item.name || item.title}
                        loading="lazy"
                        className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-matte-black via-transparent to-transparent" />

                      <div className="absolute bottom-8 left-8">
                        <span className="text-gold-elegant font-cinzel text-sm tracking-widest block mb-2 uppercase">
                          Core Territory
                        </span>

                        <span className="text-white text-xl font-cinzel">
                          {item.region || "Nusantara"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 space-y-8">
                    <div className="space-y-4">
                      <span className="text-gold-elegant font-cinzel text-base tracking-[0.3em] block mb-4 uppercase">
                        {item.period || item.year}
                      </span>

                      <h2 className="text-4xl md:text-6xl font-cinzel text-white mb-6 tracking-wider">
                        {item.name || item.title}
                      </h2>

                      <div className="prose prose-invert max-w-none">
                        <div
                          className="text-cream/70 text-lg leading-loose line-clamp-3 font-light"
                          dangerouslySetInnerHTML={{
                            __html:
                              item.description ||
                              item.content ||
                              "",
                          }}
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <Button
                        onClick={() => setSelectedKerajaan(item)}
                        variant="outline"
                        className="gap-2 px-8 py-5 rounded-2xl group hover:bg-gold-elegant/10"
                      >
                        <Info
                          size={18}
                          className="group-hover:text-gold-elegant transition-colors"
                        />
                        Baca Selengkapnya
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-8 py-8 border-y border-white/5">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-gold-elegant/60 uppercase tracking-widest text-[10px]">
                          <Landmark size={12} />
                          <span>Koleksi Terkait</span>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {budaya.filter((b) => b.kerajaan_id === item.id)
                            .length > 0 ? (
                            budaya
                              .filter((b) => b.kerajaan_id === item.id)
                              .slice(0, 3)
                              .map((b) => (
                                <div
                                  key={b.id}
                                  className="px-3 py-1 bg-white/5 rounded-full text-[10px] text-cream border border-white/10 italic"
                                >
                                  {b.title}
                                </div>
                              ))
                          ) : (
                            <span className="text-[10px] text-cream/20 italic">
                              Belum ada koleksi terdaftar
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <Map className="text-gold-elegant" size={24} />

                          <span className="text-xs text-cream/40 uppercase tracking-widest">
                            Peta Wilayah
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        (window.location.href = `/kingdom-archive?id=${item.id}`)
                      }
                      className="text-gold-elegant font-medium flex items-center gap-4 hover:gap-6 transition-all group"
                    >
                      <span className="h-px w-12 bg-gold-elegant group-hover:w-20 transition-all" />

                      Buka Arsip Dokumentasi
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedKerajaan && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedKerajaan(null)}
              className="absolute inset-0 bg-matte-black/95 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="relative w-full max-w-6xl h-[92vh] md:max-h-[90vh] bg-[#121212] rounded-[2rem] md:rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl flex flex-col md:flex-row"
            >
              <div className="w-full md:w-1/2 h-64 md:h-auto relative">
                <img
                  src={getImageUrl(selectedKerajaan)}
                  alt={selectedKerajaan.name || selectedKerajaan.title}
                  className="w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent md:bg-gradient-to-r" />
              </div>

              <div className="flex-1 p-6 pt-20 md:p-16 overflow-y-auto custom-scrollbar">
                <button
                  onClick={() => setSelectedKerajaan(null)}
                  className="absolute top-5 right-5 z-50 bg-black/40 rounded-full p-2 text-cream/60 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>

                <div className="space-y-10">
                  <div>
                    <span className="text-[10px] text-gold-elegant uppercase tracking-[0.4em] font-black block mb-4">
                      {selectedKerajaan.period || selectedKerajaan.year}
                    </span>

                    <h2 className="text-3xl md:text-5xl font-cinzel text-white mb-2">
                      {selectedKerajaan.name || selectedKerajaan.title}
                    </h2>

                    <span className="text-cream/40 uppercase tracking-widest text-xs font-bold">
                      {selectedKerajaan.region || "Nusantara"}
                    </span>
                  </div>

                  <div className="prose prose-invert max-w-none">
                    <div
                      className="text-cream/70 text-base md:text-lg leading-loose font-light"
                      dangerouslySetInnerHTML={{
                        __html:
                          selectedKerajaan.description ||
                          selectedKerajaan.content ||
                          "",
                      }}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-8 pt-10 border-t border-white/5">
                    <div className="space-y-1">
                      <span className="text-[10px] text-cream/20 uppercase tracking-widest block font-bold">
                        Ibu Kota
                      </span>

                      <span className="text-white font-cinzel uppercase">
                        {selectedKerajaan.capital ||
                          selectedKerajaan.origin ||
                          selectedKerajaan.capitals?.[0] ||
                          "Tidak diketahui"}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] text-cream/20 uppercase tracking-widest block font-bold">
                        Wilayah
                      </span>

                      <span className="text-white font-cinzel uppercase">
                        {selectedKerajaan.region || "Nusantara"}
                      </span>
                    </div>
                  </div>

                  <div className="pt-6">
                    <Button
                      onClick={() => setSelectedKerajaan(null)}
                      className="w-full py-6 rounded-2xl uppercase tracking-widest text-[10px] font-black"
                    >
                      Kembali ke Daftar Kerajaan
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