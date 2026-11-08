# Pakistan Income Tax Calculator (FY 2026-27)

A fast, responsive, and fully local web application built with React and Vite to compute personal income tax and net take-home pay under Pakistan's **FY 2026-27** tax regime.

---

## 1. What the App Is and Who It Is For

This application solves the challenge of estimating income tax liabilities following the promulgation of the **Finance Act 2026**. It caters specifically to two distinct personas:

1. **Salaried Employee**:
   - An individual employed on a fixed monthly salary with taxes withheld at source by their employer.
   - Computes: Annual tax, monthly tax withholding, monthly net take-home pay, annual take-home pay, effective tax rate, and progressive slab-by-slab breakdown.
   - Applies: FY 2026-27 salaried tax slabs (omits the abolished 9% salaried surcharge).

2. **Businessman (Sole Proprietor)**:
   - An unincorporated small business owner whose income is based on annual net business profit (gross sales minus allowable expenses) and who must set aside tax reserves independently.
   - Computes: Estimated annual tax liability, statutory 10% high-income tax surcharge (for taxable profits exceeding Rs 10,000,000), and recommended monthly tax savings amount (rounded up to the next whole rupee).
   - Results are explicitly marked as estimates and not final tax assessments.

---

## 2. Prerequisites

- **Node.js**: v20.x or v22.x (Tested on Node v22.20.0)
- **npm**: v10.x or higher
- Modern web browser: Google Chrome, Microsoft Edge, Mozilla Firefox, or Apple Safari.
- **No paid accounts, API keys, or cloud services are required.**

---

## 3. Installation and Setup

Clone or extract the repository, navigate into the project root directory, and run:

```bash
# 1. Install dependencies
npm install

# 2. Start the local development server
npm run dev
```

Open your browser at the local URL printed in the terminal (typically `http://localhost:5173/`).

To build for production:
```bash
npm run build
npm run preview
```

---

## 4. Running the Automated Tests

The application includes automated unit tests powered by **Vitest**, covering 100% of the acceptance criteria, boundary values (`Rs 600,000`, `Rs 600,001`), every slab top, high-income surcharges, rounding rules, input formatting, and error validation states.

To execute the test suite:

```bash
npm test
```

### Test Suite Summary:
- **Story S-3**: Input validation and error cases (`"Enter an amount"`, `"Enter numbers only"`, `"Amount cannot be negative"`, `"Amount must be greater than zero"`, `"Amount is too large"`).
- **Story S-1**: Salaried monthly calculations and rounding to nearest whole rupee.
- **Story S-2**: Progressive slab-by-slab breakdown.
- **Story S-4**: Fiscal year and official slab reference visibility.
- **Story S-5**: Businessman progressive tax calculation and 10% surcharge application.
- **Story S-6**: Businessman monthly reserve calculation (rounded up to next rupee).
- **Story S-7**: Independent role calculation and clean switching (Clean Tab switching is verified manually).
- **Story S-11**: Businessman dual-input mode (Annual vs. Monthly Net Profit with mutual field disabling).
- **UI Helper**: Real-time comma-separated input formatting with clear buttons.

---

## 5. AI Tool and Model Used

- **AI Tool**: Antigravity (Google DeepMind Advanced Agentic Coding)
- **Model**: Gemini 3.8 Flash
- **Role of the Developer**: Directed the AI through prompt specification, established requirements, reviewed generated code, defined and corrected edge-case behaviors (such as strict error messages and input mask preservation), and verified all acceptance criteria.

- **Other AI use**: Claude (Anthropic) was used outside the coding session to plan the work, draft the product documents in 
`/docs` . I reviewed and edited the content, and the application code was written by Antigravity.

---

## 6. Code Changed by Hand

-None. I detected the coding flaws and optimizations and told the agent to change those and then verified them manually. All architectural scaffolding, configuration files, pure calculation modules, unit tests, and React UI components were generated via directed instructions through the AI tool.

---

## 7. Assumptions and Regulatory Notes

1. **FY 2026-27 Slabs Source**:
   - Salaried slabs: Verified against Finance Act 2026 (FBR), effective 1 July 2026.
   - Business slabs: Verified against Finance Act 2026 / First Schedule, Income Tax Ordinance 2001.
2. **Salaried Surcharge**:
   - The former 9% surcharge on salaried income exceeding Rs 10,000,000 has been abolished under Finance Act 2026; therefore, it is not applied.
3. **Business Surcharge**:
   - Sole proprietor taxable profits exceeding Rs 10,000,000 incur a 10% surcharge calculated on the **base tax amount** (not on the gross income). The threshold is strictly above Rs 10,000,000 (`profit > 10,000,000`). At exactly Rs 10,000,000, surcharge is Rs 0.
4. **Rounding Rules**:
   - Salaried tax deductions and net take-home pay round to the nearest whole rupee (`Math.round`).
   - Businessman monthly savings reserve amounts divide annual tax by 12 and round up to the next whole rupee (`Math.ceil`), ensuring reserves never leave a deficit.
5. **Continuous Slab Boundaries**:
   - Taxable income exceeding Rs 600,000 (even by 1 rupee) enters Slab 2, with the incremental percentage applied to the amount exceeding Rs 600,000.
6. **Upper Bound**:
   - To prevent floating-point inaccuracies and numerical overflow, input amounts are capped at Rs 1,000,000,000 (1 Billion).
7. **Roles**: the two roles are selected with tabs. There is no login, and the app does not restrict which tab a person uses.
8. **Salary**: salary is treated as fully taxable. Allowances, deductions, exemptions and zakat are not handled.
9. **Business role**: the Businessman is a sole proprietor with business income only and no salary. The different surcharge for a sole proprietor who also draws a salary is not handled.
10. **Estimates**: all results are estimates, not final tax assessments.
11. **Fiscal year**: the calculator supports FY 2026-27 only (1 July 2026 to 30 June 2027). Rates are fixed in a single configuration file and there is no year selector. Salary or profit earned in other years would need that year's slabs, and next year's rates would need the file updated.

---

## 8. Where Things Are

- `docs/`: the product documents (`app-roles.md`, `jobs-to-be-done.md`, `user-stories.md`).
- `transcripts/`: the session logs from the AI coding tool:
  - `session-01.md`: formatted, readable Markdown transcript covering every prompt and response from start to finish.
  - `transcript_full.jsonl`: exact raw, unedited JSON Lines log directly exported from the tool engine containing all metadata and timestamps.
- `context/`: the assignment text and the slab files that were given to the agent as context.
- `src/`: the application source code.


---

## 9. Not Implemented

These stories are documented in `docs/user-stories.md` and marked Not implemented:

- **S-8**: comparing a current salary with a job offer side by side.
- **S-9**: entering allowances and deductions that change taxable income.
- **S-10**: estimating the loan installment that take-home pay supports (needs verified government loan terms).

