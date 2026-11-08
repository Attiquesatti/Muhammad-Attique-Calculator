import React, { useState } from 'react';
import { SALARIED_CONFIG, BUSINESS_CONFIG, FISCAL_YEAR } from '../config/taxSlabs.js';

export default function SlabReferenceTable() {
  const [selectedTab, setSelectedTab] = useState('salaried');

  const currentConfig = selectedTab === 'salaried' ? SALARIED_CONFIG : BUSINESS_CONFIG;

  return (
    <section className="slab-reference-section" aria-labelledby="slab-table-title">
      <div className="reference-header">
        <div>
          <h3 id="slab-table-title">Official Income Tax Slabs ({FISCAL_YEAR})</h3>
          <p className="reference-source">
            <strong>Legal Source:</strong> {currentConfig.sourceCite}
          </p>
          {selectedTab === 'salaried' && (
            <p className="reference-source" style={{ color: '#0f766e', marginTop: '2px' }}>
              ✓ Note: 9% high-income surcharge on salaried individuals is abolished.
            </p>
          )}
          {selectedTab === 'businessman' && (
            <p className="reference-source" style={{ color: '#7c3aed', marginTop: '2px' }}>
              ✓ Note: 10% tax surcharge applies if taxable profit exceeds Rs 10,000,000.
            </p>
          )}
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            className={`btn-secondary ${selectedTab === 'salaried' ? 'active' : ''}`}
            style={selectedTab === 'salaried' ? { background: '#0284c7', color: '#fff', borderColor: '#0284c7' } : {}}
            onClick={() => setSelectedTab('salaried')}
          >
            Salaried Slabs
          </button>
          <button
            type="button"
            className={`btn-secondary ${selectedTab === 'businessman' ? 'active' : ''}`}
            style={selectedTab === 'businessman' ? { background: '#7c3aed', color: '#fff', borderColor: '#7c3aed' } : {}}
            onClick={() => setSelectedTab('businessman')}
          >
            Business Slabs
          </button>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="tax-table">
          <thead>
            <tr>
              <th style={{ width: '80px' }}>Slab #</th>
              <th>Taxable Income Bracket (Rs.)</th>
              <th>Rate of Tax</th>
            </tr>
          </thead>
          <tbody>
            {currentConfig.slabs.map((slab) => (
              <tr key={slab.slabNumber}>
                <td><strong>#{slab.slabNumber}</strong></td>
                <td>{slab.label}</td>
                <td>{slab.ruleDescription}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

