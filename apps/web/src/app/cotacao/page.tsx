'use client';

import { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';
import { useQuoteStore } from '@/stores/quote.store';
import { generateQuotes } from '@/services/quote.service';

interface WizardData {
  // Step 1: Property
  cep: string;
  propertyType: 'HOUSE' | 'APARTMENT' | '';
  propertyValue: string;
  // Step 2: Personal
  name: string;
  cpf: string;
  email: string;
  phone: string;
}

const steps = [
  { number: 1, label: 'Dados do Imovel' },
  { number: 2, label: 'Dados Pessoais' },
  { number: 3, label: 'Resultado' },
];

export default function CotacaoPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center">
          <p className="text-gray-500">Carregando...</p>
        </div>
      }
    >
      <CotacaoWizard />
    </Suspense>
  );
}

function CotacaoWizard() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const setQuotes = useQuoteStore((s) => s.setQuotes);

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [data, setData] = useState<WizardData>({
    cep: searchParams.get('cep') || '',
    propertyType: '',
    propertyValue: '',
    name: user?.name || '',
    cpf: '',
    email: user?.email || '',
    phone: '',
  });

  const updateField = (field: keyof WizardData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const formatCep = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 8);
    if (digits.length > 5) return `${digits.slice(0, 5)}-${digits.slice(5)}`;
    return digits;
  };

  const formatCpf = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length > 9) {
      return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
    }
    if (digits.length > 6) {
      return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
    }
    if (digits.length > 3) {
      return `${digits.slice(0, 3)}.${digits.slice(3)}`;
    }
    return digits;
  };

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length > 6) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
    }
    if (digits.length > 2) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    }
    return digits;
  };

  const formatCurrency = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (!digits) return '';
    const num = parseInt(digits, 10);
    return num.toLocaleString('pt-BR');
  };

  const validateStep1 = (): boolean => {
    const newErrors: Record<string, string> = {};
    const cleanCep = data.cep.replace(/\D/g, '');

    if (cleanCep.length !== 8) {
      newErrors.cep = 'CEP deve ter 8 digitos';
    }
    if (!data.propertyType) {
      newErrors.propertyType = 'Selecione o tipo de imovel';
    }
    const value = parseInt(data.propertyValue.replace(/\D/g, ''), 10);
    if (!value || value < 50000) {
      newErrors.propertyValue = 'Valor minimo: R$ 50.000';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!data.name.trim() || data.name.trim().length < 3) {
      newErrors.name = 'Nome deve ter pelo menos 3 caracteres';
    }
    const cleanCpf = data.cpf.replace(/\D/g, '');
    if (cleanCpf.length !== 11) {
      newErrors.cpf = 'CPF deve ter 11 digitos';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newErrors.email = 'Email invalido';
    }
    const cleanPhone = data.phone.replace(/\D/g, '');
    if (cleanPhone.length < 10 || cleanPhone.length > 11) {
      newErrors.phone = 'Telefone invalido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setCurrentStep(3);

    try {
      const quotes = await generateQuotes({
        cep: data.cep.replace(/\D/g, ''),
        propertyType: data.propertyType as 'HOUSE' | 'APARTMENT',
        propertyValue: parseInt(data.propertyValue.replace(/\D/g, ''), 10),
        riskLevel: 'MEDIUM', // Will be determined by risk API
        riskTypes: ['flood'],
        userId: user?.id,
      });

      setQuotes(quotes);
      router.push(`/cotacao/comparar?quotes=${quotes.map((q) => q.id).join(',')}`);
    } catch {
      setErrors({ submit: 'Erro ao gerar cotacoes. Tente novamente.' });
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      {/* Step Indicator */}
      <div className="mb-10">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${
                    currentStep > step.number
                      ? 'bg-green-500 text-white'
                      : currentStep === step.number
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {currentStep > step.number ? (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    step.number
                  )}
                </div>
                <span className="mt-1 text-xs text-gray-500 hidden sm:block">
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`mx-2 h-1 w-16 sm:w-24 rounded ${
                    currentStep > step.number ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Property Data */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Dados do Imovel</h2>
          <p className="text-gray-600">
            Informe os dados do seu imovel para gerar cotacoes personalizadas.
          </p>

          {/* CEP */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              CEP
            </label>
            <input
              type="text"
              value={data.cep}
              onChange={(e) => updateField('cep', formatCep(e.target.value))}
              placeholder="00000-000"
              maxLength={9}
              className={`w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-600/20 ${
                errors.cep ? 'border-red-500' : 'border-gray-300 focus:border-primary-600'
              }`}
            />
            {errors.cep && <p className="mt-1 text-sm text-red-500">{errors.cep}</p>}
          </div>

          {/* Property Type */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Tipo de Imovel
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'HOUSE', label: 'Casa' },
                { value: 'APARTMENT', label: 'Apartamento' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateField('propertyType', option.value)}
                  className={`rounded-lg border-2 px-4 py-3 text-center font-medium transition ${
                    data.propertyType === option.value
                      ? 'border-primary-600 bg-primary-50 text-primary-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            {errors.propertyType && (
              <p className="mt-1 text-sm text-red-500">{errors.propertyType}</p>
            )}
          </div>

          {/* Property Value */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Valor Estimado do Imovel
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                R$
              </span>
              <input
                type="text"
                value={data.propertyValue}
                onChange={(e) =>
                  updateField('propertyValue', formatCurrency(e.target.value))
                }
                placeholder="300.000"
                className={`w-full rounded-lg border py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary-600/20 ${
                  errors.propertyValue
                    ? 'border-red-500'
                    : 'border-gray-300 focus:border-primary-600'
                }`}
              />
            </div>
            {errors.propertyValue && (
              <p className="mt-1 text-sm text-red-500">{errors.propertyValue}</p>
            )}
          </div>
        </div>
      )}

      {/* Step 2: Personal Data */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Dados Pessoais</h2>
          <p className="text-gray-600">
            Precisamos de alguns dados para personalizar sua cotacao.
          </p>

          {/* Name */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Nome Completo
            </label>
            <input
              type="text"
              value={data.name}
              onChange={(e) => updateField('name', e.target.value)}
              placeholder="Seu nome completo"
              className={`w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-600/20 ${
                errors.name ? 'border-red-500' : 'border-gray-300 focus:border-primary-600'
              }`}
            />
            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
          </div>

          {/* CPF */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              CPF
            </label>
            <input
              type="text"
              value={data.cpf}
              onChange={(e) => updateField('cpf', formatCpf(e.target.value))}
              placeholder="000.000.000-00"
              maxLength={14}
              className={`w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-600/20 ${
                errors.cpf ? 'border-red-500' : 'border-gray-300 focus:border-primary-600'
              }`}
            />
            {errors.cpf && <p className="mt-1 text-sm text-red-500">{errors.cpf}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={data.email}
              onChange={(e) => updateField('email', e.target.value)}
              placeholder="seu@email.com"
              className={`w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-600/20 ${
                errors.email ? 'border-red-500' : 'border-gray-300 focus:border-primary-600'
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Telefone
            </label>
            <input
              type="text"
              value={data.phone}
              onChange={(e) => updateField('phone', formatPhone(e.target.value))}
              placeholder="(00) 00000-0000"
              maxLength={15}
              className={`w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-600/20 ${
                errors.phone ? 'border-red-500' : 'border-gray-300 focus:border-primary-600'
              }`}
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
            )}
          </div>
        </div>
      )}

      {/* Step 3: Loading/Generating */}
      {currentStep === 3 && loading && (
        <div className="py-16 text-center">
          <div className="mx-auto mb-6 h-16 w-16 animate-spin rounded-full border-4 border-gray-200 border-t-primary-600" />
          <h2 className="mb-2 text-2xl font-bold text-gray-900">
            Gerando suas cotacoes...
          </h2>
          <p className="text-gray-600">
            Estamos consultando seguradoras parceiras para encontrar os melhores planos
            para voce.
          </p>
        </div>
      )}

      {/* Error on submit */}
      {errors.submit && (
        <div className="mt-6 rounded-lg bg-red-50 p-4 text-center text-red-700">
          {errors.submit}
          <button
            onClick={handleSubmit}
            className="ml-2 text-red-800 underline hover:no-underline"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {/* Navigation Buttons */}
      {currentStep < 3 && (
        <div className="mt-8 flex justify-between">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className={`rounded-lg border border-gray-300 px-6 py-3 font-medium transition ${
              currentStep === 1
                ? 'cursor-not-allowed text-gray-300'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Voltar
          </button>
          <button
            onClick={handleNext}
            className="rounded-lg bg-primary-600 px-8 py-3 font-semibold text-white transition hover:bg-primary-700"
          >
            {currentStep === 2 ? 'Gerar Cotacoes' : 'Proximo'}
          </button>
        </div>
      )}
    </div>
  );
}
