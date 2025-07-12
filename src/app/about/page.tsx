export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background text-foreground">
      <div className="max-w-3xl text-center p-8 rounded-lg shadow-lg bg-card border border-border">
        <h1 className="text-5xl font-extrabold text-primary mb-6">
          Tentang KelolaHub
        </h1>
        <p className="mt-4 text-lg text-foreground leading-relaxed">
          KelolaHub adalah platform manajemen tugas dan pekerjaan yang intuitif, dirancang untuk membantu individu dan tim mencapai produktivitas maksimal. Kami percaya bahwa pengelolaan tugas yang efisien adalah kunci untuk mengurangi stres dan meningkatkan fokus pada hal yang benar-benar penting.
        </p>
        <p className="mt-4 text-lg text-foreground leading-relaxed">
          Didirikan dengan visi untuk menyederhanakan alur kerja yang kompleks, KelolaHub menyediakan fitur-fitur canggih namun mudah digunakan, memastikan setiap tugas dan proyek berjalan lancar dari awal hingga selesai. Baik Anda mengelola proyek pribadi atau berkolaborasi dengan tim besar, KelolaHub adalah pusat Anda untuk efisiensi.
        </p>
        <p className="mt-4 text-lg text-foreground leading-relaxed">
          Misi kami adalah memberdayakan Anda untuk bekerja lebih cerdas, bukan lebih keras. Bergabunglah dengan komunitas KelolaHub dan rasakan perbedaan dalam cara Anda mengelola pekerjaan.
        </p>
      </div>
    </div>
  );
}