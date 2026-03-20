import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  Layers3,
  Radar,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SurfaceCard } from "@/components/ui/surface-card"

export const metadata: Metadata = {
  title: "Anclora Content Generator AI",
  description:
    "Sistema editorial premium para convertir conocimiento, señales y contexto en autoridad de marca.",
}

const signalStrip = [
  "RAG curado y trazable",
  "Studio editorial operativo",
  "Loop de analytics y acción",
  "Pipeline multicanal premium",
] as const

const capabilities = [
  {
    title: "Detecta señal",
    body: "Ingiere research, documentos y contexto curado para construir criterio, no solo archivo.",
    icon: Radar,
  },
  {
    title: "Produce con sistema",
    body: "Convierte oportunidades en piezas consistentes con voz, intención y trazabilidad real.",
    icon: Sparkles,
  },
  {
    title: "Decide con impacto",
    body: "Mide rendimiento por pieza y canal para actuar sobre lo que mueve reputación y negocio.",
    icon: TrendingUp,
  },
] as const

const motionCards = [
  {
    label: "Knowledge",
    title: "Señales activas",
    value: "24",
    note: "Fuentes, packs y oportunidades listas para convertirse en piezas.",
  },
  {
    label: "Studio",
    title: "Pipeline editorial",
    value: "07",
    note: "Draft, review, scheduled y published dentro del mismo cockpit.",
  },
  {
    label: "Loop",
    title: "Siguiente acción",
    value: "Refresh",
    note: "El sistema te empuja hacia la pieza o movimiento que más conviene ahora.",
  },
] as const

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <div className="landing-grid-mask pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(255,198,55,0.14),transparent_24%),radial-gradient(circle_at_78%_16%,rgba(255,198,55,0.1),transparent_18%),linear-gradient(180deg,rgba(255,198,55,0.04),transparent_18%)]" />

      <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
        <Link href="/" className="flex items-center gap-4">
          <Image
            src="/logo-content-generator.png"
            alt="Anclora Content Generator AI"
            width={56}
            height={56}
            className="h-14 w-14 object-contain"
            priority
          />
          <div>
            <p className="font-heading text-lg font-semibold text-foreground">
              Anclora Content Generator AI
            </p>
            <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
              By Anclora Group
            </p>
          </div>
        </Link>

        <div className="hidden items-center gap-3 md:flex">
          <Button
            variant="ghost"
            nativeButton={false}
            render={<Link href="#capabilities" />}
            className="text-muted-foreground hover:text-foreground"
          >
            Explorar el sistema
          </Button>
          <Button
            nativeButton={false}
            render={<Link href="/login" />}
            className="h-11 rounded-full bg-[linear-gradient(135deg,hsl(var(--primary)),hsl(41_100%_47%))] px-5 text-primary-foreground shadow-[0_24px_50px_-28px_rgba(255,198,55,0.76)]"
          >
            Entrar al Studio
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <section className="relative z-10 mx-auto grid w-full max-w-7xl gap-14 px-6 pb-14 pt-4 lg:grid-cols-[1.02fr_0.98fr] lg:px-10 lg:pb-22 lg:pt-8">
        <div className="relative max-w-3xl">
          <div className="pointer-events-none absolute -left-20 top-4 hidden h-[720px] w-[720px] lg:block">
            <Image
              src="/logo-content-generator.png"
              alt=""
              fill
              className="object-contain opacity-[0.08]"
              sizes="720px"
            />
          </div>

          <div className="relative">
            <Badge
              variant="outline"
              className="border-primary/20 bg-primary/10 px-3 py-1 text-[11px] uppercase tracking-[0.26em] text-primary"
            >
              Editorial Command System
            </Badge>

            <h1 className="mt-8 max-w-4xl font-heading text-5xl font-semibold leading-[0.92] tracking-[-0.06em] text-foreground sm:text-6xl lg:text-[5.8rem]">
              La capa de autoridad para marcas que no quieren sonar como todas.
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-[#c9bda9]">
              Anclora convierte conocimiento, señales y criterio editorial en un sistema que
              produce, mide y afina contenido de alto valor.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                nativeButton={false}
                render={<Link href="/login" />}
                className="h-12 rounded-full bg-[linear-gradient(135deg,hsl(var(--primary)),hsl(41_100%_47%))] px-6 text-primary-foreground shadow-[0_24px_50px_-28px_rgba(255,198,55,0.76)]"
              >
                Entrar al Studio
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                nativeButton={false}
                render={<Link href="#capabilities" />}
                className="h-12 rounded-full border-primary/16 bg-card/55 px-6 text-foreground backdrop-blur"
              >
                Ver cómo funciona
              </Button>
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              <div className="landing-proof-chip">
                <Layers3 className="h-4 w-4 text-primary" />
                <span>Research → Studio → Delivery</span>
              </div>
              <div className="landing-proof-chip">
                <Target className="h-4 w-4 text-primary" />
                <span>Authority-first workflow</span>
              </div>
              <div className="landing-proof-chip">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span>Decisión guiada por señales</span>
              </div>
            </div>
          </div>
        </div>

        <div className="relative min-h-[500px] lg:min-h-[620px]">
          <div className="landing-hero-card absolute inset-x-0 top-4 z-10 p-6 lg:left-8 lg:right-6 lg:top-8 lg:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.26em] text-primary/90">
                  Brand Authority Engine
                </p>
                <h2 className="mt-4 max-w-sm font-heading text-3xl font-semibold tracking-[-0.05em] text-foreground">
                  Un cockpit editorial que piensa en sistema.
                </h2>
              </div>
              <span className="rounded-full border border-primary/18 bg-primary/10 px-3 py-1 text-xs text-primary">
                activo
              </span>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {motionCards.map((card, index) => (
                <div
                  key={card.title}
                  className={`landing-floating-card ${index === 0 ? "sm:-translate-y-3" : ""} ${
                    index === 2 ? "sm:translate-y-4" : ""
                  }`}
                >
                  <p className="text-[11px] uppercase tracking-[0.24em] text-primary/80">
                    {card.label}
                  </p>
                  <p className="mt-4 font-heading text-2xl font-semibold tracking-[-0.05em] text-foreground">
                    {card.value}
                  </p>
                  <p className="mt-2 text-sm font-medium text-foreground">{card.title}</p>
                  <p className="mt-3 text-sm leading-6 text-[#c8bea9]">{card.note}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="landing-stack-card absolute bottom-6 left-0 right-14 hidden h-[220px] rotate-[-4deg] lg:block" />
          <div className="landing-stack-card absolute bottom-0 left-10 right-0 hidden h-[220px] rotate-[3deg] opacity-90 lg:block" />
        </div>
      </section>

      <section className="relative z-10 mx-auto w-full max-w-7xl px-6 py-2 lg:px-10">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {signalStrip.map((item) => (
            <div key={item} className="landing-proof-chip min-h-14 justify-center">
              {item}
            </div>
          ))}
        </div>
      </section>

      <section
        id="capabilities"
        className="relative z-10 mx-auto w-full max-w-7xl px-6 py-14 lg:px-10 lg:py-22"
      >
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.26em] text-primary">ANF system</p>
            <h2 className="mt-4 font-heading text-4xl font-semibold tracking-[-0.05em] text-foreground lg:text-5xl">
              Autoridad, narrativa y acción sin fricción.
            </h2>
          </div>
          <p className="max-w-xl text-base leading-7 text-[#c7bca8]">
            Menos explicaciones. Más sistema, más tensión visual y una ruta clara hacia la
            activación del producto.
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {capabilities.map((card, index) => {
            const Icon = card.icon

            return (
              <SurfaceCard
                key={card.title}
                variant="panel"
                className={`landing-capability-card overflow-hidden p-6 ${
                  index === 1 ? "lg:-translate-y-4" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="rounded-full border border-primary/18 bg-primary/10 p-2 text-primary">
                    <Icon className="h-4 w-4" />
                  </span>
                  <p className="font-heading text-2xl font-semibold text-foreground">{card.title}</p>
                </div>
                <p className="mt-5 max-w-sm text-base leading-7 text-[#c7bca8]">{card.body}</p>
              </SurfaceCard>
            )
          })}
        </div>
      </section>

      <section className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-20 pt-2 lg:px-10 lg:pb-24">
        <SurfaceCard
          variant="panel"
          className="landing-cta-panel relative overflow-hidden px-6 py-10 lg:px-12 lg:py-12"
        >
          <div className="pointer-events-none absolute inset-y-0 right-[-8%] hidden w-[340px] lg:block">
            <Image
              src="/logo-content-generator.png"
              alt=""
              fill
              className="object-contain opacity-[0.08]"
              sizes="340px"
            />
          </div>

          <div className="relative max-w-3xl">
            <p className="text-xs uppercase tracking-[0.26em] text-primary">Frictionless action</p>
            <h2 className="mt-4 font-heading text-4xl font-semibold tracking-[-0.05em] text-foreground lg:text-5xl">
              Entra al sistema y convierte criterio en una ventaja editorial real.
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#d2c7b5]">
              Si tu valor nace del conocimiento, tu contenido necesita algo más que velocidad:
              necesita arquitectura.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                nativeButton={false}
                render={<Link href="/login" />}
                className="h-12 rounded-full bg-[linear-gradient(135deg,hsl(var(--primary)),hsl(41_100%_47%))] px-6 text-primary-foreground shadow-[0_24px_50px_-28px_rgba(255,198,55,0.76)]"
              >
                Entrar al Studio
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="ghost"
                nativeButton={false}
                render={<Link href="#capabilities" />}
                className="h-12 rounded-full text-[#d7ccb9] hover:bg-background/55 hover:text-foreground"
              >
                Revisar capacidades
              </Button>
            </div>
          </div>
        </SurfaceCard>
      </section>
    </main>
  )
}
