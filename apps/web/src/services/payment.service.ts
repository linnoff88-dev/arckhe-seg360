import api from './api';

export interface PaymentResult {
  id: string;
  method: 'PIX' | 'CARD';
  amount: number;
  status: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  pixCode: string | null;
  pixQrCode: string | null;
  gatewayId: string | null;
  paidAt: string | null;
  createdAt: string;
}

export interface PolicyResult {
  id: string;
  policyNumber: string;
  status: 'ACTIVE' | 'CANCELLED' | 'EXPIRED' | 'SUSPENDED';
  startDate: string;
  endDate: string;
  coverageDetails: unknown;
  monthlyPremium: number;
  createdAt: string;
  planName?: string;
  providerName?: string;
  coverageAmount?: number;
}

export async function createPayment(
  quoteId: string,
  method: 'PIX' | 'CARD',
): Promise<PaymentResult> {
  const { data } = await api.post<PaymentResult>('/payments', {
    quoteId,
    method,
  });
  return data;
}

export async function getPayment(id: string): Promise<PaymentResult & { quote: unknown }> {
  const { data } = await api.get(`/payments/${id}`);
  return data;
}

export async function confirmPayment(
  id: string,
): Promise<{ id: string; status: string; paidAt: string }> {
  const { data } = await api.post(`/payments/${id}/confirm`);
  return data;
}

export async function createPolicyFromPayment(
  paymentId: string,
): Promise<PolicyResult> {
  const { data } = await api.post<PolicyResult>(
    `/policies/from-payment/${paymentId}`,
  );
  return data;
}

export async function getUserPolicies(): Promise<PolicyResult[]> {
  const { data } = await api.get<PolicyResult[]>('/policies');
  return data;
}

export async function getPolicyById(id: string): Promise<PolicyResult> {
  const { data } = await api.get<PolicyResult>(`/policies/${id}`);
  return data;
}

export async function cancelPolicy(
  id: string,
): Promise<PolicyResult> {
  const { data } = await api.post<PolicyResult>(`/policies/${id}/cancel`);
  return data;
}
