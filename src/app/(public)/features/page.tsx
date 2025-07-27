export default function FeaturesPage() {
  const features = [
    {
      title: "Manajemen Tugas Intuitif",
      description: "Buat, atur, dan lacak tugas dengan antarmuka yang bersih dan mudah digunakan. Prioritaskan pekerjaan Anda dengan cepat."
    },
    {
      title: "Kolaborasi Tim Efisien",
      description: "Bagikan proyek, tugaskan tugas, dan berkomunikasi dengan anggota tim secara real-time. Semua di satu tempat."
    },
    {
      title: "Papan Kanban Fleksibel",
      description: "Visualisasikan alur kerja Anda dengan papan Kanban yang dapat disesuaikan. Seret dan lepas tugas antar status dengan mudah."
    },
    {
      title: "Pelacakan Progres",
      description: "Pantau kemajuan proyek dan tugas Anda dengan laporan dan ringkasan visual yang jelas. Jangan lewatkan tenggat waktu."
    },
    {
      title: "Aksesibilitas Universal",
      description: "Dirancang untuk semua pengguna, dengan fokus pada pengalaman yang inklusif dan mudah diakses di berbagai perangkat."
    },
    {
      title: "Notifikasi Cerdas",
      description: "Dapatkan pemberitahuan penting tentang tugas dan pembaruan proyek agar Anda selalu terinformasi."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 bg-background text-foreground">
      <div className="max-w-4xl text-center mb-12">
        <h1 className="text-5xl font-extrabold text-primary mb-6">
          Fitur Unggulan KelolaHub
        </h1>
        <p className="text-lg text-foreground leading-relaxed">
          KelolaHub dilengkapi dengan berbagai fitur canggih yang dirancang untuk meningkatkan produktivitas Anda, baik secara personal maupun dalam tim.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-card rounded-lg shadow-md p-6 border border-border transform transition duration-300 hover:scale-[1.02] hover:shadow-xl"
          >
            <h2 className="text-2xl font-bold text-primary mb-3">
              {feature.title}
            </h2>
            <p className="text-foreground leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}