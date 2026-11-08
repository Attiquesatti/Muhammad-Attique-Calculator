import {
  SALARIED_CONFIG,
  BUSINESS_CONFIG,
  MAX_ALLOWED_AMOUNT,
} from '../config/taxSlabs.js';

/**
 * Validates tax input according to Story S-3
 * @param {string|number|null|undefined} rawInput
 * @returns {{ isValid: boolean, error?: string, value?: number }}
 */
export function validateTaxInput(rawInput) {
  if (rawInput === null || rawInput === undefined) {
    return { isValid: false, error: 'Enter an amount' };
  }

  const str = String(rawInput).trim();

  if (str === '') {
    return { isValid: false, error: 'Enter an amount' };
  }

  // Check for alphabetical characters
  if (/[a-zA-Z]/.test(str)) {
    return { isValid: false, error: 'Enter numbers only' };
  }

  // Strip standard commas
  const sanitized = str.replace(/,/g, '');
  const num = Number(sanitized);

  if (isNaN(num)) {
    return { isValid: false, error: 'Enter numbers only' };
  }

  // If starts with '-' and is not zero, or is numerically negative
  if (num < 0 || (str.startsWith('-') && num !== 0)) {
    return { isValid: false, error: 'Amount cannot be negative' };
  }

  if (num === 0) {
    return { isValid: false, error: 'Amount must be greater than zero' };
  }

  if (num > MAX_ALLOWED_AMOUNT) {
    return { isValid: false, error: 'Amount is too large' };
  }

  return { isValid: true, value: num };
}

/**
 * Formats a numeric input string with comma separators (e.g. "250000" -> "250,000")
 * Preserves letters, signs, etc. so validation rules can still inspect them.
 * @param {string|number} val
 * @returns {string}
 */
export function formatWithCommas(val) {
  if (val === null || val === undefined) return '';
  const str = String(val);
  if (str === '') return '';

  // Strip existing commas
  const stripped = str.replace(/,/g, '');

  // If it's a sequence of digits (with optional decimal point)
  if (/^\d+(\.\d*)?$/.test(stripped)) {
    const parts = stripped.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }

  return str;
}

/**
 * Calculates progressive slab-by-slab breakdown
 * @param {number} income
 * @param {Array} slabs
 * @returns {Array} List of slab breakdown items up to the active slab
 */
export function calculateSlabBreakdown(income, slabs) {
  const breakdown = [];

  for (let i = 0; i < slabs.length; i++) {
    const slab = slabs[i];
    const isFirstSlab = slab.minIncome === 0;
    const slabCap = slab.maxIncome;

    if (income <= slab.minIncome) {
      break;
    }

    const taxableChunk = slabCap !== null
      ? Math.min(income, slabCap) - slab.minIncome
      : income - slab.minIncome;

    const taxForChunk = Math.round((taxableChunk * slab.ratePercent) / 100);

    let slabRangeText = '';
    const isRemaining = (slabCap === null || income < slabCap) && !isFirstSlab;

    if (isFirstSlab) {
      slabRangeText = `the first Rs ${slabCap.toLocaleString()}`;
    } else if (isRemaining) {
      slabRangeText = `the remaining Rs ${taxableChunk.toLocaleString()}`;
    } else {
      slabRangeText = `the next Rs ${taxableChunk.toLocaleString()}`;
    }

    breakdown.push({
      slabNumber: slab.slabNumber,
      label: slab.label,
      ratePercent: slab.ratePercent,
      taxableAmount: taxableChunk,
      tax: taxForChunk,
      description: `Rs ${taxForChunk.toLocaleString()} on ${slabRangeText}`,
    });

    if (slabCap !== null && income <= slabCap) {
      break;
    }
  }

  return breakdown;
}

/**
 * Pure calculation for Salaried Employee (S-1, S-2, S-4)
 * @param {number} monthlySalary
 * @returns {object} Salaried tax details
 */
