'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '@/stores/auth.store';
import api from '@/services/api';
import { useRouter } from 'next/navigation';

interface ProfileData {
  id: string;
  email: string;
  name: string;
  role: string;
  phone: string | null;
  cpf: string | null;
}

export default function PerfilPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<{ name: string; phone: string }>();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    api
      .get<ProfileData>('/users/me')
      .then(({ data }) => {
        setProfile(data);
        reset({ name: data.name, phone: data.phone || '' });
      })
      .catch(() => setError('Erro ao carregar perfil'));
  }, [isAuthenticated, router, reset]);

  const onSubmit = async (data: { name: string; phone: string }) => {
    try {
      setError('');
      setSuccess('');
      const { data: updated } = await api.patch<ProfileData>('/users/me', data);
      setProfile(updated);
      setSuccess('Perfil atualizado com sucesso');
    } catch {
      setError('Erro ao atualizar perfil');
    }
  };

  if (!profile) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-gray-500">Carregando...</p>
      </div>
    );
  }

  const roleLabels: Record<string, string> = {
    CONSUMER: 'Consumidor',
    BROKER: 'Corretor',
    ADMIN: 'Administrador',
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Meu Perfil</h1>

      <div className="mb-6 rounded-md bg-gray-50 p-4 text-sm text-gray-600">
        <p>
          <strong>Email:</strong> {profile.email}
        </p>
        <p>
          <strong>Tipo:</strong> {roleLabels[profile.role] || profile.role}
        </p>
      </div>

      {success && (
        <div className="mb-4 rounded-md bg-green-50 p-3 text-sm text-green-700">
          {success}
        </div>
      )}
      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Nome
          </label>
          <input
            id="name"
            type="text"
            {...register('name')}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-600 focus:outline-none focus:ring-1 focus:ring-primary-600"
          />
        </div>

        <div>
          <label
            htmlFor="phone"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Telefone
          </label>
          <input
            id="phone"
            type="text"
            {...register('phone')}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-600 focus:outline-none focus:ring-1 focus:ring-primary-600"
            placeholder="(11) 99999-9999"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Salvando...' : 'Salvar'}
        </button>
      </form>
    </div>
  );
}
