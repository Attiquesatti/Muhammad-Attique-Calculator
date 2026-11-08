import { describe, it, expect } from 'vitest';
import {
  validateTaxInput,
  calculateSalariedTax,
  calculateBusinessTax,
  calculateSlabBreakdown,
  formatWithCommas,
} from '../src/utils/taxCalculator.js';
import { SALARIED_CONFIG, BUSINESS_CONFIG } from '../src/config/taxSlabs.js';

describe('Story S-3: Input Validation and Error Handling', () => {
  it('rejects empty input with "Enter an amount"', () => {
    expect(validateTaxInput('')).toEqual({ isValid: false, error: 'Enter an amount' });
    expect(validateTaxInput('   ')).toEqual({ isValid: false, error: 'Enter an amount' });
    expect(validateTaxInput(null)).toEqual({ isValid: false, error: 'Enter an amount' });
    expect(validateTaxInput(undefined)).toEqual({ isValid: false, error: 'Enter an amount' });
  });

  it('rejects letters and non-numeric characters with "Enter numbers only"', () => {
    expect(validateTaxInput('abc')).toEqual({ isValid: false, error: 'Enter numbers only' });
    expect(validateTaxInput('100k')).toEqual({ isValid: false, error: 'Enter numbers only' });
    expect(validateTaxInput('salary')).toEqual({ isValid: false, error: 'Enter numbers only' });
    expect(validateTaxInput('12.34.56')).toEqual({ isValid: false, error: 'Enter numbers only' });
  });

  it('rejects negative numbers with "Amount cannot be negative"', () => {
    expect(validateTaxInput('-1')).toEqual({ isValid: false, error: 'Amount cannot be negative' });
    expect(validateTaxInput('-50000')).toEqual({ isValid: false, error: 'Amount cannot be negative' });
    expect(validateTaxInput('-100000')).toEqual({ isValid: false, error: 'Amount cannot be negative' });
  });

  it('rejects zero with "Amount must be greater than zero"', () => {
    expect(validateTaxInput('0')).toEqual({ isValid: false, error: 'Amount must be greater than zero' });
    expect(validateTaxInput(0)).toEqual({ isValid: false, error: 'Amount must be greater than zero' });
    expect(validateTaxInput('-0')).toEqual({ isValid: false, error: 'Amount must be greater than zero' });
  });

  it('rejects amounts greater than Rs 1,000,000,000 with "Amount is too large"', () => {
    expect(validateTaxInput('1000000001')).toEqual({ isValid: false, error: 'Amount is too large' });
    expect(validateTaxInput('5000000000')).toEqual({ isValid: false, error: 'Amount is too large' });
  });

  it('accepts valid amounts including comma-formatted numbers', () => {
    expect(validateTaxInput('100000')).toEqual({ isValid: true, value: 100000 });
    expect(validateTaxInput('100,000')).toEqual({ isValid: true, value: 100000 });
    expect(validateTaxInput('1,000,000,000')).toEqual({ isValid: true, value: 1000000000 });
    expect(validateTaxInput(200000)).toEqual({ isValid: true, value: 200000 });
  });
});

