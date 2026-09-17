/**
 * Mock data, deliberately shaped like the Postgres tables in the
 * architecture doc (categories / academies / courses / lessons /
 * subscriptions / lesson_progress).
 *
 * Phase 1 replaces the bodies of the getters below with Supabase
 * queries. Nothing in src/pages imports this file directly — they
 * call the getters — so that swap touches only this file.
 */

/* ---------- categories ----------
   isPrimary distinguishes the six named fields from the catch-all.
   In Postgres this becomes a boolean column on `categories`, so a
   theme can be promoted out of "Lainnya" with a single UPDATE rather
   than a code change. */
export const CATEGORIES = [
  { slug: 'trading', label: 'Trading', color: 'var(--c-trading)', isPrimary: true },
  { slug: 'business', label: 'Bisnis', color: 'var(--c-business)', isPrimary: true },
  { slug: 'programming', label: 'Programming', color: 'var(--c-programming)', isPrimary: true },
  { slug: 'design', label: 'Desain', color: 'var(--c-design)', isPrimary: true },
  { slug: 'ai', label: 'AI', color: 'var(--c-ai)', isPrimary: true },
  { slug: 'marketing', label: 'Marketing', color: 'var(--c-marketing)', isPrimary: true },
  // Deliberately neutral-coloured: it reads as a staging area, not a
  // seventh peer field. See PROMOTION_THRESHOLD below.
  { slug: 'others', label: 'Lainnya', color: 'var(--c-others)', isPrimary: false },
];

export const categoryBySlug = (slug) => CATEGORIES.find((c) => c.slug === slug) ?? CATEGORIES[0];

export const primaryCategories = () => CATEGORIES.filter((c) => c.isPrimary);

/** When this many academies in "Lainnya" share a theme, it earns its own
 *  category. Without a rule, catch-all buckets grow until they mean nothing. */
export const PROMOTION_THRESHOLD = 3;

