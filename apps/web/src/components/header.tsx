'use client';

import Link from 'next/link';
import { useAuthStore } from '@/stores/auth.store';
import { useEffect } from 'react';

export function Header() {
  const { isAuthenticated, user, logout, hydrate } = useAuthStore();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <header className="border-b border-gray-200 bg-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-xl font-bold text-primary-600">
          Seg360
        </Link>
        <div className="flex items-center gap-6">
          <Link
            href="/simulador"
            className="text-sm text-gray-600 hover:text-primary-600"
          >
            Simulador de Risco
          </Link>

          {!isAuthenticated && (
            <>
              <Link
                href="/corretor"
                className="text-sm text-gray-600 hover:text-primary-600"
              >
                Para Corretores
              </Link>
              <Link
                href="/login"
                className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
              >
                Entrar
              </Link>
            </>
          )}

          {isAuthenticated && user?.role === 'CONSUMER' && (
            <Link
              href="/painel"
              className="text-sm text-gray-600 hover:text-primary-600"
            >
              Meu Painel
            </Link>
          )}

          {isAuthenticated && user?.role === 'BROKER' && (
            <Link
              href="/corretor/dashboard"
              className="text-sm text-gray-600 hover:text-primary-600"
            >
              Painel do Corretor
            </Link>
          )}

          {isAuthenticated && user?.role === 'ADMIN' && (
            <Link
              href="/admin"
              className="text-sm text-gray-600 hover:text-primary-600"
            >
              Admin
            </Link>
          )}

          {isAuthenticated && (
            <>
              <Link
                href="/perfil"
                className="text-sm text-gray-600 hover:text-primary-600"
              >
                Perfil
              </Link>
              <button
                onClick={() => {
                  logout();
                  window.location.href = '/';
                }}
                className="text-sm text-gray-600 hover:text-red-600"
              >
                Sair
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
