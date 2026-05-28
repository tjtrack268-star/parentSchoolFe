"use client"

import { useEffect, useState } from "react"
import { Heart, MessageCircle, Send, Star } from "lucide-react"

interface Comment {
  id: number
  content: string
  authorName: string
  rating: number
  createdAt: string
}

function StarRating({ value, onChange }: { value: number; onChange?: (v: number) => void }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onChange?.(s)}
          className={`text-lg transition ${s <= value ? "text-[#e8b41f]" : "text-slate-300"} ${onChange ? "hover:text-[#e8b41f] cursor-pointer" : "cursor-default"}`}
        >
          ★
        </button>
      ))}
    </div>
  )
}

export default function BookInteractions({ slug }: { slug: string }) {
  const [likes, setLikes] = useState(0)
  const [liked, setLiked] = useState(false)
  const [comments, setComments] = useState<Comment[]>([])
  const [showComments, setShowComments] = useState(false)
  const [form, setForm] = useState({ authorName: "", content: "", rating: 5 })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    fetch(`/api/books/${slug}/likes`).then(r => r.json()).then(d => { setLikes(d.count ?? 0); setLiked(d.liked ?? false) }).catch(() => {})
    fetch(`/api/books/${slug}/comments`).then(r => r.json()).then(d => setComments(Array.isArray(d) ? d : [])).catch(() => {})
  }, [slug])

  const toggleLike = async () => {
    const res = await fetch(`/api/books/${slug}/likes`, { method: "POST" })
    if (res.ok) {
      const d = await res.json()
      setLikes(d.count)
      setLiked(d.liked)
    } else if (res.status === 401) {
      alert("Connectez-vous pour liker cet ouvrage")
    }
  }

  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.content.trim() || !form.authorName.trim()) return
    setSubmitting(true)
    const res = await fetch(`/api/books/${slug}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      const newComment = await res.json()
      setComments(c => [newComment, ...c])
      setForm({ authorName: "", content: "", rating: 5 })
      setSubmitted(true)
      setTimeout(() => setSubmitted(false), 3000)
    }
    setSubmitting(false)
  }

  return (
    <div className="mt-4 border-t border-slate-200 pt-4">
      {/* Actions */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleLike}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold transition ${liked ? "bg-rose-50 text-rose-600" : "bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-600"}`}
        >
          <Heart className={`h-4 w-4 ${liked ? "fill-rose-500 text-rose-500" : ""}`} />
          {likes} J'aime
        </button>

        <button
          onClick={() => setShowComments(v => !v)}
          className="flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-600 transition hover:bg-[#a3ade8]/30 hover:text-[#3f2f85]"
        >
          <MessageCircle className="h-4 w-4" />
          {comments.length} Commentaire{comments.length !== 1 ? "s" : ""}
        </button>
      </div>

      {/* Section commentaires */}
      {showComments && (
        <div className="mt-4 space-y-4">
          {/* Commentaires existants */}
          {comments.length > 0 && (
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {comments.map((c) => (
                <div key={c.id} className="rounded-lg bg-[#f8f4ef] p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-[#3f2f85]">{c.authorName}</span>
                    <StarRating value={c.rating} />
                  </div>
                  <p className="text-sm text-slate-600">{c.content}</p>
                </div>
              ))}
            </div>
          )}

          {/* Formulaire */}
          {submitted ? (
            <p className="text-sm font-semibold text-green-600">✓ Commentaire publié !</p>
          ) : (
            <form onSubmit={submitComment} className="space-y-3 rounded-lg border border-[#a3ade8]/40 bg-white p-4">
              <p className="text-sm font-semibold text-[#3f2f85]">Laisser un commentaire</p>
              <input
                type="text"
                required
                value={form.authorName}
                onChange={e => setForm(f => ({ ...f, authorName: e.target.value }))}
                placeholder="Votre nom"
                className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-[#3f2f85] focus:outline-none"
              />
              <div>
                <p className="text-xs text-slate-500 mb-1">Note</p>
                <StarRating value={form.rating} onChange={v => setForm(f => ({ ...f, rating: v }))} />
              </div>
              <textarea
                required
                rows={3}
                value={form.content}
                onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                placeholder="Votre avis sur cet ouvrage..."
                className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-[#3f2f85] focus:outline-none resize-none"
              />
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-lg bg-[#3f2f85] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
              >
                <Send className="h-3.5 w-3.5" />
                {submitting ? "Envoi..." : "Publier"}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  )
}
