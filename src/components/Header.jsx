import React from 'react';
import { Calendar, FileText } from 'lucide-react';
import { FISCAL_YEAR } from '../config/taxSlabs.js';

export default function Header({ showSlabModal, setShowSlabModal }) {
  return (
    <header className="app-header">
      <div className="header-badge">
        <Calendar size={14} />
        <span>{FISCAL_YEAR} Official Tax Rates</span>
      </div>
      <h1>Pakistan Income Tax Calculator</h1>
      <p>Compute personal income tax for Salaried Employees and Business Sole Proprietors</p>
      
      <div className="header-actions">
        <button
          type="button"
          className="btn-secondary"
          onClick={() => setShowSlabModal((prev) => !prev)}
          aria-label="View official tax slab tables"
        >
          <FileText size={16} />
          <span>{showSlabModal ? 'Hide Tax Slabs Table' : 'View FY 2026-27 Tax Slabs'}</span>
        </button>
      </div>
    </header>
  );
}

