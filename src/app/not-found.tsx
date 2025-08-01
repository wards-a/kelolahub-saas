import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-8 bg-background text-foreground">
      <div className="max-w-md w-full bg-card rounded-lg shadow-xl p-10 border border-border">
        <h1 className="text-8xl font-extrabold text-primary mb-6">
          404
        </h1>
        <h2 className="text-3xl font-semibold text-foreground mb-4">
          Oops! Halaman Tidak Ditemukan
        </h2>
        <p className="text-lg text-muted-foreground mb-8">
          Sepertinya Anda tersesat di antara tugas-tugas yang belum selesai.
          Jangan khawatir, kami akan membantu Anda kembali ke jalur yang benar.
        </p>
        <Link href="/">
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 transform hover:scale-105">
            Kembali ke Beranda KelolaHub
          </Button>
        </Link>
      </div>

      <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-30">
        <div className="absolute w-40 h-40 bg-secondary rounded-full blur-2xl top-1/4 left-1/4 animate-float"></div>
        <div className="absolute w-32 h-32 bg-accent rounded-full blur-2xl bottom-1/3 right-1/4 animate-float-delay"></div>
        <div className="absolute w-24 h-24 bg-primary rounded-full blur-2xl top-2/3 left-1/3 animate-float-more"></div>
      </div>
    </div>
  );
}