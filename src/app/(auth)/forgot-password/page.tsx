/**
 * Forgot Password Page
 * Request password reset email
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AUTH_ROUTES, ERROR_MESSAGES } from "@/lib/utils/constants";
import { logger } from "@/lib/utils/logger";

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await authClient.forgetPassword({
        email,
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
      });

      if (result.error) {
        setError(result.error.message || "Gagal mengirim email reset password.");
        return;
      }

      setSuccess(true);
    } catch (err) {
      logger.error("Forgot password error", err as Error);
      setError(ERROR_MESSAGES.INTERNAL_ERROR);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
              <svg
                className="h-6 w-6 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <CardTitle className="text-2xl font-bold">Email Terkirim</CardTitle>
            <CardDescription>
              Kami telah mengirim link reset password ke{" "}
              <span className="font-medium">{email}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center text-sm text-muted-foreground">
            <p>
              Tidak menerima email? Periksa folder spam atau{" "}
              <button
                onClick={() => setSuccess(false)}
                className="text-primary hover:underline"
              >
                coba lagi
              </button>
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Link href={AUTH_ROUTES.LOGIN} className="text-primary hover:underline text-sm">
              ← Kembali ke login
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Lupa Password?</CardTitle>
          <CardDescription>
            Masukkan email Anda dan kami akan mengirimkan link untuk reset password
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                autoComplete="email"
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Mengirim..." : "Kirim Link Reset"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center">
          <Link href={AUTH_ROUTES.LOGIN} className="text-primary hover:underline text-sm">
            ← Kembali ke login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
