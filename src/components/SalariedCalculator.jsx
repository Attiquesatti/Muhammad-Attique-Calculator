import React, { useState } from 'react';
import { Calculator, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { validateTaxInput, calculateSalariedTax, formatWithCommas } from '../utils/taxCalculator.js';
import { FISCAL_YEAR, SALARIED_CONFIG } from '../config/taxSlabs.js';

export default function SalariedCalculator() {
  const [monthlyInput, setMonthlyInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [result, setResult] = useState(null);
  const [showBreakdown, setShowBreakdown] = useState(true);

  const handleCalculate = (e) => {
    if (e) e.preventDefault();

    const validation = validateTaxInput(monthlyInput);
    if (!validation.isValid) {
      setErrorMessage(validation.error);
      setResult(null);
      return;
    }

    setErrorMessage('');
    const taxData = calculateSalariedTax(validation.value);
    setResult(taxData);
  };

  const handleInputChange = (e) => {
    const formatted = formatWithCommas(e.target.value);
    setMonthlyInput(formatted);
  };

  const salariedStats = result
    ? [
        {
          id: 'monthly-take-home',
          title: 'Monthly Take-Home Pay',
          value: `Rs ${result.monthlyTakeHome.toLocaleString()}`,
          sub: 'After monthly tax withholding',
          highlight: true,
        },
        {
          id: 'monthly-tax',
          title: 'Monthly Tax',
          value: `Rs ${result.monthlyTax.toLocaleString()}`,
          sub: 'Deducted from monthly salary',
        },
        {
          id: 'annual-tax',
          title: 'Annual Tax',
          value: `Rs ${result.annualTax.toLocaleString()}`,
          sub: `Total tax for ${FISCAL_YEAR}`,
        },
        {
          id: 'annual-take-home',
          title: 'Annual Take-Home',
          value: `Rs ${result.annualTakeHome.toLocaleString()}`,
          sub: `Annual gross: Rs ${result.annualSalary.toLocaleString()}`,
        },
        {
          id: 'effective-rate',
          title: 'Effective Tax Rate',
          value: `${result.effectiveTaxRate.toFixed(2)}%`,
          sub: 'Average tax rate across income',
        },
        {
          id: 'applicable-slab',
          title: 'Applicable Slab',
          value: `Slab #${result.activeSlab.slabNumber}`,
          sub: result.activeSlab.label,
        },
      ]
    : [];

  return (
    <div className="calc-card" data-testid="salaried-calculator">
      <div className="role-info-banner">
        <strong>Salaried Employee:</strong> For individuals on a fixed monthly salary with taxes withheld by employers under {FISCAL_YEAR}. 
        <em> (Source: {SALARIED_CONFIG.sourceCite})</em>
      </div>

      <form className="input-form" onSubmit={handleCalculate} noValidate>
        <div className="form-group">
          <label htmlFor="salaried-monthly-input">Monthly Gross Salary (Rs.)</label>
          <div className="input-wrapper">
            <span className="currency-prefix">Rs</span>
            <input
              id="salaried-monthly-input"
              type="text"
              className={`tax-input ${errorMessage ? 'input-error' : ''}`}
              placeholder="e.g. 100,000"
              value={monthlyInput}
              onChange={handleInputChange}
              aria-invalid={Boolean(errorMessage)}
              aria-describedby={errorMessage ? 'salaried-error' : 'salaried-hint'}
            />
          </div>
          <span id="salaried-hint" className="input-hint">
            Annual taxable income is calculated as monthly salary × 12.
          </span>
        </div>

        {errorMessage && (
          <div id="salaried-error" className="error-alert" role="alert">
            <AlertCircle size={18} />
            <span>{errorMessage}</span>
          </div>
        )}

        <button type="submit" className="btn-primary" id="salaried-calc-btn">
          <Calculator size={18} />
          <span>Calculate Tax</span>
        </button>
      </form>

      {result && (
        <div className="results-container" data-testid="salaried-results">
          <div className="stat-grid">
            {salariedStats.map((stat) => (
              <div
                key={stat.id}
                className={`stat-card ${stat.highlight ? 'highlight' : ''}`}
              >
                <div className="stat-title">{stat.title}</div>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-sub">{stat.sub}</div>
              </div>
            ))}
          </div>

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
                <li className="breakdown-item" style={{ background: '#f1f5f9', fontWeight: 700 }}>
                  <span>Total Annual Tax:</span>
                  <span>Rs {result.annualTax.toLocaleString()}</span>
                </li>
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

