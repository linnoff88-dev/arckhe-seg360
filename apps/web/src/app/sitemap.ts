import { MetadataRoute } from 'next';

const regionalPages = [
  'rs/porto-alegre',
  'rj/petropolis',
  'sp/santos',
  'sp/sao-sebastiao',
  'sc/blumenau',
  'ba/salvador',
  'sp/sao-paulo',
  'rj/rio-de-janeiro',
  'rs/sao-leopoldo',
  'rs/caxias-do-sul',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://seg360.com.br';

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/simulador`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/login`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/cadastro`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/corretor`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  ];

  const regionPages: MetadataRoute.Sitemap = regionalPages.map((path) => ({
    url: `${baseUrl}/risco/${path}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [...staticPages, ...regionPages];
}
