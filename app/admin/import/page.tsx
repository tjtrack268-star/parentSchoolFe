"use client"

import { useState, useRef, useCallback } from "react"
import { Upload, FileSpreadsheet, CheckCircle2, AlertTriangle, XCircle, Loader2 } from "lucide-react"

// ── Types ─────────────────────────────────────────────────────────────────────
type ImportError = { line: number; field: string; message: string }
type ImportedMember = { name: string; code: string; sponsor: string; grade: string }
type ImportReport = {
  success: number
  duplicates: number
  errors: number
  errorDetails: ImportError[]
  members: ImportedMember[]
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ImportPage() {
  const [file,       setFile]       = useState<File | null>(null)
  const [dragging,   setDragging]   = useState(false)
  const [progress,   setProgress]   = useState(0)
  const [importing,  setImporting]  = useState(false)
  const [report,     setReport]     = useState<ImportReport | null>(null)
  const [apiError,   setApiError]   = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Drag & drop handlers
  const onDragOver  = useCallback((e: React.DragEvent) => { e.preventDefault(); setDragging(true)  }, [])
  const onDragLeave = useCallback(() => setDragging(false), [])
  const onDrop      = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false)
    const dropped = e.dataTransfer.files[0]
    if (dropped && dropped.name.endsWith(".xlsx")) { setFile(dropped); setReport(null); setApiError(null) }
    else setApiError("Seuls les fichiers .xlsx sont acceptés.")
  }, [])

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (selected && selected.name.endsWith(".xlsx")) { setFile(selected); setReport(null); setApiError(null) }
    else setApiError("Seuls les fichiers .xlsx sont acceptés.")
  }

  const handleImport = async () => {
    if (!file) return
    setImporting(true); setProgress(0); setApiError(null); setReport(null)

    // Simulation de progression pendant l'upload
    const interval = setInterval(() => {
      setProgress(p => { if (p >= 85) { clearInterval(interval); return p } return p + 10 })
    }, 300)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const res = await fetch("/api/admin/import", { method: "POST", body: formData })
      clearInterval(interval); setProgress(100)

      const data = await res.json()
      if (!res.ok) { setApiError(data.message || "Erreur lors de l'import"); return }

      setReport({
        success:      data.success      ?? 0,
        duplicates:   data.duplicates   ?? 0,
        errors:       data.errors       ?? 0,
        errorDetails: data.errorDetails ?? [],
        members:      data.members      ?? [],
      })
    } catch {
      clearInterval(interval)
      setApiError("Impossible de joindre le serveur.")
    } finally {
      setImporting(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">

        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#e8b41f]">Administration</p>
          <h1 className="text-3xl font-bold text-[#3f2f85]">Import de membres</h1>
          <p className="mt-1 text-sm text-slate-500">Importez des membres en masse via un fichier Excel (.xlsx)</p>
        </div>

        {/* Explication Importation */}
        <div className="mb-6 rounded-lg border border-[#a3ade8]/40 bg-white p-4 text-xs leading-relaxed text-slate-600 shadow-sm">
          <p className="font-semibold text-[#3f2f85] text-sm mb-1">💡 Instructions d'importation Excel :</p>
          <ul className="list-disc list-inside space-y-0.5">
            <li><strong>Format accepté :</strong> Fichier Microsoft Excel (<code>.xlsx</code>).</li>
            <li><strong>Colonnes requises :</strong> Prénom, Nom, Email, Téléphone, Pays, Type de membre (Optionnel: Code Parrain, Grade).</li>
            <li><strong>Doublons :</strong> Les membres existants (même email) seront ignorés pour éviter les doublons.</li>
          </ul>
        </div>

        {/* Zone dépôt fichier */}
        <div
          onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}
          onClick={() => !importing && inputRef.current?.click()}
          className={`mb-6 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 transition
            ${dragging ? "border-[#3f2f85] bg-[#3f2f85]/5" : "border-[#a3ade8]/60 bg-white hover:border-[#3f2f85]/60"}
            ${importing ? "pointer-events-none opacity-60" : ""}`}>
          <input ref={inputRef} type="file" accept=".xlsx" className="hidden" onChange={onFileChange} />
          {file
            ? <><FileSpreadsheet className="mb-3 h-12 w-12 text-[#3f2f85]" />
                <p className="font-semibold text-[#3f2f85]">{file.name}</p>
                <p className="text-xs text-slate-400">{(file.size / 1024).toFixed(1)} Ko</p></>
            : <><Upload className="mb-3 h-12 w-12 text-slate-300" />
                <p className="font-semibold text-slate-600">Glissez votre fichier ici</p>
                <p className="text-xs text-slate-400">ou cliquez pour sélectionner — .xlsx uniquement</p></>}
        </div>

        {apiError && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{apiError}</div>
        )}

        {/* Bouton import */}
        <button onClick={handleImport} disabled={!file || importing}
          className="mb-8 flex w-full items-center justify-center gap-2 rounded-lg bg-[#3f2f85] py-3 font-semibold text-white transition hover:opacity-90 disabled:opacity-50">
          {importing
            ? <><Loader2 className="h-4 w-4 animate-spin" /> Import en cours...</>
            : <><Upload className="h-4 w-4" /> Lancer l'import</>}
        </button>

        {/* Barre de progression */}
        {importing && (
          <div className="mb-8">
            <div className="mb-1 flex justify-between text-xs text-slate-500">
              <span>Traitement en cours...</span><span>{progress}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-[#a3ade8]/30">
              <div className="h-full rounded-full bg-[#3f2f85] transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        {/* Rapport */}
        {report && (
          <div className="space-y-6">
            {/* Cartes résumé */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="flex items-center gap-4 rounded-xl border-l-4 border-green-500 bg-white p-5 shadow-sm">
                <CheckCircle2 className="h-8 w-8 shrink-0 text-green-500" />
                <div>
                  <p className="text-2xl font-bold text-green-600">{report.success}</p>
                  <p className="text-xs text-slate-500">membres importés avec succès</p>
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-xl border-l-4 border-orange-400 bg-white p-5 shadow-sm">
                <AlertTriangle className="h-8 w-8 shrink-0 text-orange-400" />
                <div>
                  <p className="text-2xl font-bold text-orange-500">{report.duplicates}</p>
                  <p className="text-xs text-slate-500">doublons mis à jour</p>
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-xl border-l-4 border-red-400 bg-white p-5 shadow-sm">
                <XCircle className="h-8 w-8 shrink-0 text-red-400" />
                <div>
                  <p className="text-2xl font-bold text-red-500">{report.errors}</p>
                  <p className="text-xs text-slate-500">erreurs</p>
                </div>
              </div>
            </div>

            {/* Tableau erreurs */}
            {report.errorDetails.length > 0 && (
              <div className="rounded-xl bg-white shadow-sm">
                <div className="border-b border-slate-100 px-6 py-4">
                  <h2 className="font-bold text-red-600">Détail des erreurs</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-[#f8f4ef] text-xs font-semibold uppercase text-slate-500">
                      <tr>
                        <th className="px-4 py-3 text-left">Ligne</th>
                        <th className="px-4 py-3 text-left">Champ</th>
                        <th className="px-4 py-3 text-left">Message</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {report.errorDetails.map((e, i) => (
                        <tr key={i} className="hover:bg-red-50/40">
                          <td className="px-4 py-3 font-mono text-red-500">{e.line}</td>
                          <td className="px-4 py-3 font-medium text-slate-700">{e.field}</td>
                          <td className="px-4 py-3 text-slate-600">{e.message}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tableau membres importés */}
            {report.members.length > 0 && (
              <div className="rounded-xl bg-white shadow-sm">
                <div className="border-b border-slate-100 px-6 py-4">
                  <h2 className="font-bold text-[#3f2f85]">Membres importés avec succès</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-[#f8f4ef] text-xs font-semibold uppercase text-slate-500">
                      <tr>
                        <th className="px-4 py-3 text-left">Nom</th>
                        <th className="px-4 py-3 text-left">Code</th>
                        <th className="px-4 py-3 text-left">Parrain</th>
                        <th className="px-4 py-3 text-left">Grade</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {report.members.map((m, i) => (
                        <tr key={i} className="hover:bg-[#f8f4ef]/60">
                          <td className="px-4 py-3 font-medium text-slate-800">{m.name}</td>
                          <td className="px-4 py-3 font-mono text-[#3f2f85]">{m.code}</td>
                          <td className="px-4 py-3 text-slate-600">{m.sponsor || "—"}</td>
                          <td className="px-4 py-3">
                            <span className="rounded-full bg-[#3f2f85]/10 px-2.5 py-0.5 text-xs font-semibold text-[#3f2f85]">
                              {m.grade || "Aucun"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
    </div>
  )
}
