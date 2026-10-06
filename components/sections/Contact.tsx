'use client'

import { useState } from 'react'
import type { ContactFormData } from '@/types'
import { Halo } from '@/components/da/Doodles'
import SprayTag from '@/components/da/SprayTag'

const BUDGET_OPTIONS = ['< 100 €', '100 – 300 €', '300 – 500 €', '> 500 €']

export default function Contact() {
  const [form, setForm] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: null,
    message: '',
    budget: null,
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value || null }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      const { createContactRequest } = await import('@/lib/supabase')
      await createContactRequest(form)
      setStatus('success')
      setForm({ name: '', email: '', phone: null, message: '', budget: null })
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="contact" className="bg-ink px-4 py-20 text-paper sm:px-6">
      <div className="grid gap-14 md:grid-cols-[1fr_1.1fr]">
        <div>
          <p className="font-mono text-xs uppercase text-paper/60">[ 03 ] Commande</p>
          <h2 className="mt-4 font-display text-6xl uppercase leading-[0.85] sm:text-8xl">
            Commander
            <br />
            une pièce
          </h2>
          <SprayTag className="relative mt-4 -rotate-3 text-4xl text-acid sm:text-5xl" drips={[[25, 0.5], [70, 0.3]]}>
            on la dessine ensemble
          </SprayTag>

          {/* Oculus de Mantegna photocopié : une fenêtre ouverte sur le ciel, auréolée à la bombe. */}
          <div className="relative mt-14 w-56 sm:w-64">
            <div
              role="img"
              aria-label="L'oculus de la Camera degli Sposi d'Andrea Mantegna : un ciel bordé de putti"
              className="xerox aspect-square rounded-full bg-[url(/da/mantegna-oculus.jpg)] bg-[length:312%_auto] bg-[position:50%_4%]"
            />
            <Halo className="absolute -top-8 left-1/2 w-44 -translate-x-1/2 text-fluo-pink" />
          </div>
        </div>

        <div className="md:pt-10">
        {status === 'success' ? (
          <p className="font-mono text-sm uppercase leading-relaxed">
            Merci ! Votre demande a bien été envoyée. Je vous recontacte rapidement.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <Field label="Nom *" htmlFor="name">
              <input
                id="name"
                name="name"
                type="text"
                required
                value={form.name}
                onChange={handleChange}
                className="input"
              />
            </Field>

            <Field label="Email *" htmlFor="email">
              <input
                id="email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                className="input"
              />
            </Field>

            <Field label="Téléphone" htmlFor="phone">
              <input
                id="phone"
                name="phone"
                type="tel"
                value={form.phone ?? ''}
                onChange={handleChange}
                className="input"
              />
            </Field>

            <Field label="Description du bijou souhaité *" htmlFor="message">
              <textarea
                id="message"
                name="message"
                required
                rows={4}
                value={form.message}
                onChange={handleChange}
                className="input resize-none"
              />
            </Field>

            <Field label="Budget" htmlFor="budget">
              <select
                id="budget"
                name="budget"
                value={form.budget ?? ''}
                onChange={handleChange}
                className="input [&_option]:text-ink"
              >
                <option value="">Sélectionner…</option>
                {BUDGET_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </Field>

            {status === 'error' && (
              <p className="font-mono text-xs uppercase text-orange">
                Une erreur est survenue. Veuillez réessayer.
              </p>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="mt-4 bg-paper px-6 py-3 font-display text-lg uppercase tracking-wide text-ink transition-colors hover:bg-acid disabled:opacity-50"
            >
              {status === 'loading' ? 'Envoi…' : 'Envoyer la demande'}
            </button>
          </form>
        )}
        </div>
      </div>
    </section>
  )
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string
  htmlFor: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block font-mono text-[11px] uppercase tracking-wider text-paper/60">
        {label}
      </label>
      {children}
    </div>
  )
}
