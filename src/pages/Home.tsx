import { motion } from "motion/react";
import { Play, ArrowRight, Compass, History, BookOpen, User } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Link } from "react-router-dom";
import manuskrip from "../image/Manuskrip.png";
import hero from "../image/Hero.png";
import kerajaan from "../image/Kerajaan.png";

export default function Home() {
  return (
    <div className="relative min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Video Placeholder / Dark Overlay */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1596431969248-18e3a2b72ce2?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center">
          <div className="absolute inset-0 bg-gradient-to-t from-matte-black via-matte-black/60 to-transparent" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h1 className="text-4xl md:text-8xl font-cinzel font-bold mb-6 tracking-wider leading-tight">
              <span className="block text-white/90">MENJELAJAHI</span>
              <span className="gold-gradient animate-glow">NUSANTARA</span>
            </h1>
            <p className="text-lg md:text-xl text-cream/70 max-w-2xl mx-auto mb-10 font-light tracking-wide leading-relaxed">
              Sebuah pengembaraan digital melintasi ruang dan waktu, menghidupkan kembali kemegahan kerajaan, 
              kearifan sastra, dan warisan luhur nenek moyang kita.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/collections">
                <Button size="lg" className="w-full sm:w-auto gap-2">
                  <Compass size={20} />
                  Explore Museum
                </Button>
              </Link>
              <Link to="/virtual-tour">
                <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2">
                  <Play size={20} />
                  Virtual Tour
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Decorative Elements */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-gold-elegant/50 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] tracking-[0.3em] uppercase">Scroll to Discover</span>
          <div className="w-px h-12 bg-gradient-to-b from-gold-elegant to-transparent" />
        </motion.div>
      </section>

      {/* Purpose Section */}
      <section className="py-32 px-6 bg-matte-black border-y border-white/5">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-cinzel mb-8 text-gold-elegant">Gerbang Pengetahuan Digital</h2>
            <p className="text-lg text-cream/80 mb-6 leading-loose">
              Kakawin Nusantara Museum hadir sebagai jembatan antara masa lalu yang agung dan masa depan yang digital. 
              Kami mendedikasikan platform ini untuk melestarikan setiap jengkal sejarah yang membentuk identitas bangsa.
            </p>
            <p className="text-lg text-cream/80 mb-10 leading-loose">
              Dari megahnya Candi Borobudur hingga tajamnya filosofi sebilah Keris, 
              setiap elemen dikurasi dengan teknologi modern untuk memberikan pengalaman yang menyelam (immersive).
            </p>
            <Button variant="secondary">Selengkapnya Tentang Kami</Button>
          </motion.div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4 pt-12">
              <div className="aspect-[3/4] rounded-lg overflow-hidden glass border border-white/10 grayscale hover:grayscale-0 transition-all duration-700">
                <img src="https://www.indonesia.travel/contentassets/9ccb0c516f3f49dc96591822d5dbf54b/candi-borobudur.jpg" alt="Culture" className="w-full h-full object-cover" />
              </div>
              <div className="aspect-square rounded-lg overflow-hidden glass border border-white/10 grayscale hover:grayscale-0 transition-all duration-700">
                <img src="data:image/jpeg;base64,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" alt="Kingdom" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="space-y-4">
              <div className="aspect-square rounded-lg overflow-hidden glass border border-white/10 grayscale hover:grayscale-0 transition-all duration-700">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZvgvujTztP5nev1JoIR2ibgKR4-nsPPfSnA&s" alt="Art" className="w-full h-full object-cover" />
              </div>
              <div className="aspect-[3/4] rounded-lg overflow-hidden glass border border-white/10 grayscale hover:grayscale-0 transition-all duration-700">
                <img src="https://cdn0-production-images-kly.akamaized.net/bTTzEd9TFk9zGgn8J_r-vaSUPqI=/1280x720/smart/filters:quality(75):strip_icc()/kly-media-production/medias/2855365/original/055386900_1563332268-IMG-20190717-WA0001__1_.jpg" alt="Nature" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-40 px-6 relative overflow-hidden flex items-center justify-center text-center">
        <div className="absolute inset-0 bg-deep-navy opacity-40" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <span className="text-gold-elegant text-6xl font-cinzel block mb-8">“</span>
            <blockquote className="text-3xl md:text-5xl font-cinzel text-cream leading-snug mb-12 italic">
              "Nguri-uri kabudayan iku dadi dalan kanggo nggoleki jati diri lan pepadang ing mbesuk."
            </blockquote>
            <p className="text-gold-elegant/80 tracking-widest text-sm uppercase">Melestarikan budaya adalah jalan menemukan jati diri dan cahaya di masa depan.</p>
          </motion.div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-32 px-6 bg-matte-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-cinzel mb-4">Jelajahi Koridor Waktu</h2>
            <p className="text-cream/60 tracking-widest uppercase text-xs">Pilih dimensi yang ingin Anda jelajahi</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                title: "Sejarah Kerajaan", 
                icon: <History size={32} />, 
                desc: "Telusuri jejak Majapahit, Sriwijaya, hingga Mataram.",
                path: "/kingdoms",
                image: kerajaan
              },
              { 
                title: "Syair & Sastra", 
                icon: <BookOpen size={32} />, 
                desc: "Resapi keindahan bait Kakawin dan manuskrip kuno.",
                path: "/manuscripts",
                image: manuskrip
              },
              { 
                title: "Tokoh Budaya", 
                icon: <User size={32} />, 
                desc: "Kenali pahlawan dan pujangga hebat Nusantara.",
                path: "/figures",
                image: hero
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
                className="group relative h-[500px] rounded-2xl overflow-hidden glass border border-white/5 cursor-pointer"
              >
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url(${item.image})` }} />
                <div className="absolute inset-0 bg-gradient-to-t from-matte-black via-matte-black/40 to-transparent" />
                
                <div className="absolute inset-0 p-10 flex flex-col justify-end">
                  <div className="text-gold-elegant mb-6 opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-y-4 group-hover:translate-y-0">
                    {item.icon}
                  </div>
                  <h3 className="text-3xl font-cinzel mb-2 text-white group-hover:text-gold-elegant transition-colors">{item.title}</h3>
                  <p className="text-cream/70 text-sm mb-6 leading-relaxed opacity-0 group-hover:opacity-100 transition-all duration-500">
                    {item.desc}
                  </p>
                  <Link to={item.path}>
                    <Button variant="outline" className="w-fit self-start gap-2 group-hover:bg-gold-elegant group-hover:text-matte-black">
                      Selengkapnya
                      <ArrowRight size={16} />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}