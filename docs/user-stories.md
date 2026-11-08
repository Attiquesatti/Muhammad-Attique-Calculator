# User Stories

Status values are set after testing in the running app. Until then every story is marked "Not yet tested".

## S-1 (serves J-1, Salaried Employee) Status: Implemented
As a Salaried Employee, I want to enter my monthly salary and see annual tax, monthly tax and take-home pay, so that I know what I will actually receive.
- Given FY 2026-27 is shown, when I enter 100000 and calculate, then annual tax is Rs 6,000, monthly tax Rs 500 and take-home Rs 99,500.
- Given I enter 200000, then annual tax is Rs 156,000, monthly tax Rs 13,000 and take-home Rs 187,000.
- Given I enter 50000 (annual Rs 600,000), then tax is Rs 0 and take-home is Rs 50,000.
- Given I enter 1000000, then annual tax is Rs 3,174,000, monthly tax Rs 264,500 and take-home Rs 735,500.
- Given an amount that leaves a fraction of a rupee, then amounts are shown rounded to the nearest whole rupee.
- Given a result is showing, when I change the salary and calculate again, then the old result is replaced by the new one.

## S-2 (serves J-2, Salaried Employee) Status: Implemented
As a Salaried Employee, I want to see the tax worked out slab by slab, so that I can check my payslip.
- Given I enter 200000, when I open the breakdown, then I see Rs 0 on the first Rs 600,000, Rs 6,000 on the next Rs 600,000, Rs 110,000 on the next Rs 1,000,000, Rs 40,000 on the remaining Rs 200,000, and a total of Rs 156,000.
- Given my income is within the first slab, then slabs above it are not listed.

## S-3 (serves J-1 and J-3, both roles) Status: Implemented
As any user, I want a clear message when my input is invalid, so that I never get a wrong or blank result.
- Given the field is empty, when I calculate, then I see "Enter an amount" and no result.
- Given I type letters, then I see "Enter numbers only" and no result.
- Given I enter a negative number, then I see "Amount cannot be negative" and no result.
- Given I enter 0, then I see "Amount must be greater than zero" and no result.
- Given I enter more than Rs 1,000,000,000, then I see "Amount is too large" and no result.
- Given an error is showing, when I enter a valid amount and calculate, then the error disappears and the result is shown.

## S-4 (serves J-2, Salaried Employee) Status: Implemented
As a Salaried Employee, I want to see which fiscal year and rates are used, so that I know the result applies to me.
- Given I open the app, then "FY 2026-27" and the slab table are visible, and the source is named.

## S-5 (serves J-3, Businessman) Status: Implemented
As a Businessman, I want to enter my expected annual net business profit and see the estimated annual tax, so that I know what I will owe.
- Given I enter 600000, then estimated tax is Rs 0.
- Given I enter 1200000, then estimated tax is Rs 90,000.
- Given I enter 3000000, then estimated tax is Rs 590,000.
- Given I enter 5600000, then estimated tax is Rs 1,610,000.
- Given I enter 10000000, then estimated tax is Rs 3,590,000 and no surcharge is added.
- Given I enter 12000000, then tax is Rs 4,490,000, surcharge is Rs 449,000 and the total is Rs 4,939,000.
- Given any result, then it is labeled as an estimate and not a final tax liability.
- Given an invalid amount, then the messages from S-3 are shown and no result appears.

## S-6 (serves J-3, Businessman) Status: Implemented
As a Businessman, I want to see a monthly amount to set aside, so that I can save for the tax during the year.
- Given an estimated annual tax of Rs 590,000, then the monthly amount shown is Rs 49,167 (annual tax divided by 12, rounded up to the next whole rupee).
- Given an estimated annual tax of Rs 0, then the monthly amount is Rs 0.

## S-7 (serves J-1 and J-3, both roles) Status: Implemented
As any user, I want switching between the two roles to start clean, so that I never read one role's result as the other's.
- Given a result is showing on the Salaried tab, when I switch to the Businessman tab, then no result or error is shown until I calculate.
- Given I enter the same number on both tabs, then each tab shows the result from its own slab table.

## S-11 (serves J-3, Businessman) Status: Implemented
As a Businessman, I want to enter either my monthly net profit or my annual net profit with the inactive field disabled, so that I can calculate my taxes based on whichever time period I track.
- Given I am on the Businessman tab, when I enter an amount in the Monthly Net Profit field, then the Annual Net Profit field is disabled.
- Given I enter an amount in the Annual Net Profit field, then the Monthly Net Profit field is disabled.
- Given I enter a monthly profit of 250000 (annualized Rs 3,000,000), when I calculate, then the estimated annual tax is Rs 590,000 and the monthly tax to set aside is Rs 49,167.
- Given I enter a monthly profit of 100000 (annualized Rs 1,200,000), when I calculate, then the estimated annual tax is Rs 90,000 and monthly tax to set aside is Rs 7,500.
- Given an active field is cleared, then both profit fields become enabled again.
- Given an invalid amount in whichever field is active, then the error messages from S-3 are shown and no result appears.

## S-8 (serves J-1, Salaried Employee) Status: Not implemented
As a Salaried Employee, I want to compare my current salary with a job offer side by side, so that I can see which gives more take-home pay.

## S-9 (serves J-2, Salaried Employee) Status: Not implemented
As a Salaried Employee, I want to enter allowances and deductions that change my taxable income, so that the result matches my payslip.

## S-10 (serves J-4, Salaried Employee) Status: Not implemented
As a Salaried Employee, I want to see what loan installment my take-home supports, so that I can decide on a home loan. (Needs verified government loan terms.)
