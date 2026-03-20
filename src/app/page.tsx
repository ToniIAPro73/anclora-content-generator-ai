import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  BarChart3,
  BrainCircuit,
  CalendarClock,
  Radar,
  Sparkles,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SurfaceCard } from "@/components/ui/surface-card"

export const metadata: Metadata = {
  title: "Anclora Content Generator AI",
  description:
    "Cockpit editorial premium para convertir inteligencia de mercado en contenido de autoridad, trazable y orientado a conversión.",
}

const capabilityCards = [
  {
    title: "Ingiere contexto con criterio",
    body: "Convierte documentos, Google Docs y conocimiento curado en una Knowledge Base que no solo almacena: estructura, prioriza y prepara contexto reutilizable.",
    icon: BrainCircuit,
  },
  {
    title: "Transforma señales en piezas",
    body: "El sistema detecta oportunidades editoriales, las lleva al Studio y acelera la producción de activos con una voz consistente y un objetivo concreto.",
    icon: Sparkles,
  },
  {
    title: "Opera y decide desde un cockpit",
    body: "Mide rendimiento por pieza, canal y ciclo editorial para decidir qué impulsar, qué refrescar y qué convertir en negocio real.",
    icon: BarChart3,
  },
] as const

const workflow = [
  {
    step: "01",
    title: "Captura conocimiento",
    body: "Importa research, notas, briefs y fuentes documentales para construir una base propia de contexto.",
  },
  {
    step: "02",
    title: "Genera oportunidades",
    body: "El RAG y el agente editorial transforman información dispersa en temas, ángulos y piezas accionables.",
  },
  {
    step: "03",
    title: "Produce con trazabilidad",
    body: "Cada borrador puede remontarse a la fuente, a la oportunidad y a la intención editorial original.",
  },
  {
    step: "04",
    title: "Mide y reacciona",
    body: "El sistema compara impacto, señala qué mover y propone la siguiente acción operativa.",
  },
] as const

