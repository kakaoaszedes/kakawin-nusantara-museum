import { createDocument, getAllDocuments } from "./db";

const relics = [
  {
    title: "Keris Kyai Naga Sasra",
    imageUrl: "https://images.unsplash.com/photo-1596431969248-18e3a2b72ce2?q=80&w=800",
    origin: "Majapahit, Jawa Timur",
    philosophy: "Simbol kepemimpinan dan kekayaan spiritual.",
    description: "Keris luk 13 dengan tinatah emas naga sasra.",
    category: "Senjata & Pusaka"
  },
  {
    title: "Batik Parang Rusak",
    imageUrl: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=800",
    origin: "Mataram, Yogyakarta",
    philosophy: "Jalinan yang tidak pernah putus, melambangkan perjuangan.",
    description: "Motif batik tertua yang melambangkan kekuasaan dan kekuatan.",
    category: "Tekstil & Fashion"
  },
  {
    title: "Candi Bajang Ratu",
    imageUrl: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=800",
    origin: "Trowulan, Jawa Timur",
    description: "Gapura peninggalan era Majapahit yang menampilkan arsitektur Hindu-Buddha.",
    category: "Arsitektur"
  },
  {
    title: "Wayang Kulit",
    imageUrl: "https://images.unsplash.com/photo-1596431969248-18e3a2b72ce2?q=80&w=800",
    origin: "Jawa Tengah",
    description: "Seni pertunjukan tradisional dengan tokoh-tokoh legendaris dari Ramayana dan Mahabharata.",
    category: "Tari & Seni"
  },
  {
    title: "Gorga Batak",
    imageUrl: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=800",
    origin: "Sumatera Utara",
    description: "Motif ornamen tradisional Batak yang penuh makna filosofis dan spiritual.",
    category: "Budaya & Tradisi"
  },
  {
    title: "Rumah Joglo",
    imageUrl: "https://images.unsplash.com/photo-1596431969248-18e3a2b72ce2?q=80&w=800",
    origin: "Yogyakarta",
    description: "Rumah tradisional Jawa dengan struktur tiang-tiang besar tanpa paku.",
    category: "Rumah Adat"
  },
  {
    title: "Gamelan",
    imageUrl: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=800",
    origin: "Jawa",
    description: "Ansambel musik tradisional yang terdiri dari gong, kendang, saron, dan instrumen lainnya.",
    category: "Musik & Instrumen"
  }
];

const figures = [
  {
    name: "Gajah Mada",
    title: "Mahapatih Majapahit",
    biography: "Tokoh sentral pemersatu Nusantara melalui Sumpah Palapa. Gajah Mada adalah mahapatih (perdana menteri) di bawah kekuasaan Raja Hayam Wuruk.",
    influence: "Pemersatu wilayah Nusantara di bawah panji Majapahit.",
    period: "Abad ke-14",
    imageUrl: "https://images.unsplash.com/photo-1596431969248-18e3a2b72ce2?q=80&w=800"
  },
  {
    name: "Hayam Wuruk",
    title: "Raja Majapahit",
    biography: "Raja Majapahit yang memerintah saat kejayaan kerajaan ini mencapai puncaknya. Beliau berhasil memperluas wilayah Majapahit ke seluruh Nusantara.",
    influence: "Pemimpin visioner yang membawa Majapahit ke masa keemasan.",
    period: "Abad ke-14",
    imageUrl: "https://images.unsplash.com/photo-1596431969248-18e3a2b72ce2?q=80&w=800"
  },
  {
    name: "Srivijaya Maharaja",
    title: "Penguasa Srivijaya",
    biography: "Raja-raja Srivijaya yang memimpin kerajaan maritim terbesar di kawasan Asia Tenggara.",
    influence: "Penguasa jalur perdagangan maritim dan pusat pembelajaran Buddhisme.",
    period: "Abad ke-7 hingga ke-13",
    imageUrl: "https://images.unsplash.com/photo-1596431969248-18e3a2b72ce2?q=80&w=800"
  },
  {
    name: "Airlangga",
    title: "Raja Medang",
    biography: "Airlangga adalah seorang raja besar dari kerajaan Medang yang mempunyai pengaruh besar di Jawa Timur.",
    influence: "Penyebar agama Hindu-Buddha dan pembangun kerajaan Medang yang kuat.",
    period: "Abad ke-11",
    imageUrl: "https://images.unsplash.com/photo-1596431969248-18e3a2b72ce2?q=80&w=800"
  }
];

