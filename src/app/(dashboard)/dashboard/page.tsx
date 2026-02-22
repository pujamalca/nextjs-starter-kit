/**
 * Dashboard Home Page
 * Main dashboard with user info and quick actions
 */

"use client";

import { useSession } from "@/lib/auth-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { data: session } = useSession();

  const quickActions = [
    {
      title: "Profile",
      description: "Kelola informasi profil Anda",
      href: "/profile",
      icon: "👤",
    },
    {
      title: "Settings",
      description: "Pengaturan akun dan preferensi",
      href: "/settings",
      icon: "⚙️",
    },
    {
      title: "Documentation",
      description: "Pelajari cara menggunakan starter kit",
      href: "https://github.com",
      icon: "📚",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold">
          Selamat datang, {session?.user?.name || "User"}! 👋
        </h1>
        <p className="text-muted-foreground mt-2">
          Ini adalah dashboard starter kit Anda. Mulai eksplorasi fitur-fitur yang tersedia.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status Akun</CardTitle>
            <span className="text-2xl">✅</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Aktif</div>
            <p className="text-xs text-muted-foreground">
              Akun Anda dalam status baik
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Email</CardTitle>
            <span className="text-2xl">📧</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {session?.user?.emailVerified ? "Terverifikasi" : "Belum"}
            </div>
            <p className="text-xs text-muted-foreground">
              {session?.user?.email}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Role</CardTitle>
            <span className="text-2xl">👤</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">User</div>
            <p className="text-xs text-muted-foreground">
              Role default
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Session</CardTitle>
            <span className="text-2xl">🔐</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Aktif</div>
            <p className="text-xs text-muted-foreground">
              Login berhasil
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {quickActions.map((action) => (
            <Card key={action.title} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">{action.icon}</span>
                  {action.title}
                </CardTitle>
                <CardDescription>{action.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <a href={action.href}>
                    Buka
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Tech Stack Info */}
      <Card>
        <CardHeader>
          <CardTitle>🛠️ Tech Stack</CardTitle>
          <CardDescription>
            Teknologi yang digunakan dalam starter kit ini
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
            {[
              "Next.js 14",
              "TypeScript",
              "TailwindCSS",
              "Shadcn/ui",
              "Drizzle ORM",
              "Better Auth",
              "MySQL/MariaDB",
              "Zod",
            ].map((tech) => (
              <div
                key={tech}
                className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm"
              >
                <span className="text-green-500">✓</span>
                {tech}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
