'use client'

import { useState } from 'react'
import type { ContactFormData } from '@/types'

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
    <section id="contact" className="py-20 px-6 bg-gray-50">
      <div className="max-w-xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-900 mb-10 text-center">
          Commander une pièce
        </h2>

        {status === 'success' ? (
          <p className="text-center text-gray-600">
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
                className="input"
              >
                <option value="">Sélectionner…</option>
                {BUDGET_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </Field>

            {status === 'error' && (
              <p className="text-sm text-red-500">
                Une erreur est survenue. Veuillez réessayer.
              </p>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-gray-900 text-white py-3 rounded-full text-sm hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              {status === 'loading' ? 'Envoi…' : 'Envoyer la demande'}
            </button>
          </form>
        )}
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
      <label htmlFor={htmlFor} className="block text-sm text-gray-700 mb-1">
        {label}
      </label>
      {children}
    </div>
  )
}
