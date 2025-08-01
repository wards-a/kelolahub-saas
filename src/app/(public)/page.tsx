import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function HomePage() {
  const features = [
    {
      title: "Manajemen Tugas Intuitif",
      description: "Buat, atur, dan lacak tugas dengan antarmuka yang bersih dan mudah digunakan. Prioritaskan pekerjaan Anda dengan cepat.",
      // icon: <LayoutDashboard className="h-8 w-8 text-primary" />
    },
    {
      title: "Kolaborasi Tim Efisien",
      description: "Bagikan proyek, tugaskan tugas, dan berkomunikasi dengan anggota tim secara real-time. Semua di satu tempat.",
      // icon: <Users className="h-8 w-8 text-primary" />
    },
    {
      title: "Papan Kanban Fleksibel",
      description: "Visualisasikan alur kerja Anda dengan papan Kanban yang dapat disesuaikan. Seret dan lepas tugas antar status dengan mudah.",
      // icon: <CheckCircle className="h-8 w-8 text-primary" />
    },
    {
      title: "Notifikasi Cerdas",
      description: "Dapatkan pemberitahuan penting tentang tugas dan pembaruan proyek agar Anda selalu terinformasi dan tidak ketinggalan.",
      // icon: <BellRing className="h-8 w-8 text-primary" />
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-background text-foreground overflow-hidden">
      {/* --- Hero Section --- */}
      <section className="relative w-full py-20 md:py-32 text-center bg-gradient-to-br from-primary/10 to-secondary/10 flex flex-col items-center justify-center">
        <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-40">
          <div className="absolute w-60 h-60 bg-primary rounded-full blur-3xl top-1/4 left-1/4 animate-float"></div>
          <div className="absolute w-48 h-48 bg-secondary rounded-full blur-3xl bottom-1/3 right-1/4 animate-float-delay"></div>
          <div className="absolute w-72 h-72 bg-accent rounded-full blur-3xl top-2/3 left-1/2 animate-float-more"></div>
        </div>

        <div className="container max-w-4xl px-4">
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-primary mb-6 animate-fade-in-up">
            KelolaHub: Pusat Efisiensi Tugas & Proyek Anda
          </h1>
          <p className="text-xl md:text-2xl text-foreground mb-8 animate-fade-in-up animation-delay-200">
            Sederhanakan alur kerja Anda, berkolaborasi dengan mulus, dan capai tujuan Anda dengan mudah.
          </p>
          <Link href="/register">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 animate-fade-in-up animation-delay-400">
              Mulai Gratis Sekarang
            </Button>
          </Link>
          <p className="mt-4 text-sm text-muted-foreground animate-fade-in-up animation-delay-600">
            Tidak perlu kartu kredit. Batalkan kapan saja.
          </p>
        </div>
      </section>

      {/* --- Feature Highlights Section --- */}
      <section className="w-full py-20 px-4 md:px-6 bg-card flex flex-col items-center justify-center">
        <div className="container max-w-6xl text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Dirancang untuk Produktivitas Anda
          </h2>
          <p className="text-xl text-foreground">
            Fitur-fitur inti yang memberdayakan individu dan tim.
          </p>
        </div>
        <div className="container max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="flex flex-col text-center p-6 bg-background border border-border shadow-md transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
              <CardHeader className="p-0 mb-4">
                {/* {feature.icon} */}
                <span className="text-5xl text-primary mb-2">✨</span> {/* Placeholder Icon */}
                <CardTitle className="text-xl font-semibold text-foreground">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <CardDescription className="text-muted-foreground">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link href="/features">
            <Button variant="outline" className="text-primary border-primary hover:bg-primary/10 transition-all duration-300">
              Lihat Semua Fitur
            </Button>
          </Link>
        </div>
      </section>

      {/* --- Call to Action (CTA) Section --- */}
      <section className="w-full py-20 px-4 md:px-6 bg-gradient-to-tl from-secondary/10 to-primary/10 text-center flex flex-col items-center justify-center">
        <div className="container max-w-4xl">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            Siap Tingkatkan Produktivitas Anda?
          </h2>
          <p className="text-xl md:text-2xl text-foreground mb-8">
            Daftar sekarang dan rasakan kemudahan mengelola pekerjaan dengan KelolaHub.
          </p>
          <Link href="/register">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-10 py-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105">
              Mulai Petualangan Produktivitas Anda
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}