const kingdoms = [
  {
    name: "Majapahit",
    period: "1293–1527 M",
    region: "Jawa Timur",
    description: "Imperium maritim terbesar yang berhasil menyatukan sebagian besar wilayah Nusantara. Majapahit mencapai puncak kejayaannya di era Hayam Wuruk.",
    capitals: ["Trowulan"],
    imageUrl: "https://images.unsplash.com/photo-1596431969248-18e3a2b72ce2?q=80&w=1200"
  },
  {
    name: "Srivijaya",
    period: "Abad ke-7 – Abad ke-13",
    region: "Sumatera Selatan",
    description: "Pusat pembelajaran agama Buddha dan penguasa jalur perdagangan Selat Melaka. Srivijaya adalah kerajaan maritim pertama yang besar di Asia Tenggara.",
    capitals: ["Palembang"],
    imageUrl: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=1200"
  },
  {
    name: "Medang (Mataram Kuno)",
    period: "Abad ke-8 – Abad ke-11",
    region: "Jawa Tengah",
    description: "Kerajaan Hindu-Buddha di Jawa Tengah yang terkenal dengan candi-candi megah seperti Borobudur dan Prambanan.",
    capitals: ["Medang"],
    imageUrl: "https://images.unsplash.com/photo-1596431969248-18e3a2b72ce2?q=80&w=1200"
  },
  {
    name: "Singosari",
    period: "1222–1292 M",
    region: "Jawa Timur",
    description: "Kerajaan Hindu yang mempersiapkan dasar bagi berdirinya Majapahit. Singosari terkenal dengan sistem administrasi yang terorganisir.",
    capitals: ["Singosari"],
    imageUrl: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=1200"
  },
  {
    name: "Sailendra",
    period: "Abad ke-8 – Abad ke-9",
    region: "Jawa Tengah",
    description: "Dinasti yang berkuasa di Jawa Tengah dan dikenal sebagai pembangun Candi Borobudur yang megah.",
    capitals: ["Jawa Tengah"],
    imageUrl: "https://images.unsplash.com/photo-1596431969248-18e3a2b72ce2?q=80&w=1200"
  }
];

const exhibitions = [
  {
    title: "Gema Majapahit: Relik Sumpah Palapa",
    description: "Pameran eksklusif yang menampilkan koleksi artefak terbaru dari era keemasan Majapahit.",
    startDate: new Date("2026-05-10"),
    endDate: new Date("2026-06-20"),
    imageUrl: "https://images.unsplash.com/photo-1596431969248-18e3a2b72ce2?q=80&w=1200",
    isActive: true
  },
  {
    title: "Warisan Srivijaya: Jejak Kerajaan Maritim",
    description: "Pameran interaktif mengungkap kehidupan, perdagangan, dan budaya kerajaan Srivijaya yang legendaris.",
    startDate: new Date("2026-06-01"),
    endDate: new Date("2026-07-31"),
    imageUrl: "https://images.unsplash.com/photo-1596431969248-18e3a2b72ce2?q=80&w=1200",
    isActive: false
  },
  {
    title: "Keindahan Candi: Arsitektur Nusantara",
    description: "Pameran fotografi dan model arsitektur candi-candi terkenal dari berbagai periode sejarah.",
    startDate: new Date("2026-07-15"),
    endDate: new Date("2026-09-30"),
    imageUrl: "https://images.unsplash.com/photo-1596431969248-18e3a2b72ce2?q=80&w=1200",
    isActive: false
  }
];

const gallery = [
  { imageUrl: "https://images.unsplash.com/photo-1596431969248-18e3a2b72ce2?q=80&w=1200", title: "Candi Bajang Ratu", category: "Arsitektur", type: "image" },
  { imageUrl: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=1200", title: "Proses Membatik", category: "Seni Lukis", type: "image" },
  { imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200", title: "Pertunjukan Reog", category: "Tari", type: "image" },
  { imageUrl: "https://images.unsplash.com/photo-1596431969248-18e3a2b72ce2?q=80&w=1200", title: "Gamelan Jawa", category: "Musik", type: "image" },
  { imageUrl: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=1200", title: "Keramik Tradisional", category: "Kerajinan", type: "image" }
];

export async function seedInitialData() {
  const collections = await getAllDocuments("contents");
  if (collections.length > 0) return; // Already seeded

  for (const item of relics) await createDocument("contents", item);
  for (const item of figures) await createDocument("contents", item);
  for (const item of kingdoms) await createDocument("contents", item);
  for (const item of exhibitions) await createDocument("contents", item);
  for (const item of gallery) await createDocument("contents", item);
  
  console.log("Seeding complete");
}
