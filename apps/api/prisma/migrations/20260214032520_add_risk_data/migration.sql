-- CreateEnum
CREATE TYPE "RiskLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'VERY_HIGH');

-- CreateTable
CREATE TABLE "risk_data" (
    "id" TEXT NOT NULL,
    "cep" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "neighborhood" TEXT,
    "risk_level" "RiskLevel" NOT NULL,
    "risk_types" TEXT[],
    "avg_damage" DECIMAL(12,2) NOT NULL,
    "incident_count_12m" INTEGER NOT NULL,
    "last_updated" TIMESTAMP(3) NOT NULL,
    "is_approximate" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "risk_data_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "risk_data_cep_key" ON "risk_data"("cep");

-- CreateIndex
CREATE INDEX "risk_data_city_state_idx" ON "risk_data"("city", "state");

-- CreateIndex
CREATE INDEX "risk_data_risk_level_idx" ON "risk_data"("risk_level");