describe('Story S-1: Salaried Employee Calculations', () => {
  it('calculates monthly Rs 50,000 (annual Rs 600,000): tax is Rs 0, take-home is Rs 50,000', () => {
    const result = calculateSalariedTax(50000);
    expect(result.annualSalary).toBe(600000);
    expect(result.annualTax).toBe(0);
    expect(result.monthlyTax).toBe(0);
    expect(result.monthlyTakeHome).toBe(50000);
    expect(result.annualTakeHome).toBe(600000);
    expect(result.effectiveTaxRate).toBe(0);
  });

  it('calculates monthly Rs 100,000: annual tax Rs 6,000, monthly tax Rs 500, take-home Rs 99,500', () => {
    const result = calculateSalariedTax(100000);
    expect(result.annualSalary).toBe(1200000);
    expect(result.annualTax).toBe(6000);
    expect(result.monthlyTax).toBe(500);
    expect(result.monthlyTakeHome).toBe(99500);
    expect(result.annualTakeHome).toBe(1194000);
    expect(result.effectiveTaxRate).toBe(0.5);
  });

  it('calculates monthly Rs 200,000: annual tax Rs 156,000, monthly tax Rs 13,000, take-home Rs 187,000', () => {
    const result = calculateSalariedTax(200000);
    expect(result.annualSalary).toBe(2400000);
    expect(result.annualTax).toBe(156000);
    expect(result.monthlyTax).toBe(13000);
    expect(result.monthlyTakeHome).toBe(187000);
    expect(result.annualTakeHome).toBe(2244000);
    expect(result.effectiveTaxRate).toBe(6.5);
  });

  it('calculates monthly Rs 1,000,000: annual tax Rs 3,174,000, monthly tax Rs 264,500, take-home Rs 735,500', () => {
    const result = calculateSalariedTax(1000000);
    expect(result.annualSalary).toBe(12000000);
    expect(result.annualTax).toBe(3174000);
    expect(result.monthlyTax).toBe(264500);
    expect(result.monthlyTakeHome).toBe(735500);
    expect(result.annualTakeHome).toBe(8826000);
  });

  it('rounds amounts that leave a fraction of a rupee to the nearest whole rupee', () => {
    // 65,000 * 12 = 780,000 -> 1% of (780,000 - 600,000) = 1,800 annual tax -> 150/mo
    // Let's test an amount that produces fractional monthly tax:
    // monthly 60,005 -> annual 720,060 -> tax = 1% of 120,060 = 1,200.6 -> round to 1,201
    // monthly tax = 1201 / 12 = 100.083 -> round to 100
    const result = calculateSalariedTax(60005);
    expect(result.annualTax).toBe(1201);
    expect(result.monthlyTax).toBe(100);
    expect(Number.isInteger(result.annualTax)).toBe(true);
    expect(Number.isInteger(result.monthlyTax)).toBe(true);
    expect(Number.isInteger(result.monthlyTakeHome)).toBe(true);
  });
});

describe('Salaried Slabs: Boundaries and Slab Tops', () => {
  it('covers boundary 600,000 annual (slab 1 cap): tax is 0', () => {
    const result = calculateSalariedTax(600000 / 12);
    expect(result.annualTax).toBe(0);
    expect(result.activeSlab.slabNumber).toBe(1);
  });

  it('covers boundary 600,001 annual: falls in slab 2 with 1% on excess (Rs 1 excess)', () => {
    // annual 600,001: 1% of 1 = 0.01 -> rounds to 0
    // let's test annual 600,100 (monthly 600,100 / 12): 1% of 100 = 1
    const result = calculateSalariedTax(600100 / 12);
    expect(result.activeSlab.slabNumber).toBe(2);
    expect(result.annualTax).toBe(1);
  });

  it('covers top of slab 2: Rs 1,200,000 annual -> tax Rs 6,000', () => {
    const result = calculateSalariedTax(1200000 / 12);
    expect(result.activeSlab.slabNumber).toBe(2);
    expect(result.annualTax).toBe(6000);
  });

  it('covers top of slab 3: Rs 2,200,000 annual -> tax Rs 116,000', () => {
    const result = calculateSalariedTax(2200000 / 12);
    expect(result.activeSlab.slabNumber).toBe(3);
    expect(result.annualTax).toBe(116000);
  });

  it('covers top of slab 4: Rs 3,200,000 annual -> tax Rs 316,000', () => {
    const result = calculateSalariedTax(3200000 / 12);
    expect(result.activeSlab.slabNumber).toBe(4);
    expect(result.annualTax).toBe(316000);
  });

  it('covers top of slab 5: Rs 4,100,000 annual -> tax Rs 541,000', () => {
    const result = calculateSalariedTax(4100000 / 12);
    expect(result.activeSlab.slabNumber).toBe(5);
    expect(result.annualTax).toBe(541000);
  });

  it('covers top of slab 6: Rs 5,600,000 annual -> tax Rs 976,000', () => {
    const result = calculateSalariedTax(5600000 / 12);
    expect(result.activeSlab.slabNumber).toBe(6);
    expect(result.annualTax).toBe(976000);
  });

  it('covers top of slab 7: Rs 7,000,000 annual -> tax Rs 1,424,000', () => {
    const result = calculateSalariedTax(7000000 / 12);
    expect(result.activeSlab.slabNumber).toBe(7);
    expect(result.annualTax).toBe(1424000);
  });

  it('covers above top slab (slab 8): Rs 8,000,000 annual -> 1,424,000 + 35% of 1,000,000 = Rs 1,774,000', () => {
    const result = calculateSalariedTax(8000000 / 12);
    expect(result.activeSlab.slabNumber).toBe(8);
    expect(result.annualTax).toBe(1774000);
  });
});

