import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Book,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Pause,
  Play,
  Search,
  X,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { getAllDocuments } from "../services/db";

export default function Manuscripts() {
  const [manuscripts, setManuscripts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedManuscript, setSelectedManuscript] = useState<any>(null);
  const [selectedManuscriptExpanded, setSelectedManuscriptExpanded] =
    useState(false);

  useEffect(() => {
    const fetchManuscripts = async () => {
      try {
        const data = await getAllDocuments<any>("syair");
        const params = new URLSearchParams(window.location.search);
        const kingdomFilter = params.get("kingdom");

        const filteredData = kingdomFilter
          ? data.filter((m: any) => m.kingdomId === kingdomFilter)
          : data;

        setManuscripts(filteredData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchManuscripts();
  }, []);

  useEffect(() => {
    setCurrentIdx(0);
    setIsPlaying(false);
    setSelectedManuscript(null);
    setSelectedManuscriptExpanded(false);
  }, [searchQuery]);

  const filteredManuscripts = manuscripts.filter((item) => {
    const keyword = searchQuery.toLowerCase();

    return [
      item.title,
      item.author,
      item.period,
      item.year,
      item.description,
      item.content,
      item.desc,
      item.philosophy,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(keyword);
  });

  const openManuscript = (item: any, index: number) => {
    setSelectedManuscript(item);
    setCurrentIdx(index);
    setIsPlaying(false);
    setSelectedManuscriptExpanded(false);
  };

  const moveManuscript = (direction: -1 | 1) => {
    const nextIdx = currentIdx + direction;
    const nextItem = filteredManuscripts[nextIdx];

    if (!nextItem) return;

    setCurrentIdx(nextIdx);
    setSelectedManuscript(nextItem);
    setIsPlaying(false);
    setSelectedManuscriptExpanded(false);
  };

  const closeReader = () => {
    setSelectedManuscript(null);
    setIsPlaying(false);
    setSelectedManuscriptExpanded(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#100d0a] flex flex-col items-center justify-center gap-6">
        <Loader2 className="animate-spin text-[#c49a55]" size={40} />
        <span className="text-[#c49a55] font-cinzel tracking-widest text-sm uppercase">
          Membuka Arsip Sastra...
        </span>
      </div>
    );
  }

  if (manuscripts.length === 0) {
    return (
      <div className="min-h-screen bg-[#100d0a] pt-32 pb-20 px-6 flex flex-col items-center">
        <header className="text-center mb-20">
          <motion.h1
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-5xl md:text-8xl font-cinzel text-[#d4b06a] mb-6 italic"
          >
            Sastra
          </motion.h1>
        </header>

        <div className="max-w-4xl mx-auto w-full text-center py-36 rounded-[2rem] border border-[#d4b06a]/15 bg-[#1a1410]/80 shadow-[0_40px_120px_rgba(0,0,0,0.45)]">
          <h3 className="text-2xl font-cinzel text-[#d8c8a3]/50 px-4 uppercase tracking-[0.2em]">
            Belum ada manuskrip dalam arsip ini
          </h3>
          <p className="text-[#d8c8a3]/30 mt-4">
            Silakan periksa kembali di lain waktu.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0c09] pt-32 pb-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_0%,rgba(177,121,55,0.18),transparent_36%),linear-gradient(180deg,rgba(12,9,7,0.15),#0f0c09_72%)]" />
      <div className="absolute inset-0 pointer-events-none opacity-[0.08] bg-[linear-gradient(115deg,transparent_0%,rgba(255,255,255,0.22)_1px,transparent_2px,transparent_18px)] bg-[length:44px_44px]" />
      <div className="absolute inset-x-0 top-0 h-96 pointer-events-none bg-gradient-to-b from-[#6d4b2a]/20 to-transparent" />

      <div className="max-w-7xl mx-auto relative">
        <header className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="text-5xl md:text-8xl font-cinzel text-[#d4b06a] mb-5 italic drop-shadow-[0_18px_45px_rgba(212,176,106,0.16)]"
          >
            Sastra
          </motion.h1>

          <div className="flex items-center justify-center gap-2 text-[#d8c8a3]/45 uppercase tracking-[0.28em] text-[10px]">
            <Book size={14} />
            <span>Manuskrip Kuno & Puisi Budaya</span>
          </div>

          <div className="max-w-xl mx-auto relative group mt-10">
            <Search
              className="absolute left-6 top-1/2 -translate-y-1/2 text-[#d8c8a3]/25 group-focus-within:text-[#d4b06a] transition-colors"
              size={18}
            />

            <input
              type="text"
              placeholder="Cari sastra atau manuskrip..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1b1511]/75 border border-[#d4b06a]/15 rounded-full py-4 pl-16 pr-8 text-[#efe0bd] placeholder:text-[#d8c8a3]/28 outline-none focus:border-[#d4b06a]/60 focus:bg-[#211912]/90 transition-all text-sm shadow-[0_18px_60px_rgba(0,0,0,0.28)]"
            />
          </div>
        </header>

        {filteredManuscripts.length === 0 ? (
          <div className="text-center py-36 rounded-[2rem] border border-[#d4b06a]/15 bg-[#1a1410]/80 shadow-[0_40px_120px_rgba(0,0,0,0.42)]">
            <h3 className="text-2xl font-cinzel text-[#d8c8a3]/50 px-4 uppercase tracking-[0.2em]">
              Manuskrip tidak ditemukan
            </h3>
            <p className="text-[#d8c8a3]/30 mt-4">Coba kata kunci lain.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredManuscripts.map((item, index) => (
              <motion.article
                key={item.id || index}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.55, delay: index * 0.04 }}
                className="group relative min-h-[390px] rounded-[1.5rem] border border-[#d4b06a]/14 bg-[#19120e]/88 overflow-hidden shadow-[0_28px_80px_rgba(0,0,0,0.32)] hover:border-[#d4b06a]/45 transition-all"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(238,193,112,0.13),transparent_38%),linear-gradient(180deg,rgba(255,255,255,0.035),transparent)] pointer-events-none" />
                <div className="absolute inset-4 rounded-[1.1rem] border border-[#d4b06a]/10 pointer-events-none" />

                <div className="relative h-full p-6 flex flex-col">
                  <div className="mb-8">
                    <span className="text-[10px] uppercase tracking-[0.26em] text-[#d4b06a]/62">
                      {item.period || item.year || "Arsip Sastra"}
                    </span>

                    <h2 className="mt-4 text-2xl font-cinzel text-[#f3e3bd] leading-tight line-clamp-3 group-hover:text-[#d4b06a] transition-colors">
                      {item.title}
                    </h2>
                  </div>

                  <div
                    className="text-sm leading-7 text-[#d8c8a3]/58 line-clamp-6 font-light"
                    dangerouslySetInnerHTML={{
                      __html: item.description || item.content || item.desc || "",
                    }}
                  />

                  <div className="mt-auto pt-8">
                    <button
                      onClick={() => openManuscript(item, index)}
                      className="w-full rounded-full border border-[#d4b06a]/30 px-5 py-3 text-[10px] uppercase tracking-[0.22em] text-[#d4b06a] hover:bg-[#d4b06a] hover:text-[#17110d] transition-all font-bold"
                    >
                      Baca Naskah
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedManuscript && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#0f0c09]/92 backdrop-blur-xl"
              onClick={closeReader}
            />

            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.97 }}
              transition={{ duration: 0.35 }}
              className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-[2rem] border border-[#d4b06a]/18 bg-[#221811] shadow-[0_45px_140px_rgba(0,0,0,0.55)] custom-scrollbar"
            >
              <button
                onClick={closeReader}
                className="absolute top-6 right-6 z-20 w-11 h-11 rounded-full border border-[#d4b06a]/20 text-[#d8c8a3]/60 hover:text-[#d4b06a] hover:bg-[#d4b06a]/10 transition-all flex items-center justify-center"
              >
                <X size={20} />
              </button>

              <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(255,222,158,0.14),transparent_34%),linear-gradient(180deg,rgba(45,30,18,0.12),rgba(13,10,8,0.48))] pointer-events-none" />
              <div className="relative z-10 p-7 md:p-12 xl:p-16">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-8 mb-12 pr-12">
                  <div className="flex-1">
                    <h2 className="text-4xl md:text-6xl font-cinzel text-[#f3e3bd] mb-5 leading-tight">
                      {selectedManuscript.title}
                    </h2>

                    <div className="flex flex-wrap gap-x-5 gap-y-2 text-[#d4b06a]/75 font-cinzel text-sm">
                      {selectedManuscript.author && (
                        <span>Oleh: {selectedManuscript.author}</span>
                      )}
                      {selectedManuscript.author &&
                        (selectedManuscript.period ||
                          selectedManuscript.year) && <span>/</span>}
                      {(selectedManuscript.period || selectedManuscript.year) && (
                        <span>
                          {selectedManuscript.period || selectedManuscript.year}
                        </span>
                      )}
                    </div>
                  </div>

                  {selectedManuscript.audioUrl && (
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className={`shrink-0 w-14 h-14 rounded-full border border-[#d4b06a]/70 flex items-center justify-center transition-all ${
                        isPlaying
                          ? "bg-[#d4b06a] text-[#17110d]"
                          : "text-[#d4b06a] hover:bg-[#d4b06a]/10"
                      }`}
                    >
                      {isPlaying ? (
                        <Pause size={22} />
                      ) : (
                        <Play size={22} className="ml-1" />
                      )}
                    </button>
                  )}
                </div>

                <div className="max-w-4xl rounded-[1.5rem] border border-[#4b3423]/70 bg-[#d9c29a] text-[#2a1a12] p-7 md:p-10 shadow-[inset_0_0_60px_rgba(90,55,24,0.18),0_24px_90px_rgba(0,0,0,0.34)] relative overflow-hidden">
                  <div className="absolute inset-0 pointer-events-none opacity-[0.24] bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.28),transparent_20%),linear-gradient(90deg,rgba(68,38,14,0.08)_1px,transparent_1px)] bg-[length:100%_100%,18px_18px]" />

                  <h4 className="relative text-xs uppercase tracking-widest text-[#6f4b22]/75 mb-8 flex items-center gap-2">
                    <span className="w-8 h-px bg-[#6f4b22]/35" />
                    Isi Manuskrip
                  </h4>

                  <div className="relative z-10">
                    <div className="prose max-w-none">
                      <div
                        className={`text-xl md:text-2xl font-cinzel leading-[2.05] text-[#2d1b11] whitespace-pre-wrap transition-all duration-700 ${
                          !selectedManuscriptExpanded
                            ? "max-h-[360px] overflow-hidden"
                            : ""
                        }`}
                        dangerouslySetInnerHTML={{
                          __html:
                            selectedManuscript.description ||
                            selectedManuscript.content ||
                            selectedManuscript.desc,
                        }}
                      />
                    </div>

                    {!selectedManuscriptExpanded && (
                      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#d9c29a] to-transparent pointer-events-none" />
                    )}

                    <div className="mt-8">
                      <Button
                        onClick={() =>
                          setSelectedManuscriptExpanded(
                            !selectedManuscriptExpanded
                          )
                        }
                        variant="ghost"
                        className="text-[#6f4b22] hover:bg-[#6f4b22]/10 uppercase tracking-[0.2em] text-[10px] font-black p-0 h-auto"
                      >
                        {selectedManuscriptExpanded
                          ? "Lihat Lebih Sedikit"
                          : "Baca Selengkapnya"}
                      </Button>
                    </div>
                  </div>
                </div>

                {selectedManuscript.philosophy && (
                  <div className="pt-12 border-t border-[#d4b06a]/10 max-w-2xl mt-12">
                    <h4 className="text-xs uppercase tracking-widest text-[#d4b06a]/60 mb-4 font-bold">
                      Filosofi
                    </h4>
                    <div
                      className="text-lg text-[#d8c8a3]/65 leading-loose italic"
                      dangerouslySetInnerHTML={{
                        __html: selectedManuscript.philosophy,
                      }}
                    />
                  </div>
                )}

                <div className="pt-10 flex justify-end gap-4">
                  <button
                    disabled={currentIdx === 0}
                    onClick={() => moveManuscript(-1)}
                    className="p-3 rounded-full border border-[#d4b06a]/20 text-[#d8c8a3]/70 hover:bg-[#d4b06a]/10 hover:text-[#d4b06a] disabled:opacity-20 transition-all"
                  >
                    <ChevronLeft size={24} />
                  </button>

                  <button
                    disabled={currentIdx === filteredManuscripts.length - 1}
                    onClick={() => moveManuscript(1)}
                    className="p-3 rounded-full border border-[#d4b06a]/20 text-[#d8c8a3]/70 hover:bg-[#d4b06a]/10 hover:text-[#d4b06a] disabled:opacity-20 transition-all"
                  >
                    <ChevronRight size={24} />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {selectedManuscript?.audioUrl && (
        <audio
          controls={false}
          autoPlay={false}
          onEnded={() => setIsPlaying(false)}
          ref={(audio) => {
            if (audio) {
              if (isPlaying) {
                audio.play().catch((e) => console.error("Audio play failed", e));
              } else {
                audio.pause();
              }
            }
          }}
          src={selectedManuscript.audioUrl}
        />
      )}
    </div>
  );
}
