'use client';

import { useEffect, useState } from 'react';
import api from '@/services/api';

interface PlatformMetrics {
  activePolicies: number;
  totalQuotes: number;
  activeBrokers: number;
  monthlyGMV: number;
  monthlySales: number;
  conversionRate: string;
}

interface BrokerProfile {
  id: string;
  susepRegistration: string;
  companyName: string | null;
  status: string;
  verifiedAt: string | null;
  createdAt: string;
  user: { name: string; email: string };
}

const brokerStatusConfig: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  PENDING: { label: 'Pendente', color: 'text-yellow-700', bg: 'bg-yellow-100' },
  ACTIVE: { label: 'Ativo', color: 'text-green-700', bg: 'bg-green-100' },
  SUSPENDED: { label: 'Suspenso', color: 'text-red-700', bg: 'bg-red-100' },
};

export default function AdminPage() {
  const [metrics, setMetrics] = useState<PlatformMetrics | null>(null);
  const [brokers, setBrokers] = useState<BrokerProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [m, b] = await Promise.all([
          api.get<PlatformMetrics>('/admin/metrics'),
          api.get<BrokerProfile[]>('/admin/brokers'),
        ]);
        setMetrics(m.data);
        setBrokers(b.data);
      } catch {
        // User might not be admin
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleVerify = async (brokerId: string) => {
    await api.patch(`/admin/brokers/${brokerId}/verify`);
    const { data } = await api.get<BrokerProfile[]>('/admin/brokers');
    setBrokers(data);
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-1/3 rounded bg-gray-200" />
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-24 rounded-lg bg-gray-200" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">
        Painel Administrativo
      </h1>

      {/* Platform Metrics */}
      {metrics && (
        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          <div className="rounded-lg border border-gray-200 p-4">
            <p className="text-2xl font-bold text-gray-900">{metrics.activePolicies}</p>
            <p className="text-xs text-gray-500">Apolices ativas</p>
          </div>
          <div className="rounded-lg border border-gray-200 p-4">
            <p className="text-2xl font-bold text-primary-600">
              R$ {metrics.monthlyGMV.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-gray-500">GMV do mes</p>
          </div>
          <div className="rounded-lg border border-gray-200 p-4">
            <p className="text-2xl font-bold text-gray-900">{metrics.activeBrokers}</p>
            <p className="text-xs text-gray-500">Corretores ativos</p>
          </div>
          <div className="rounded-lg border border-gray-200 p-4">
            <p className="text-2xl font-bold text-gray-900">{metrics.totalQuotes}</p>
            <p className="text-xs text-gray-500">Total cotacoes</p>
          </div>
          <div className="rounded-lg border border-gray-200 p-4">
            <p className="text-2xl font-bold text-gray-900">{metrics.monthlySales}</p>
            <p className="text-xs text-gray-500">Vendas no mes</p>
          </div>
          <div className="rounded-lg border border-gray-200 p-4">
            <p className="text-2xl font-bold text-secondary-600">{metrics.conversionRate}%</p>
            <p className="text-xs text-gray-500">Taxa conversao</p>
          </div>
        </div>
      )}

      {/* Brokers List */}
      <div className="rounded-lg border border-gray-200">
        <div className="border-b p-4">
          <h2 className="text-lg font-semibold text-gray-900">Corretores</h2>
        </div>
        {brokers.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Nenhum corretor cadastrado ainda.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-4 py-3">Nome</th>
                  <th className="px-4 py-3">SUSEP</th>
                  <th className="px-4 py-3">Empresa</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Cadastro</th>
                  <th className="px-4 py-3">Acao</th>
                </tr>
              </thead>
              <tbody>
                {brokers.map((broker) => {
                  const config = brokerStatusConfig[broker.status] || brokerStatusConfig.PENDING;
                  return (
                    <tr key={broker.id} className="border-t">
                      <td className="px-4 py-3">
                        <p className="font-medium">{broker.user.name}</p>
                        <p className="text-xs text-gray-400">{broker.user.email}</p>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs">
                        {broker.susepRegistration}
                      </td>
                      <td className="px-4 py-3">{broker.companyName || '-'}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium ${config.bg} ${config.color}`}
                        >
                          {config.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {new Date(broker.createdAt).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-4 py-3">
                        {broker.status === 'PENDING' && (
                          <button
                            onClick={() => handleVerify(broker.id)}
                            className="rounded bg-green-600 px-3 py-1 text-xs text-white hover:bg-green-700"
                          >
                            Verificar
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
