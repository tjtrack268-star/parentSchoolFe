"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
  city: string
  userType: string
  userStatus: string
  totalPoints: number
  directSponsorshipsCount: number
  sponsorshipCode: string
  currentGrade?: {
    name: string
    level: number
  }
  country?: {
    name: string
  }
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<Partial<User>>({})

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const token = authClient.getToken()
        if (!token) {
          router.push("/auth/login")
          return
        }

        // Get current user from token or make API call
        const response = await fetch('/api/fetch-user', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch user')
        }

        const userData = await response.json()
        setUser(userData)
        setFormData(userData)
      } catch (error) {
        console.error("Error loading profile:", error)
        router.push("/auth/login")
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    if (!user) return

    setSaving(true)
    try {
      const token = authClient.getToken()
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          city: formData.city,
        }),
      })

      if (!response.ok) throw new Error('Failed to update profile')

      const updatedUser = await response.json()
      setUser(updatedUser)
      setEditing(false)
    } catch (error) {
      console.error("Error saving profile:", error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">Loading profile...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="p-6">
        <div className="text-red-600">Profile not found</div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-2xl">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Mon Profil</h1>
          {!editing && (
            <Button onClick={() => setEditing(true)}>
              Modifier
            </Button>
          )}
        </div>

        {editing ? (
          <div className="space-y-4">
            <div>
              <Label htmlFor="firstName">Prénom</Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName || ""}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <Label htmlFor="lastName">Nom</Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName || ""}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone || ""}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <Label htmlFor="city">Ville</Label>
              <Input
                id="city"
                name="city"
                value={formData.city || ""}
                onChange={handleChange}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={saving}>
                {saving ? "Enregistrement..." : "Enregistrer"}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setEditing(false)
                  setFormData(user)
                }}
              >
                Annuler
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-500">Prénom</Label>
                <p className="text-lg">{user.firstName}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Nom</Label>
                <p className="text-lg">{user.lastName}</p>
              </div>
            </div>
            
            <div>
              <Label className="text-sm font-medium text-gray-500">Email</Label>
              <p className="text-lg">{user.email}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-500">Téléphone</Label>
                <p className="text-lg">{user.phone || "Non renseigné"}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Ville</Label>
                <p className="text-lg">{user.city || "Non renseigné"}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-500">Grade</Label>
                <p className="text-lg">{user.currentGrade?.name || "Aucun"}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Type</Label>
                <p className="text-lg">{user.userType}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-500">Points</Label>
                <p className="text-lg font-semibold text-blue-600">{user.totalPoints}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Parrainages</Label>
                <p className="text-lg font-semibold text-green-600">{user.directSponsorshipsCount}</p>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-500">Code de parrainage</Label>
              <p className="text-lg font-mono bg-gray-100 p-2 rounded">{user.sponsorshipCode}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}