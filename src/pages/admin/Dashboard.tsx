import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { 
  BarChart3, 
  Plus, 
  Upload, 
  Settings, 
  LogOut, 
  Image as ImageIcon, 
  Layers, 
  Users, 
  BookMarked,
  LayoutDashboard,
  RefreshCw,
  Clock,
  Globe,
  Landmark,
  Loader2
} from "lucide-react";
import { auth } from "../../lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { Button } from "../../components/ui/Button";
import { getAllDocuments, deleteDocumentById, createDocument, uploadFile } from "../../services/db";
import { seedInitialData } from "../../services/seeder";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("collections");
  const [items, setItems] = useState<any[]>([]);
  const [timelineItems, setTimelineItems] = useState<any[]>([]);
  const [kingdoms, setKingdoms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    year: "",
    imageUrl: "",
    audioUrl: "",
    videoUrl: "",
    kingdomId: "",
    startDate: "",
    endDate: "",
    category: "",
    philosophy: "",
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        navigate("/admin");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user, activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getAllDocuments(activeTab);
      setItems(data);
      
      // Also fetch kingdoms for relations if needed
      if (activeTab !== 'kingdoms') {
        const kData = await getAllDocuments('kingdoms');
        setKingdoms(kData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const handleSeed = async () => {
    setSeeding(true);
    try {
      await seedInitialData();
      await fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setSeeding(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data ini dari arsip?")) {
      try {
        await deleteDocumentById(activeTab, id);
        await fetchData();
      } catch (err) {
        console.error("Gagal menghapus:", err);
        alert("Gagal menghapus data. Periksa koneksi atau hak akses.");
      }
    }
  };

  const handleOpenModal = () => {
    setFormData({
      title: "",
      description: "",
      year: "",
      imageUrl: "",
      audioUrl: "",
      videoUrl: "",
      kingdomId: "",
      startDate: "",
      endDate: "",
      category: "",
      philosophy: "",
    });
    setImageFile(null);
    setAudioFile(null);
    setIsModalOpen(true);
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return alert("Judul wajib diisi.");

    try {
      setLoading(true);
      
      let currentImageUrl = formData.imageUrl;
      let currentAudioUrl = formData.audioUrl;

      // Handle Image Upload
      if (imageFile) {
        try {
          currentImageUrl = await uploadFile(imageFile, `images/${activeTab}`);
        } catch (uploadErr) {
          console.error("Gagal upload gambar:", uploadErr);
          return alert("Gagal mengunggah gambar. Pastikan ukuran file wajar.");
        }
      }

      // Handle Audio Upload
      if (audioFile) {
        try {
          currentAudioUrl = await uploadFile(audioFile, `audio/${activeTab}`);
        } catch (uploadErr) {
          console.error("Gagal upload audio:", uploadErr);
          return alert("Gagal mengunggah audio. Pastikan ukuran file wajar.");
        }
      }

      await createDocument(activeTab, {
        ...formData,
        imageUrl: currentImageUrl,
        audioUrl: currentAudioUrl,
        name: formData.title, // Support both formats
        period: formData.year, // Support different field naming
        status: activeTab === 'exhibitions' ? 'scheduled' : 'active',
        createdAt: new Date().toISOString()
      });
      setIsModalOpen(false);
      setImageFile(null);
      setAudioFile(null);
      await fetchData();
    } catch (err) {
      console.error("Gagal menambah data:", err);
      alert("Terjadi kesalahan saat menambah data.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#0C0C0C] flex font-poppins text-cream">
      {/* Sidebar */}
      <aside className="w-72 bg-[#121212] border-r border-white/5 flex flex-col h-screen sticky top-0 overflow-hidden">
        {/* Sidebar Header */}
        <div className="p-8 pb-12">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gold-elegant/20 border border-gold-elegant/30 rounded-xl flex items-center justify-center text-gold-elegant">
              <LayoutDashboard size={20} />
            </div>
            <div>
              <span className="font-cinzel text-white tracking-[0.2em] text-xs font-black block leading-none mb-1">KAKAWIN</span>
              <span className="text-[10px] text-gold-elegant/60 tracking-[0.1em] uppercase font-bold">Arsip Curator</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 px-4 space-y-1">
          <p className="px-4 text-[10px] uppercase tracking-[0.3em] text-cream/20 font-bold mb-4">Navigasi Utama</p>
          {[
            { id: "collections", icon: <Layers size={18} />, label: "Koleksi Artefak" },
            { id: "timeline", icon: <Clock size={18} />, label: "Garis Waktu" },
            { id: "kingdoms", icon: <Landmark size={18} />, label: "Silsilah Kerajaan" },
            { id: "figures", icon: <Users size={18} />, label: "Tokoh Sejarah" },
            { id: "manuscripts", icon: <BookMarked size={18} />, label: "Syair & Sastra" },
            { id: "virtual-tour", icon: <Globe size={18} />, label: "Virtual Tour 360" },
            { id: "gallery", icon: <ImageIcon size={18} />, label: "Galeri Visual" },
            { id: "exhibitions", icon: <Clock size={18} />, label: "Agenda Pameran" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all group ${
                activeTab === tab.id 
                ? "bg-gold-elegant text-matte-black font-bold shadow-[0_0_20px_rgba(212,175,55,0.2)]" 
                : "text-cream/40 hover:text-white hover:bg-white/5"
              }`}
            >
              <span className={activeTab === tab.id ? "text-matte-black" : "text-gold-elegant/50 group-hover:text-gold-elegant"}>
                {tab.icon}
              </span>
              <span className="text-sm tracking-wide">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Sidebar Footer */}
        <div className="p-6 bg-[#161616] border-t border-white/5 space-y-3">
          <div className="px-4 mb-4">
             <p className="text-[10px] text-cream/40 uppercase tracking-widest mb-1">Kurator Aktif</p>
             <p className="text-xs text-white truncate font-medium">{user.email}</p>
          </div>
          
          <button 
            onClick={handleSeed}
            disabled={seeding}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-white/5 text-gold-elegant hover:bg-gold-elegant hover:text-matte-black transition-all text-xs font-bold uppercase tracking-wider disabled:opacity-50"
          >
            <RefreshCw className={seeding ? "animate-spin" : ""} size={14} />
            Data Contoh
          </button>
          
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-cream/30 hover:text-red-400 hover:bg-red-400/10 transition-all text-xs font-bold uppercase tracking-wider"
          >
            <LogOut size={14} />
            Keluar Sistem
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-screen overflow-y-auto bg-[#0C0C0C]">
        {/* Top Header */}
        <header className="sticky top-0 z-10 bg-[#0C0C0C]/80 backdrop-blur-md border-b border-white/5 px-12 py-8 flex justify-between items-center text-cream">
          <div>
            <div className="flex items-center gap-3 text-gold-elegant/40 text-[10px] uppercase tracking-[0.4em] font-bold mb-1">
               <span>Pusat Data</span>
               <span className="w-1 h-1 rounded-full bg-gold-elegant/20" />
               <span className="capitalize text-gold-elegant">{activeTab}</span>
            </div>
            <h1 className="text-3xl font-cinzel text-white capitalize tracking-wide">{activeTab}</h1>
          </div>
          <div className="flex items-center gap-6">
             <div className="hidden md:flex flex-col items-end">
                <span className="text-[10px] text-cream/20 uppercase tracking-widest font-bold">Sinkronisasi Terakhir</span>
                <span className="font-mono text-xs text-green-400/60">OK — {new Date().toLocaleTimeString()}</span>
             </div>
             <Button 
               onClick={handleOpenModal}
               className="gap-2 px-6 py-6 rounded-full shadow-lg hover:shadow-gold-elegant/20"
             >
                <Plus size={20} />
                <span className="uppercase tracking-[0.1em] text-xs font-black">Tambah {activeTab}</span>
             </Button>
          </div>
        </header>

        <div className="p-12 space-y-12">
          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { label: "Jumlah Data", value: items.length.toString(), color: "from-gold-elegant/20 to-transparent", borderColor: "border-gold-elegant/20" },
              { label: "Otoritas", value: "Level 4", color: "from-blue-500/10 to-transparent", borderColor: "border-blue-500/20" },
              { label: "Firewall", value: "Active", color: "from-green-500/10 to-transparent", borderColor: "border-green-500/20" },
              { label: "Uptime", value: "99.9%", color: "from-purple-500/10 to-transparent", borderColor: "border-purple-500/20" },
            ].map((stat, i) => (
              <div key={i} className={`relative p-8 rounded-2xl border ${stat.borderColor} bg-[#121212] bg-gradient-to-br ${stat.color} overflow-hidden group shadow-xl`}>
                <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-all">
                   <BarChart3 size={100} />
                </div>
                <span className="text-[10px] text-cream/40 uppercase tracking-[0.3em] block mb-4 font-bold">{stat.label}</span>
                <span className="text-4xl font-cinzel font-black text-white">{stat.value}</span>
              </div>
            ))}
          </div>

          {/* Table Area */}
          <div className="bg-[#121212] rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl">
            <div className="px-10 py-8 border-b border-white/5 flex justify-between items-center bg-[#161616]">
              <h3 className="font-cinzel text-xl text-white tracking-widest">Daftar {activeTab}</h3>
              <div className="relative group">
                <input 
                  type="text" 
                  placeholder="Cari dalam arsip..." 
                  className="bg-white/5 border border-white/10 rounded-full pl-12 pr-6 py-3 text-sm outline-none focus:border-gold-elegant w-64 md:w-80 transition-all font-light tracking-wide focus:w-96" 
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-cream/20 group-focus-within:text-gold-elegant transition-colors">
                  <div className="w-5 h-5 flex items-center justify-center">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-0">
              {loading ? (
                <div className="py-32 text-center">
                  <Loader2 className="animate-spin text-gold-elegant mx-auto mb-6" size={48} />
                  <p className="text-cream/20 font-cinzel tracking-[0.5em] text-sm animate-pulse uppercase">Memanggil Data...</p>
                </div>
              ) : items.length === 0 ? (
                <div className="py-32 text-center">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5">
                     <Layers className="text-cream/10" size={32} />
                  </div>
                  <p className="text-cream/40 font-cinzel tracking-widest uppercase">Arsip Kosong</p>
                  <button onClick={handleSeed} className="mt-6 px-6 py-2 border border-gold-elegant/30 rounded-full text-gold-elegant text-[10px] uppercase tracking-widest font-bold hover:bg-gold-elegant hover:text-matte-black transition-all">
                     Isi Otomatis
                  </button>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#181818] text-gold-elegant/40 text-[10px] uppercase tracking-[0.3em] font-bold">
                      <th className="px-10 py-5 border-b border-white/5">Identitas Koleksi</th>
                      <th className="px-10 py-5 border-b border-white/5">Kategori & Detil</th>
                      <th className="px-10 py-5 border-b border-white/5 text-right">Manajemen Arsitek</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {items.map((item) => (
                      <tr key={item.id} className="hover:bg-white/[0.02] transition-colors group cursor-default">
                        <td className="px-10 py-8">
                          <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-2xl bg-white/5 overflow-hidden border border-white/10 flex items-center justify-center text-gold-elegant shadow-xl group-hover:scale-105 transition-all">
                              {item.imageUrl ? (
                                <img src={item.imageUrl} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                              ) : (
                                <Upload size={24} className="opacity-20" />
                              )}
                            </div>
                            <div>
                              <span className="text-white font-cinzel text-lg tracking-wide group-hover:text-gold-elegant transition-colors block mb-1">
                                {item.title || item.name}
                              </span>
                              <span className="font-mono text-[10px] text-cream/20 tracking-tighter uppercase">Reference ID: {item.id}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-10 py-8">
                          <div className="space-y-1">
                             <span className="text-gold-elegant/70 text-[10px] uppercase tracking-widest font-bold block">{item.category || item.period || "General"}</span>
                             <span className="text-cream/40 text-xs italic font-light truncate max-w-xs block">{item.description || item.bio || item.biography || "Tidak ada deskripsi singkat."}</span>
                          </div>
                        </td>
                        <td className="px-10 py-8 text-right">
                          <div className="flex justify-end gap-3 opacity-30 group-hover:opacity-100 transition-all">
                            <button className="bg-white/5 hover:bg-blue-500/10 text-cream/40 hover:text-blue-400 p-3 rounded-xl transition-all border border-white/5 hover:border-blue-500/30">
                              <Settings size={18} />
                            </button>
                            <button 
                              onClick={() => handleDelete(item.id)}
                              className="bg-white/5 hover:bg-red-500/10 text-cream/40 hover:text-red-400 p-3 rounded-xl transition-all border border-white/5 hover:border-red-500/30"
                            >
                              <LogOut size={18} className="rotate-180" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            
            <div className="px-10 py-6 bg-[#161616] border-t border-white/5 flex justify-between items-center text-[10px] uppercase tracking-[0.2em] font-bold text-cream/20">
               <span>Arsip Digital Nusantara @2026</span>
               <span>Halaman 01 dari 01</span>
            </div>
          </div>
        </div>
      </main>

      {/* Modern Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-matte-black/90 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-2xl bg-[#161616] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_0_100px_rgba(212,175,55,0.15)]"
          >
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-gold-elegant/5 to-transparent">
               <div>
                  <span className="text-[10px] text-gold-elegant uppercase tracking-[0.5em] font-black block mb-1">PROSES KURASI</span>
                  <h2 className="text-2xl font-cinzel text-white">Tambah Data {activeTab}</h2>
               </div>
               <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-cream/40 hover:text-white transition-colors">
                  <LogOut size={20} className="rotate-90" />
               </button>
            </div>

            <form onSubmit={handleSaveItem} className="p-10 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
               <div className="grid md:grid-cols-2 gap-8">
                  {/* Judul */}
                  <div className="space-y-2">
                     <label className="text-[10px] uppercase font-bold tracking-widest text-cream/40 px-1">Judul / Nama Koleksi</label>
                     <input 
                        required
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        placeholder="Contoh: Keris Nagasasra"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm outline-none focus:border-gold-elegant transition-all text-white placeholder:text-white/10"
                     />
                  </div>

                  {/* Tahun/Era */}
                  <div className="space-y-2">
                     <label className="text-[10px] uppercase font-bold tracking-widest text-cream/40 px-1">Tahun / Era Sejarah</label>
                     <input 
                        type="text"
                        value={formData.year}
                        onChange={(e) => setFormData({...formData, year: e.target.value})}
                        placeholder="Contoh: Abad ke-14 / Majapahit"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm outline-none focus:border-gold-elegant transition-all text-white placeholder:text-white/10"
                     />
                  </div>
               </div>

               {/* Deskripsi */}
               {/* Kategori untuk Koleksi/Pusaka */}
               {activeTab === 'collections' && (
                  <div className="space-y-2">
                     <label className="text-[10px] uppercase font-bold tracking-widest text-gold-elegant px-1">Kategori Warisan</label>
                     <select 
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm outline-none focus:border-gold-elegant transition-all text-white appearance-none cursor-pointer"
                     >
                        <option value="" className="bg-[#161616]">-- Pilih Kategori --</option>
                        <option value="Tari & Seni" className="bg-[#161616]">Tari & Seni</option>
                        <option value="Budaya & Tradisi" className="bg-[#161616]">Budaya & Tradisi</option>
                        <option value="Rumah Adat" className="bg-[#161616]">Rumah Adat</option>
                        <option value="Senjata & Pusaka" className="bg-[#161616]">Senjata & Pusaka</option>
                     </select>
                  </div>
               )}

               <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-cream/40 px-1">Relasi Kerajaan / Era (Wajib untuk Koleksi/Tour)</label>
                  <select 
                    value={formData.kingdomId}
                    onChange={(e) => setFormData({...formData, kingdomId: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm outline-none focus:border-gold-elegant transition-all text-white appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-[#161616]">-- Pilih Kerajaan Terkait --</option>
                    {kingdoms.map(k => (
                      <option key={k.id} value={k.id} className="bg-[#161616]">
                        {k.title || k.name}
                      </option>
                    ))}
                  </select>
               </div>

               {/* Additional Scheduling and Category for Exhibitions */}
               {activeTab === 'exhibitions' && (
                  <div className="space-y-8 p-8 bg-gold-elegant/5 border border-gold-elegant/20 rounded-[2rem]">
                     <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                           <label className="text-[10px] uppercase font-bold tracking-widest text-gold-elegant px-1">Kategori Pameran</label>
                           <select 
                              value={formData.category}
                              onChange={(e) => setFormData({...formData, category: e.target.value})}
                              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm outline-none focus:border-gold-elegant transition-all text-white appearance-none cursor-pointer"
                           >
                              <option value="" className="bg-[#161616]">-- Pilih Kategori --</option>
                              <option value="Sastra & Syair" className="bg-[#161616]">Sastra & Syair</option>
                              <option value="Tokoh Sejarah" className="bg-[#161616]">Tokoh Sejarah</option>
                              <option value="Seni Lukis" className="bg-[#161616]">Seni Lukis</option>
                              <option value="Manuskrip Kuno" className="bg-[#161616]">Manuskrip Kuno</option>
                              <option value="Artefak & Senjata" className="bg-[#161616]">Artefak & Senjata</option>
                           </select>
                        </div>
                        <div className="space-y-4">
                           <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                 <label className="text-[10px] uppercase font-bold tracking-widest text-gold-elegant/50 px-1">Tgl Mulai</label>
                                 <input 
                                    type="date"
                                    value={formData.startDate}
                                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white"
                                 />
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[10px] uppercase font-bold tracking-widest text-gold-elegant/50 px-1">Tgl Selesai</label>
                                 <input 
                                    type="date"
                                    value={formData.endDate}
                                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white"
                                 />
                              </div>
                           </div>
                        </div>
                     </div>
                     <p className="text-[10px] text-gold-elegant/50 italic px-1">
                        * Pameran akan otomatis muncul di publik pada rentang tanggal yang dipilih.
                     </p>
                  </div>
               )}

               {/* Filosofi */}
               <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-gold-elegant px-1">Filosofi & Makna</label>
                  <textarea 
                     rows={3}
                     value={formData.philosophy}
                     onChange={(e) => setFormData({...formData, philosophy: e.target.value})}
                     placeholder="Tuliskan makna filosofis di balik karya/artefak ini..."
                     className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm outline-none focus:border-gold-elegant transition-all text-white resize-none placeholder:text-white/10"
                  />
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-cream/40 px-1">URL Video (YouTube / MP4)</label>
                  <input 
                     type="text"
                     value={formData.videoUrl}
                     onChange={(e) => setFormData({...formData, videoUrl: e.target.value})}
                     placeholder="https://youtube.com/watch?v=..."
                     className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm outline-none focus:border-gold-elegant transition-all text-white placeholder:text-white/10"
                  />
               </div>

               {/* Deskripsi Utama */}
               <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-cream/40 px-1">Deskripsi Singkat / Narasi</label>
                  <textarea 
                     rows={4}
                     value={formData.description}
                     onChange={(e) => setFormData({...formData, description: e.target.value})}
                     placeholder="Tuliskan latar belakang sejarah atau detail koleksi..."
                     className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm outline-none focus:border-gold-elegant transition-all text-white resize-none placeholder:text-white/10"
                  />
               </div>

               <div className="grid md:grid-cols-2 gap-8">
                  {/* Gambar */}
                  <div className="space-y-2">
                     <label className="text-[10px] uppercase font-bold tracking-widest text-cream/40 px-1">Unggah Gambar</label>
                     <div className="relative group/file">
                        <input 
                           type="file"
                           accept="image/*"
                           onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                           className="absolute inset-0 opacity-0 cursor-pointer z-10"
                        />
                        <div className={`w-full bg-white/5 border border-dashed rounded-2xl px-6 py-4 text-sm flex items-center gap-3 transition-all ${imageFile ? "border-gold-elegant text-gold-elegant" : "border-white/10 text-white/30 group-hover/file:border-gold-elegant/50"}`}>
                           <Upload size={16} />
                           <span className="truncate">{imageFile ? imageFile.name : "Pilih File Gambar..."}</span>
                        </div>
                     </div>
                  </div>

                  {/* Audio URL - Only for relevant tabs */}
                  {(activeTab === 'manuscripts' || activeTab === 'collections') && (
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-gold-elegant px-1">Unggah Audio / Syair</label>
                      <div className="relative group/file">
                        <input 
                           type="file"
                           accept="audio/*"
                           onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
                           className="absolute inset-0 opacity-0 cursor-pointer z-10"
                        />
                        <div className={`w-full bg-gold-elegant/5 border border-dashed rounded-2xl px-6 py-4 text-sm flex items-center gap-3 transition-all ${audioFile ? "border-gold-elegant text-white" : "border-gold-elegant/20 text-gold-elegant/40 group-hover/file:border-gold-elegant/50"}`}>
                           <RefreshCw size={16} className={audioFile ? "animate-spin-slow" : ""} />
                           <span className="truncate">{audioFile ? audioFile.name : "Pilih File Audio..."}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Panorama Info for Virtual Tour */}
                  {activeTab === 'virtual-tour' && (
                    <div className="md:col-span-2 p-6 bg-gold-elegant/5 border border-gold-elegant/20 rounded-2xl italic text-[10px] text-gold-elegant">
                      Tips: Pastikan file gambar yang Anda unggah di atas adalah foto Panorama 360° (rasio 2:1) untuk hasil Virtual Tour yang maksimal.
                    </div>
                  )}
               </div>

               <div className="pt-6 flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-8 py-5 rounded-2xl border border-white/5 text-cream/40 font-bold uppercase tracking-widest text-xs hover:bg-white/5 transition-all outline-none"
                  >
                     Batalkan
                  </button>
                  <button 
                    type="submit"
                    disabled={loading}
                    className="flex-[2] bg-gold-elegant text-matte-black px-8 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-lg shadow-gold-elegant/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 outline-none"
                  >
                     {loading ? "Menyimpan..." : "Simpan ke Arsip"}
                  </button>
               </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

// End of file

// End of file
