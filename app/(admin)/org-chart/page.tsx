"use client"

import { useEffect, useState, useCallback, useRef, useMemo } from "react"
import dynamic from "next/dynamic"
import type { RawNodeDatum, CustomNodeElementProps } from "react-d3-tree"
import { RotateCcw, Loader2, Users, Search, ChevronLeft, ChevronRight, X, Download, FileImage } from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { COUNTRIES } from "@/lib/constants"

const Tree = dynamic(() => import("react-d3-tree").then(m => m.Tree), { ssr: false })

// ── Couleurs grade ────────────────────────────────────────────────────────────
const GRADE_COLORS: Record<string, { bg: string; text: string }> = {
  "Aucun":         { bg: "#94a3b8", text: "#fff"     },
  "Leader":        { bg: "#22c55e", text: "#fff"     },
  "Leader Senior": { bg: "#3b82f6", text: "#fff"     },
  "Coordinateur":  { bg: "#f97316", text: "#fff"     },
  "Mentor":        { bg: "#a855f7", text: "#fff"     },
  "Directeur":     { bg: "#e8b41f", text: "#3f2f85"  },
}
const LEGEND_GRADES = ["Aucun","Leader","Leader Senior","Coordinateur","Mentor","Directeur"]
const GRADE_OPTIONS  = ["Tous", ...LEGEND_GRADES.filter(g => g !== "Aucun")]

// ── Types ─────────────────────────────────────────────────────────────────────
interface ApiNode {
  id:                      number
  firstName:               string
  lastName:                string
  sponsorshipCode:         string
  gradeName:               string
  country?:                string
  totalPoints:             number
  directSponsorshipsCount: number
  children:                ApiNode[]
}

// Enrichit le RawNodeDatum avec un id stable pour la recherche
interface EnrichedDatum extends RawNodeDatum {
  __id: string
  children?: EnrichedDatum[]
}

function toD3Node(node: ApiNode): EnrichedDatum {
  return {
    __id: String(node.id),
    name: `${node.firstName} ${node.lastName.charAt(0)}.`,
    attributes: {
      code:      node.sponsorshipCode,
      grade:     node.gradeName  || "Aucun",
      country:   node.country    || "",
      points:    String(node.totalPoints),
      initials:  `${node.firstName.charAt(0)}${node.lastName.charAt(0)}`.toUpperCase(),
      fullName:  `${node.firstName} ${node.lastName}`,
    },
    children: node.children.map(toD3Node),
  }
}

function countNodes(node: RawNodeDatum): number {
  return 1 + (node.children?.reduce((s, c) => s + countNodes(c), 0) ?? 0)
}

// Parcours DFS → liste à plat des nœuds
function flattenTree(node: EnrichedDatum, acc: EnrichedDatum[] = []): EnrichedDatum[] {
  acc.push(node)
  node.children?.forEach(c => flattenTree(c as EnrichedDatum, acc))
  return acc
}

// ── Contexte filtre passé aux nœuds via fermeture ────────────────────────────
// react-d3-tree ne permet pas de passer des props supplémentaires à renderCustomNodeElement
// On utilise un module-level ref pour partager l'état des filtres
let _highlightIds: Set<string> = new Set()
let _filterGrade  = "Tous"
let _filterCountry = ""
let _matchIds: string[] = []
let _currentMatchIdx = 0

