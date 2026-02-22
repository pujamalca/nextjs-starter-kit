/**
 * 404 Not Found Page
 */

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[400px] flex items-center justify-center p-4">
      <div className="text-center space-y-4">
        <div className="text-8xl font-bold text-muted-foreground">404</div>
        <h1 className="text-2xl font-bold">Halaman Tidak Ditemukan</h1>
        <p className="text-muted-foreground max-w-md">
          Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.
        </p>
        <div className="flex gap-4 justify-center pt-4">
          <Button asChild>
            <Link href="/">Kembali ke Beranda</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard">Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
