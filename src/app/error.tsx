/**
 * Global Error Boundary
 */

"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { logger } from "@/lib/utils/logger";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error("Unhandled error", error);
  }, [error]);

  return (
    <div className="min-h-[400px] flex items-center justify-center p-4">
      <div className="text-center space-y-4">
        <div className="text-6xl">⚠️</div>
        <h1 className="text-2xl font-bold">Terjadi Kesalahan</h1>
        <p className="text-muted-foreground max-w-md">
          Maaf, terjadi kesalahan yang tidak terduga. Tim kami telah diberitahu.
        </p>
        <div className="flex gap-4 justify-center">
          <Button onClick={reset}>Coba Lagi</Button>
          <Button variant="outline" onClick={() => (window.location.href = "/")}>
            Kembali ke Beranda
          </Button>
        </div>
      </div>
    </div>
  );
}
