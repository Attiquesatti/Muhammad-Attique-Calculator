/**
 * Tax Slabs Configuration for Pakistan Income Tax FY 2026-27
 * Source: Finance Act 2026 (FBR), effective 1 July 2026
 */

export const FISCAL_YEAR = 'FY 2026-27';

export const SALARIED_CONFIG = {
  fiscalYear: FISCAL_YEAR,
  sourceCite: 'Finance Act 2026 (FBR), effective 1 July 2026',
  surchargeAbolishedNote: 'The 9% surcharge on salaried income above Rs 10 million is abolished; do not apply it.',
  slabs: [
    {
      slabNumber: 1,
      minIncome: 0,
      maxIncome: 600000,
      baseTax: 0,
      ratePercent: 0,
      label: 'Up to Rs 600,000',
      ruleDescription: '0%',
    },
    {
      slabNumber: 2,
      minIncome: 600000,
      maxIncome: 1200000,
      baseTax: 0,
      ratePercent: 1,
      label: 'Rs 600,001 to Rs 1,200,000',
      ruleDescription: '1% of amount exceeding Rs 600,000',
    },
    {
      slabNumber: 3,
      minIncome: 1200000,
      maxIncome: 2200000,
      baseTax: 6000,
      ratePercent: 11,
      label: 'Rs 1,200,001 to Rs 2,200,000',
      ruleDescription: 'Rs 6,000 + 11% of amount exceeding Rs 1,200,000',
    },
    {
      slabNumber: 4,
      minIncome: 2200000,
      maxIncome: 3200000,
      baseTax: 116000,
      ratePercent: 20,
      label: 'Rs 2,200,001 to Rs 3,200,000',
      ruleDescription: 'Rs 116,000 + 20% of amount exceeding Rs 2,200,000',
    },
    {
      slabNumber: 5,
      minIncome: 3200000,
      maxIncome: 4100000,
      baseTax: 316000,
      ratePercent: 25,
      label: 'Rs 3,200,001 to Rs 4,100,000',
      ruleDescription: 'Rs 316,000 + 25% of amount exceeding Rs 3,200,000',
    },
    {
      slabNumber: 6,
      minIncome: 4100000,
      maxIncome: 5600000,
      baseTax: 541000,
      ratePercent: 29,
      label: 'Rs 4,100,001 to Rs 5,600,000',
      ruleDescription: 'Rs 541,000 + 29% of amount exceeding Rs 4,100,000',
    },
    {
      slabNumber: 7,
      minIncome: 5600000,
      maxIncome: 7000000,
      baseTax: 976000,
      ratePercent: 32,
      label: 'Rs 5,600,001 to Rs 7,000,000',
      ruleDescription: 'Rs 976,000 + 32% of amount exceeding Rs 5,600,000',
    },
    {
      slabNumber: 8,
      minIncome: 7000000,
      maxIncome: null,
      baseTax: 1424000,
      ratePercent: 35,
      label: 'Above Rs 7,000,000',
      ruleDescription: 'Rs 1,424,000 + 35% of amount exceeding Rs 7,000,000',
    },
  ],
};

export const BUSINESS_CONFIG = {
  fiscalYear: FISCAL_YEAR,
  sourceCite: 'Finance Act 2026 / First Schedule, Income Tax Ordinance 2001',
  surchargeThreshold: 10000000, // Rs 10,000,000
  surchargeRatePercent: 10, // 10% of tax if taxable income > 10,000,000
  slabs: [
    {
      slabNumber: 1,
      minIncome: 0,
      maxIncome: 600000,
      baseTax: 0,
      ratePercent: 0,
      label: 'Up to Rs 600,000',
      ruleDescription: '0%',
    },
    {
      slabNumber: 2,
      minIncome: 600000,
      maxIncome: 1200000,
      baseTax: 0,
      ratePercent: 15,
      label: 'Rs 600,001 to Rs 1,200,000',
      ruleDescription: '15% of amount exceeding Rs 600,000',
    },
    {
      slabNumber: 3,
      minIncome: 1200000,
      maxIncome: 1600000,
      baseTax: 90000,
      ratePercent: 20,
      label: 'Rs 1,200,001 to Rs 1,600,000',
      ruleDescription: 'Rs 90,000 + 20% of amount exceeding Rs 1,200,000',
    },
    {
      slabNumber: 4,
      minIncome: 1600000,
      maxIncome: 3200000,
      baseTax: 170000,
      ratePercent: 30,
      label: 'Rs 1,600,001 to Rs 3,200,000',
      ruleDescription: 'Rs 170,000 + 30% of amount exceeding Rs 1,600,000',
    },
    {
      slabNumber: 5,
      minIncome: 3200000,
      maxIncome: 5600000,
      baseTax: 650000,
      ratePercent: 40,
      label: 'Rs 3,200,001 to Rs 5,600,000',
      ruleDescription: 'Rs 650,000 + 40% of amount exceeding Rs 3,200,000',
    },
    {
      slabNumber: 6,
      minIncome: 5600000,
      maxIncome: null,
      baseTax: 1610000,
      ratePercent: 45,
      label: 'Above Rs 5,600,000',
      ruleDescription: 'Rs 1,610,000 + 45% of amount exceeding Rs 5,600,000',
    },
  ],
};

export const MAX_ALLOWED_AMOUNT = 1000000000; // Rs 1,000,000,000