/* ---------- academies ---------- */
const ACADEMIES = [
  {
    id: 'farrel',
    name: 'Farrel Academy',
    category: 'trading',
    tagline: 'Market structure, order flow, dan manajemen risiko untuk trader yang serius soal konsistensi.',
    instructor: { name: 'Farrel Gunawan', title: 'Trader aktif', initials: 'F', avatarUrl: null },
    instructorBio:
      'Trader aktif dengan rekam jejak yang bisa diverifikasi. Setiap kelas membedah proses pengambilan keputusan, bukan hanya hasil akhirnya.',
    priceIdr: 99000,
    memberCount: 18400,
    rating: 4.9,
    courseCount: 32,
  },
  {
    id: 'budi',
    name: 'Budi Academy',
    category: 'business',
    tagline: 'Membangun personal brand dan bisnis dari nol dengan pendekatan yang bisa diukur.',
    instructor: { name: 'Budi Santoso', title: 'Founder', initials: 'B', avatarUrl: null },
    instructorBio: 'Membangun dan menjual dua bisnis. Mengajarkan apa yang berhasil dan apa yang gagal, dengan angka.',
    priceIdr: 99000,
    memberCount: 6100,
    rating: 4.7,
    courseCount: 8,
  },
  {
    id: 'reza',
    name: 'Reza Academy',
    category: 'programming',
    tagline: 'Software engineering dari dasar sampai siap kerja — bukan tutorial tanpa proyek nyata.',
    instructor: { name: 'Reza Pratama', title: 'Software Engineer', initials: 'R', avatarUrl: null },
    instructorBio: 'Engineer dengan pengalaman membangun produk yang dipakai ribuan pengguna setiap hari.',
    priceIdr: 129000,
    memberCount: 11200,
    rating: 4.8,
    courseCount: 21,
  },
  {
    id: 'nadia',
    name: 'Nadia Academy',
    category: 'design',
    tagline: 'UI/UX, design system, dan prototyping untuk desainer produk yang kerjaannya betulan dipakai.',
    instructor: { name: 'Nadia Putri', title: 'Product Designer', initials: 'N', avatarUrl: null },
    instructorBio:
      'Membangun design system untuk produk yang dipakai jutaan orang. Proses kerjanya dibedah langsung, bukan cuma hasil akhirnya.',
    priceIdr: 89000,
    memberCount: 7400,
    rating: 4.8,
    courseCount: 14,
  },
  {
    id: 'aimaster',
    name: 'AI Masterclass',
    category: 'ai',
    tagline: 'Membangun dan memakai AI secara praktis — untuk kreator, bisnis, dan tim produk.',
    instructor: { name: 'Dewi Anggraini', title: 'ML Engineer', initials: 'D', avatarUrl: null },
    instructorBio: 'Membangun sistem AI di produksi. Fokus pada penerapan nyata, bukan demo.',
    priceIdr: 129000,
    memberCount: 15600,
    rating: 4.7,
    courseCount: 19,
  },
  {
    id: 'alfian',
    name: 'Alfian Academy',
    category: 'marketing',
    tagline: 'Copywriting dan growth marketing yang diukur dari konversi, bukan dari jumlah like.',
    instructor: { name: 'Alfian Nugroho', title: 'Growth Marketer', initials: 'A', avatarUrl: null },
    instructorBio: 'Menjalankan kampanye untuk merek lokal dan internasional. Semua klaim disertai angkanya.',
    priceIdr: 89000,
    memberCount: 5300,
    rating: 4.7,
    courseCount: 10,
  },

  /* ---- second and third academies per field ---- */
  {
    id: 'sigma',
    name: 'Sigma Trading',
    category: 'trading',
    tagline: 'Scalping dan day trading dengan fokus pada pasar Indonesia.',
    instructor: { name: 'Sigit Mahendra', title: 'Day trader', initials: 'S', avatarUrl: null },
    instructorBio: 'Fokus pada eksekusi cepat dan disiplin jurnal harian. Setiap setup dibedah dengan data, bukan firasat.',
    priceIdr: 89000,
    memberCount: 9200,
    rating: 4.7,
    courseCount: 18,
  },
  {
    id: 'rudicrypto',
    name: 'Rudi Crypto',
    category: 'trading',
    tagline: 'Analisa on-chain dan siklus pasar kripto untuk jangka menengah.',
    instructor: { name: 'Rudi Hartanto', title: 'On-chain analyst', initials: 'R', avatarUrl: null },
    instructorBio: 'Membaca data on-chain untuk memahami perilaku pasar, bukan mengejar pump harian.',
    priceIdr: 99000,
    memberCount: 6800,
    rating: 4.6,
    courseCount: 12,
  },
  {
    id: 'skala',
    name: 'Skala Bisnis',
    category: 'business',
    tagline: 'Operasional dan keuangan untuk UMKM yang sedang tumbuh.',
    instructor: { name: 'Maya Lestari', title: 'Operator bisnis', initials: 'M', avatarUrl: null },
    instructorBio: 'Membangun sistem operasional untuk bisnis keluarga sampai punya belasan cabang.',
    priceIdr: 99000,
    memberCount: 4400,
    rating: 4.6,
    courseCount: 11,
  },
  {
    id: 'backendid',
    name: 'Backend ID',
    category: 'programming',
    tagline: 'API, database, dan arsitektur sistem yang tahan beban.',
    instructor: { name: 'Arif Wibowo', title: 'Backend engineer', initials: 'A', avatarUrl: null },
    instructorBio: 'Membangun sistem yang melayani jutaan permintaan per hari. Fokus pada keandalan, bukan tren.',
    priceIdr: 129000,
    memberCount: 5900,
    rating: 4.7,
    courseCount: 15,
  },
  {
    id: 'mobiledev',
    name: 'Mobile Dev Lab',
    category: 'programming',
    tagline: 'Android dan iOS dengan React Native, dari nol sampai rilis.',
    instructor: { name: 'Tia Rahmawati', title: 'Mobile engineer', initials: 'T', avatarUrl: null },
    instructorBio: 'Merilis belasan aplikasi ke Play Store dan App Store. Mengajarkan proses rilisnya juga, bukan cuma kodenya.',
    priceIdr: 119000,
    memberCount: 3700,
    rating: 4.5,
    courseCount: 11,
  },
  {
    id: 'studiografis',
    name: 'Studio Grafis',
    category: 'design',
    tagline: 'Branding, tipografi, dan desain cetak untuk klien nyata.',
    instructor: { name: 'Bagas Prasetyo', title: 'Graphic designer', initials: 'B', avatarUrl: null },
    instructorBio: 'Mengerjakan identitas visual untuk merek lokal. Setiap kelas memakai brief klien sungguhan.',
    priceIdr: 89000,
    memberCount: 4100,
    rating: 4.6,
    courseCount: 9,
  },
  {
    id: 'promptlab',
    name: 'Prompt Lab',
    category: 'ai',
    tagline: 'Prompt engineering untuk pekerjaan sehari-hari, bukan demo.',
    instructor: { name: 'Vina Kusuma', title: 'AI practitioner', initials: 'V', avatarUrl: null },
    instructorBio: 'Membantu tim non-teknis memakai AI untuk memangkas pekerjaan berulang.',
    priceIdr: 89000,
    memberCount: 3200,
    rating: 4.5,
    courseCount: 7,
  },

  /* ---- "Lainnya": academies outside the six named fields ---- */
  {
    id: 'arenagaming',
    name: 'Arena Gaming',
    category: 'others',
    theme: 'Gaming',
    tagline: 'Esports kompetitif: mekanik, strategi tim, dan analisa replay.',
    instructor: { name: 'Bayu Anggara', title: 'Pro player & coach', initials: 'B', avatarUrl: null },
    instructorBio: 'Mantan pemain profesional yang kini melatih tim kompetitif. Membedah replay pertandingan sungguhan.',
    priceIdr: 79000,
    memberCount: 8900,
    rating: 4.8,
    courseCount: 13,
  },
  {
    id: 'dapurnusantara',
    name: 'Dapur Nusantara',
    category: 'others',
    theme: 'Kuliner',
    tagline: 'Teknik masak tradisional sampai plating modern.',
    instructor: { name: 'Sri Handayani', title: 'Chef', initials: 'S', avatarUrl: null },
    instructorBio: 'Memasak profesional selama belasan tahun. Mengajarkan teknik dasar yang membuat resep apa pun jadi masuk akal.',
    priceIdr: 79000,
    memberCount: 5200,
    rating: 4.9,
    courseCount: 16,
  },
  {
    id: 'lensastudio',
    name: 'Lensa Studio',
    category: 'others',
    theme: 'Fotografi',
    tagline: 'Fotografi produk dan videografi untuk kreator.',
    instructor: { name: 'Yoga Saputra', title: 'Photographer', initials: 'Y', avatarUrl: null },
    instructorBio: 'Memotret untuk merek e-commerce. Fokus pada hasil yang menjual, dengan alat seadanya.',
    priceIdr: 89000,
    memberCount: 3400,
    rating: 4.6,
    courseCount: 9,
  },
];

