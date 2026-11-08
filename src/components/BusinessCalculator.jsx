import React, { useState } from 'react';
import { Calculator, AlertCircle, ChevronDown, ChevronUp, AlertTriangle, X } from 'lucide-react';
import { validateTaxInput, calculateBusinessTax, formatWithCommas } from '../utils/taxCalculator.js';
import { FISCAL_YEAR, BUSINESS_CONFIG } from '../config/taxSlabs.js';

export default function BusinessCalculator() {
  const [annualProfit, setAnnualProfit] = useState('');
  const [monthlyProfit, setMonthlyProfit] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [result, setResult] = useState(null);
  const [showBreakdown, setShowBreakdown] = useState(true);

  // S-11: Mutually exclusive input fields using React state
  const isAnnualDisabled = Boolean(monthlyProfit.trim());
  const isMonthlyDisabled = Boolean(annualProfit.trim());

  const handleAnnualChange = (e) => {
    const formatted = formatWithCommas(e.target.value);
    setAnnualProfit(formatted);
  };

  const handleMonthlyChange = (e) => {
    const formatted = formatWithCommas(e.target.value);
    setMonthlyProfit(formatted);
  };

  const clearAnnual = () => {
    setAnnualProfit('');
    setErrorMessage('');
  };

  const clearMonthly = () => {
    setMonthlyProfit('');
    setErrorMessage('');
  };

  const handleCalculate = (e) => {
    if (e) e.preventDefault();

    // Check which input is active
    if (!annualProfit.trim() && !monthlyProfit.trim()) {
      const validation = validateTaxInput('');
      setErrorMessage(validation.error);
      setResult(null);
      return;
    }

    if (annualProfit.trim()) {
      const validation = validateTaxInput(annualProfit);
      if (!validation.isValid) {
        setErrorMessage(validation.error);
        setResult(null);
        return;
      }
      setErrorMessage('');
      const taxData = calculateBusinessTax(validation.value, 'annual');
      setResult(taxData);
    } else {
      const validation = validateTaxInput(monthlyProfit);
      if (!validation.isValid) {
        setErrorMessage(validation.error);
        setResult(null);
        return;
      }
      setErrorMessage('');
      const annualizedProfit = validation.value * 12;
      const taxData = calculateBusinessTax(annualizedProfit, 'monthly', validation.value);
      setResult(taxData);
    }
  };

  const businessStats = result
    ? [
        {
          id: 'monthly-reserve',
          title: 'Monthly Amount to Set Aside',
          value: `Rs ${result.monthlySavingsAmount.toLocaleString()}`,
          sub: 'Recommended monthly tax reserve (rounded up)',
          highlight: true,
        },
        {
          id: 'annual-tax',
          title: 'Estimated Annual Tax',
          value: `Rs ${result.totalAnnualTax.toLocaleString()}`,
          sub: `Total payable for ${FISCAL_YEAR}`,
        },
        {
          id: 'net-profit',
          title: result.inputMode === 'monthly' ? 'Annualized Profit' : 'Annual Net Profit',
          value: `Rs ${result.annualProfit.toLocaleString()}`,
          sub: `Monthly: Rs ${result.monthlyProfit.toLocaleString()}`,
        },
        {
          id: 'base-tax',
          title: 'Base Tax (Before Surcharge)',
          value: `Rs ${result.baseTax.toLocaleString()}`,
          sub: 'Progressive slab tax',
        },
        {
          id: 'surcharge',
          title: 'High-Income Surcharge',
          value: result.hasSurcharge ? `Rs ${result.surcharge.toLocaleString()}` : 'Rs 0',
          sub: result.hasSurcharge ? '10% on tax (Profit > Rs 10M)' : 'Not applicable (≤ Rs 10M)',
        },
        {
          id: 'effective-rate',
          title: 'Effective Tax Rate',
          value: `${result.effectiveTaxRate.toFixed(2)}%`,
          sub: 'Tax as % of net profit',
        },
      ]
    : [];

  return (
    <div className="calc-card" data-testid="business-calculator">
      <div className="role-info-banner business-theme">
        <strong>Businessman (Sole Proprietor):</strong> For unincorporated small business owners paying tax on net profit under {FISCAL_YEAR}. 
        <em> (Source: {BUSINESS_CONFIG.sourceCite})</em>
      </div>

      <form className="input-form" onSubmit={handleCalculate} noValidate>
        {/* Field 1: Annual Net Profit */}
        <div className="form-group">
          <label htmlFor="business-annual-profit-input">
            Expected Annual Net Profit (Rs.)
            {isAnnualDisabled && <span style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 400 }}> (Disabled: Monthly field active)</span>}
          </label>
          <div className="input-wrapper">
            <span className="currency-prefix">Rs</span>
            <input
              id="business-annual-profit-input"
              type="text"
              disabled={isAnnualDisabled}
              className={`tax-input ${errorMessage && annualProfit ? 'input-error' : ''}`}
              placeholder="e.g. 3,000,000"
              value={annualProfit}
              onChange={handleAnnualChange}
              aria-invalid={Boolean(errorMessage && annualProfit)}
              aria-describedby={errorMessage ? 'business-error' : 'business-hint'}
            />
            {annualProfit && (
              <button
                type="button"
                className="input-clear-btn"
                onClick={clearAnnual}
                title="Clear Annual Profit"
                aria-label="Clear Annual Profit"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        <div className="or-divider">
          <span>OR</span>
        </div>

        {/* Field 2: Monthly Net Profit (S-11) */}
        <div className="form-group">
          <label htmlFor="business-monthly-profit-input">
            Expected Monthly Net Profit (Rs.)
            {isMonthlyDisabled && <span style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 400 }}> (Disabled: Annual field active)</span>}
          </label>
          <div className="input-wrapper">
            <span className="currency-prefix">Rs</span>
            <input
              id="business-monthly-profit-input"
              type="text"
              disabled={isMonthlyDisabled}
              className={`tax-input ${errorMessage && monthlyProfit ? 'input-error' : ''}`}
              placeholder="e.g. 250,000"
              value={monthlyProfit}
              onChange={handleMonthlyChange}
              aria-invalid={Boolean(errorMessage && monthlyProfit)}
              aria-describedby={errorMessage ? 'business-error' : 'business-hint'}
            />
            {monthlyProfit && (
              <button
                type="button"
                className="input-clear-btn"
                onClick={clearMonthly}
                title="Clear Monthly Profit"
                aria-label="Clear Monthly Profit"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <span id="business-hint" className="input-hint">
            Enter either Annual or Monthly net profit (sales minus allowed expenses). One field disables when the other has text.
          </span>
        </div>

        {errorMessage && (
          <div id="business-error" className="error-alert" role="alert">
            <AlertCircle size={18} />
            <span>{errorMessage}</span>
          </div>
        )}

        <button type="submit" className="btn-primary business-btn" id="business-calc-btn">
          <Calculator size={18} />
          <span>Calculate Estimated Tax</span>
        </button>
      </form>

      {result && (
        <div className="results-container" data-testid="business-results">
          {/* S-5: Clearly labeled as an estimate and not a final tax liability */}
          <div className="estimate-notice" role="note">
            <AlertTriangle size={18} />
            <span>
              <strong>Notice:</strong> This calculation is an <strong>estimate</strong> of your annual tax liability under {FISCAL_YEAR} sole proprietor slabs. It is not an official or final tax assessment.
            </span>
          </div>

          <div className="stat-grid">
            {businessStats.map((stat) => (
              <div
                key={stat.id}
                className={`stat-card ${stat.highlight ? 'highlight business-highlight' : ''}`}
              >
                <div className="stat-title">{stat.title}</div>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-sub">{stat.sub}</div>
              </div>
            ))}
          </div>

          {result.hasSurcharge && (
            <div className="surcharge-card">
              <div className="surcharge-info">
                <h4>High-Income Surcharge Applied (+10% on tax)</h4>
                <p>Taxable profit exceeds Rs 10,000,000. Statutory 10% surcharge added to base tax.</p>
              </div>
              <div className="surcharge-amount">+ Rs {result.surcharge.toLocaleString()}</div>
            </div>
          )}

          <div className="breakdown-section">
            <button
              type="button"
              className="breakdown-toggle"
              onClick={() => setShowBreakdown((prev) => !prev)}
              aria-expanded={showBreakdown}
            >
              <span>Tax Breakdown (Slab-by-Slab)</span>
              {showBreakdown ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>

            {showBreakdown && (
              <ul className="breakdown-list">
                {result.slabBreakdown.map((item) => (
                  <li key={item.slabNumber} className="breakdown-item">
                    <span className="breakdown-slab-desc">{item.description}</span>
                    <span className="breakdown-slab-tax">
                      {item.ratePercent > 0 ? `(${item.ratePercent}%)` : '(Exempt)'}
                    </span>
                  </li>
                ))}

                {result.hasSurcharge && (
                  <li className="breakdown-item" style={{ background: '#faf5ff', color: '#6b21a8' }}>
                    <span className="breakdown-slab-desc">High-Income Surcharge (10% of base tax)</span>
                    <span className="breakdown-slab-tax">+ Rs {result.surcharge.toLocaleString()}</span>
                  </li>
                )}

                <li className="breakdown-item" style={{ background: '#f1f5f9', fontWeight: 700 }}>
                  <span>Total Estimated Tax:</span>
                  <span>Rs {result.totalAnnualTax.toLocaleString()}</span>
                </li>
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
