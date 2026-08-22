import { FiveYearRoiSimulation, FiveYearRoiYearProjection } from '../types';

export interface RoiSimulationParams {
  initialStreamedBase?: number; // default $128,450
  initialSubscribers?: number; // default 4,080
  blendedArpu?: number; // default $49.50
  annualGrowthRatePct?: number; // default 120% YoY
  societyFundSplitPct?: number; // default 50%
  forProfitMarginPct?: number; // default 50%
  initialCreators?: number; // default 180
  creatorGrowthFactor?: number; // scaling factor for creators
  valuationMultiple?: number; // default 8x ARR
}

export const RoiProjectionService = {
  calculate5YearProjection(params: RoiSimulationParams = {}): FiveYearRoiSimulation {
    const initialStreamedBase = params.initialStreamedBase ?? 128450;
    const initialSubscribers = params.initialSubscribers ?? 4080;
    const blendedArpu = params.blendedArpu ?? 49.50;
    const annualGrowthRatePct = params.annualGrowthRatePct ?? 120;
    const societyFundSplitPct = params.societyFundSplitPct ?? 50;
    const forProfitMarginPct = 100 - societyFundSplitPct;
    const initialCreators = params.initialCreators ?? 180;
    const valuationMultiple = params.valuationMultiple ?? 8.5;

    const projections: FiveYearRoiYearProjection[] = [];
    let cumulativeFund = initialStreamedBase;
    let currentSubscribers = initialSubscribers;
    let currentCreators = initialCreators;

    const growthMultiplier = 1 + (annualGrowthRatePct / 100);

    for (let year = 1; year <= 5; year++) {
      if (year > 1) {
        // Compound growth with modest natural tier saturation adjustment in years 4-5
        const decayFactor = year >= 4 ? 0.88 : (year === 3 ? 0.94 : 1.0);
        const adjustedGrowth = 1 + ((annualGrowthRatePct / 100) * decayFactor);
        currentSubscribers = Math.round(currentSubscribers * adjustedGrowth);
        currentCreators = Math.round(currentCreators * Math.pow(adjustedGrowth, 0.75));
      }

      const grossMrr = currentSubscribers * blendedArpu;
      const grossAnnualRevenue = grossMrr * 12;
      const societyFundAnnualPool = grossAnnualRevenue * (societyFundSplitPct / 100);
      const forProfitSoftwareRevenue = grossAnnualRevenue * (forProfitMarginPct / 100);
      
      cumulativeFund += societyFundAnnualPool;

      const averageCreatorAnnualPayout = currentCreators > 0 
        ? societyFundAnnualPool / currentCreators 
        : 0;

      const estimatedValuationLow = grossAnnualRevenue * valuationMultiple;
      const estimatedValuationHigh = grossAnnualRevenue * (valuationMultiple * 1.4);

      projections.push({
        year,
        subscribers: currentSubscribers,
        grossMrr,
        grossAnnualRevenue,
        societyFundAnnualPool,
        cumulativeSocietyFundDistributed: cumulativeFund,
        forProfitSoftwareRevenue,
        activeCreators: currentCreators,
        averageCreatorAnnualPayout,
        estimatedValuationLow,
        estimatedValuationHigh,
      });
    }

    const year5 = projections[projections.length - 1];

    return {
      initialStreamedBase,
      initialSubscribers,
      blendedArpu,
      annualGrowthRatePct,
      societyFundSplitPct,
      forProfitMarginPct,
      valuationMultiple,
      projections,
      cumulative5YearFundTotal: cumulativeFund,
      cumulative5YearCreatorPayoutsTotal: cumulativeFund,
      year5Arr: year5 ? year5.grossAnnualRevenue : 0,
      year5EstimatedValuation: year5 ? year5.estimatedValuationLow : 0,
    };
  },

  exportToMarkdown(sim: FiveYearRoiSimulation): string {
    const lines: string[] = [
      `# H.U.M.A.N. Initiative - 5-Year Stakeholder & Investor ROI Projection`,
      `**Motto**: Powering Ethical AI apps, And Paying the People`,
      `**Generated On**: ${new Date().toISOString().split('T')[0]}`,
      `**Baseline Streamed**: $${sim.initialStreamedBase.toLocaleString()}`,
      `**Blended ARPU**: $${sim.blendedArpu.toFixed(2)}/mo across 4 Apps (Tome Crafter, RLM Pro Studio, ForgeOS App Builder, RL Easy Flow)`,
      `**Covenant Fund Allocation**: ${sim.societyFundSplitPct}% to Society Fund / ${sim.forProfitMarginPct}% to For-Profit Software Company`,
      `**Annual Subscriber Growth**: ${sim.annualGrowthRatePct}% YoY`,
      ``,
      `| Metric | Year 1 | Year 2 | Year 3 | Year 4 | Year 5 |`,
      `|---|---|---|---|---|---|`,
      `| Active Subscribers | ${sim.projections.map(p => p.subscribers.toLocaleString()).join(' | ')} |`,
      `| Monthly Run-Rate (MRR) | ${sim.projections.map(p => `$${(p.grossMrr / 1000).toFixed(1)}k`).join(' | ')} |`,
      `| Gross ARR | ${sim.projections.map(p => `$${(p.grossAnnualRevenue / 1000000).toFixed(2)}M`).join(' | ')} |`,
      `| **50% Society Fund Pool** | ${sim.projections.map(p => `$${(p.societyFundAnnualPool / 1000000).toFixed(2)}M`).join(' | ')} |`,
      `| **50% For-Profit SaaS Ops** | ${sim.projections.map(p => `$${(p.forProfitSoftwareRevenue / 1000000).toFixed(2)}M`).join(' | ')} |`,
      `| Verified Creator Cohort | ${sim.projections.map(p => p.activeCreators.toLocaleString()).join(' | ')} |`,
      `| Avg Annual Payout/Creator | ${sim.projections.map(p => `$${p.averageCreatorAnnualPayout.toLocaleString('en-US', { maximumFractionDigits: 0 })}`).join(' | ')} |`,
      `| **Cumulative Fund Distributed** | ${sim.projections.map(p => `$${(p.cumulativeSocietyFundDistributed / 1000000).toFixed(2)}M`).join(' | ')} |`,
      `| **Estimated Valuation (${sim.valuationMultiple}x ARR)** | ${sim.projections.map(p => `$${(p.estimatedValuationLow / 1000000).toFixed(1)}M`).join(' | ')} |`,
      ``,
      `### Executive Summary for Investors:`,
      `- **5-Year Cumulative Creator Royalties**: $${(sim.cumulative5YearCreatorPayoutsTotal / 1000000).toFixed(2)}M streamed directly to verified human artists, authors, and maintainers.`,
      `- **Year 5 Gross ARR**: $${(sim.year5Arr / 1000000).toFixed(2)}M across the 4-app commercial software suite.`,
      `- **Defensibility & Moat**: Zero-copyleft indemnity, Fairly Trained v2 certification, and organic creator loyalty eliminate copyright lawsuits and create a non-replicable data moat.`,
    ];

    return lines.join('\n');
  },

  exportToCsv(sim: FiveYearRoiSimulation): string {
    const headers = [
      'Year',
      'Subscribers',
      'Gross_MRR_USD',
      'Gross_ARR_USD',
      'Society_Fund_50Pct_Annual_USD',
      'For_Profit_SaaS_50Pct_USD',
      'Cumulative_Society_Fund_USD',
      'Active_Creators_Count',
      'Average_Annual_Payout_Per_Creator_USD',
      'Estimated_Valuation_Low_USD',
      'Estimated_Valuation_High_USD'
    ];

    const rows = sim.projections.map(p => [
      p.year,
      p.subscribers,
      p.grossMrr.toFixed(2),
      p.grossAnnualRevenue.toFixed(2),
      p.societyFundAnnualPool.toFixed(2),
      p.forProfitSoftwareRevenue.toFixed(2),
      p.cumulativeSocietyFundDistributed.toFixed(2),
      p.activeCreators,
      p.averageCreatorAnnualPayout.toFixed(2),
      p.estimatedValuationLow.toFixed(2),
      p.estimatedValuationHigh.toFixed(2)
    ]);

    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  }
};
