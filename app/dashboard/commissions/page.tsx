"use client"

import { useEffect, useState } from "react"
import { apiClient } from "@/lib/api-client"

interface Transaction {
  id: string
  amount: number
  createdAt: string
  type: string
  description: string
}

export default function CommissionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiClient.get<Transaction[]>('/commissions/history')
      .then(data => {
        const list = data || []
        setTransactions(list)
        setTotal(list.reduce((s, t) => s + (t.amount || 0), 0))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-10 h-10 rounded-full border-4 border-[#a3ade8] border-t-[#3f2f85] animate-spin" />
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#3f2f85]">Mes commissions</h1>
        <p className="text-slate-500 mt-1 text-sm">Suivi de vos gains et commissions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Gains totaux", value: `${total.toLocaleString("fr-FR")} FCFA`, color: "text-[#e8b41f]" },
          { label: "Ce mois", value: "0 FCFA", color: "text-[#3f2f85]" },
          { label: "Transactions", value: transactions.length, color: "text-[#3f2f85]" },
        ].map((c, i) => (
          <div key={i} className="bg-white rounded-xl border border-[#a3ade8]/30 p-5 shadow-sm">
            <p className="text-slate-500 text-xs mb-2">{c.label}</p>
            <p className={`text-3xl font-bold ${c.color}`}>{c.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-[#a3ade8]/30 p-5 shadow-sm">
        <h2 className="font-bold text-[#3f2f85] mb-4">Historique des transactions</h2>
        {transactions.length === 0 ? (
          <div className="py-12 text-center">
            <div className="text-4xl mb-3">💰</div>
            <p className="font-semibold text-[#3f2f85]">Aucune commission disponible</p>
            <p className="text-sm text-slate-500 mt-1">Vos commissions apparaîtront ici une fois que vous aurez des parrainages actifs.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#a3ade8]/30">
                  {["Date", "Type", "Description", "Montant"].map(h => (
                    <th key={h} className={`pb-3 font-semibold text-[#3f2f85] ${h === "Montant" ? "text-right" : "text-left"}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {transactions.map(t => (
                  <tr key={t.id} className="border-b border-[#a3ade8]/20 hover:bg-[#f8f4ef]">
                    <td className="py-3 text-slate-600">{new Date(t.createdAt).toLocaleDateString("fr-FR")}</td>
                    <td className="py-3 text-slate-600">{t.type}</td>
                    <td className="py-3 text-slate-600">{t.description}</td>
                    <td className="py-3 font-semibold text-[#e8b41f] text-right">{t.amount.toLocaleString("fr-FR")} FCFA</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
