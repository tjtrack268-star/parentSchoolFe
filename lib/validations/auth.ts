import { z } from "zod"

const countryEnum = z.enum(["CM", "CD", "SN", "CG", "FR", "CA", "BE", "CH"] as const)

export const signUpSchema = z.object({
  email: z.string().email("Email invalide").min(1, "Email requis"),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(/[A-Z]/, "Le mot de passe doit contenir une majuscule")
    .regex(/[0-9]/, "Le mot de passe doit contenir un chiffre")
    .regex(/[!@#$%^&*]/, "Le mot de passe doit contenir un caractère spécial"),
  firstName: z.string().min(2, "Prénom requis"),
  lastName: z.string().min(2, "Nom requis"),
  phone: z.string().min(10, "Numéro de téléphone invalide"),
  country: countryEnum,
  referralCode: z
    .string()
    .max(12, "Code de parrainage invalide")
    .regex(/^[A-Z0-9]*$/, "Code de parrainage invalide")
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