/* ---------- courses ----------
   isOrdered carries decision 6: lessons are freely navigable unless
   the creator locks the sequence for that course. */
const COURSES = [
  {
    id: 'figma-prototyping',
    academyId: 'nadia',
    title: 'Prototyping Cepat dengan Figma',
    level: 'Menengah',
    summary:
      'Dari file kosong sampai prototype yang bisa diuji ke pengguna dalam satu sore. Delapan pelajaran, langsung praktik.',
    isOrdered: false,
    ratingCount: 1204,
    updatedAt: 'Mei 2026',
    outcomes: [
      'Membangun prototype interaktif yang terasa seperti produk asli, bukan slideshow.',
      'Memakai Auto Layout dan Interactive Components supaya file tetap rapi saat skalanya membesar.',
      'Menyusun handoff yang bisa langsung dipakai developer tanpa bolak-balik bertanya.',
      'Menguji alur ke pengguna lebih cepat, sebelum satu baris kode ditulis.',
    ],
    resources: [
      { name: 'Auto-Layout-Starter.fig', meta: 'Figma · 2.4 MB' },
      { name: 'Checklist-Prototyping.pdf', meta: 'PDF · 180 KB' },
    ],
  },
  {
    id: 'chart-pattern',
    academyId: 'farrel',
    title: 'Analisa Chart Pattern untuk Swing Trading',
    level: 'Menengah',
    summary: 'Membaca struktur market dan menyusun rencana entry yang punya alasan, bukan tebakan.',
    isOrdered: true,
    ratingCount: 2310,
    updatedAt: 'April 2026',
    outcomes: [],
    resources: [],
  },
  {
    id: 'web-dasar',
    academyId: 'reza',
    title: 'Dasar Pemrograman Web untuk Pemula',
    level: 'Pemula',
    summary: 'HTML, CSS, dan JavaScript sampai bisa membangun halaman yang benar-benar jalan.',
    isOrdered: true,
    ratingCount: 1890,
    updatedAt: 'Juni 2026',
    outcomes: [],
    resources: [],
  },
  {
    id: 'growth-hacking',
    academyId: 'budi',
    title: 'Growth Hacking untuk Startup',
    level: 'Menengah',
    summary: 'Eksperimen pertumbuhan yang terukur, dari hipotesis sampai pembacaan hasil.',
    isOrdered: false,
    ratingCount: 640,
    updatedAt: 'Maret 2026',
    outcomes: [],
    resources: [],
  },
  {
    id: 'ai-kreator',
    academyId: 'aimaster',
    title: 'Pengantar AI untuk Kreator',
    level: 'Pemula',
    summary: 'Memakai AI untuk mempercepat kerja kreatif tanpa kehilangan suara sendiri.',
    isOrdered: false,
    ratingCount: 980,
    updatedAt: 'Juli 2026',
    outcomes: [],
    resources: [],
  },
  {
    id: 'copywriting',
    academyId: 'alfian',
    title: 'Copywriting yang Menjual',
    level: 'Pemula',
    summary: 'Menulis halaman dan iklan yang diukur dari konversi.',
    isOrdered: false,
    ratingCount: 410,
    updatedAt: 'Mei 2026',
    outcomes: [],
    resources: [],
  },
];

