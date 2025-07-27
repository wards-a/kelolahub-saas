// app/(protected)/layout.tsx
import Sidebar from '@/components/Sidebar'; // Import Sidebar

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 p-4 md:p-6 overflow-auto">
        {children}
      </main>
    </div>
  );
}