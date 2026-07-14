"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { ArrowLeft, ArrowRight, Eye, EyeOff, LockKeyhole, Mail, Sparkles } from "lucide-react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import styles from "./page.module.css";

type Mode = "login" | "signup";

export default function AuthPage() {
  const [mode, setMode] = useState<Mode>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    const supabase = createClient();
    if (!supabase) {
      setMessage("Conecte as chaves do Supabase para ativar a autenticação.");
      return;
    }

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");
    const fullName = String(form.get("fullName") ?? "").trim();
    setLoading(true);

    const result = mode === "login"
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName } } });

    setLoading(false);
    if (result.error) {
      setMessage(result.error.message);
      return;
    }

    if (mode === "signup" && !result.data.session) {
      setMessage("Conta criada. Confira seu e-mail para confirmar o acesso.");
      return;
    }

    window.location.href = "/";
  }

  return <main className={styles.page}>
    <section className={styles.story}>
      <Link className={styles.back} href="/"><ArrowLeft /> Voltar ao dashboard</Link>
      <div className={styles.storyContent}>
        <Image src="/brand/liflow-mark.png" alt="LIFLOW" width={84} height={84} priority />
        <p className={styles.eyebrow}>SUA VIDA EM FLUXOS</p>
        <h1>Clareza para decidir.<br />Leveza para viver.</h1>
        <p>Um único lugar para acompanhar dinheiro, metas e tudo que move a sua vida.</p>
        <div className={styles.promise}><Sparkles /><span>Seus dados financeiros protegidos por políticas de acesso individuais.</span></div>
      </div>
      <span className={styles.orbOne} /><span className={styles.orbTwo} />
    </section>

    <section className={styles.formSide}>
      <div className={styles.formCard}>
        <div className={styles.mobileBrand}><Image src="/brand/liflow-mark.png" alt="" width={44} height={44} /><b>LIFLOW</b></div>
        <p className={styles.eyebrow}>{mode === "login" ? "BEM-VINDO DE VOLTA" : "COMECE SEU FLUXO"}</p>
        <h2>{mode === "login" ? "Entre na sua conta" : "Crie sua conta"}</h2>
        <p className={styles.subtitle}>{mode === "login" ? "Continue de onde parou." : "Leva menos de um minuto."}</p>

        {!isSupabaseConfigured && <div className={styles.setupNotice}>Modo de demonstração: adicione as chaves do Supabase em <code>apps/web/.env.local</code>.</div>}

        <form onSubmit={submit}>
          {mode === "signup" && <label>Nome completo<div className={styles.input}><span>✦</span><input name="fullName" autoComplete="name" placeholder="Como podemos chamar você?" required /></div></label>}
          <label>E-mail<div className={styles.input}><Mail /><input name="email" type="email" autoComplete="email" placeholder="voce@email.com" required /></div></label>
          <label>Senha<div className={styles.input}><LockKeyhole /><input name="password" type={showPassword ? "text" : "password"} minLength={8} autoComplete={mode === "login" ? "current-password" : "new-password"} placeholder="Mínimo de 8 caracteres" required /><button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}>{showPassword ? <EyeOff /> : <Eye />}</button></div></label>
          {message && <p className={styles.message} role="status">{message}</p>}
          <button className={styles.submit} disabled={loading}>{loading ? "Aguarde..." : mode === "login" ? "Entrar" : "Criar minha conta"}<ArrowRight /></button>
        </form>

        <p className={styles.switch}>{mode === "login" ? "Ainda não tem uma conta?" : "Já possui uma conta?"}<button onClick={() => { setMode(mode === "login" ? "signup" : "login"); setMessage(""); }}>{mode === "login" ? "Criar conta" : "Entrar"}</button></p>
      </div>
    </section>
  </main>;
}