function CustomNode({ nodeDatum, toggleNode, hierarchyPointNode }: CustomNodeElementProps) {
  const id      = (nodeDatum as EnrichedDatum).__id ?? ""
  const grade   = String(nodeDatum.attributes?.grade   ?? "Aucun")
  const country = String(nodeDatum.attributes?.country ?? "")
  const colors  = GRADE_COLORS[grade] ?? GRADE_COLORS["Aucun"]
  const initials= String(nodeDatum.attributes?.initials ?? "??")
  const code    = String(nodeDatum.attributes?.code    ?? "")
  const childCount  = nodeDatum.children?.length ?? 0
  const hasChildren = childCount > 0
  const isRoot  = hierarchyPointNode.depth === 0

  // Surbrillance recherche (bordure dorée)
  const isHighlighted = _highlightIds.has(id)
  const isCurrentMatch = _matchIds[_currentMatchIdx] === id

  // Grisage filtre
  const gradeMatch   = _filterGrade   === "Tous" || grade   === _filterGrade
  const countryMatch = !_filterCountry || country === _filterCountry
  const dimmed = !gradeMatch || !countryMatch

  const W = 190, H = 92
  const cardFill    = isRoot ? "#3f2f85" : "white"
  const borderColor = isCurrentMatch ? "#e8b41f" : isHighlighted ? "#f59e0b" : isRoot ? "#e8b41f" : colors.bg
  const borderWidth = isHighlighted || isCurrentMatch ? 3 : 2
  const opacity     = dimmed ? 0.25 : 1
  const nameColor   = isRoot ? "#ffffff" : "#3f2f85"
  const codeColor   = isRoot ? "#a3ade8" : "#64748b"
  const avatarFill  = isRoot ? "#e8b41f" : colors.bg
  const avatarText  = isRoot ? "#3f2f85" : colors.text

  return (
    <g onClick={toggleNode} style={{ cursor: hasChildren ? "pointer" : "default", opacity }}>
      <rect x={-W/2} y={-H/2} width={W} height={H} rx={12} ry={12}
        fill={cardFill} stroke={borderColor} strokeWidth={borderWidth}
        filter="drop-shadow(0 2px 4px rgba(0,0,0,0.12))" />

      {/* Halo doré pour le match courant */}
      {isCurrentMatch && (
        <rect x={-W/2-4} y={-H/2-4} width={W+8} height={H+8} rx={15} ry={15}
          fill="none" stroke="#e8b41f" strokeWidth={2} strokeDasharray="4 2" opacity={0.7} />
      )}

      <circle cx={-W/2+30} cy={0} r={20} fill={avatarFill} />
      <text x={-W/2+30} y={5} textAnchor="middle" fill={avatarText} fontSize={13} fontWeight="bold">
        {initials}
      </text>

      <text x={-W/2+58} y={-16} fill={nameColor} fontSize={13} fontWeight="bold">
        {nodeDatum.name.length > 17 ? nodeDatum.name.slice(0,16)+"…" : nodeDatum.name}
      </text>
      <text x={-W/2+58} y={2} fill={codeColor} fontSize={10} fontFamily="monospace">{code}</text>

      <rect x={-W/2+56} y={12} width={96} height={20} rx={10}
        fill={isRoot ? "rgba(255,255,255,0.15)" : colors.bg} />
      <text x={-W/2+104} y={26} textAnchor="middle"
        fill={isRoot ? "#e8b41f" : colors.text} fontSize={10} fontWeight="600">
        {grade.length > 14 ? grade.slice(0,13)+"…" : grade}
      </text>

      {/* Badge nombre de filleuls directs */}
      {hasChildren && (
        <>
          <circle cx={W/2-2} cy={-H/2+2} r={11} fill={isRoot ? "#e8b41f" : colors.bg}
            stroke="white" strokeWidth={2} />
          <text x={W/2-2} y={-H/2+6} textAnchor="middle"
            fill={isRoot ? "#3f2f85" : colors.text} fontSize={10} fontWeight="bold">
            {childCount}
          </text>
        </>
      )}
    </g>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function OrgChartPage() {
  const [treeData,   setTreeData]   = useState<EnrichedDatum | null>(null)
  const [flatNodes,  setFlatNodes]  = useState<EnrichedDatum[]>([])
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState<string | null>(null)
  const [total,      setTotal]      = useState(0)
  const [translate,  setTranslate]  = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const chartRef     = useRef<HTMLDivElement>(null)

  // Export
  const [exporting, setExporting] = useState<"png" | "pdf" | null>(null)
  const [search,       setSearch]       = useState("")
  const [matchIds,     setMatchIds]     = useState<string[]>([])
  const [matchIdx,     setMatchIdx]     = useState(0)
  const [highlightIds, setHighlightIds] = useState<Set<string>>(new Set())

  // Filtres
  const [filterGrade,   setFilterGrade]   = useState("Tous")
  const [filterCountry, setFilterCountry] = useState("")

  // Sync module-level refs → déclenche re-render de react-d3-tree via key
  const [renderKey, setRenderKey] = useState(0)

  // ── Export PNG ────────────────────────────────────────────────────────────
  const exportPNG = async () => {
    if (!chartRef.current) return
    setExporting("png")
    try {
      const html2canvas = (await import("html2canvas")).default
      const canvas = await html2canvas(chartRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
        logging: false,
      })
      const date     = new Date().toISOString().slice(0, 10)
      const filename = `organigramme_parentschool_${date}.png`
      const link     = document.createElement("a")
      link.href      = canvas.toDataURL("image/png")
      link.download  = filename
      link.click()
    } catch (e) {
      console.error("Export PNG failed", e)
    } finally {
      setExporting(null)
    }
  }

  // ── Export PDF ────────────────────────────────────────────────────────────
  const exportPDF = async () => {
    if (!chartRef.current) return
    setExporting("pdf")
    try {
      const html2canvas = (await import("html2canvas")).default
      const { jsPDF }   = await import("jspdf")

      const canvas  = await html2canvas(chartRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
        logging: false,
      })

      const imgData  = canvas.toDataURL("image/png")
      const pdf      = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" })

      const pageW    = pdf.internal.pageSize.getWidth()
      const pageH    = pdf.internal.pageSize.getHeight()
      const margin   = 10
      const maxW     = pageW - margin * 2
      const maxH     = pageH - margin * 2 - 10  // 10mm réservé pour le pied de page

      // Calculer les dimensions en conservant le ratio
      const ratio    = canvas.width / canvas.height
      let imgW = maxW
      let imgH = maxW / ratio
      if (imgH > maxH) { imgH = maxH; imgW = maxH * ratio }

      // Centrer horizontalement
      const offsetX  = (pageW - imgW) / 2
      const offsetY  = margin

      pdf.addImage(imgData, "PNG", offsetX, offsetY, imgW, imgH)

      // Pied de page
      const date     = new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })
      pdf.setFontSize(8)
      pdf.setTextColor(150)
      pdf.text(`ParentSchool — ${date}`, pageW / 2, pageH - 4, { align: "center" })

      const filename = `organigramme_parentschool_${new Date().toISOString().slice(0, 10)}.pdf`
      pdf.save(filename)
    } catch (e) {
      console.error("Export PDF failed", e)
    } finally {
      setExporting(null)
    }
  }

  const centerTree = useCallback(() => {
    if (containerRef.current) {
      const { width } = containerRef.current.getBoundingClientRect()
      setTranslate({ x: width / 2, y: 80 })
    }
  }, [])

  useEffect(() => {
    apiClient.get<ApiNode | ApiNode[]>("/organigramme")
      .then(data => {
        const root = Array.isArray(data) ? data[0] : data
        if (!root) { setError("Aucune donnée"); return }
        const d3 = toD3Node(root)
        setTreeData(d3)
        setFlatNodes(flattenTree(d3))
        setTotal(countNodes(d3))
      })
      .catch(e => setError(e instanceof Error ? e.message : "Erreur"))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { if (treeData) centerTree() }, [treeData, centerTree])

  // Recherche : trouver tous les nœuds correspondants
  useEffect(() => {
    const q = search.trim().toLowerCase()
    if (!q) {
      setMatchIds([]); setMatchIdx(0); setHighlightIds(new Set())
      _matchIds = []; _currentMatchIdx = 0; _highlightIds = new Set()
      setRenderKey(k => k+1); return
    }
    const found = flatNodes.filter(n => {
      const full = String(n.attributes?.fullName ?? "").toLowerCase()
      const code = String(n.attributes?.code     ?? "").toLowerCase()
      return full.includes(q) || code.includes(q)
    }).map(n => n.__id)

    setMatchIds(found); setMatchIdx(0)
    setHighlightIds(new Set(found))
    _matchIds = found; _currentMatchIdx = 0; _highlightIds = new Set(found)
    setRenderKey(k => k+1)
  }, [search, flatNodes])

  // Sync filtres → module refs
  useEffect(() => {
    _filterGrade   = filterGrade
    _filterCountry = filterCountry
    setRenderKey(k => k+1)
  }, [filterGrade, filterCountry])

  const navigate = (dir: 1 | -1) => {
    const next = Math.max(0, Math.min(matchIds.length - 1, matchIdx + dir))
    setMatchIdx(next)
    _currentMatchIdx = next
    setRenderKey(k => k+1)
  }

  const resetFilters = () => {
    setFilterGrade("Tous"); setFilterCountry("")
    setSearch("")
  }

  const hasFilters = filterGrade !== "Tous" || filterCountry || search

  const selectCls = "rounded-lg border border-[#a3ade8]/40 bg-white px-3 py-2 text-sm focus:border-[#3f2f85] focus:outline-none"

  if (loading) return (
    <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
      <Loader2 className="h-10 w-10 animate-spin text-[#3f2f85]" />
    </div>
  )
  if (error) return (
    <div className="flex h-[calc(100vh-4rem)] items-center justify-center px-4">
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center max-w-sm">
        <p className="font-semibold text-red-600">Erreur</p>
        <p className="mt-1 text-sm text-red-500">{error}</p>
      </div>
    </div>
  )
  if (!treeData) return null

  return (
    <div className="relative flex h-[calc(100vh-4rem)] flex-col">

      {/* ── Barre d'outils ── */}
      <div className="border-b border-[#a3ade8]/30 bg-white px-4 py-3 shadow-sm space-y-2">

        {/* Ligne 1 : titre + compteur + recentrer */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-lg font-bold text-[#3f2f85]">Organigramme interactif</h1>
            <p className="text-xs text-slate-400 flex items-center gap-1">
              <Users className="h-3 w-3" /> {total} membre{total > 1 ? "s" : ""} affiché{total > 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {/* Export PNG */}
            <button onClick={exportPNG} disabled={!!exporting}
              className="flex items-center gap-1.5 rounded-lg border border-[#a3ade8]/60 bg-white px-3 py-2 text-xs font-semibold text-[#3f2f85] hover:border-[#3f2f85] transition disabled:opacity-50">
              {exporting === "png"
                ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                : <FileImage className="h-3.5 w-3.5" />}
              PNG
            </button>

            {/* Export PDF */}
            <button onClick={exportPDF} disabled={!!exporting}
              className="flex items-center gap-1.5 rounded-lg border border-[#a3ade8]/60 bg-white px-3 py-2 text-xs font-semibold text-[#3f2f85] hover:border-[#3f2f85] transition disabled:opacity-50">
              {exporting === "pdf"
                ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                : <Download className="h-3.5 w-3.5" />}
              PDF
            </button>

            <button onClick={centerTree}
              className="flex items-center gap-2 rounded-lg border-2 border-[#3f2f85] px-4 py-2 text-sm font-semibold text-[#3f2f85] transition hover:bg-[#3f2f85] hover:text-white">
              <RotateCcw className="h-4 w-4" /> Recentrer
            </button>
          </div>
        </div>

        {/* Ligne 2 : recherche + filtres */}
        <div className="flex flex-wrap items-center gap-2">

          {/* Recherche */}
          <div className="relative min-w-56 flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher un membre (nom ou code)"
              className="w-full rounded-lg border border-[#a3ade8]/40 bg-white py-2 pl-9 pr-9 text-sm focus:border-[#3f2f85] focus:outline-none" />
            {search && (
              <button onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Navigation résultats */}
          {matchIds.length > 0 && (
            <div className="flex items-center gap-1.5 rounded-lg bg-[#e8b41f]/10 border border-[#e8b41f]/40 px-3 py-1.5">
              <button onClick={() => navigate(-1)} disabled={matchIdx === 0}
                className="text-[#3f2f85] disabled:opacity-30">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-xs font-semibold text-[#3f2f85]">
                {matchIdx + 1}/{matchIds.length}
              </span>
              <button onClick={() => navigate(1)} disabled={matchIdx >= matchIds.length - 1}
                className="text-[#3f2f85] disabled:opacity-30">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
          {search && matchIds.length === 0 && (
            <span className="text-xs text-red-500">Aucun résultat</span>
          )}

          {/* Filtre grade */}
          <select value={filterGrade} onChange={e => setFilterGrade(e.target.value)} className={selectCls}>
            {GRADE_OPTIONS.map(g => <option key={g} value={g}>{g === "Tous" ? "Tous les grades" : g}</option>)}
          </select>

          {/* Filtre pays */}
          <select value={filterCountry} onChange={e => setFilterCountry(e.target.value)} className={selectCls}>
            <option value="">Tous les pays</option>
            {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
          </select>

          {/* Reset */}
          {hasFilters && (
            <button onClick={resetFilters}
              className="flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-100 transition">
              <X className="h-3.5 w-3.5" /> Réinitialiser
            </button>
          )}
        </div>

        {/* Ligne 3 : légende des grades (cliquable = filtre) */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">Grades</span>
          {LEGEND_GRADES.map(g => (
            <button key={g} onClick={() => setFilterGrade(filterGrade === g ? "Tous" : g)}
              className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs transition ${
                filterGrade === g
                  ? "border-[#3f2f85] bg-[#3f2f85]/5 font-semibold text-[#3f2f85]"
                  : "border-[#a3ade8]/40 bg-white text-slate-600 hover:border-[#3f2f85]/40"
              }`}>
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: (GRADE_COLORS[g] ?? GRADE_COLORS["Aucun"]).bg }} />
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* ── Canvas ── */}
      <div ref={containerRef} className="relative flex-1 bg-[#f8f4ef]">
        <div ref={chartRef} className="h-full w-full">
        <Tree
          key={renderKey}
          data={treeData}
          orientation="vertical"
          translate={translate}
          nodeSize={{ x: 210, y: 150 }}
          separation={{ siblings: 1.02, nonSiblings: 1.2 }}
          renderCustomNodeElement={CustomNode}
          pathFunc="diagonal"
          pathClassFunc={() => "stroke-[#a3ade8] stroke-[1.5px] fill-none"}
          initialDepth={2}
          zoom={0.8}
          scaleExtent={{ min: 0.2, max: 2 }}
          enableLegacyTransitions
          transitionDuration={300}
          collapsible
        />

        <div className="absolute bottom-4 right-4 rounded-lg bg-white/80 border border-[#a3ade8]/20 px-3 py-2 text-xs text-slate-400 backdrop-blur-sm">
          🖱 Molette pour zoomer · Drag pour déplacer · Clic nœud pour déplier
        </div>
        </div>
      </div>
    </div>
  )
}
