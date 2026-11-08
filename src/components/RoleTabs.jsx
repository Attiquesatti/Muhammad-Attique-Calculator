import React from 'react';
import { Briefcase, Building2 } from 'lucide-react';

export default function RoleTabs({ activeRole, onRoleChange }) {
  return (
    <nav className="role-tabs" aria-label="Calculator Role Selection">
      <button
        type="button"
        className={`tab-btn salaried-tab ${activeRole === 'salaried' ? 'active' : ''}`}
        onClick={() => onRoleChange('salaried')}
        aria-selected={activeRole === 'salaried'}
        role="tab"
      >
        <Briefcase size={18} />
        <span>Salaried Employee</span>
      </button>

      <button
        type="button"
        className={`tab-btn business-tab ${activeRole === 'businessman' ? 'active' : ''}`}
        onClick={() => onRoleChange('businessman')}
        aria-selected={activeRole === 'businessman'}
        role="tab"
      >
        <Building2 size={18} />
        <span>Businessman (Sole Proprietor)</span>
      </button>
    </nav>
  );
}