describe('Story S-2: Slab-by-Slab Breakdown', () => {
  it('breaks down monthly Rs 200,000 (annual Rs 2,400,000) exactly per acceptance criteria', () => {
    const result = calculateSalariedTax(200000);
    const breakdown = result.slabBreakdown;

    expect(breakdown).toHaveLength(4);
    expect(breakdown[0].tax).toBe(0);
    expect(breakdown[0].description).toBe('Rs 0 on the first Rs 600,000');

    expect(breakdown[1].tax).toBe(6000);
    expect(breakdown[1].description).toBe('Rs 6,000 on the next Rs 600,000');

    expect(breakdown[2].tax).toBe(110000);
    expect(breakdown[2].description).toBe('Rs 110,000 on the next Rs 1,000,000');

    expect(breakdown[3].tax).toBe(40000);
    expect(breakdown[3].description).toBe('Rs 40,000 on the remaining Rs 200,000');

    const totalSum = breakdown.reduce((sum, item) => sum + item.tax, 0);
    expect(totalSum).toBe(156000);
    expect(totalSum).toBe(result.annualTax);
  });

  it('does not list slabs above income when income is within the first slab', () => {
    const result = calculateSalariedTax(40000); // 480,000 annual
    const breakdown = result.slabBreakdown;
    expect(breakdown).toHaveLength(1);
    expect(breakdown[0].slabNumber).toBe(1);
    expect(breakdown[0].tax).toBe(0);
  });
});

describe('Story S-5: Businessman Estimated Annual Tax and Surcharge', () => {
  it('calculates net profit Rs 600,000: estimated tax is Rs 0', () => {
    const result = calculateBusinessTax(600000);
    expect(result.totalAnnualTax).toBe(0);
    expect(result.isEstimate).toBe(true);
    expect(result.hasSurcharge).toBe(false);
  });

  it('calculates net profit Rs 1,200,000: estimated tax is Rs 90,000', () => {
    const result = calculateBusinessTax(1200000);
    expect(result.baseTax).toBe(90000);
    expect(result.surcharge).toBe(0);
    expect(result.totalAnnualTax).toBe(90000);
    expect(result.hasSurcharge).toBe(false);
  });

  it('calculates net profit Rs 3,000,000: estimated tax is Rs 590,000', () => {
    const result = calculateBusinessTax(3000000);
    expect(result.baseTax).toBe(590000);
    expect(result.totalAnnualTax).toBe(590000);
    expect(result.hasSurcharge).toBe(false);
  });

  it('calculates net profit Rs 5,600,000: estimated tax is Rs 1,610,000', () => {
    const result = calculateBusinessTax(5600000);
    expect(result.baseTax).toBe(1610000);
    expect(result.totalAnnualTax).toBe(1610000);
    expect(result.hasSurcharge).toBe(false);
  });

  it('calculates boundary Rs 10,000,000: estimated tax is Rs 3,590,000 and NO surcharge is added', () => {
    const result = calculateBusinessTax(10000000);
    expect(result.baseTax).toBe(3590000);
    expect(result.surcharge).toBe(0);
    expect(result.totalAnnualTax).toBe(3590000);
    expect(result.hasSurcharge).toBe(false);
  });

  it('calculates profit above 10M (Rs 12,000,000): base tax Rs 4,490,000 + 10% surcharge Rs 449,000 = Rs 4,939,000', () => {
    const result = calculateBusinessTax(12000000);
    expect(result.baseTax).toBe(4490000);
    expect(result.surcharge).toBe(449000);
    expect(result.totalAnnualTax).toBe(4939000);
    expect(result.hasSurcharge).toBe(true);
    expect(result.isEstimate).toBe(true);
  });
});

