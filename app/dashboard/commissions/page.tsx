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
  const [totalEarnings, setTotalEarnings] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadCommissions = async () => {
      try {
        const data = await apiClient.get<Transaction[]>('/commissions/history')
        
        const transactions = data || []
        setTransactions(transactions)
        setTotalEarnings(transactions.reduce((sum, t) => sum + (t.amount || 0), 0))
      } catch (error) {
        console.error("Error loading commissions:", error)
      } finally {
        setLoading(false)
      }
    }

    loadCommissions()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Mes commissions</h1>
          <p className="text-slate-600 mt-1">Suivi de vos gains et commissions</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-8 text-center">
          <div className="inline-block w-8 h-8 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin"></div>
          <p className="text-slate-600 mt-4">Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Mes commissions</h1>
        <p className="text-slate-600 mt-1">Suivi de vos gains et commissions</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <p className="text-slate-600 text-sm mb-2">Gains totaux</p>
          <p className="text-4xl font-bold text-green-600">{totalEarnings.toLocaleString("fr-FR")} FCFA</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <p className="text-slate-600 text-sm mb-2">Ce mois</p>
          <p className="text-4xl font-bold text-blue-600">0 FCFA</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <p className="text-slate-600 text-sm mb-2">Transactions</p>
          <p className="text-4xl font-bold text-slate-600">{transactions.length}</p>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Liste des transactions</h2>
        {transactions.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-500">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-lg font-semibold mb-2">Aucune commission disponible</h3>
              <p className="text-sm">Vos commissions apparaîtront ici une fois que vous aurez des parrainages actifs.</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left text-sm font-semibold text-slate-700 pb-2">Date</th>
                  <th className="text-left text-sm font-semibold text-slate-700 pb-2">Type</th>
                  <th className="text-left text-sm font-semibold text-slate-700 pb-2">Description</th>
                  <th className="text-right text-sm font-semibold text-slate-700 pb-2">Montant</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b">
                    <td className="text-sm text-slate-600 py-3">
                      {new Date(transaction.createdAt).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="text-sm text-slate-600 py-3">{transaction.type}</td>
                    <td className="text-sm text-slate-600 py-3">{transaction.description}</td>
                    <td className="text-sm font-semibold text-green-600 py-3 text-right">
                      {transaction.amount.toLocaleString("fr-FR")} FCFA
                    </td>
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