const proofPoints = [
  "RAG curado con fuentes, claims y evidencias",
  "Workflow editorial completo: research -> draft -> delivery",
  "Trazabilidad real entre contexto, oportunidad y pieza",
  "Operación multicanal guiada por señales",
] as const

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,198,55,0.13),transparent_28%),radial-gradient(circle_at_80%_18%,rgba(255,198,55,0.08),transparent_20%),linear-gradient(180deg,rgba(255,198,55,0.03),transparent_22%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,198,55,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,198,55,0.08)_1px,transparent_1px)] bg-[size:38px_38px] opacity-[0.08]" />

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
            render={<Link href="#system" />}
            className="text-muted-foreground hover:text-foreground"
          >
            Explorar el sistema
          </Button>
          <Button
            variant="default"
            render={<Link href="/login" />}
            className="h-11 rounded-full bg-[linear-gradient(135deg,hsl(var(--primary)),hsl(40_100%_44%))] px-5 text-primary-foreground shadow-[0_16px_36px_-24px_rgba(255,198,55,0.8)]"
          >
            Entrar al Studio
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <section className="relative z-10 mx-auto grid w-full max-w-7xl gap-10 px-6 pb-12 pt-6 lg:grid-cols-[1.08fr_0.92fr] lg:px-10 lg:pb-20 lg:pt-10">
        <div className="relative">
          <div className="absolute -left-10 top-0 hidden h-[760px] w-[760px] lg:block">
            <Image
              src="/logo-content-generator.png"
              alt=""
              fill
              className="object-contain opacity-[0.12] saturate-0"
              sizes="760px"
            />
          </div>

          <div className="relative max-w-3xl">
            <Badge
              variant="outline"
              className="border-primary/25 bg-primary/10 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-primary"
            >
              Brand Authority Engine
            </Badge>

            <h1 className="mt-8 max-w-4xl font-heading text-5xl font-semibold leading-[0.95] tracking-[-0.05em] text-foreground sm:text-6xl lg:text-[5.6rem]">
              Genera autoridad editorial con un sistema, no con ruido.
            </h1>

            <p className="mt-8 max-w-2xl text-lg leading-8 text-[#c7bca8]">
              Anclora convierte inteligencia de mercado, research curado y señales operativas
              en contenido de alto valor, trazable y orientado a negocio.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                render={<Link href="/login" />}
                className="h-12 rounded-full bg-[linear-gradient(135deg,hsl(var(--primary)),hsl(40_100%_44%))] px-6 text-primary-foreground shadow-[0_18px_40px_-24px_rgba(255,198,55,0.7)]"
              >
                Entrar al Studio
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                render={<Link href="#workflow" />}
                className="h-12 rounded-full border-primary/15 bg-card/60 px-6 text-foreground backdrop-blur"
              >
                Explorar el sistema
              </Button>
            </div>

            <div className="mt-12 grid gap-4 md:grid-cols-3">
              <SurfaceCard variant="inner" className="border-primary/12 bg-card/55 p-4 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                  Knowledge Base
                </p>
                <p className="mt-3 text-sm leading-6 text-[#d8cfbf]">
                  Contexto curado desde documentos, research y fuentes editoriales.
                </p>
              </SurfaceCard>
              <SurfaceCard variant="inner" className="border-primary/12 bg-card/55 p-4 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                  Content Studio
                </p>
                <p className="mt-3 text-sm leading-6 text-[#d8cfbf]">
                  Briefing, generación, revisión y delivery en un mismo cockpit.
                </p>
              </SurfaceCard>
              <SurfaceCard variant="inner" className="border-primary/12 bg-card/55 p-4 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                  Analytics Loop
                </p>
                <p className="mt-3 text-sm leading-6 text-[#d8cfbf]">
                  Señales por pieza, canal y resultado para decidir la siguiente acción.
                </p>
              </SurfaceCard>
            </div>
          </div>
        </div>

        <div className="relative">
          <SurfaceCard
            variant="panel"
            className="relative overflow-hidden border-primary/15 bg-[linear-gradient(180deg,rgba(32,24,18,0.95),rgba(18,14,11,0.94))] p-6 shadow-[0_28px_70px_-44px_rgba(0,0,0,0.95),0_0_0_1px_rgba(255,198,55,0.06)] lg:p-7"
          >
            <div className="absolute inset-x-6 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,198,55,0.65),transparent)]" />

            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-primary/90">
                  Editorial Command
                </p>
                <p className="mt-3 max-w-sm font-heading text-2xl font-semibold text-foreground">
                  Un cockpit diseñado para convertir conocimiento en reputación operativa.
                </p>
              </div>
              <div className="hidden rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs text-primary md:block">
                activo
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <SurfaceCard variant="inner" className="border-primary/12 bg-background/55 p-5">
                <div className="flex items-center gap-3">
                  <Radar className="h-4 w-4 text-primary" />
                  <p className="text-sm font-medium text-foreground">Señales detectadas</p>
                </div>
                <p className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-foreground">24</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Oportunidades editoriales construidas desde fuentes y dossiers curados.
                </p>
              </SurfaceCard>

              <SurfaceCard variant="inner" className="border-primary/12 bg-background/55 p-5">
                <div className="flex items-center gap-3">
                  <CalendarClock className="h-4 w-4 text-primary" />
                  <p className="text-sm font-medium text-foreground">Pipeline activo</p>
                </div>
                <p className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-foreground">07</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Piezas avanzando entre draft, review, scheduled y published.
                </p>
              </SurfaceCard>
            </div>

            <div className="mt-6 space-y-3">
              {proofPoints.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-2xl bg-background/45 px-4 py-3 text-sm text-[#e1d6c3]"
                >
                  <span className="mt-1 h-2 w-2 rounded-full bg-primary shadow-[0_0_16px_rgba(255,198,55,0.55)]" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </SurfaceCard>
        </div>
      </section>

      <section className="relative z-10 mx-auto w-full max-w-7xl px-6 py-8 lg:px-10">
        <div className="grid gap-px overflow-hidden rounded-[28px] bg-primary/10 lg:grid-cols-4">
          {proofPoints.map((item) => (
            <div key={item} className="bg-card/60 px-5 py-5 text-sm text-[#d6ccbb] backdrop-blur">
              {item}
            </div>
          ))}
        </div>
      </section>

      <section id="system" className="relative z-10 mx-auto w-full max-w-7xl px-6 py-12 lg:px-10 lg:py-20">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.24em] text-primary">Sistema editorial</p>
          <h2 className="mt-4 font-heading text-4xl font-semibold tracking-[-0.04em] text-foreground lg:text-5xl">
            La autoridad no se improvisa. Se orquesta.
          </h2>
          <p className="mt-5 text-lg leading-8 text-[#c7bca8]">
            Anclora conecta contexto, oportunidades, producción y medición en una misma
            arquitectura. No es solo generación; es dirección editorial con memoria y criterio.
          </p>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {capabilityCards.map((card) => {
            const Icon = card.icon
            return (
              <SurfaceCard
                key={card.title}
                variant="panel"
                className="border-primary/12 bg-card/70 p-6 backdrop-blur"
              >
                <div className="flex items-center gap-3">
                  <span className="rounded-full border border-primary/15 bg-primary/10 p-2 text-primary">
                    <Icon className="h-4 w-4" />
                  </span>
                  <p className="font-heading text-xl font-semibold text-foreground">{card.title}</p>
                </div>
                <p className="mt-5 text-base leading-7 text-[#c7bca8]">{card.body}</p>
              </SurfaceCard>
            )
          })}
        </div>
      </section>

      <section id="workflow" className="relative z-10 mx-auto w-full max-w-7xl px-6 py-12 lg:px-10 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
          <div className="max-w-lg">
            <p className="text-xs uppercase tracking-[0.24em] text-primary">Workflow</p>
            <h2 className="mt-4 font-heading text-4xl font-semibold tracking-[-0.04em] text-foreground">
              Un loop editorial diseñado para convertir expertise en activos.
            </h2>
            <p className="mt-5 text-lg leading-8 text-[#c7bca8]">
              Desde la ingesta de conocimiento hasta la recomendación operativa, la plataforma
              mantiene el hilo completo de cada decisión editorial.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {workflow.map((item, index) => (
              <SurfaceCard
                key={item.step}
                variant="panel"
                className={`border-primary/12 bg-card/70 p-6 backdrop-blur ${
                  index % 2 === 1 ? "md:translate-y-10" : ""
                }`}
              >
                <p className="text-xs uppercase tracking-[0.26em] text-primary">{item.step}</p>
                <p className="mt-4 font-heading text-2xl font-semibold text-foreground">
                  {item.title}
                </p>
                <p className="mt-4 text-base leading-7 text-[#c7bca8]">{item.body}</p>
              </SurfaceCard>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-18 pt-6 lg:px-10 lg:pb-24">
        <SurfaceCard
          variant="panel"
          className="relative overflow-hidden border-primary/14 bg-[linear-gradient(180deg,rgba(34,24,16,0.96),rgba(17,13,10,0.98))] px-6 py-10 lg:px-12"
        >
          <div className="absolute right-[-4%] top-1/2 hidden h-[340px] w-[340px] -translate-y-1/2 opacity-[0.08] lg:block">
            <Image
              src="/logo-content-generator.png"
              alt=""
              fill
              className="object-contain"
              sizes="340px"
            />
          </div>

          <div className="relative max-w-3xl">
            <p className="text-xs uppercase tracking-[0.24em] text-primary">Acceso al producto</p>
            <h2 className="mt-4 font-heading text-4xl font-semibold tracking-[-0.04em] text-foreground lg:text-5xl">
              Entra en Anclora y opera tu sistema editorial con una lógica de autoridad.
            </h2>
            <p className="mt-5 text-lg leading-8 text-[#d3c8b6]">
              Si tu ventaja competitiva nace del conocimiento, la reputación no puede depender
              de improvisación. Necesita sistema, contexto y ejecución.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                render={<Link href="/login" />}
                className="h-12 rounded-full bg-[linear-gradient(135deg,hsl(var(--primary)),hsl(40_100%_44%))] px-6 text-primary-foreground shadow-[0_18px_40px_-24px_rgba(255,198,55,0.7)]"
              >
                Entrar al Studio
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="ghost"
                render={<Link href="#system" />}
                className="h-12 rounded-full text-[#d5cab8] hover:bg-background/60 hover:text-foreground"
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