/* ---------- lessons ----------
   isPreview powers free previews (requirement 16). videoId is the
   provider-agnostic handle consumed by lib/video.js. */
const LESSONS = [
  { id: 'l1', courseId: 'figma-prototyping', position: 1, title: 'Kenapa Prototyping Penting', duration: '06:12', seconds: 372, videoId: null, isPreview: true },
  { id: 'l2', courseId: 'figma-prototyping', position: 2, title: 'Setup File & Komponen Dasar', duration: '14:20', seconds: 860, videoId: null, isPreview: false },
  { id: 'l3', courseId: 'figma-prototyping', position: 3, title: 'Auto Layout yang Benar-Benar Dipakai', duration: '18:45', seconds: 1125, videoId: null, isPreview: false },
  { id: 'l4', courseId: 'figma-prototyping', position: 4, title: 'Interactive Components', duration: '21:56', seconds: 1316, videoId: null, isPreview: false },
  { id: 'l5', courseId: 'figma-prototyping', position: 5, title: 'Smart Animate & Micro-interaction', duration: '19:08', seconds: 1148, videoId: null, isPreview: false },
  { id: 'l6', courseId: 'figma-prototyping', position: 6, title: 'Handoff ke Developer', duration: '12:34', seconds: 754, videoId: null, isPreview: false },
  { id: 'l7', courseId: 'figma-prototyping', position: 7, title: 'Studi Kasus: Prototype Checkout Flow', duration: '24:10', seconds: 1450, videoId: null, isPreview: false },
  { id: 'l8', courseId: 'figma-prototyping', position: 8, title: 'Review & Next Step', duration: '08:02', seconds: 482, videoId: null, isPreview: false },
];

/* ---------- lesson_progress (per signed-in learner) ---------- */
const PROGRESS = {
  l1: { completed: true, seconds: 372 },
  l2: { completed: true, seconds: 860 },
  l3: { completed: false, seconds: 428 },
};

