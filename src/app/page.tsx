/**
 * Landing Page
 * Public home page with app info
 */

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  const features = [
    {
      title: "🔐 Authentication",
      description: "Email/Password + Google OAuth dengan Better Auth",
    },
    {
      title: "🗄️ Database",
      description: "Drizzle ORM dengan MySQL/MariaDB, full type-safe",
    },
    {
      title: "🎨 UI Components",
      description: "Shadcn/ui + TailwindCSS + Framer Motion",
    },
    {
      title: "🛡️ Security",
      description: "Rate limiting, CSRF, validation, audit logs",
    },
    {
      title: "📁 File Upload",
      description: "Upload handler dengan validation dan size limit",
    },
    {
      title: "📊 Logging",
      description: "Structured logging untuk development & production",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
            <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>Starter Kit</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Next.js Starter Kit
          <span className="text-primary"> untuk AI</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Production-ready starter kit dengan authentication, database, security, dan struktur yang AI-friendly. 
          Mulai proyek baru dalam hitungan menit.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register">
            <Button size="lg" className="w-full sm:w-auto">
              Mulai Sekarang
            </Button>
          </Link>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </Button>
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Fitur Lengkap</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title}>
              <CardHeader>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Tech Stack</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {[
            "Next.js 14",
            "React 18",
            "TypeScript",
            "TailwindCSS",
            "Shadcn/ui",
            "Framer Motion",
            "Drizzle ORM",
            "Better Auth",
            "Zod",
            "MySQL/MariaDB",
          ].map((tech) => (
            <div
              key={tech}
              className="rounded-full border bg-white dark:bg-gray-950 px-4 py-2 text-sm font-medium"
            >
              {tech}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            Built with ❤️ using Next.js, TailwindCSS, Drizzle ORM, and Better Auth
          </p>
          <p className="mt-2">
            AI-friendly documentation included for easy development with AI assistants
          </p>
        </div>
      </footer>
    </div>
  );
}
