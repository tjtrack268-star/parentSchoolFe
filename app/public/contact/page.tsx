'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Simulate form submission
    setTimeout(() => {
      alert('Message envoyé! Nous vous répondrons bientôt.')
      setFormData({ name: '', email: '', subject: '', message: '' })
      setLoading(false)
    }, 1000)
  }

  return (
    <main className="min-h-screen bg-white">
      <nav className="fixed w-full top-0 bg-white bg-opacity-95 backdrop-blur shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            Parents School
          </Link>
          <div className="flex gap-4">
            <Link href="/auth/login">
              <Button variant="ghost">Se connecter</Button>
            </Link>
            <Link href="/auth/signup">
              <Button>S'inscrire</Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-20">
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-20">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">Nous Contacter</h1>
          <p className="text-xl text-slate-600">
            Avez-vous des questions? Nous sommes ici pour vous aider!
          </p>
        </section>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Informations de Contact</h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <span className="text-2xl">📧</span>
                  <div>
                    <p className="font-semibold text-slate-900">Email</p>
                    <p className="text-slate-600">contact@parentsschool.dev</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="text-2xl">📱</span>
                  <div>
                    <p className="font-semibold text-slate-900">Téléphone</p>
                    <p className="text-slate-600">+237 XXX XXX XXX</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="text-2xl">⏰</span>
                  <div>
                    <p className="font-semibold text-slate-900">Horaires</p>
                    <p className="text-slate-600">Lun-Ven: 9h-18h (GMT+1)</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="text-2xl">📍</span>
                  <div>
                    <p className="font-semibold text-slate-900">Localisation</p>
                    <p className="text-slate-600">Yaoundé, Cameroun</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-6 bg-slate-50 p-8 rounded-lg border border-slate-200">
            <h3 className="text-2xl font-bold text-slate-900">Envoyez-nous un Message</h3>

            <div className="space-y-2">
              <Label htmlFor="name">Nom complet</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Votre nom"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="votre@email.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Sujet</Label>
              <Input
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Sujet de votre message"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Votre message..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={4}
                required
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700">
              {loading ? 'Envoi en cours...' : 'Envoyer le Message'}
            </Button>
          </form>
        </div>
      </div>
    </main>
  )
}
