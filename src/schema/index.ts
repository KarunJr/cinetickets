import * as z from "zod"

export const SignupSchema = z.object({
    name: z.string(),
    email: z.string().email("Email is required"),
    password: z.string().min(6, "Minimum 6 characters required!"),
})

export const LoginSchema = z.object({
    email: z.string().email("Email is required"),
    password: z.string()
})