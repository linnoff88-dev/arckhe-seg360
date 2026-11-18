import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Email invalido'),
  password: z
    .string()
    .min(8, 'Senha deve ter no minimo 8 caracteres')
    .regex(/[A-Z]/, 'Senha deve conter pelo menos 1 letra maiuscula')
    .regex(/[0-9]/, 'Senha deve conter pelo menos 1 numero'),
  name: z.string().min(2, 'Nome deve ter no minimo 2 caracteres'),
  role: z.enum(['CONSUMER', 'BROKER']),
});

export const loginSchema = z.object({
  email: z.string().email('Email invalido'),
  password: z.string().min(1, 'Senha e obrigatoria'),
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token e obrigatorio'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshInput = z.infer<typeof refreshSchema>;
