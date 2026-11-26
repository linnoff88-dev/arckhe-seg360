import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Admin user
  const admARCKHÉil = 'admin@seg360.com.br';
  const existing = await prisma.user.findUnique({
    where: { email: admARCKHÉil },
  });

  if (!existing) {
    const passwordHash = await bcrypt.hash('Admin123!', 10);
    await prisma.user.create({
      data: {
        email: admARCKHÉil,
        passwordHash,
        name: 'Administrador Seg360',
        role: 'ADMIN',
      },
    });
    console.log('Admin user created: admin@seg360.com.br / Admin123!');
  }

  // Risk data seed
  const riskDataSeed = [
    // RS — Porto Alegre (enchentes 2024)
    { cep: '90010000', city: 'Porto Alegre', state: 'RS', neighborhood: 'Centro Historico', riskLevel: 'VERY_HIGH' as const, riskTypes: ['flood', 'landslide'], avgDamage: 120000, incidentCount12m: 23, isApproximate: false },
    { cep: '90000000', city: 'Porto Alegre', state: 'RS', neighborhood: null, riskLevel: 'HIGH' as const, riskTypes: ['flood'], avgDamage: 85000, incidentCount12m: 15, isApproximate: true },
    { cep: '93000000', city: 'Sao Leopoldo', state: 'RS', neighborhood: null, riskLevel: 'HIGH' as const, riskTypes: ['flood'], avgDamage: 78000, incidentCount12m: 11, isApproximate: true },
    { cep: '95010000', city: 'Caxias do Sul', state: 'RS', neighborhood: 'Centro', riskLevel: 'MEDIUM' as const, riskTypes: ['hail', 'windstorm'], avgDamage: 35000, incidentCount12m: 6, isApproximate: false },

    // RJ — Petropolis / Rio
    { cep: '25610000', city: 'Petropolis', state: 'RJ', neighborhood: 'Centro', riskLevel: 'VERY_HIGH' as const, riskTypes: ['landslide', 'flood'], avgDamage: 150000, incidentCount12m: 18, isApproximate: false },
    { cep: '25600000', city: 'Petropolis', state: 'RJ', neighborhood: null, riskLevel: 'HIGH' as const, riskTypes: ['landslide', 'flood'], avgDamage: 110000, incidentCount12m: 14, isApproximate: true },
    { cep: '20040000', city: 'Rio de Janeiro', state: 'RJ', neighborhood: 'Centro', riskLevel: 'MEDIUM' as const, riskTypes: ['flood'], avgDamage: 45000, incidentCount12m: 7, isApproximate: false },
    { cep: '20000000', city: 'Rio de Janeiro', state: 'RJ', neighborhood: null, riskLevel: 'MEDIUM' as const, riskTypes: ['flood', 'landslide'], avgDamage: 55000, incidentCount12m: 9, isApproximate: true },

    // SP — Litoral
    { cep: '11010000', city: 'Santos', state: 'SP', neighborhood: 'Centro', riskLevel: 'HIGH' as const, riskTypes: ['flood', 'windstorm'], avgDamage: 70000, incidentCount12m: 10, isApproximate: false },
    { cep: '11700000', city: 'Sao Sebastiao', state: 'SP', neighborhood: null, riskLevel: 'VERY_HIGH' as const, riskTypes: ['landslide', 'flood'], avgDamage: 130000, incidentCount12m: 16, isApproximate: true },
    { cep: '01310100', city: 'Sao Paulo', state: 'SP', neighborhood: 'Bela Vista', riskLevel: 'MEDIUM' as const, riskTypes: ['flood'], avgDamage: 40000, incidentCount12m: 5, isApproximate: false },
    { cep: '01000000', city: 'Sao Paulo', state: 'SP', neighborhood: null, riskLevel: 'MEDIUM' as const, riskTypes: ['flood'], avgDamage: 38000, incidentCount12m: 8, isApproximate: true },

    // SC — Blumenau
    { cep: '89010000', city: 'Blumenau', state: 'SC', neighborhood: 'Centro', riskLevel: 'HIGH' as const, riskTypes: ['flood'], avgDamage: 90000, incidentCount12m: 13, isApproximate: false },
    { cep: '89000000', city: 'Blumenau', state: 'SC', neighborhood: null, riskLevel: 'HIGH' as const, riskTypes: ['flood'], avgDamage: 80000, incidentCount12m: 11, isApproximate: true },

    // BA — Salvador
    { cep: '40000000', city: 'Salvador', state: 'BA', neighborhood: null, riskLevel: 'MEDIUM' as const, riskTypes: ['flood', 'landslide'], avgDamage: 50000, incidentCount12m: 7, isApproximate: true },
    { cep: '40020000', city: 'Salvador', state: 'BA', neighborhood: 'Comercio', riskLevel: 'HIGH' as const, riskTypes: ['flood', 'landslide'], avgDamage: 65000, incidentCount12m: 9, isApproximate: false },
  ];

  for (const data of riskDataSeed) {
    await prisma.riskData.upsert({
      where: { cep: data.cep },
      update: data,
      create: {
        ...data,
        avgDamage: data.avgDamage,
        lastUpdated: new Date(),
      },
    });
  }

  console.log(`Risk data seeded: ${riskDataSeed.length} entries`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
