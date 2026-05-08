import { motion } from "framer-motion";
import { Award, Eye, Target, Sparkles } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-matte-black pt-32 pb-20">
      {/* Hero Section */}
      <section className="px-6 mb-32">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-5xl md:text-7xl font-cinzel text-gold-elegant mb-8"
          >
            Filosofi Nama <br /> <span className="text-white">Kakawin</span>
          </motion.h1>
          <div className="w-24 h-px bg-gold-elegant mx-auto mb-12" />
          <p className="text-xl text-cream/70 leading-loose italic">
            "Kakawin" merujuk pada puisi naratif Jawa Kuno yang ditulis dalam bahasa Kawi. 
            Ia bukan sekadar sastra, melainkan rekaman jiwa, petuah bijak, dan estetika peradaban yang tak lekang oleh waktu. 
            Museum ini adalah 'Kakawin' modern bagi Nusantara.
          </p>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="px-6 py-24 glass border-y border-white/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center">
          <div className="relative aspect-square rounded-3xl overflow-hidden border border-white/10">
            <img src="https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=1000" alt="Culture" className="w-full h-full object-cover grayscale opacity-50" />
            <div className="absolute inset-0 flex items-center justify-center p-12">
              <div className="text-center font-cinzel text-white space-y-4">
                <span className="text-6xl block text-gold-elegant">X</span>
                <span className="text-2xl tracking-[0.3em] uppercase">Est. 2026</span>
              </div>
            </div>
          </div>

          <div className="space-y-12">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-gold-elegant/10 flex items-center justify-center text-gold-elegant">
                  <Eye size={24} />
                </div>
                <h2 className="text-3xl font-cinzel text-white">Visi Kami</h2>
              </div>
              <p className="text-cream/60 leading-relaxed text-lg">
                Menjadi pusat pelestarian digital Nusantara yang paling terkemuka di dunia, 
                menjadikan sejarah masa lalu sebagai inspirasi hidup bagi generasi masa depan.
              </p>
            </div>

            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-gold-elegant/10 flex items-center justify-center text-gold-elegant">
                  <Target size={24} />
                </div>
                <h2 className="text-3xl font-cinzel text-white">Misi Kami</h2>
              </div>
              <ul className="space-y-4 text-cream/60 text-lg">
                <li className="flex gap-4">
                  <span className="text-gold-elegant inline-block mt-1">•</span>
                  Mengkurasi dan mendigitalkan artefak fisik ke dalam bentuk 3D dan resolusi tinggi.
                </li>
                <li className="flex gap-4">
                  <span className="text-gold-elegant inline-block mt-1">•</span>
                  Menyediakan narasi sejarah yang akurat berdasarkan manuskrip aslinya.
                </li>
                <li className="flex gap-4">
                  <span className="text-gold-elegant inline-block mt-1">•</span>
                  Menciptakan pengalaman virtual yang imersif bagi siapa saja, di mana saja.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="px-6 py-32 bg-matte-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-cinzel text-gold-elegant mb-4">Nilai-Nilai Luhur</h2>
            <p className="text-cream/40 uppercase tracking-widest text-xs">Pilar yang menyangga museum kami</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              { icon: <Award size={32} />, title: "Integritas", desc: "Menyajikan data sejarah dengan kejujuran dan referensi yang valid." },
              { icon: <Sparkles size={32} />, title: "Estetika", desc: "Memadukan keindahan seni tradisional dengan elegansi desain modern." },
              { icon: <Landmark size={32} />, title: "Pelestarian", desc: "Berkomitmen menjaga warisan agar abadi dalam bentuk digital." },
            ].map((value, i) => (
              <div key={i} className="text-center group">
                <div className="w-20 h-20 bg-white/2 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/5 group-hover:border-gold-elegant/50 transition-all text-gold-elegant">
                  {value.icon}
                </div>
                <h3 className="text-2xl font-cinzel text-white mb-4">{value.title}</h3>
                <p className="text-cream/60 leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
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
