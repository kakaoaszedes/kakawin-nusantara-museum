import { motion } from "motion/react";
import { ArrowRight, Compass, History, BookOpen, User } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="relative min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
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
              Sebuah pengembaraan digital melintasi ruang dan waktu,
              menghidupkan kembali kemegahan kerajaan,
              kearifan sastra, dan warisan luhur nenek moyang kita.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/collections">
                <Button size="lg" className="w-full sm:w-auto gap-2">
                  <Compass size={20} />
                  Explore Museum
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Decorative */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-gold-elegant/50 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] tracking-[0.3em] uppercase">
            Scroll to Discover
          </span>

          <div className="w-px h-12 bg-gradient-to-b from-gold-elegant to-transparent" />
        </motion.div>
      </section>

      {/* Purpose */}
      <section className="py-32 px-6 bg-matte-black border-y border-white/5">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-cinzel mb-8 text-gold-elegant">
              Gerbang Pengetahuan Digital
            </h2>

            <p className="text-lg text-cream/80 mb-6 leading-loose">
              Kakawin Nusantara Museum hadir sebagai jembatan antara masa lalu
              yang agung dan masa depan yang digital.
              Kami mendedikasikan platform ini untuk melestarikan setiap
              jengkal sejarah yang membentuk identitas bangsa.
            </p>

            <p className="text-lg text-cream/80 mb-10 leading-loose">
              Dari megahnya Candi Borobudur hingga tajamnya filosofi sebilah
              Keris, setiap elemen dikurasi dengan teknologi modern untuk
              memberikan pengalaman yang menyelam (immersive).
            </p>

            <Button variant="secondary">
              Selengkapnya Tentang Kami
            </Button>
          </motion.div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4 pt-12">
              <div className="aspect-[3/4] rounded-lg overflow-hidden glass border border-white/10 grayscale hover:grayscale-0 transition-all duration-700">
                <img
                  src="https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=2670"
                  alt="Culture"
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="aspect-square rounded-lg overflow-hidden glass border border-white/10 grayscale hover:grayscale-0 transition-all duration-700">
                <img
                  src="https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=2670"
                  alt="Kingdom"
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="aspect-square rounded-lg overflow-hidden glass border border-white/10 grayscale hover:grayscale-0 transition-all duration-700">
                <img
                  src="https://images.unsplash.com/photo-1596431969248-18e3a2b72ce2?q=80&w=2670"
                  alt="Art"
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="aspect-[3/4] rounded-lg overflow-hidden glass border border-white/10 grayscale hover:grayscale-0 transition-all duration-700">
                <img
                  src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2670"
                  alt="Nature"
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="py-40 px-6 relative overflow-hidden flex items-center justify-center text-center">
        <div className="absolute inset-0 bg-deep-navy opacity-40" />

        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <span className="text-gold-elegant text-6xl font-cinzel block mb-8">
              “
            </span>

            <blockquote className="text-3xl md:text-5xl font-cinzel text-cream leading-snug mb-12 italic">
              "Nguri-uri kabudayan iku dadi dalan kanggo nggoleki jati diri lan
              pepadang ing mbesuk."
            </blockquote>

            <p className="text-gold-elegant/80 tracking-widest text-sm uppercase">
              Melestarikan budaya adalah jalan menemukan jati diri dan cahaya
              di masa depan.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-32 px-6 bg-matte-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-cinzel mb-4">
              Jelajahi Koridor Waktu
            </h2>

            <p className="text-cream/60 tracking-widest uppercase text-xs">
              Pilih dimensi yang ingin Anda jelajahi
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Sejarah Kerajaan",
                icon: <History size={32} />,
                desc: "Telusuri jejak Majapahit, Sriwijaya, hingga Mataram.",
                path: "/kingdoms",
                image:
                  "https://images.unsplash.com/photo-1605649406093-f25492476594?q=80&w=1000",
              },
              {
                title: "Sastra",
                icon: <BookOpen size={32} />,
                desc: "Resapi keindahan bait Kakawin dan manuskrip kuno.",
                path: "/manuscripts",
                image:
                  "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=1000",
              },
              {
                title: "Tokoh Budaya",
                icon: <User size={32} />,
                desc: "Kenali pahlawan dan pujangga hebat Nusantara.",
                path: "/figures",
                image:
                  "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=1000",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
                className="group relative h-[500px] rounded-2xl overflow-hidden glass border border-white/5 cursor-pointer"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${item.image})` }}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-matte-black via-matte-black/40 to-transparent" />

                <div className="absolute inset-0 p-10 flex flex-col justify-end">
                  <div className="text-gold-elegant mb-6 opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-y-4 group-hover:translate-y-0">
                    {item.icon}
                  </div>

                  <h3 className="text-3xl font-cinzel mb-2 text-white group-hover:text-gold-elegant transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-cream/70 text-sm mb-6 leading-relaxed opacity-0 group-hover:opacity-100 transition-all duration-500">
                    {item.desc}
                  </p>

                  <Link to={item.path}>
                    <Button
                      variant="outline"
                      className="w-fit self-start gap-2 group-hover:bg-gold-elegant group-hover:text-matte-black"
                    >
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
