import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, Globe } from "lucide-react";
import { Button } from "../components/ui/Button";

export default function Contact() {
  return (
    <div className="min-h-screen bg-matte-black pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-24">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-5xl md:text-7xl font-cinzel text-gold-elegant mb-6 px-4"
          >
            Hubungi Kurator
          </motion.h1>
          <p className="text-cream/60 max-w-2xl mx-auto uppercase tracking-[0.3em] text-[10px]">
            Sampaikan Pertanyaan atau Kolaborasi Pelestarian Budaya
          </p>
        </header>

        <div className="grid lg:grid-cols-2 gap-20">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-12"
          >
            <div>
              <h2 className="text-3xl font-cinzel text-white mb-8">Informasi Museum</h2>
              <p className="text-cream/60 leading-loose mb-12 text-lg">
                Kakawin Nusantara Museum beroperasi sepenuhnya secara digital, 
                namun kantor pusat pelestarian dan kurasi kami berlokasi di jantung sejarah Nusantara.
              </p>
              
              <div className="space-y-8">
                {[
                  { icon: <MapPin className="text-gold-elegant" />, label: "Alamat", value: "Jl. Majapahit No. 1, Trowulan, Mojokerto" },
                  { icon: <Mail className="text-gold-elegant" />, label: "Email", value: "curator@kakawin.id" },
                  { icon: <Phone className="text-gold-elegant" />, label: "Telepon", value: "+62 812 3456 7890" },
                  { icon: <Globe className="text-gold-elegant" />, label: "Media Sosial", value: "@kakawin.museum" },
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-6 items-start group">
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-gold-elegant/50 transition-all shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <span className="text-xs uppercase tracking-widest text-cream/30 block mb-1">{item.label}</span>
                      <span className="text-white text-lg font-medium">{item.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Map Preview Placeholder */}
            <div className="aspect-video rounded-3xl overflow-hidden glass border border-white/10 relative">
               <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1000')] bg-cover opacity-20" />
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="text-gold-elegant mx-auto mb-4" size={40} />
                    <span className="text-gold-elegant font-cinzel tracking-widest text-sm underline cursor-pointer">Buka di Google Maps</span>
                  </div>
               </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass p-12 rounded-3xl border border-white/5"
          >
            <h3 className="text-2xl font-cinzel text-white mb-8">Kirimkan Pesan</h3>
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-cream/40 px-2">Nama Lengkap</label>
                  <input 
                    type="text" 
                    placeholder="Wira Nusantara"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 outline-none focus:border-gold-elegant transition-all text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-cream/40 px-2">Email</label>
                  <input 
                    type="email" 
                    placeholder="wira@example.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 outline-none focus:border-gold-elegant transition-all text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-cream/40 px-2">Subjek</label>
                <input 
                  type="text" 
                  placeholder="Pertanyaan Koleksi / Kerjasama"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 outline-none focus:border-gold-elegant transition-all text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-cream/40 px-2">Pesan</label>
                <textarea 
                  rows={6}
                  placeholder="Tuliskan pesan Anda di sini..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 outline-none focus:border-gold-elegant transition-all text-white resize-none"
                />
              </div>

              <Button className="w-full py-5 text-lg gap-3">
                Kirim Pesan
                <Send size={20} />
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
