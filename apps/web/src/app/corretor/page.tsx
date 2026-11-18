'use client';

import { useEffect, useState } from 'react';
import {
  getBrokerDashboard,
  getLeads,
  updateLeadStatus,
  createReferralLink,
  getCommissionSummary,
  BrokerDashboard,
  Lead,
  Referral,
  CommissionSummary,
} from '@/services/broker.service';

const leadStatusConfig: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  NEW: { label: 'Novo', color: 'text-blue-700', bg: 'bg-blue-100' },
  CONTACTED: { label: 'Contatado', color: 'text-yellow-700', bg: 'bg-yellow-100' },
  CONVERTED: { label: 'Convertido', color: 'text-green-700', bg: 'bg-green-100' },
  LOST: { label: 'Perdido', color: 'text-red-700', bg: 'bg-red-100' },
};

export default function CorretorDashboard() {
  const [metrics, setMetrics] = useState<BrokerDashboard | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [referral, setReferral] = useState<Referral | null>(null);
  const [commissions, setCommissions] = useState<CommissionSummary | null>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [m, l, c] = await Promise.all([
          getBrokerDashboard(),
          getLeads(),
          getCommissionSummary(),
        ]);
        setMetrics(m);
        setLeads(l);
        setCommissions(c);
      } catch {
        // Handle error silently - user might not have broker profile yet
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleGenerateReferral = async () => {
    const ref = await createReferralLink();
    setReferral(ref);
  };

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    await updateLeadStatus(leadId, newStatus);
    const updated = await getLeads(statusFilter ? { status: statusFilter } : undefined);
    setLeads(updated);
  };

  const handleFilter = async (status: string) => {
    setStatusFilter(status);
    const filtered = await getLeads(status ? { status } : undefined);
    setLeads(filtered);
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-1/3 rounded bg-gray-200" />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 rounded-lg bg-gray-200" />
            ))}
          </div>
          <div className="h-64 rounded-lg bg-gray-200" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">
        Dashboard do Corretor
      </h1>

      {/* Metrics */}
      {metrics && (
        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-lg border border-gray-200 p-4">
            <p className="text-2xl font-bold text-gray-900">{metrics.leadsThisMonth}</p>
            <p className="text-sm text-gray-500">Leads este mes</p>
          </div>
          <div className="rounded-lg border border-gray-200 p-4">
            <p className="text-2xl font-bold text-gray-900">{metrics.totalQuotes}</p>
            <p className="text-sm text-gray-500">Cotacoes geradas</p>
          </div>
          <div className="rounded-lg border border-gray-200 p-4">
            <p className="text-2xl font-bold text-gray-900">{metrics.totalSales}</p>
            <p className="text-sm text-gray-500">Vendas concluidas</p>
          </div>
          <div className="rounded-lg border border-gray-200 p-4">
            <p className="text-2xl font-bold text-primary-600">
              R$ {metrics.commissionThisMonth.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-sm text-gray-500">Comissao do mes</p>
          </div>
        </div>
      )}

      {/* Referral Link Section */}
      <div className="mb-8 rounded-lg border border-gray-200 p-6">
        <h2 className="mb-3 text-lg font-semibold text-gray-900">
          Link de Referencia
        </h2>
        {referral ? (
          <div className="flex items-center gap-3">
            <input
              type="text"
              readOnly
              value={`${typeof window !== 'undefined' ? window.location.origin : ''}/simulador?ref=${referral.code}`}
              className="flex-1 rounded border bg-gray-50 px-3 py-2 text-sm"
            />
            <button
              onClick={() =>
                navigator.clipboard.writeText(
                  `${window.location.origin}/simulador?ref=${referral.code}`,
                )
              }
              className="rounded bg-primary-600 px-4 py-2 text-sm text-white hover:bg-primary-700"
            >
              Copiar
            </button>
          </div>
        ) : (
          <button
            onClick={handleGenerateReferral}
            className="rounded-lg bg-primary-600 px-6 py-2 text-white hover:bg-primary-700"
          >
            Gerar meu link
          </button>
        )}
        {referral && (
          <div className="mt-3 flex gap-6 text-sm text-gray-500">
            <span>Cliques: {referral.clicks}</span>
            <span>Cotacoes: {referral.quotesGenerated}</span>
            <span>Vendas: {referral.salesCompleted}</span>
          </div>
        )}
      </div>

      {/* Commission Summary */}
      {commissions && (
        <div className="mb-8 grid grid-cols-2 gap-4">
          <div className="rounded-lg border border-green-200 bg-green-50 p-4">
            <p className="text-xl font-bold text-green-700">
              R$ {commissions.paidAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-sm text-green-600">
              Comissoes pagas ({commissions.paidCount})
            </p>
          </div>
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
            <p className="text-xl font-bold text-yellow-700">
              R$ {commissions.pendingAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-sm text-yellow-600">
              Comissoes pendentes ({commissions.pendingCount})
            </p>
          </div>
        </div>
      )}

      {/* Leads Table */}
      <div className="rounded-lg border border-gray-200">
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-lg font-semibold text-gray-900">Meus Leads</h2>
          <select
            value={statusFilter}
            onChange={(e) => handleFilter(e.target.value)}
            className="rounded border border-gray-300 px-3 py-1 text-sm"
          >
            <option value="">Todos</option>
            <option value="NEW">Novos</option>
            <option value="CONTACTED">Contatados</option>
            <option value="CONVERTED">Convertidos</option>
            <option value="LOST">Perdidos</option>
          </select>
        </div>

        {leads.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Nenhum lead encontrado. Compartilhe seu link de referencia para
            receber leads!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-4 py-3">Nome</th>
                  <th className="px-4 py-3">CEP</th>
                  <th className="px-4 py-3">Risco</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Data</th>
                  <th className="px-4 py-3">Acao</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => {
                  const config = leadStatusConfig[lead.status];
                  return (
                    <tr key={lead.id} className="border-t">
                      <td className="px-4 py-3">
                        <p className="font-medium">{lead.consumerName}</p>
                        <p className="text-xs text-gray-400">{lead.consumerEmail}</p>
                      </td>
                      <td className="px-4 py-3">{lead.cep}</td>
                      <td className="px-4 py-3">{lead.riskLevel}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium ${config.bg} ${config.color}`}
                        >
                          {config.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {new Date(lead.createdAt).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={lead.status}
                          onChange={(e) =>
                            handleStatusChange(lead.id, e.target.value)
                          }
                          className="rounded border px-2 py-1 text-xs"
                        >
                          <option value="NEW">Novo</option>
                          <option value="CONTACTED">Contatado</option>
                          <option value="CONVERTED">Convertido</option>
                          <option value="LOST">Perdido</option>
                        </select>
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
