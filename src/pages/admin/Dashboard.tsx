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
  Clock
} from "lucide-react";
import { auth } from "../../lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { Button } from "../../components/ui/Button";
import { getAllDocuments } from "../../services/db";
import { seedInitialData } from "../../services/seeder";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("collections");
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const navigate = useNavigate();

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

  if (!user) return null;

  return (
    <div className="min-h-screen bg-matte-black flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 flex flex-col p-6 h-screen sticky top-0">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-8 h-8 bg-gold-elegant rounded-full flex items-center justify-center">
            <LayoutDashboard className="text-matte-black" size={16} />
          </div>
          <span className="font-cinzel text-gold-elegant tracking-widest text-sm font-bold">DASHBOARD</span>
        </div>

        <nav className="flex-1 space-y-2">
          {[
            { id: "collections", icon: <Layers size={18} />, label: "Koleksi" },
            { id: "kingdoms", icon: <Landmark size={18} />, label: "Kerajaan" },
            { id: "figures", icon: <Users size={18} />, label: "Tokoh" },
            { id: "manuscripts", icon: <BookMarked size={18} />, label: "Syair" },
            { id: "gallery", icon: <ImageIcon size={18} />, label: "Galeri" },
            { id: "exhibitions", icon: <Clock size={18} />, label: "Pameran" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
                activeTab === tab.id 
                ? "bg-gold-elegant/10 text-gold-elegant border border-gold-elegant/20" 
                : "text-cream/50 hover:text-white hover:bg-white/5 whitespace-nowrap"
              }`}
            >
              {tab.icon}
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="pt-6 border-t border-white/5 space-y-4">
          <button 
            onClick={handleSeed}
            disabled={seeding}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-gold-elegant hover:bg-gold-elegant/10 transition-all font-medium disabled:opacity-50"
          >
            <RefreshCw className={seeding ? "animate-spin" : ""} size={18} />
            <span className="text-sm">Seed Demo Data</span>
          </button>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-red-400 hover:bg-red-400/10 transition-all font-medium"
          >
            <LogOut size={18} />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-12 overflow-y-auto">
        <header className="flex justify-between items-start mb-12">
          <div>
            <h1 className="text-3xl font-cinzel text-white mb-2 capitalize">{activeTab}</h1>
            <p className="text-cream/40 text-sm italic">Status: {loading ? "Menghubungkan ke pusat arsip..." : `Ditemukan ${items.length} entri`}</p>
          </div>
          <Button className="gap-2">
            <Plus size={20} />
            Tambah Data Baru
          </Button>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: "Total Entri", value: items.length.toString(), color: "text-gold-elegant" },
            { label: "Admin Sesi", value: "Active", color: "text-blue-400" },
            { label: "Database", value: "Ready", color: "text-green-400" },
            { label: "Sistem", value: "Online", color: "text-purple-400" },
          ].map((stat, i) => (
            <div key={i} className="glass p-6 rounded-2xl border border-white/5">
              <span className="text-xs text-cream/30 uppercase tracking-widest block mb-2">{stat.label}</span>
              <span className={`text-4xl font-cinzel font-bold ${stat.color}`}>{stat.value}</span>
            </div>
          ))}
        </div>

        {/* Content Area */}
        <div className="glass rounded-3xl border border-white/5 overflow-hidden">
          <div className="p-8 border-b border-white/5 flex justify-between items-center">
            <h3 className="font-cinzel text-lg text-white">Daftar {activeTab}</h3>
            <div className="flex gap-4">
              <input 
                type="text" 
                placeholder="Cari..." 
                className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm outline-none focus:border-gold-elegant" 
              />
            </div>
          </div>
          <div className="p-0">
            {loading ? (
              <div className="p-20 text-center">
                <Loader2 className="animate-spin text-gold-elegant mx-auto mb-4" size={40} />
                <p className="text-cream/40 font-cinzel tracking-widest">SINKRONISASI DATA...</p>
              </div>
            ) : items.length === 0 ? (
              <div className="p-20 text-center">
                <p className="text-cream/40 font-cinzel tracking-widest">BELUM ADA DATA</p>
                <button onClick={handleSeed} className="mt-4 text-gold-elegant underline text-sm">Gunakan Data Contoh</button>
              </div>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-white/2 text-cream/40 text-[10px] uppercase tracking-widest">
                    <th className="px-8 py-4 font-normal">Identitas</th>
                    <th className="px-8 py-4 font-normal">Detail</th>
                    <th className="px-8 py-4 font-normal text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-white/2 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-white/5 overflow-hidden flex items-center justify-center text-gold-elegant">
                            {item.imageUrl ? <img src={item.imageUrl} alt="" className="w-full h-full object-cover" /> : <Upload size={20} />}
                          </div>
                          <div>
                            <span className="text-white font-medium block">{item.title || item.name}</span>
                            <span className="text-cream/40 text-xs">ID: {item.id.substring(0, 8)}...</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-cream/70 text-sm italic">{item.category || item.period || "General"}</span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-2">
                          <button className="text-cream/30 hover:text-gold-elegant transition-colors p-2">
                            <Settings size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

const Landmark = ({ size, className }: { size: number, className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <line x1="2" y1="22" x2="22" y2="22"></line>
    <path d="M5 22v-4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4"></path>
    <path d="M12 2v2"></path>
    <path d="M7 6h10"></path>
    <path d="M12 6c-2.2 0-4 1.8-4 4v6h8v-6c0-2.2-1.8-4-4-4Z"></path>
  </svg>
);

const Loader2 = ({ size, className }: { size?: number, className?: string }) => (
  <motion.div 
    animate={{ rotate: 360 }}
    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    className={className}
  >
    <RefreshCw size={size} />
  </motion.div>
);
