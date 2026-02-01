"use client"

import { useEffect, useState } from "react"
import { apiClient } from "@/lib/api-client"

interface Voucher {
  id: string
  code: string
  amount: number
  isUsed: boolean
  createdAt: string
}

export default function VouchersPage() {
  const [vouchers, setVouchers] = useState<Voucher[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadVouchers = async () => {
      try {
        const data = await apiClient.get<Voucher[]>('/vouchers/my-vouchers')
        setVouchers(data || [])
      } catch (error) {
        console.error("Error loading vouchers:", error)
      } finally {
        setLoading(false)
      }
    }

    loadVouchers()
  }, [])

  const activeVouchers = vouchers.filter((v) => !v.isUsed)
  const usedVouchers = vouchers.filter((v) => v.isUsed)

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Bons de formation</h1>
          <p className="text-slate-600 mt-1">Vos bons de formation d'une valeur de 3 000 FCFA</p>
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
        <h1 className="text-3xl font-bold text-slate-900">Bons de formation</h1>
        <p className="text-slate-600 mt-1">Vos bons de formation d'une valeur de 3 000 FCFA</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-green-50 rounded-lg border border-green-200 p-6">
          <p className="text-green-800 text-sm mb-1">Bons actifs</p>
          <p className="text-4xl font-bold text-green-600">{activeVouchers.length}</p>
          <p className="text-green-700 text-sm mt-2">
            Valeur totale: {(activeVouchers.length * 3000).toLocaleString("fr-FR")} FCFA
          </p>
        </div>
        <div className="bg-slate-50 rounded-lg border border-slate-200 p-6">
          <p className="text-slate-800 text-sm mb-1">Bons utilisés</p>
          <p className="text-4xl font-bold text-slate-600">{usedVouchers.length}</p>
          <p className="text-slate-700 text-sm mt-2">
            Valeur totale: {(usedVouchers.length * 3000).toLocaleString("fr-FR")} FCFA
          </p>
        </div>
      </div>

      {vouchers.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-gray-500">
            <div className="text-4xl mb-4">🎫</div>
            <h3 className="text-lg font-semibold mb-2">Aucun bon disponible</h3>
            <p className="text-sm">Les bons de formation seront disponibles prochainement.</p>
          </div>
        </div>
      ) : (
        <>
          {/* Active Vouchers */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Bons actifs</h2>
            {activeVouchers.length === 0 ? (
              <p className="text-slate-500">Aucun bon actif</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left text-sm font-semibold text-slate-700 pb-2">Code</th>
                      <th className="text-left text-sm font-semibold text-slate-700 pb-2">Créé le</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeVouchers.map((voucher) => (
                      <tr key={voucher.id} className="border-b">
                        <td className="text-sm text-slate-600 py-2">{voucher.code}</td>
                        <td className="text-sm text-slate-600 py-2">
                          {new Date(voucher.createdAt).toLocaleDateString("fr-FR")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Used Vouchers */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Bons utilisés</h2>
            {usedVouchers.length === 0 ? (
              <p className="text-slate-500">Aucun bon utilisé</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left text-sm font-semibold text-slate-700 pb-2">Code</th>
                      <th className="text-left text-sm font-semibold text-slate-700 pb-2">Utilisé le</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usedVouchers.map((voucher) => (
                      <tr key={voucher.id} className="border-b">
                        <td className="text-sm text-slate-600 py-2">{voucher.code}</td>
                        <td className="text-sm text-slate-600 py-2">
                          {new Date(voucher.createdAt).toLocaleDateString("fr-FR")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}