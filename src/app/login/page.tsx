"use client"

import * as React from "react"
import Image from "next/image"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { betterAuthClient } from "@/lib/auth/better-auth-client"

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number, message: string): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined

  const timeoutPromise = new Promise<T>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(message))
    }, timeoutMs)
  })

  try {
    return await Promise.race([promise, timeoutPromise])
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
  }
}

async function bootstrapWorkspace() {
  if (process.env.NEXT_PUBLIC_BETTER_AUTH_ENABLED !== "true") {
    return
  }

  const response = await withTimeout(
    fetch("/api/auth/bootstrap-workspace", {
      method: "POST",
      credentials: "include",
    }),
    15000,
    "La preparacion inicial del workspace ha tardado demasiado. Intentalo de nuevo."
  )

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { message?: string } | null
    throw new Error(payload?.message ?? "No se pudo preparar el workspace inicial.")
  }
}

export default function LoginPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccessMsg(null)

    try {
      if (mode === "signin") {
        const { error } = await withTimeout(
          betterAuthClient.signIn.email({
            email,
            password,
            callbackURL: "/dashboard",
          }),
          15000,
          "El login ha tardado demasiado. Revisa tu conexion e intentalo de nuevo."
        )

        if (error) {
          setError(error.message ?? "No se pudo iniciar sesion.")
          return
        }

        await bootstrapWorkspace()
        window.location.href = "/dashboard"
        return
      }

      const { error } = await withTimeout(
        betterAuthClient.signUp.email({
          email,
          password,
          name: fullName || email,
        }),
        15000,
        "La creacion de cuenta ha tardado demasiado. Revisa tu conexion e intentalo de nuevo."
      )

      if (error) {
        setError(error.message ?? "No se pudo crear la cuenta.")
        return
      }

      try {
        await bootstrapWorkspace()
        window.location.href = "/dashboard"
        return
      } catch {
        // Some providers do not create an authenticated session immediately after sign up.
      }

      const signInResult = await withTimeout(
        betterAuthClient.signIn.email({
          email,
          password,
          callbackURL: "/dashboard",
        }),
        15000,
        "La activacion inicial ha tardado demasiado. Intentalo de nuevo."
      )

      if (signInResult.error) {
        setSuccessMsg("Cuenta creada. Ya puedes iniciar sesion para entrar al studio.")
        setMode("signin")
        setPassword("")
        return
      }

      await bootstrapWorkspace()
      window.location.href = "/dashboard"
    } catch (error) {
      setError(error instanceof Error ? error.message : "No se pudo completar la autenticacion.")
    } finally {
      setIsLoading(false)
    }
  }

  function switchMode(next: "signin" | "signup") {
    setMode(next)
    setError(null)
    setSuccessMsg(null)
  }

  const bg = "hsl(20 18% 5%)"
  const panelBorder = "hsl(20 10% 11%)"
  const cardBg = "hsl(20 14% 8%)"
  const cardBorder = "hsl(20 10% 13%)"
  const inputBg = "hsl(20 12% 10%)"
  const inputBorder = "hsl(20 10% 17%)"
  const amber = "hsl(38 92% 55%)"
  const amberDark = "hsl(20 18% 5%)"
  const textPrimary = "hsl(36 15% 93%)"
  const textMuted = "hsl(20 8% 54%)"
  const textDim = "hsl(20 8% 36%)"
  const sage = "hsl(158 42% 45%)"

  return (
    <div
      className="relative flex h-screen w-full overflow-hidden"
      style={{ backgroundColor: bg }}
    >
      <div
        className="hidden lg:flex lg:w-[58%] flex-col justify-between relative overflow-hidden"
        style={{ borderRight: `1px solid ${panelBorder}` }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle, hsl(38 92% 55% / 0.18) 1px, transparent 1px)`,
            backgroundSize: "28px 28px",
          }}
        />

        <div
          className="absolute left-0 top-0 bottom-0 w-px pointer-events-none"
          style={{
            background: `linear-gradient(to bottom, transparent 5%, ${amber} 40%, ${amber} 60%, transparent 95%)`,
            opacity: 0.6,
          }}
        />

        <div
          className="absolute pointer-events-none select-none"
          style={{
            right: "-120px",
            top: "50%",
            transform: "translateY(-50%) rotate(-10deg)",
            opacity: 0.08,
          }}
        >
          <div className="relative h-[620px] w-[620px]">
            <Image
              src="/logo-content-generator.png"
              alt=""
              fill
              className="object-contain"
              aria-hidden="true"
              priority
            />
          </div>
        </div>

        <div className="relative z-10 flex flex-col h-full justify-between p-12">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-xl ring-1 ring-white/10">
              <Image
                src="/logo-content-generator.png"
                alt="Anclora Content Generator AI logo"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div>
              <p
                className="font-heading text-sm font-semibold tracking-tight"
                style={{ color: textPrimary }}
              >
                Anclora Content Generator AI
              </p>
              <p className="text-[11px] uppercase tracking-[0.16em]" style={{ color: textDim }}>
                by Anclora Group
              </p>
            </div>
          </div>

          <div className="space-y-7 max-w-[480px]">
            <div className="space-y-4">
              <p
                className="text-[10px] font-semibold tracking-[0.18em] uppercase"
                style={{ color: amber }}
              >
                Content Intelligence
              </p>
              <h1
                className="font-heading leading-[1.06]"
                style={{
                  fontSize: "clamp(38px, 4vw, 58px)",
                  color: textPrimary,
                  letterSpacing: "-0.02em",
                }}
              >
                Genera contenido
                <br />
                <span style={{ color: "hsl(36 15% 60%)" }}>de autoridad</span>
                <br />
                con IA
              </h1>
              <p
                className="text-sm leading-relaxed max-w-sm"
                style={{ color: textMuted }}
              >
                El cockpit editorial de Anclora Group para convertir inteligencia de mercado en contenido de autoridad.
              </p>
            </div>

            <div className="space-y-3.5">
              {[
                { label: "RAG Knowledge Base", desc: "Embeddings propios con pgvector" },
                { label: "Multi-plataforma", desc: "Blog, redes sociales, email" },
                { label: "Voz de marca", desc: "Aprendizaje de tu estilo único" },
              ].map(({ label, desc }) => (
                <div key={label} className="flex items-baseline gap-3">
                  <div
                    className="mt-0.5 h-1 w-1 rounded-full flex-shrink-0"
                    style={{ backgroundColor: amber, marginTop: "7px" }}
                  />
                  <div>
                    <span
                      className="text-sm font-medium"
                      style={{ color: "hsl(36 15% 78%)" }}
                    >
                      {label}
                    </span>
                    <span
                      className="text-xs ml-2"
                      style={{ color: textMuted }}
                    >
                      — {desc}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs" style={{ color: textDim }}>
            © 2026 Anclora Content Generator AI
          </p>
        </div>
      </div>

      <div className="flex w-full lg:w-[42%] items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-[370px] space-y-7">
          <div className="flex items-center gap-3 lg:hidden">
            <div className="relative h-10 w-10 overflow-hidden rounded-xl ring-1 ring-white/10">
              <Image
                src="/logo-content-generator.png"
                alt="Anclora Content Generator AI logo"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div>
              <p
                className="font-heading text-sm font-semibold"
                style={{ color: textPrimary }}
              >
                Anclora Content Generator AI
              </p>
              <p className="text-[11px] uppercase tracking-[0.16em]" style={{ color: textDim }}>
                by Anclora Group
              </p>
            </div>
          </div>

          <div
            className="rounded-xl p-7"
            style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }}
          >
            <div
              className="mb-6 flex rounded-lg p-0.5"
              style={{ backgroundColor: "hsl(20 12% 10%)" }}
            >
              {(["signin", "signup"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => switchMode(m)}
                  className="flex-1 rounded-md py-2 text-xs font-medium transition-all duration-200"
                  style={
                    mode === m
                      ? {
                          backgroundColor: amber,
                          color: amberDark,
                          boxShadow: "0 1px 4px rgba(0,0,0,0.35)",
                        }
                      : { color: textMuted }
                  }
                >
                  {m === "signin" ? "Iniciar sesión" : "Crear cuenta"}
                </button>
              ))}
            </div>

            <div className="mb-5">
              <h2
                className="font-heading text-xl font-bold"
                style={{ color: textPrimary }}
              >
                {mode === "signin" ? "Bienvenido de vuelta" : "Empieza gratis"}
              </h2>
              <p className="mt-0.5 text-xs" style={{ color: textMuted }}>
                {mode === "signin"
                  ? "Accede a Anclora Content Generator AI"
                  : "Crea tu cuenta y entra directamente al studio"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "signup" && (
                <div className="space-y-1.5">
                  <Label
                    htmlFor="fullName"
                    className="text-xs font-medium"
                    style={{ color: textMuted }}
                  >
                    Nombre completo
                  </Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Tu nombre"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="text-sm transition-colors"
                    style={{
                      backgroundColor: inputBg,
                      border: `1px solid ${inputBorder}`,
                      color: textPrimary,
                    }}
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <Label
                  htmlFor="email"
                  className="text-xs font-medium"
                  style={{ color: textMuted }}
                >
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="founder@anclora.es"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="text-sm"
                  style={{
                    backgroundColor: inputBg,
                    border: `1px solid ${inputBorder}`,
                    color: textPrimary,
                  }}
                />
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="password"
                  className="text-xs font-medium"
                  style={{ color: textMuted }}
                >
                  Contraseña
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder={mode === "signup" ? "Mínimo 8 caracteres" : "••••••••"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="text-sm"
                  style={{
                    backgroundColor: inputBg,
                    border: `1px solid ${inputBorder}`,
                    color: textPrimary,
                  }}
                />
              </div>

              {error && (
                <div
                  className="rounded-lg px-3 py-2.5 text-xs leading-relaxed"
                  style={{
                    backgroundColor: "hsl(0 72% 51% / 0.1)",
                    border: "1px solid hsl(0 72% 51% / 0.22)",
                    color: "hsl(0 72% 70%)",
                  }}
                >
                  {error}
                </div>
              )}

              {successMsg && (
                <div
                  className="rounded-lg px-3 py-2.5 text-xs leading-relaxed"
                  style={{
                    backgroundColor: `${sage}1a`,
                    border: `1px solid ${sage}40`,
                    color: sage,
                  }}
                >
                  {successMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="mt-1 w-full rounded-lg py-2.5 text-sm font-semibold transition-all duration-150 active:scale-[0.98] disabled:opacity-55"
                style={{
                  backgroundColor: amber,
                  color: amberDark,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.25), 0 0 0 1px hsl(38 92% 55% / 0.2)",
                }}
              >
                {isLoading
                  ? mode === "signin"
                    ? "Entrando..."
                    : "Creando cuenta..."
                  : mode === "signin"
                  ? "Entrar al Studio"
                  : "Crear mi cuenta"}
              </button>
            </form>
          </div>

          <p className="text-center text-xs" style={{ color: textDim }}>
            Anclora Content Generator AI by Anclora Group · © 2026
          </p>
        </div>
      </div>
    </div>
  )
}
