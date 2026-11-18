import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div>
            <h3 className="mb-3 text-sm font-semibold text-gray-900">
              Seg360
            </h3>
            <p className="text-sm text-gray-500">
              Marketplace de seguros contra calamidades naturais. Protecao
              acessivel para todos.
            </p>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold text-gray-900">Links</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>
                <Link href="/simulador" className="hover:text-primary-600">
                  Simulador de Risco
                </Link>
              </li>
              <li>
                <Link href="/corretor" className="hover:text-primary-600">
                  Para Corretores
                </Link>
              </li>
              <li>
                <Link href="/cadastro" className="hover:text-primary-600">
                  Criar Conta
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold text-gray-900">
              Contato
            </h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>contato@seg360.com.br</li>
              <li>
                <Link href="#faq" className="hover:text-primary-600">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-6 text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} Seg360. Todos os direitos
          reservados.
        </div>
      </div>
    </footer>
  );
}
