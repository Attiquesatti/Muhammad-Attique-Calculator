import React, { useState } from 'react';
import Header from './components/Header.jsx';
import RoleTabs from './components/RoleTabs.jsx';
import SalariedCalculator from './components/SalariedCalculator.jsx';
import BusinessCalculator from './components/BusinessCalculator.jsx';
import SlabReferenceTable from './components/SlabReferenceTable.jsx';
import { FISCAL_YEAR } from './config/taxSlabs.js';

export default function App() {
  const [activeRole, setActiveRole] = useState('salaried');
  const [showSlabModal, setShowSlabModal] = useState(true);

  return (
    <div className="app-container">
      <Header showSlabModal={showSlabModal} setShowSlabModal={setShowSlabModal} />

      <main>
        <RoleTabs activeRole={activeRole} onRoleChange={setActiveRole} />

        {/* Clean separation between roles per S-7 */}
        {activeRole === 'salaried' ? (
          <SalariedCalculator key="salaried" />
        ) : (
          <BusinessCalculator key="businessman" />
        )}

        {/* FY 2026-27 Slab Tables visible with named sources per S-4 */}
        {showSlabModal && <SlabReferenceTable />}
      </main>

      <footer className="app-footer">
        <p>
          Pakistan Income Tax Calculator • {FISCAL_YEAR} Rates • Local React Application
        </p>
      </footer>
    </div>
  );
}

