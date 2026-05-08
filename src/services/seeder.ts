import { createDocument, getAllDocuments } from "./db";

const relics = [
  {
    title: "Keris Kyai Naga Sasra",
    imageUrl: "https://images.unsplash.com/photo-1596431969248-18e3a2b72ce2?q=80&w=800",
    origin: "Majapahit, Jawa Timur",
    philosophy: "Simbol kepemimpinan dan kekayaan spiritual.",
    description: "Keris luk 13 dengan tinatah emas naga sasra.",
    category: "Senjata"
  },
  {
    title: "Batik Parang Rusak",
    imageUrl: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=800",
    origin: "Mataram, Yogyakarta",
    philosophy: "Jalinan yang tidak pernah putus, melambangkan perjuangan.",
    description: "Motif batik tertua yang melambangkan kekuasaan dan kekuatan.",
    category: "Tekstil"
  }
];

const figures = [
  {
    name: "Gajah Mada",
    title: "Mahapatih Majapahit",
    biography: "Tokoh sentral pemersatu Nusantara melalui Sumpah Palapa.",
    influence: "Pemersatu wilayah Nusantara di bawah panji Majapahit.",
    period: "Abad ke-14",
    imageUrl: "https://images.unsplash.com/photo-1596431969248-18e3a2b72ce2?q=80&w=800"
  }
];

const kingdoms = [
  {
    name: "Majapahit",
    period: "1293–1527 M",
    region: "Jawa Timur",
    description: "Imperium maritim terbesar yang berhasil menyatukan sebagian besar wilayah Nusantara.",
    capitals: ["Trowulan"],
    imageUrl: "https://images.unsplash.com/photo-1596431969248-18e3a2b72ce2?q=80&w=1200"
  },
  {
    name: "Sriwijaya",
    period: "Abad ke-7 – Abad ke-13",
    region: "Sumatera Selatan",
    description: "Pusat pembelajaran agama Buddha dan penguasa jalur perdagangan Selat Melaka.",
    capitals: ["Palembang"],
    imageUrl: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=1200"
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
  }
];

const gallery = [
  { imageUrl: "https://images.unsplash.com/photo-1596431969248-18e3a2b72ce2?q=80&w=1200", title: "Candi Bajang Ratu", category: "Arsitektur", type: "image" },
  { imageUrl: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=1200", title: "Proses Membatik", category: "Seni Lukis", type: "image" },
  { imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200", title: "Pertunjukan Reog", category: "Tari", type: "image" }
];

export async function seedInitialData() {
  const collections = await getAllDocuments("collections");
  if (collections.length > 0) return; // Already seeded

  for (const item of relics) await createDocument("collections", item);
  for (const item of figures) await createDocument("figures", item);
  for (const item of kingdoms) await createDocument("kingdoms", item);
  for (const item of exhibitions) await createDocument("exhibitions", item);
  for (const item of gallery) await createDocument("gallery", item);
  
  console.log("Seeding complete");
}
