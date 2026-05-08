import { motion } from "framer-motion";
import { History, Shield, Flame, Anchor, Landmark, Cpu } from "lucide-react";

const events = [
  {
    year: "Era Prasejarah",
    title: "Awal Peradaban",
    category: "prasejarah",
    icon: <History size={24} />,
    desc: "Jejak manusia purba dan migrasi penduduk awal di kepulauan Nusantara.",
    image: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=800"
  },
  {
    year: "Abad IV - XV",
    title: "Kejayaan Hindu-Buddha",
    category: "hindu-buddha",
    icon: <Landmark size={24} />,
    desc: "Masa keemasan kerajaan Tarumanegara, Sriwijaya, hingga Majapahit yang menyatukan Nusantara.",
    image: "https://images.unsplash.com/photo-1596431969248-18e3a2b72ce2?q=80&w=800"
  },
  {
    year: "Abad XIII - XVI",
    title: "Penyebaran Islam",
    category: "islam",
    icon: <Shield size={24} />,
    desc: "Berdirinya kesultanan-kesultanan besar seperti Samudera Pasai, Demak, dan Gowa-Tallo.",
    image: "https://images.unsplash.com/photo-1584622781564-1d9876a13d00?q=80&w=800"
  },
  {
    year: "Abad XVI - XX",
    title: "Masa Kolonial",
    category: "kolonial",
    icon: <Anchor size={24} />,
    desc: "Kedatangan bangsa Eropa dan perjuangan panjang melawan penjajahan.",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800"
  },
  {
    year: "1945",
    title: "Era Kemerdekaan",
    category: "kemerdekaan",
    icon: <Flame size={24} />,
    desc: "Proklamasi Kemerdekaan dan pembentukan identitas negara kesatuan.",
    image: "https://images.unsplash.com/photo-1550985543-f47f38aeee65?q=80&w=800"
  },
  {
    year: "Abad XXI",
    title: "Indonesia Modern",
    category: "modern",
    icon: <Cpu size={24} />,
    desc: "Transformasi menuju bangsa yang maju di kancah global dengan tetap menjaga nilai luhur.",
    image: "https://images.unsplash.com/photo-1589149021873-1f9fdc76251f?q=80&w=800"
  }
];

export default function Timeline() {
  return (
    <div className="min-h-screen bg-matte-black pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-cinzel text-gold-elegant mb-6"
          >
            Garis Waktu Peradaban
          </motion.h1>
          <p className="text-cream/60 max-w-2xl mx-auto uppercase tracking-widest text-xs">
            Menyusuri lorong waktu dari fajar sejarah hingga masa depan
          </p>
        </div>

        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gold-elegant/30 to-transparent hidden md:block" />

          <div className="space-y-24">
            {events.map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className={`flex flex-col md:flex-row items-center gap-8 md:gap-20 ${
                  index % 2 === 0 ? "" : "md:flex-row-reverse"
                }`}
              >
                {/* Content */}
                <div className="flex-1 text-center md:text-right w-full">
                  <div className={`flex flex-col ${index % 2 === 0 ? "md:items-end" : "md:items-start"}`}>
                    <span className="text-gold-elegant font-cinzel text-2xl mb-2">{event.year}</span>
                    <h3 className="text-3xl font-cinzel mb-4 text-white">{event.title}</h3>
                    <p className="text-cream/70 leading-relaxed max-w-md ml-auto mr-auto md:ml-0 md:mr-0">
                      {event.desc}
                    </p>
                  </div>
                </div>

                {/* Central Icon */}
                <div className="relative z-10 w-16 h-16 rounded-full bg-matte-black border-2 border-gold-elegant flex items-center justify-center text-gold-elegant shadow-[0_0_20px_rgba(212,175,55,0.2)]">
                  {event.icon}
                </div>

                {/* Image */}
                <div className="flex-1 w-full">
                  <div className="aspect-video rounded-xl overflow-hidden glass border border-white/10 group">
                    <img 
                      src={event.image} 
                      alt={event.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0" 
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