/* ---------- events ---------- */
export const EVENTS = [
  { id: 'e1', date: '12 MEI', time: '19:00 WIB', title: 'Workshop Trading Psikologi Market', academyId: 'farrel', price: 'Rp149.000' },
  { id: 'e2', date: '13 MEI', time: '20:00 WIB', title: 'Bangun Personal Brand di LinkedIn', academyId: 'budi', price: 'Rp99.000' },
  { id: 'e3', date: '14 MEI', time: '19:30 WIB', title: 'Live Q&A Eksklusif Member', academyId: 'aimaster', price: 'Gratis' },
  { id: 'e4', date: '28 JUN', time: '20:00 WIB', title: 'Workshop Intro to Web Development', academyId: 'reza', price: 'Tiket' },
  { id: 'e5', date: '05 JUL', time: '20:00 WIB', title: 'Live Critique Portfolio Desain', academyId: 'nadia', price: 'Gratis' },
];

/* ---------- community ---------- */
export const CHAT_ACTIVITY = [
  { id: 'c1', academyId: 'farrel', message: 'Dimas: Mantap bang, breakdown order block-nya jelas banget', at: '5m' },
  { id: 'c2', academyId: 'budi', message: 'Sari: Ada template buat personal brand audit, nggak?', at: '22m' },
  { id: 'c3', academyId: 'alfian', message: 'Rina: Headline mana yang lebih convert menurut kalian?', at: '40m' },
  { id: 'c4', academyId: 'aimaster', message: 'Yusuf: Prompt buat generate outline kelas gimana, ya?', at: '1h' },
];

export const ANNOUNCEMENT = {
  academyId: 'budi',
  body: 'Sesi review positioning brand minggu ini dipindah ke Rabu, 19:00 WIB.',
};

/* ============================================================
   GETTERS — the seam. Phase 1 makes these async Supabase calls.
   ============================================================ */
export const getAcademies = () => ACADEMIES;

/** Academies grouped by category, in CATEGORIES order, skipping empty ones.
 *  This is what the sectioned Academy page renders from. */
export const getAcademiesByCategory = () =>
  CATEGORIES.map((category) => ({
    category,
    academies: ACADEMIES.filter((a) => a.category === category.slug),
  })).filter((group) => group.academies.length > 0);

export const countByCategory = (slug) => ACADEMIES.filter((a) => a.category === slug).length;

/** Themes inside "Lainnya" that have hit the promotion threshold and
 *  should graduate into their own category. */
export const promotionCandidates = () => {
  const counts = {};
  for (const a of ACADEMIES.filter((x) => x.category === 'others' && x.theme)) {
    counts[a.theme] = (counts[a.theme] ?? 0) + 1;
  }
  return Object.entries(counts)
    .filter(([, n]) => n >= PROMOTION_THRESHOLD)
    .map(([theme, n]) => ({ theme, count: n }));
};
export const getAcademy = (id) => ACADEMIES.find((a) => a.id === id);
export const getCourses = () => COURSES;
export const getCourse = (id) => COURSES.find((c) => c.id === id);
export const getCoursesByAcademy = (academyId) => COURSES.filter((c) => c.academyId === academyId);
export const getLessons = (courseId) =>
  LESSONS.filter((l) => l.courseId === courseId).sort((a, b) => a.position - b.position);
export const getLesson = (id) => LESSONS.find((l) => l.id === id);
export const getProgress = (lessonId) => PROGRESS[lessonId] ?? { completed: false, seconds: 0 };

export const getCourseProgress = (courseId) => {
  const lessons = getLessons(courseId);
  const done = lessons.filter((l) => getProgress(l.id).completed).length;
  return { done, total: lessons.length, pct: lessons.length ? (done / lessons.length) * 100 : 0 };
};

/** The lesson a learner should land on when they press "continue". */
export const getResumeLesson = (courseId) => {
  const lessons = getLessons(courseId);
  return lessons.find((l) => !getProgress(l.id).completed) ?? lessons[0];
};

/** Courses the signed-in learner has started. Phase 1: join on subscriptions. */
export const getEnrolledCourses = () =>
  ['figma-prototyping', 'chart-pattern', 'web-dasar', 'growth-hacking'].map(getCourse).filter(Boolean);

export const formatIdr = (n) => 'Rp' + n.toLocaleString('id-ID');
