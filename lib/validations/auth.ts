import { z } from "zod"

const countryEnum = z.enum(["CM", "CD", "SN", "CG", "FR", "CA", "BE", "CH", "CI"] as const)

export const registerSchema = z.object({
  sponsorCode: z.string().max(32).optional().or(z.literal("")),
  firstName: z.string().min(2, "Prénom requis (min. 2 caractères)"),
  lastName: z.string().min(2, "Nom requis (min. 2 caractères)"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(8, "Numéro de téléphone invalide"),
  country: z.enum(["CM", "CI", "SN", "FR", "CD", "CG", "CA", "BE", "CH"], { required_error: "Pays requis" }),
  profession: z.string().max(100).optional().or(z.literal("")),
  memberType: z.enum(["ORDINARY", "HONORARY", "BENEFACTOR"], { required_error: "Type de membre requis" }),
})

export type RegisterInput = z.infer<typeof registerSchema>

export const signUpSchema = z.object({
  email: z.string().email("Email invalide").min(1, "Email requis"),
  password: z
    .string()
    .min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  firstName: z.string().min(2, "Prénom requis"),
  lastName: z.string().min(2, "Nom requis"),
  phone: z.string().min(10, "Numéro de téléphone invalide"),
  country: countryEnum,
  referralCode: z
    .string()
    .max(32, "Code de parrainage invalide")
    .optional(),
  sponsorName: z
    .string()
    .max(150, "Nom du parrain invalide")
    .optional(),
})

export const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
})

export const updateProfileSchema = z.object({
  firstName: z.string().min(2, "Prénom requis").optional(),
  lastName: z.string().min(2, "Nom requis").optional(),
  phone: z.string().min(10, "Numéro invalide").optional(),
  bio: z.string().max(500, "Bio limitée à 500 caractères").optional(),
})

export type SignUpInput = z.infer<typeof signUpSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
