-- CreateEnum
CREATE TYPE "PropertyType" AS ENUM ('HOUSE', 'APARTMENT');

-- CreateTable
CREATE TABLE "quotes" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "cep" TEXT NOT NULL,
    "risk_level" "RiskLevel" NOT NULL,
    "provider_name" TEXT NOT NULL,
    "plan_name" TEXT NOT NULL,
    "monthly_premium" DECIMAL(10,2) NOT NULL,
    "coverage_amount" DECIMAL(12,2) NOT NULL,
    "coverage_details" JSONB NOT NULL,
    "property_type" "PropertyType" NOT NULL,
    "property_value" DECIMAL(12,2) NOT NULL,
    "valid_until" TIMESTAMP(3) NOT NULL,
    "referral_code" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "quotes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "quotes_user_id_idx" ON "quotes"("user_id");

-- CreateIndex
CREATE INDEX "quotes_referral_code_idx" ON "quotes"("referral_code");

-- AddForeignKey
ALTER TABLE "quotes" ADD CONSTRAINT "quotes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