export function calculateSalariedTax(monthlySalary) {
  const annualSalary = monthlySalary * 12;
  const slabs = SALARIED_CONFIG.slabs;

  let activeSlab = slabs[0];
  for (const slab of slabs) {
    if (annualSalary > slab.minIncome) {
      activeSlab = slab;
    }
  }

  let rawAnnualTax = 0;
  if (annualSalary > activeSlab.minIncome && activeSlab.ratePercent > 0) {
    const excess = annualSalary - activeSlab.minIncome;
    rawAnnualTax = activeSlab.baseTax + (excess * (activeSlab.ratePercent / 100));
  } else {
    rawAnnualTax = activeSlab.baseTax;
  }

  // Rounded to nearest whole rupee per S-1
  const annualTax = Math.round(rawAnnualTax);
  const monthlyTax = Math.round(annualTax / 12);
  const monthlyTakeHome = Math.round(monthlySalary - monthlyTax);
  const annualTakeHome = Math.round(annualSalary - annualTax);
  const effectiveTaxRate = annualSalary > 0 ? (annualTax / annualSalary) * 100 : 0;

  const slabBreakdown = calculateSlabBreakdown(annualSalary, slabs);

  return {
    monthlySalary,
    annualSalary,
    annualTax,
    monthlyTax,
    monthlyTakeHome,
    annualTakeHome,
    effectiveTaxRate: Number(effectiveTaxRate.toFixed(2)),
    activeSlab,
    slabBreakdown,
    fiscalYear: SALARIED_CONFIG.fiscalYear,
    sourceCite: SALARIED_CONFIG.sourceCite,
  };
}

/**
 * Pure calculation for Businessman / Sole Proprietor (S-5, S-6, S-11)
 * @param {number} annualProfit
 * @param {'annual'|'monthly'} [inputMode='annual']
 * @param {number|null} [monthlyProfit=null]
 * @returns {object} Business tax details
 */
export function calculateBusinessTax(annualProfit, inputMode = 'annual', monthlyProfit = null) {
  const slabs = BUSINESS_CONFIG.slabs;

  let activeSlab = slabs[0];
  for (const slab of slabs) {
    if (annualProfit > slab.minIncome) {
      activeSlab = slab;
    }
  }

  let rawBaseTax = 0;
  if (annualProfit > activeSlab.minIncome && activeSlab.ratePercent > 0) {
    const excess = annualProfit - activeSlab.minIncome;
    rawBaseTax = activeSlab.baseTax + (excess * (activeSlab.ratePercent / 100));
  } else {
    rawBaseTax = activeSlab.baseTax;
  }

  const baseTax = Math.round(rawBaseTax);

  // Surcharge: if annual taxable profit is strictly above 10,000,000, add 10% of the tax
  const hasSurcharge = annualProfit > BUSINESS_CONFIG.surchargeThreshold;
  const surcharge = hasSurcharge
    ? Math.round(baseTax * (BUSINESS_CONFIG.surchargeRatePercent / 100))
    : 0;

  const totalAnnualTax = baseTax + surcharge;

  // Monthly set-aside per S-6: annual tax divided by 12, rounded up to next whole rupee
  const monthlySavingsAmount = totalAnnualTax > 0 ? Math.ceil(totalAnnualTax / 12) : 0;

  const effectiveTaxRate = annualProfit > 0 ? (totalAnnualTax / annualProfit) * 100 : 0;
  const slabBreakdown = calculateSlabBreakdown(annualProfit, slabs);

  const resolvedMonthlyProfit = monthlyProfit !== null
    ? monthlyProfit
    : Math.round(annualProfit / 12);

  return {
    annualProfit,
    monthlyProfit: resolvedMonthlyProfit,
    inputMode,
    baseTax,
    surcharge,
    hasSurcharge,
    totalAnnualTax,
    monthlySavingsAmount,
    effectiveTaxRate: Number(effectiveTaxRate.toFixed(2)),
    activeSlab,
    slabBreakdown,
    isEstimate: true,
    fiscalYear: BUSINESS_CONFIG.fiscalYear,
    sourceCite: BUSINESS_CONFIG.sourceCite,
  };
}
