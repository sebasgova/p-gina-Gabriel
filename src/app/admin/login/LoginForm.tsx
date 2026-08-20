"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { loginAction } from "../actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-6 h-12 w-full rounded-full bg-accent text-sm font-medium text-black transition-colors hover:bg-accent-soft disabled:opacity-60"
    >
      {pending ? "Ingresando…" : "Ingresar"}
    </button>
  );
}

export function LoginForm() {
  const [state, formAction] = useActionState(loginAction, undefined);

  return (
    <form action={formAction} className="mt-6">
      <label className="block text-xs uppercase tracking-wider text-mist">Contraseña</label>
      <input
        type="password"
        name="password"
        required
        autoFocus
        className="mt-2 h-12 w-full rounded-xl border border-line-strong bg-white/[0.03] px-4 text-sm outline-none focus:border-accent"
      />
      {state?.error && <p className="mt-3 text-sm text-accent">{state.error}</p>}
      <SubmitButton />
    </form>
  );
}
