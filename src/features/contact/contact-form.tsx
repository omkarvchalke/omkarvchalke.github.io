"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";

const CONTACT_EMAIL = "chalkeomkarvilas@gmail.com";
// Set at build time once a real form endpoint (e.g. Formspree) exists.
// Falls back to a prefilled mailto: link so the form works either way —
// see Phase 1's static-hosting decision (client-side only, no backend).
const FORM_ENDPOINT = process.env.NEXT_PUBLIC_CONTACT_FORM_ENDPOINT;

const schema = z.object({
  name: z.string().min(2, "Enter your name"),
  email: z.string().email("Enter a valid email"),
  message: z.string().min(10, "Say a bit more — 10 characters minimum"),
});

type FormValues = z.infer<typeof schema>;

type Status = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    setStatus("submitting");

    if (!FORM_ENDPOINT) {
      const subject = encodeURIComponent(
        `Portfolio contact from ${values.name}`
      );
      const body = encodeURIComponent(
        `${values.message}\n\n— ${values.name} (${values.email})`
      );
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
      setStatus("success");
      reset();
      return;
    }

    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new URLSearchParams(values),
      });
      if (!res.ok) throw new Error("Submission failed");
      setStatus("success");
      reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="border-primary/30 bg-primary/5 rounded-lg border px-6 py-10 text-center">
        <p className="text-foreground text-sm">
          {FORM_ENDPOINT
            ? "Message sent — I'll get back to you soon."
            : "Your email client should have opened with the message prefilled."}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <Field label="Name" error={errors.name?.message}>
        <input
          {...register("name")}
          type="text"
          autoComplete="name"
          className={inputClass(Boolean(errors.name))}
        />
      </Field>
      <Field label="Email" error={errors.email?.message}>
        <input
          {...register("email")}
          type="email"
          autoComplete="email"
          className={inputClass(Boolean(errors.email))}
        />
      </Field>
      <Field label="Message" error={errors.message?.message}>
        <textarea
          {...register("message")}
          rows={5}
          className={cn(inputClass(Boolean(errors.message)), "resize-none")}
        />
      </Field>

      {status === "error" && (
        <p className="text-destructive text-sm">
          Something went wrong — email {CONTACT_EMAIL} directly instead.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="glow-ring-emerald bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-10 w-fit items-center gap-2 rounded-md px-4 text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 disabled:pointer-events-none disabled:translate-y-0 disabled:opacity-50 disabled:shadow-none"
      >
        {status === "submitting" ? "Sending…" : "Send message"}
        <Send className="size-3.5" />
      </button>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-muted-foreground font-mono text-xs tracking-[0.08em] uppercase">
        {label}
      </span>
      {children}
      {error && <span className="text-destructive text-xs">{error}</span>}
    </label>
  );
}

function inputClass(hasError: boolean) {
  return cn(
    "rounded-md border bg-card px-3 py-2 text-sm outline-none transition-colors focus-visible:border-primary",
    hasError ? "border-destructive" : "border-border"
  );
}