describe('Business Slabs: Boundaries and Slab Tops', () => {
  it('covers boundary 600,000: tax is 0', () => {
    const result = calculateBusinessTax(600000);
    expect(result.totalAnnualTax).toBe(0);
  });

  it('covers boundary 600,001: 15% of 1 = 0.15 -> rounds to 0', () => {
    const result = calculateBusinessTax(600001);
    expect(result.totalAnnualTax).toBe(0);
  });

  it('covers top of slab 2: Rs 1,200,000 -> Rs 90,000', () => {
    const result = calculateBusinessTax(1200000);
    expect(result.activeSlab.slabNumber).toBe(2);
    expect(result.totalAnnualTax).toBe(90000);
  });

  it('covers top of slab 3: Rs 1,600,000 -> Rs 170,000', () => {
    const result = calculateBusinessTax(1600000);
    expect(result.activeSlab.slabNumber).toBe(3);
    expect(result.totalAnnualTax).toBe(170000);
  });

  it('covers top of slab 4: Rs 3,200,000 -> Rs 650,000', () => {
    const result = calculateBusinessTax(3200000);
    expect(result.activeSlab.slabNumber).toBe(4);
    expect(result.totalAnnualTax).toBe(650000);
  });

  it('covers top of slab 5: Rs 5,600,000 -> Rs 1,610,000', () => {
    const result = calculateBusinessTax(5600000);
    expect(result.activeSlab.slabNumber).toBe(5);
    expect(result.totalAnnualTax).toBe(1610000);
  });

  it('covers above top slab (slab 6): Rs 8,000,000 -> 1,610,000 + 45% of 2,400,000 = Rs 2,690,000', () => {
    const result = calculateBusinessTax(8000000);
    expect(result.activeSlab.slabNumber).toBe(6);
    expect(result.totalAnnualTax).toBe(2690000);
    expect(result.hasSurcharge).toBe(false);
  });
});

describe('Story S-6: Businessman Monthly Set Aside Amount', () => {
  it('calculates monthly amount for Rs 590,000 annual tax: Rs 49,167 (rounded up to next whole rupee)', () => {
    const result = calculateBusinessTax(3000000);
    expect(result.totalAnnualTax).toBe(590000);
    expect(result.monthlySavingsAmount).toBe(49167);
  });

  it('calculates monthly amount for Rs 0 annual tax: Rs 0', () => {
    const result = calculateBusinessTax(600000);
    expect(result.totalAnnualTax).toBe(0);
    expect(result.monthlySavingsAmount).toBe(0);
  });
});

describe('Story S-11: Businessman Monthly Net Profit Mode', () => {
  it('calculates monthly profit Rs 250,000 (annualized Rs 3,000,000): annual tax Rs 590,000, monthly set aside Rs 49,167', () => {
    const monthlyInput = 250000;
    const annualized = monthlyInput * 12;
    const result = calculateBusinessTax(annualized, 'monthly', monthlyInput);

    expect(result.annualProfit).toBe(3000000);
    expect(result.monthlyProfit).toBe(250000);
    expect(result.inputMode).toBe('monthly');
    expect(result.totalAnnualTax).toBe(590000);
    expect(result.monthlySavingsAmount).toBe(49167);
  });

  it('calculates monthly profit Rs 100,000 (annualized Rs 1,200,000): annual tax Rs 90,000, monthly set aside Rs 7,500', () => {
    const monthlyInput = 100000;
    const annualized = monthlyInput * 12;
    const result = calculateBusinessTax(annualized, 'monthly', monthlyInput);

    expect(result.annualProfit).toBe(1200000);
    expect(result.monthlyProfit).toBe(100000);
    expect(result.inputMode).toBe('monthly');
    expect(result.totalAnnualTax).toBe(90000);
    expect(result.monthlySavingsAmount).toBe(7500);
  });
});

describe('UI Helper: Number formatting with commas', () => {
  it('formats numbers with standard comma separators (e.g. 250000 -> 250,000)', () => {
    expect(formatWithCommas('250000')).toBe('250,000');
    expect(formatWithCommas('1000')).toBe('1,000');
    expect(formatWithCommas('1000000')).toBe('1,000,000');
    expect(formatWithCommas('50000')).toBe('50,000');
    expect(formatWithCommas('250,000')).toBe('250,000');
  });

  it('handles empty or blank input cleanly', () => {
    expect(formatWithCommas('')).toBe('');
    expect(formatWithCommas(null)).toBe('');
    expect(formatWithCommas(undefined)).toBe('');
  });

  it('preserves non-numeric characters for S-3 error testing', () => {
    expect(formatWithCommas('abc')).toBe('abc');
    expect(formatWithCommas('-25000')).toBe('-25000');
  });
});

