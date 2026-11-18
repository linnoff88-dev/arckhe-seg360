import api from './api';

export interface BrokerDashboard {
  leadsThisMonth: number;
  totalQuotes: number;
  totalSales: number;
  commissionThisMonth: number;
}

export interface Lead {
  id: string;
  consumerName: string;
  consumerEmail: string;
  consumerPhone: string | null;
  cep: string;
  riskLevel: string;
  status: 'NEW' | 'CONTACTED' | 'CONVERTED' | 'LOST';
  source: string | null;
  notes: string | null;
  createdAt: string;
}

export interface Referral {
  id: string;
  code: string;
  clicks: number;
  quotesGenerated: number;
  salesCompleted: number;
  createdAt: string;
}

export interface CommissionSummary {
  pendingAmount: number;
  pendingCount: number;
  paidAmount: number;
  paidCount: number;
}

export async function getBrokerDashboard(): Promise<BrokerDashboard> {
  const { data } = await api.get<BrokerDashboard>('/brokers/dashboard');
  return data;
}

export async function getLeads(filters?: {
  status?: string;
  cep?: string;
}): Promise<Lead[]> {
  const params = new URLSearchParams();
  if (filters?.status) params.append('status', filters.status);
  if (filters?.cep) params.append('cep', filters.cep);
  const { data } = await api.get<Lead[]>(
    `/brokers/leads?${params.toString()}`,
  );
  return data;
}

export async function updateLeadStatus(
  leadId: string,
  status: string,
  notes?: string,
): Promise<Lead> {
  const { data } = await api.patch<Lead>(`/brokers/leads/${leadId}`, {
    status,
    notes,
  });
  return data;
}

export async function createReferralLink(): Promise<Referral> {
  const { data } = await api.post<Referral>('/brokers/referral-link');
  return data;
}

export async function getReferralStats(): Promise<Referral[]> {
  const { data } = await api.get<Referral[]>('/brokers/referrals');
  return data;
}

export async function getCommissionSummary(): Promise<CommissionSummary> {
  const { data } = await api.get<CommissionSummary>(
    '/brokers/commissions/summary',
  );
  return data;
}
