import React, { useState, useMemo } from 'react';
import {
  Globe2,
  TrendingUp,
  Coins,
  FileText,
  Shield,
  CheckSquare,
  Cpu,
  Download,
  Share2,
  Sparkles,
  Layers,
  Award,
  AlertCircle,
  BarChart3,
  Sliders,
  DollarSign,
  Users,
  Zap,
  BookOpen,
  Scale,
  Code2,
  Lock,
  ArrowUpRight,
  HelpCircle,
  Flame,
  CheckCircle2,
  Briefcase,
  Search,
  Filter,
  ArrowRight,
  ArrowDownRight,
  HeartHandshake,
  Activity,
  Compass,
  Building2,
  Radio,
  PhoneCall,
  TrendingDown,
  Wheat,
  Home,
  HeartPulse,
  Truck,
  GraduationCap,
  Percent,
  Check,
  Sun,
  Rocket,
  Droplets,
  Trees,
  Crosshair,
  Atom,
  Lightbulb,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon
} from 'lucide-react';

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ComposedChart,
} from 'recharts';

import {
  GlobalMacroFundMetrics,
  BlockchainDocumentSpec,
  BlockchainNutsAndBoltsSpec,
  FounderActionItem,
  ProductivityYieldEngine,
  UniversalGuaranteedMonthlyLivingMetrics,
  CountryProductivityAccountability,
  CostOfLivingDeflationMetrics,
  DeflationaryAbundanceModel,
  GlobalPeaceDividendMetrics,
  SovereignGovernmentPledge,
  UniversalBasicLivingFundMetrics,
  GlobalProsperityYearData,
  GlobalProsperityProjectionSummary
} from '../types.ts';

interface GlobalFundMacroProps {
  onExportReport?: (reportTitle: string) => void;
}

export const GlobalFundMacroAndBlockchainArchitecture: React.FC<GlobalFundMacroProps> = ({
  onExportReport,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<
    'living-payment-stat' | 'prosperity-projection' | 'ublf-government-treaty' | 'cost-of-living-deflation' | 'peace-dividend' | 'country-accountability' | 'macro-fund' | 'productivity-engine' | 'blockchain-nuts-bolts' | 'whitepapers-legal' | 'founder-roadmap'
  >('living-payment-stat');



  // Dynamic Productivity Simulator State
  const [productivityScore, setProductivityScore] = useState<number>(88); // 0 - 100
  const [workforceParticipation, setWorkforceParticipation] = useState<number>(82); // %
  const [innovationMultiplier, setInnovationMultiplier] = useState<number>(1.25); // 0.5x to 2.0x
  const [aiAutomationAdoptionPct, setAiAutomationAdoptionPct] = useState<number>(45); // 0 - 100%
  const [selectedDocId, setSelectedDocId] = useState<string>('wp-tech-01');
  const [countryFilter, setCountryFilter] = useState<'all' | 'surge' | 'protected' | 'penalty' | 'mutual-aid'>('all');
  const [countrySearchQuery, setCountrySearchQuery] = useState<string>('');

  // Base Macro Calculations ($450 Trillion Global Net Worth benchmark)
  const GLOBAL_WEALTH_USD = 450_000_000_000_000; // $450 Trillion USD
  const FUND_INJECTION_USD = GLOBAL_WEALTH_USD * 0.01; // $4.50 Trillion USD (1.0%)
  const BASE_YIELD_RATE = 0.05; // 5.0% annual endowment yield
  const BASE_ANNUAL_YIELD_USD = FUND_INJECTION_USD * BASE_YIELD_RATE; // $225 Billion/year

  // Universal Guaranteed Monthly Living Baseline Calculations
  // Base Living Floor = $1,450 / month / citizen
  const BASE_MONTHLY_LIVING_FLOOR_USD = 1450;
  
  // Dynamic sliding scale multiplier:
  // Dynamically factors human productivity, participation, and innovation
  const dynamicProductivityMultiplier = useMemo(() => {
    const pFactor = productivityScore / 80;
    const wFactor = workforceParticipation / 75;
    return Number((pFactor * wFactor * innovationMultiplier).toFixed(3));
  }, [productivityScore, workforceParticipation, innovationMultiplier]);

  // Current Dynamic Monthly Living Payout per Citizen
  const currentMonthlyLivingPayoutUsd = useMemo(() => {
    return Math.round(BASE_MONTHLY_LIVING_FLOOR_USD * dynamicProductivityMultiplier);
  }, [BASE_MONTHLY_LIVING_FLOOR_USD, dynamicProductivityMultiplier]);

  const annualCitizenEquivalentUsd = useMemo(() => {
    return currentMonthlyLivingPayoutUsd * 12;
  }, [currentMonthlyLivingPayoutUsd]);

  const dynamicAnnualYieldUsd = useMemo(() => {
    return BASE_ANNUAL_YIELD_USD * dynamicProductivityMultiplier;
  }, [BASE_ANNUAL_YIELD_USD, dynamicProductivityMultiplier]);

  // Dynamic Pool Allocations
  const dynamicAllocations = useMemo(() => {
    return {
      creatorsUsd: dynamicAnnualYieldUsd * 0.40, // 40%
      humanDividendUsd: dynamicAnnualYieldUsd * 0.30, // 30%
      computeCommonsUsd: dynamicAnnualYieldUsd * 0.15, // 15%
      publicGoodsUsd: dynamicAnnualYieldUsd * 0.10, // 10%
      securityReserveUsd: dynamicAnnualYieldUsd * 0.05, // 5%
    };
  }, [dynamicAnnualYieldUsd]);

  // Country-by-Country Productivity, Slack Penalty & Mutual Aid Database
  const baseCountriesData: CountryProductivityAccountability[] = useMemo(() => {
    return [
      {
        countryCode: 'US',
        countryName: 'United States',
        flagEmoji: '🇺🇸',
        populationMln: 338,
        perCapitaBaselineAllocationUsd: 1450,
        actualDynamicMonthlyPayoutUsd: 1980,
        humanEffortProductivityScore: 92,
        aiAutomationDisplacementPct: 58,
        humanCausedSlackDropPct: 4,
        status: 'Surge Producer (+Bonus Pool Inflow)',
        redistributionDeltaPct: 22.4,
        redistributionAmountMonthlyUsd: 179_140_000_000,
        mutualAidReliabilityIndex: 96,
        strengths: ['Advanced AI & Software Architecture', 'High Tech Manufacturing', 'Rapid Crisis Surge Capacity']
      },
      {
        countryCode: 'DE',
        countryName: 'Germany',
        flagEmoji: '🇩🇪',
        populationMln: 84,
        perCapitaBaselineAllocationUsd: 1450,
        actualDynamicMonthlyPayoutUsd: 1890,
        humanEffortProductivityScore: 90,
        aiAutomationDisplacementPct: 52,
        humanCausedSlackDropPct: 5,
        status: 'Surge Producer (+Bonus Pool Inflow)',
        redistributionDeltaPct: 18.2,
        redistributionAmountMonthlyUsd: 36_960_000_000,
        mutualAidReliabilityIndex: 94,
        strengths: ['Precision Engineering', 'Renewable Infrastructure', 'Industrial Supply Chain Reliability']
      },
      {
        countryCode: 'JP',
        countryName: 'Japan',
        flagEmoji: '🇯🇵',
        populationMln: 124,
        perCapitaBaselineAllocationUsd: 1450,
        actualDynamicMonthlyPayoutUsd: 1920,
        humanEffortProductivityScore: 94,
        aiAutomationDisplacementPct: 62,
        humanCausedSlackDropPct: 3,
        status: 'Surge Producer (+Bonus Pool Inflow)',
        redistributionDeltaPct: 20.8,
        redistributionAmountMonthlyUsd: 58_280_000_000,
        mutualAidReliabilityIndex: 97,
        strengths: ['Robotics & Automation Hardware', 'Zero-Waste Logistics', 'High Civic Reliability']
      },
      {
        countryCode: 'KR',
        countryName: 'South Korea',
        flagEmoji: '🇰🇷',
        populationMln: 52,
        perCapitaBaselineAllocationUsd: 1450,
        actualDynamicMonthlyPayoutUsd: 2040,
        humanEffortProductivityScore: 95,
        aiAutomationDisplacementPct: 65,
        humanCausedSlackDropPct: 3,
        status: 'Surge Producer (+Bonus Pool Inflow)',
        redistributionDeltaPct: 24.5,
        redistributionAmountMonthlyUsd: 30_680_000_000,
        mutualAidReliabilityIndex: 95,
        strengths: ['Semiconductor Fabrication', 'Digital Infrastructure', 'Rapid Crisis Mobilization']
      },
      {
        countryCode: 'VN',
        countryName: 'Vietnam',
        flagEmoji: '🇻🇳',
        populationMln: 98,
        perCapitaBaselineAllocationUsd: 1450,
        actualDynamicMonthlyPayoutUsd: 1840,
        humanEffortProductivityScore: 89,
        aiAutomationDisplacementPct: 40,
        humanCausedSlackDropPct: 6,
        status: 'Surge Producer (+Bonus Pool Inflow)',
        redistributionDeltaPct: 16.0,
        redistributionAmountMonthlyUsd: 38_220_000_000,
        mutualAidReliabilityIndex: 91,
        strengths: ['Hardware Assembly', 'Agricultural Resilience', 'Rapid Workforce Upskilling']
      },
      {
        countryCode: 'CH',
        countryName: 'Switzerland',
        flagEmoji: '🇨🇭',
        populationMln: 8.8,
        perCapitaBaselineAllocationUsd: 1450,
        actualDynamicMonthlyPayoutUsd: 2150,
        humanEffortProductivityScore: 96,
        aiAutomationDisplacementPct: 55,
        humanCausedSlackDropPct: 2,
        status: 'Surge Producer (+Bonus Pool Inflow)',
        redistributionDeltaPct: 28.6,
        redistributionAmountMonthlyUsd: 6_160_000_000,
        mutualAidReliabilityIndex: 98,
        strengths: ['Global Restitution Banking', 'Cryptographic Governance', 'Sovereign Institutional Stability']
      },
      {
        countryCode: 'SG',
        countryName: 'Singapore',
        flagEmoji: '🇸🇬',
        populationMln: 5.9,
        perCapitaBaselineAllocationUsd: 1450,
        actualDynamicMonthlyPayoutUsd: 2180,
        humanEffortProductivityScore: 97,
        aiAutomationDisplacementPct: 68,
        humanCausedSlackDropPct: 2,
        status: 'Surge Producer (+Bonus Pool Inflow)',
        redistributionDeltaPct: 30.2,
        redistributionAmountMonthlyUsd: 4_307_000_000,
        mutualAidReliabilityIndex: 98,
        strengths: ['Global Logistics & Trade Routing', 'Financial Clearing', 'AI Policy Sandbox']
      },
      {
        countryCode: 'SE',
        countryName: 'Sweden',
        flagEmoji: '🇸🇪',
        populationMln: 10.5,
        perCapitaBaselineAllocationUsd: 1450,
        actualDynamicMonthlyPayoutUsd: 1880,
        humanEffortProductivityScore: 88,
        aiAutomationDisplacementPct: 48,
        humanCausedSlackDropPct: 5,
        status: 'Surge Producer (+Bonus Pool Inflow)',
        redistributionDeltaPct: 17.5,
        redistributionAmountMonthlyUsd: 4_515_000_000,
        mutualAidReliabilityIndex: 93,
        strengths: ['Clean Tech Innovation', 'Public Health Infrastructure', 'High Trust Society']
      },
      {
        countryCode: 'BR',
        countryName: 'Brazil',
        flagEmoji: '🇧🇷',
        populationMln: 215,
        perCapitaBaselineAllocationUsd: 1450,
        actualDynamicMonthlyPayoutUsd: 1450,
        humanEffortProductivityScore: 78,
        aiAutomationDisplacementPct: 38,
        humanCausedSlackDropPct: 8,
        status: 'AI Transition Protected',
        redistributionDeltaPct: 0.0,
        redistributionAmountMonthlyUsd: 0,
        mutualAidReliabilityIndex: 84,
        strengths: ['Bio-Agriculture & Food Sovereignty', 'Clean Energy Grid', 'Creative Cultural Economy']
      },
      {
        countryCode: 'IN',
        countryName: 'India',
        flagEmoji: '🇮🇳',
        populationMln: 1428,
        perCapitaBaselineAllocationUsd: 1450,
        actualDynamicMonthlyPayoutUsd: 1580,
        humanEffortProductivityScore: 86,
        aiAutomationDisplacementPct: 50,
        humanCausedSlackDropPct: 7,
        status: 'Surge Producer (+Bonus Pool Inflow)',
        redistributionDeltaPct: 8.9,
        redistributionAmountMonthlyUsd: 185_640_000_000,
        mutualAidReliabilityIndex: 89,
        strengths: ['Software Engineering Workforce', 'Generic Pharmaceuticals', 'Space & Satellite Tech']
      },
      {
        countryCode: 'NG',
        countryName: 'Nigeria',
        flagEmoji: '🇳🇬',
        populationMln: 224,
        perCapitaBaselineAllocationUsd: 1450,
        actualDynamicMonthlyPayoutUsd: 1450,
        humanEffortProductivityScore: 80,
        aiAutomationDisplacementPct: 32,
        humanCausedSlackDropPct: 9,
        status: 'AI Transition Protected',
        redistributionDeltaPct: 0.0,
        redistributionAmountMonthlyUsd: 0,
        mutualAidReliabilityIndex: 81,
        strengths: ['Fintech Adoption', 'Creative Media (Nollywood/Afrobeats)', 'Youth Demographic Dividend']
      },
      {
        countryCode: 'CA',
        countryName: 'Canada',
        flagEmoji: '🇨🇦',
        populationMln: 39,
        perCapitaBaselineAllocationUsd: 1450,
        actualDynamicMonthlyPayoutUsd: 1780,
        humanEffortProductivityScore: 85,
        aiAutomationDisplacementPct: 50,
        humanCausedSlackDropPct: 7,
        status: 'Surge Producer (+Bonus Pool Inflow)',
        redistributionDeltaPct: 12.5,
        redistributionAmountMonthlyUsd: 12_870_000_000,
        mutualAidReliabilityIndex: 92,
        strengths: ['Clean Energy & Minerals', 'AI Research Labs', 'Disaster Relief Resources']
      },
      {
        countryCode: 'AU',
        countryName: 'Australia',
        flagEmoji: '🇦🇺',
        populationMln: 26,
        perCapitaBaselineAllocationUsd: 1450,
        actualDynamicMonthlyPayoutUsd: 1820,
        humanEffortProductivityScore: 87,
        aiAutomationDisplacementPct: 46,
        humanCausedSlackDropPct: 6,
        status: 'Surge Producer (+Bonus Pool Inflow)',
        redistributionDeltaPct: 14.8,
        redistributionAmountMonthlyUsd: 9_620_000_000,
        mutualAidReliabilityIndex: 93,
        strengths: ['Critical Raw Materials', 'Solar & Hydrogen Generation', 'Pacific Humanitarian Air-Bridge']
      },
      {
        countryCode: 'REG-X',
        countryName: 'Hypothetical Slacking Sector/Region Alpha',
        flagEmoji: '⚠️',
        populationMln: 45,
        perCapitaBaselineAllocationUsd: 1450,
        actualDynamicMonthlyPayoutUsd: 1080,
        humanEffortProductivityScore: 48,
        aiAutomationDisplacementPct: 22,
        humanCausedSlackDropPct: 34,
        status: 'Slack Penalty (Redistributed Outward)',
        redistributionDeltaPct: -25.5,
        redistributionAmountMonthlyUsd: -16_650_000_000,
        mutualAidReliabilityIndex: 42,
        strengths: ['Unused Latent Industrial Capacity', 'Awaiting Civic Reorganization']
      },
      {
        countryCode: 'REG-Y',
        countryName: 'Hypothetical Slacking Sector/Region Beta',
        flagEmoji: '⚠️',
        populationMln: 30,
        perCapitaBaselineAllocationUsd: 1450,
        actualDynamicMonthlyPayoutUsd: 950,
        humanEffortProductivityScore: 41,
        aiAutomationDisplacementPct: 18,
        humanCausedSlackDropPct: 42,
        status: 'Slack Penalty (Redistributed Outward)',
        redistributionDeltaPct: -34.5,
        redistributionAmountMonthlyUsd: -15_000_000_000,
        mutualAidReliabilityIndex: 38,
        strengths: ['Pending Workforce Re-engagement Program']
      }
    ];
  }, []);

  // Filtered Countries
  const filteredCountries = useMemo(() => {
    return baseCountriesData.filter((country) => {
      const matchesSearch =
        country.countryName.toLowerCase().includes(countrySearchQuery.toLowerCase()) ||
        country.countryCode.toLowerCase().includes(countrySearchQuery.toLowerCase()) ||
        country.strengths.some((s) => s.toLowerCase().includes(countrySearchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      if (countryFilter === 'surge') return country.status === 'Surge Producer (+Bonus Pool Inflow)';
      if (countryFilter === 'protected') return country.status === 'AI Transition Protected';
      if (countryFilter === 'penalty') return country.status === 'Slack Penalty (Redistributed Outward)';
      if (countryFilter === 'mutual-aid') return country.mutualAidReliabilityIndex >= 90;

      return true;
    });
  }, [baseCountriesData, countryFilter, countrySearchQuery]);

  // Aggregate Total Penalized Slack Surrendered to Global Bonus Pool
  const totalPenalizedSlackTransferredMonthlyUsd = useMemo(() => {
    return baseCountriesData
      .filter((c) => c.redistributionAmountMonthlyUsd < 0)
      .reduce((acc, c) => acc + Math.abs(c.redistributionAmountMonthlyUsd), 0);
  }, [baseCountriesData]);

  // =========================================================================
  // COST OF LIVING DEFLATIONARY ABUNDANCE DATA & SIMULATOR
  // =========================================================================
  // Baseline household expenditure before technology commons & global fund
  const [energyDeflationMultiplier, setEnergyDeflationMultiplier] = useState<number>(0.85); // 85% deflation
  const [agriFoodDeflationMultiplier, setAgriFoodDeflationMultiplier] = useState<number>(0.65); // 65% deflation
  const [healthBiotechDeflationMultiplier, setHealthBiotechDeflationMultiplier] = useState<number>(0.75); // 75% deflation
  const [housingDeflationMultiplier, setHousingDeflationMultiplier] = useState<number>(0.55); // 55% deflation
  const [computeEduDeflationMultiplier, setComputeEduDeflationMultiplier] = useState<number>(0.92); // 92% deflation
  const [logisticsDeflationMultiplier, setLogisticsDeflationMultiplier] = useState<number>(0.60); // 60% deflation

  // Sector-by-Sector Cost of Living Deflation Matrix
  const costOfLivingBreakdown: CostOfLivingDeflationMetrics[] = useMemo(() => {
    return [
      {
        sector: 'Clean Energy & Power Grids',
        category: 'Energy',
        iconName: 'Zap',
        baselineAnnualCostUsd: 4800,
        postFundAbundanceCostUsd: Math.round(4800 * (1 - energyDeflationMultiplier)),
        deflationPct: Math.round(energyDeflationMultiplier * 100),
        primaryDriver: 'Zero Marginal Cost Solar, Fission & Geothermal Commons',
        mechanism: 'Decentralized smart-grid micro-generators funded by 15% Compute & Energy Commons pool; eliminates fossil utility monopolies.',
        annualSavingsPerFamilyUsd: Math.round(4800 * energyDeflationMultiplier),
      },
      {
        sector: 'Nutritional Food & Autonomous Agriculture',
        category: 'Food & Agriculture',
        iconName: 'Wheat',
        baselineAnnualCostUsd: 9600,
        postFundAbundanceCostUsd: Math.round(9600 * (1 - agriFoodDeflationMultiplier)),
        deflationPct: Math.round(agriFoodDeflationMultiplier * 100),
        primaryDriver: 'Precision Robotics, Vertical Hydroponics & Seed Commons',
        mechanism: 'AI-guided robotic planting and harvesting with zero IP royalty fees on bio-diverse seed strains and decentralized distribution.',
        annualSavingsPerFamilyUsd: Math.round(9600 * agriFoodDeflationMultiplier),
      },
      {
        sector: 'Healthcare, Therapeutics & Longevity',
        category: 'Healthcare & Biotech',
        iconName: 'HeartPulse',
        baselineAnnualCostUsd: 11200,
        postFundAbundanceCostUsd: Math.round(11200 * (1 - healthBiotechDeflationMultiplier)),
        deflationPct: Math.round(healthBiotechDeflationMultiplier * 100),
        primaryDriver: 'Open-Source AI Drug Discovery & Automated Diagnostics',
        mechanism: 'AI-synthesized open molecular patents + automated bedside diagnostic arrays remove 90% of pharmaceutical markups and hospital billing overhead.',
        annualSavingsPerFamilyUsd: Math.round(11200 * healthBiotechDeflationMultiplier),
      },
      {
        sector: 'Housing Construction & Smart Materials',
        category: 'Housing & Construction',
        iconName: 'Home',
        baselineAnnualCostUsd: 15600,
        postFundAbundanceCostUsd: Math.round(15600 * (1 - housingDeflationMultiplier)),
        deflationPct: Math.round(housingDeflationMultiplier * 100),
        primaryDriver: '3D Modular Automated Prefabrication & Local Sourcing',
        mechanism: 'Autonomous robotic construction cranes and open CAD architectural blueprints reduce residential build time from 14 months to 6 days.',
        annualSavingsPerFamilyUsd: Math.round(15600 * housingDeflationMultiplier),
      },
      {
        sector: 'Education, Global Compute & AI Intelligence',
        category: 'Education & Compute',
        iconName: 'GraduationCap',
        baselineAnnualCostUsd: 6500,
        postFundAbundanceCostUsd: Math.round(6500 * (1 - computeEduDeflationMultiplier)),
        deflationPct: Math.round(computeEduDeflationMultiplier * 100),
        primaryDriver: 'Universal Open-Weights LLMs & Sovereign Compute Nodes',
        mechanism: '15% compute commons pool provides free frontier AI models and 1-on-1 personalized master tutors for every student and creator on Earth.',
        annualSavingsPerFamilyUsd: Math.round(6500 * computeEduDeflationMultiplier),
      },
      {
        sector: 'Autonomous Logistics & Public Transit',
        category: 'Logistics & Mobility',
        iconName: 'Truck',
        baselineAnnualCostUsd: 5800,
        postFundAbundanceCostUsd: Math.round(5800 * (1 - logisticsDeflationMultiplier)),
        deflationPct: Math.round(logisticsDeflationMultiplier * 100),
        primaryDriver: 'EV Autonomous Freight Fleets & High-Speed Rail Corridors',
        mechanism: 'Coordinated driverless freight routing and solar-powered magnetic transit reduce cargo shipping costs to sub-penny ton-miles.',
        annualSavingsPerFamilyUsd: Math.round(5800 * logisticsDeflationMultiplier),
      },
    ];
  }, [
    energyDeflationMultiplier,
    agriFoodDeflationMultiplier,
    healthBiotechDeflationMultiplier,
    housingDeflationMultiplier,
    computeEduDeflationMultiplier,
    logisticsDeflationMultiplier,
  ]);

  // Aggregate Macro Deflation Model
  const deflationModel: DeflationaryAbundanceModel = useMemo(() => {
    const baselineTotal = costOfLivingBreakdown.reduce((sum, item) => sum + item.baselineAnnualCostUsd, 0); // $53,500
    const abundanceTotal = costOfLivingBreakdown.reduce((sum, item) => sum + item.postFundAbundanceCostUsd, 0);
    const savingsTotal = baselineTotal - abundanceTotal;
    const netDeflation = Number(((savingsTotal / baselineTotal) * 100).toFixed(1));
    const purchasingMultiplier = Number((baselineTotal / Math.max(1, abundanceTotal)).toFixed(2));

    return {
      totalAverageHouseholdSpendBaselineUsd: baselineTotal,
      totalAverageHouseholdSpendAbundanceUsd: abundanceTotal,
      netCostOfLivingReductionPct: netDeflation,
      effectivePurchasingPowerMultiplier: purchasingMultiplier,
      disposableSurplusAnnualUsd: savingsTotal,
      macroPillars: {
        energyMarginalCostZero: 'Solar, modular fission, and high-efficiency battery grids drive marginal electricity costs toward zero.',
        autonomousAgricultureAndDistribution: 'Robotic precision harvesting and local vertical farms remove middlemen margins and freight waste.',
        decentralizedOpenSourceBiotech: 'Open drug formulation libraries replace patent monopolies with generic local synthesis.',
        modularAutomatedBuilding: 'Automated 3D site assembly collapses residential and civil construction costs by over 50%.',
        freeComputeCommonsAndUniversalIntelligence: 'H.U.M.A.N. Initiative 15% compute endowment guarantees universal frontier intelligence for all humanity.',
      },
    };
  }, [costOfLivingBreakdown]);

  // =========================================================================
  // GLOBAL PEACE DIVIDEND & DISARMAMENT-TO-CONSTRUCTION ENGINE
  // =========================================================================
  // Total global annual military expenditures: ~$2.44 Trillion USD (verified SIPRI benchmark data)
  const GLOBAL_ANNUAL_MILITARY_BUDGET_USD = 2_440_000_000_000;
  const [militaryReallocationPct, setMilitaryReallocationPct] = useState<number>(75); // default 75% redirected from destruction to construction

  const peaceDividendMetrics: GlobalPeaceDividendMetrics = useMemo(() => {
    const reallocatedCapital = GLOBAL_ANNUAL_MILITARY_BUDGET_USD * (militaryReallocationPct / 100);
    // Calculated across ~4.2 billion adult global working age population
    const eligibleAdultPopulation = 4_200_000_000;
    const perCapitaAnnual = Math.round(reallocatedCapital / eligibleAdultPopulation);
    const perCapitaMonthly = Math.round(perCapitaAnnual / 12);

    return {
      currentGlobalAnnualMilitarySpendUsd: GLOBAL_ANNUAL_MILITARY_BUDGET_USD,
      reallocatedAnnualCapitalUsd: reallocatedCapital,
      reallocationPct: militaryReallocationPct,
      perCapitaAnnualPeaceBonusUsd: perCapitaAnnual,
      perCapitaMonthlyPeaceBonusUsd: perCapitaMonthly,
      globalMegaProjectsFunded: [
        {
          title: 'Global High-Speed Fusion & Geothermal Grid',
          category: 'Energy & Fusion',
          annualCostUsd: 380_000_000_000,
          timelineYears: 7,
          impactDescription: 'Redirects ballistic missile propulsion and high-energy physics teams into commercially scalable modular fusion reactors and deep-earth 15km geothermal borehole grids.',
          unlockedCivilizationMilestone: 'Type I Kardashev Energy Sovereignty (Abundant clean power for 10 Billion humans)',
          iconName: 'Atom',
        },
        {
          title: 'Planetary Atmospheric Carbon Sinks & Biome Reforestation',
          category: 'Planetary Reforestation & Biosphere',
          annualCostUsd: 220_000_000_000,
          timelineYears: 10,
          impactDescription: 'Deploys autonomous planting fleets and biochar kilns across 1.2 billion hectares of degraded land to restore prehistoric biodiversity and reverse ecological degradation.',
          unlockedCivilizationMilestone: 'Complete Climate Stability & Rewilded Continental Wildlife Corridors',
          iconName: 'Trees',
        },
        {
          title: 'Transcontinental Magnetic Levitation Transit Network',
          category: 'Global High-Speed Transit',
          annualCostUsd: 450_000_000_000,
          timelineYears: 12,
          impactDescription: 'Converts armored tank factories and military logistics corridors into seamless 600 km/h vacuum-tube maglev train systems linking Africa, Eurasia, and the Americas.',
          unlockedCivilizationMilestone: 'Border-Free Global Mobility (Travel between any two world cities in under 8 hours)',
          iconName: 'Rocket',
        },
        {
          title: 'Universal Desalination, Clean Aquifer & Ocean Restoration',
          category: 'Clean Water & Ocean Restoration',
          annualCostUsd: 190_000_000_000,
          timelineYears: 5,
          impactDescription: 'Converts submarine nuclear propulsion and naval fleets into mega-scale solar graphene water desalination plants, turning deserts into lush arable orchards.',
          unlockedCivilizationMilestone: 'Zero Water Scarcity & 100% Elimination of Waterborne Pathogens Worldwide',
          iconName: 'Droplets',
        },
        {
          title: 'Global Autonomous Space Exploration & Asteroid Mining',
          category: 'Space Exploration & Planetary Defense',
          annualCostUsd: 320_000_000_000,
          timelineYears: 15,
          impactDescription: 'Redirects intercontinental ballistic missile telemetry and orbital surveillance satellites into permanent lunar research colonies, Mars habitat terraforming, and platinum-group asteroid harvesting.',
          unlockedCivilizationMilestone: 'Multi-Planetary Human Civilization & Outer-Solar Resource Abundance',
          iconName: 'Rocket',
        },
        {
          title: 'Planetary Pathogen Eradication & Universal Nanomedicine',
          category: 'Disease Eradication',
          annualCostUsd: 240_000_000_000,
          timelineYears: 6,
          impactDescription: 'Repurposes chemical and biological defense laboratories into universal mRNA disease vaccines, cancer antigen synthesis hubs, and cellular rejuvenation therapies.',
          unlockedCivilizationMilestone: 'Eradication of All Infectious Pandemics, Cancer, and Neurodegenerative Decay',
          iconName: 'HeartPulse',
        },
      ],
      divertedHumanGenius: {
        aerospaceWeaponsToSpaceExploration: 'Thousands of top aerospace rocket scientists and supersonic engineers shift from designing cruise missiles to crafting deep-space exploration vessels and interplanetary propulsion.',
        cyberWarfareToUniversalCyberSecurity: 'Offensive state-sponsored malware units transition into open-source cryptographic guardians, protecting human civil liberties and decentralized identity.',
        explosivesAndBallisticsToGeothermalAndDeepMining: 'Precision explosive and ballistic engineering is repurposed into micro-fracturing deep subterranean geothermal shafts and tunnel-boring machines.',
        surveillanceInfrastructureToGlobalEcosystemMonitoring: 'Spy satellite constellations and battlefield drone networks pivot to tracking oceanic acidification, illegal deforestation, and wildlife migrations in real-time.',
      },
    };
  }, [militaryReallocationPct]);

  // =========================================================================
  // UNIVERSAL BASIC LIVING FUND (UBLF) & SOVEREIGN GOVERNMENTS SYSTEM
  // Shift the load from corporate/oligarchic greed to genuine governance of the people
  // =========================================================================
  const [globalGdpPledgeRatePct, setGlobalGdpPledgeRatePct] = useState<number>(1.8); // 0.5% to 5.0% of GDP
  const [bureaucracyEliminationRatePct, setBureaucracyEliminationRatePct] = useState<number>(85); // 85% overhead removed by blockchain
  const [speculativeGreedTaxRatePct, setSpeculativeGreedTaxRatePct] = useState<number>(2.5); // 2.5% tax on high-frequency speculative gambling
  const [selectedGovCountry, setSelectedGovCountry] = useState<string>('ALL');

  // Sovereign Government Base Pledge Database
  const sovereignGovernmentData: SovereignGovernmentPledge[] = useMemo(() => {
    return [
      {
        countryCode: 'US',
        countryName: 'United States of America',
        flagEmoji: '🇺🇸',
        gdpAnnualTrillionUsd: 28.78,
        pledgeRatePct: globalGdpPledgeRatePct,
        annualContributionUsd: 28.78 * 1_000_000_000_000 * (globalGdpPledgeRatePct / 100),
        monthlyDisbursementToUBLFUsd: (28.78 * 1_000_000_000_000 * (globalGdpPledgeRatePct / 100)) / 12,
        populationMillion: 338,
        citizenMonthlyFloorUsd: 1950,
        treatyStatus: 'Ratified Treaty',
        shiftFromGreedMetric: {
          divertedLobbyingAndWasteUsd: 480_000_000_000,
          administrativeBureaucracySavedUsd: 390_000_000_000,
          directCitizenYieldEfficiencyPct: 98.6,
        },
        civicPillarsGuaranteed: [
          'Direct Universal Citizen Dividend Account (EVM/Passkey)',
          'Zero Means-Testing Bureaucracy or Degrading Welfare Inquisitions',
          'Protection Against Corporate Price-Gouging & AI Job Displacement'
        ]
      },
      {
        countryCode: 'EU',
        countryName: 'European Union (Consortium)',
        flagEmoji: '🇪🇺',
        gdpAnnualTrillionUsd: 19.35,
        pledgeRatePct: globalGdpPledgeRatePct,
        annualContributionUsd: 19.35 * 1_000_000_000_000 * (globalGdpPledgeRatePct / 100),
        monthlyDisbursementToUBLFUsd: (19.35 * 1_000_000_000_000 * (globalGdpPledgeRatePct / 100)) / 12,
        populationMillion: 448,
        citizenMonthlyFloorUsd: 1820,
        treatyStatus: 'Ratified Treaty',
        shiftFromGreedMetric: {
          divertedLobbyingAndWasteUsd: 290_000_000_000,
          administrativeBureaucracySavedUsd: 260_000_000_000,
          directCitizenYieldEfficiencyPct: 99.1,
        },
        civicPillarsGuaranteed: [
          'Constitutional Right to Guaranteed Baseline Living',
          'Elimination of Fragmented Social Security Red Tape',
          'Decentralized Energy & Universal Cleanroom Compute Rights'
        ]
      },
      {
        countryCode: 'JP',
        countryName: 'Japan',
        flagEmoji: '🇯🇵',
        gdpAnnualTrillionUsd: 4.21,
        pledgeRatePct: globalGdpPledgeRatePct,
        annualContributionUsd: 4.21 * 1_000_000_000_000 * (globalGdpPledgeRatePct / 100),
        monthlyDisbursementToUBLFUsd: (4.21 * 1_000_000_000_000 * (globalGdpPledgeRatePct / 100)) / 12,
        populationMillion: 124,
        citizenMonthlyFloorUsd: 1890,
        treatyStatus: 'Ratified Treaty',
        shiftFromGreedMetric: {
          divertedLobbyingAndWasteUsd: 75_000_000_000,
          administrativeBureaucracySavedUsd: 68_000_000_000,
          directCitizenYieldEfficiencyPct: 98.9,
        },
        civicPillarsGuaranteed: [
          'Elder Care & Demographic Longevity Dividend',
          'Autonomous Robotic Harvest Distribution to Every Household',
          'Youth Creation & Innovation Stipends'
        ]
      },
      {
        countryCode: 'IN',
        countryName: 'India',
        flagEmoji: '🇮🇳',
        gdpAnnualTrillionUsd: 3.94,
        pledgeRatePct: globalGdpPledgeRatePct,
        annualContributionUsd: 3.94 * 1_000_000_000_000 * (globalGdpPledgeRatePct / 100),
        monthlyDisbursementToUBLFUsd: (3.94 * 1_000_000_000_000 * (globalGdpPledgeRatePct / 100)) / 12,
        populationMillion: 1428,
        citizenMonthlyFloorUsd: 1450,
        treatyStatus: 'Parliamentary Review',
        shiftFromGreedMetric: {
          divertedLobbyingAndWasteUsd: 110_000_000_000,
          administrativeBureaucracySavedUsd: 140_000_000_000,
          directCitizenYieldEfficiencyPct: 97.8,
        },
        civicPillarsGuaranteed: [
          'Eradication of Extreme Poverty via Direct Mobile UPI/Passkey Wallets',
          'Agrarian Transition Fund & Clean Irrigation Infrastructure',
          'Open-Source Educational Compute Access for 500M+ Youth'
        ]
      },
      {
        countryCode: 'GB',
        countryName: 'United Kingdom',
        flagEmoji: '🇬🇧',
        gdpAnnualTrillionUsd: 3.33,
        pledgeRatePct: globalGdpPledgeRatePct,
        annualContributionUsd: 3.33 * 1_000_000_000_000 * (globalGdpPledgeRatePct / 100),
        monthlyDisbursementToUBLFUsd: (3.33 * 1_000_000_000_000 * (globalGdpPledgeRatePct / 100)) / 12,
        populationMillion: 67,
        citizenMonthlyFloorUsd: 1840,
        treatyStatus: 'Ratified Treaty',
        shiftFromGreedMetric: {
          divertedLobbyingAndWasteUsd: 55_000_000_000,
          administrativeBureaucracySavedUsd: 48_000_000_000,
          directCitizenYieldEfficiencyPct: 98.7,
        },
        civicPillarsGuaranteed: [
          'NHS Reinforcement with Free AI Diagnostic Prescriptions',
          'Complete Elimination of Fuel & Utility Poverty',
          'Creator & Artisan Cultural Endowment Stream'
        ]
      },
      {
        countryCode: 'BR',
        countryName: 'Brazil',
        flagEmoji: '🇧🇷',
        gdpAnnualTrillionUsd: 2.17,
        pledgeRatePct: globalGdpPledgeRatePct,
        annualContributionUsd: 2.17 * 1_000_000_000_000 * (globalGdpPledgeRatePct / 100),
        monthlyDisbursementToUBLFUsd: (2.17 * 1_000_000_000_000 * (globalGdpPledgeRatePct / 100)) / 12,
        populationMillion: 215,
        citizenMonthlyFloorUsd: 1520,
        treatyStatus: 'Bilateral Accord',
        shiftFromGreedMetric: {
          divertedLobbyingAndWasteUsd: 42_000_000_000,
          administrativeBureaucracySavedUsd: 38_000_000_000,
          directCitizenYieldEfficiencyPct: 98.1,
        },
        civicPillarsGuaranteed: [
          'Amazon Rainforest Stewardship Citizen Royalty Payouts',
          'Direct Nutritional & Family Health Guarantees',
          'Regenerative Agriculture Micro-Grant Streams'
        ]
      },
      {
        countryCode: 'CA',
        countryName: 'Canada',
        flagEmoji: '🇨🇦',
        gdpAnnualTrillionUsd: 2.14,
        pledgeRatePct: globalGdpPledgeRatePct,
        annualContributionUsd: 2.14 * 1_000_000_000_000 * (globalGdpPledgeRatePct / 100),
        monthlyDisbursementToUBLFUsd: (2.14 * 1_000_000_000_000 * (globalGdpPledgeRatePct / 100)) / 12,
        populationMillion: 39,
        citizenMonthlyFloorUsd: 1880,
        treatyStatus: 'Ratified Treaty',
        shiftFromGreedMetric: {
          divertedLobbyingAndWasteUsd: 35_000_000_000,
          administrativeBureaucracySavedUsd: 31_000_000_000,
          directCitizenYieldEfficiencyPct: 99.0,
        },
        civicPillarsGuaranteed: [
          'Indigenous Sovereignty Resource Dividend',
          'Housing Affordability Automated Build Commons',
          'Clean Arctic Energy Grid Protection'
        ]
      },
      {
        countryCode: 'AU',
        countryName: 'Australia',
        flagEmoji: '🇦🇺',
        gdpAnnualTrillionUsd: 1.72,
        pledgeRatePct: globalGdpPledgeRatePct,
        annualContributionUsd: 1.72 * 1_000_000_000_000 * (globalGdpPledgeRatePct / 100),
        monthlyDisbursementToUBLFUsd: (1.72 * 1_000_000_000_000 * (globalGdpPledgeRatePct / 100)) / 12,
        populationMillion: 26,
        citizenMonthlyFloorUsd: 1910,
        treatyStatus: 'Ratified Treaty',
        shiftFromGreedMetric: {
          divertedLobbyingAndWasteUsd: 28_000_000_000,
          administrativeBureaucracySavedUsd: 25_000_000_000,
          directCitizenYieldEfficiencyPct: 99.2,
        },
        civicPillarsGuaranteed: [
          'Solar Mega-Array Green Hydrogen Public Commons',
          'Great Barrier Reef Restoration Living Stipends',
          'First Nations Cultural Heritage Perpetual Restitution'
        ]
      },
      {
        countryCode: 'GLOBAL_REST',
        countryName: 'All Other UN Member States (Rest of World)',
        flagEmoji: '🌐',
        gdpAnnualTrillionUsd: 38.30,
        pledgeRatePct: globalGdpPledgeRatePct,
        annualContributionUsd: 38.30 * 1_000_000_000_000 * (globalGdpPledgeRatePct / 100),
        monthlyDisbursementToUBLFUsd: (38.30 * 1_000_000_000_000 * (globalGdpPledgeRatePct / 100)) / 12,
        populationMillion: 5300,
        citizenMonthlyFloorUsd: 1450,
        treatyStatus: 'Simulated Pledge',
        shiftFromGreedMetric: {
          divertedLobbyingAndWasteUsd: 620_000_000_000,
          administrativeBureaucracySavedUsd: 580_000_000_000,
          directCitizenYieldEfficiencyPct: 97.5,
        },
        civicPillarsGuaranteed: [
          'Global Baseline Dignity & Hunger Eradication',
          'Universal Clean Water & Decentralized Solar Desalination',
          'Protection from Exploitative Neocolonial Debt Traps'
        ]
      }
    ];
  }, [globalGdpPledgeRatePct]);

  // Aggregate Macro Metrics for UBLF
  const ublfMetrics: UniversalBasicLivingFundMetrics = useMemo(() => {
    const totalGlobalGdp = sovereignGovernmentData.reduce((acc, c) => acc + c.gdpAnnualTrillionUsd, 0) * 1_000_000_000_000;
    const totalAnnualContributions = sovereignGovernmentData.reduce((acc, c) => acc + c.annualContributionUsd, 0);
    const totalDivertedWaste = sovereignGovernmentData.reduce((acc, c) => acc + c.shiftFromGreedMetric.divertedLobbyingAndWasteUsd, 0);
    const totalBureaucracySaved = sovereignGovernmentData.reduce((acc, c) => acc + c.shiftFromGreedMetric.administrativeBureaucracySavedUsd, 0) * (bureaucracyEliminationRatePct / 100);
    const totalSpeculativeGreedCaptured = (totalGlobalGdp * (speculativeGreedTaxRatePct / 100));
    const totalCombinedPoolAnnual = totalAnnualContributions + totalSpeculativeGreedCaptured + totalBureaucracySaved;
    const monthlyDistributable = totalCombinedPoolAnnual / 12;

    return {
      totalGlobalGdpBaselineUsd: totalGlobalGdp,
      participatingGovernmentsCount: 195,
      aggregateAnnualGovernmentContributionsUsd: totalCombinedPoolAnnual,
      monthlyGlobalDistributableFundUsd: monthlyDistributable,
      globalCitizenBeneficiariesCount: 8_100_000_000,
      baseMonthlyLivingFloorPerCitizenUsd: Math.round(1450 * (globalGdpPledgeRatePct / 1.5) * (1 + speculativeGreedTaxRatePct / 5)),
      greedShiftRatio: {
        capitalDivertedFromSpeculativeGreedUsd: totalSpeculativeGreedCaptured + totalDivertedWaste,
        bureaucracyOverheadEliminatedUsd: totalBureaucracySaved,
        directCitizenValueRatio: '98.8% Direct Liquid Payout to Citizens',
      },
      governanceProtocols: [
        {
          title: 'The Sovereign Anti-Greed Covenant',
          axiom: 'Wealth is created by human civilization collectively and must guarantee the baseline survival and dignity of all members.',
          mechanism: 'Mandates an immutable 1.8% - 3.5% GDP automated sovereign treaty smart contract routed directly to citizen Passkey wallets.',
          iconName: 'Shield',
        },
        {
          title: 'Total Decapitation of Bureaucratic Parasitism',
          axiom: 'No citizen should ever have to beg, prove poverty, or navigate punitive paperwork to afford food, medicine, and shelter.',
          mechanism: 'Smart contract code replaces hundreds of billions in wasteful means-testing agencies, transferring 99% of funds directly to people.',
          iconName: 'Zap',
        },
        {
          title: 'Speculative Friction to Social Production',
          axiom: 'Speculative algorithmic casino gambling that creates zero real goods is harnessed to fund real human lives and innovation.',
          mechanism: 'A micro-friction levy on predatory automated financial engineering flows straight into the Universal Basic Living Fund.',
          iconName: 'TrendingUp',
        },
        {
          title: 'Civilization Peace & Diligence Harmony',
          axiom: 'Governments compete not in military destruction, but in civilizational quality of life, scientific discovery, and mutual aid.',
          mechanism: 'Nations with superior civic participation and zero corruption receive bonus dividend allocations for cultural mega-projects.',
          iconName: 'HeartHandshake',
        },
      ],
    };
  }, [sovereignGovernmentData, bureaucracyEliminationRatePct, speculativeGreedTaxRatePct, globalGdpPledgeRatePct]);

  // =========================================================================
  // 10-YEAR GLOBAL PROSPERITY PROJECTION (50% ROYALTY SPLIT) ENGINE
  // =========================================================================
  const [prosperityScenario, setProsperityScenario] = useState<'Baseline Accord' | 'Accelerated Treaty' | 'Conservative Organic'>('Baseline Accord');
  const [globalRoyaltySplitPct, setGlobalRoyaltySplitPct] = useState<number>(50); // 50% immutable covenant
  const [chartViewMetric, setChartViewMetric] = useState<'all' | 'poverty' | 'royalties' | 'security'>('all');
  const [selectedHoverYear, setSelectedHoverYear] = useState<number | null>(null);

  // 10-Year Simulation Data
  const tenYearProsperityData: GlobalProsperityYearData[] = useMemo(() => {
    const startYear = 2026;
    const data: GlobalProsperityYearData[] = [];

    const speedFactor = prosperityScenario === 'Accelerated Treaty' ? 1.35 : prosperityScenario === 'Conservative Organic' ? 0.75 : 1.0;
    const splitMultiplier = globalRoyaltySplitPct / 50;

    let cumulativeRoyalties = 0;

    for (let i = 1; i <= 10; i++) {
      const calendarYear = startYear + i - 1;
      const t = (i - 1) * speedFactor;
      
      // S-Curve adoption rate of the 50% global royalty split protocol across digital platforms and AI ecosystems
      const baseAdoption = 14 + (83 / (1 + Math.exp(-0.72 * (t - 3.8))));
      const adoptionPct = Math.min(98.8, Math.max(14, Number((baseAdoption * Math.min(1.12, splitMultiplier)).toFixed(1))));

      // Extreme poverty rate (% under $2.15/day): plunges from 8.5% down to 0.15%
      const extremePoverty = Math.max(0.12, Number((8.5 * Math.exp(-0.43 * t * Math.max(0.7, splitMultiplier))).toFixed(2)));

      // Moderate poverty / cost-of-living distress rate (% under basic dignity threshold): drops from 28.4% down to 1.9%
      const moderatePoverty = Math.max(1.85, Number((28.4 * Math.exp(-0.31 * t * Math.max(0.7, splitMultiplier))).toFixed(2)));

      // Annual royalties & living payouts distributed in Trillions USD (e.g. $0.52T in Year 1 up to $5.88T in Year 10)
      const annualRoyalties = Number(((adoptionPct / 100) * 5.95 * splitMultiplier).toFixed(2));
      cumulativeRoyalties += annualRoyalties;

      // Median citizen monthly living floor USD
      const monthlyFloor = Math.round(1450 + (adoptionPct / 100) * 1050 * splitMultiplier);

      // Living Security Index (0-100)
      const securityIndex = Math.min(99, Math.round(26 + (adoptionPct / 100) * 71 * splitMultiplier));

      // Child labor eradication percentage
      const childLaborReduction = Math.min(99.6, Number(((1 - (extremePoverty / 8.5)) * 100).toFixed(1)));

      data.push({
        year: i,
        calendarYear,
        globalRoyaltyAdoptionPct: adoptionPct,
        extremePovertyRatePct: extremePoverty,
        moderatePovertyRatePct: moderatePoverty,
        annualRoyaltiesDistributedTrillionUsd: annualRoyalties,
        cumulativeRoyaltiesDistributedTrillionUsd: Number(cumulativeRoyalties.toFixed(2)),
        medianCitizenMonthlyLivingFloorUsd: monthlyFloor,
        globalLivingSecurityIndex: securityIndex,
        childLaborReductionPct: childLaborReduction,
      });
    }

    return data;
  }, [prosperityScenario, globalRoyaltySplitPct]);

  // Aggregate 10-Year Summary
  const prosperitySummary: GlobalProsperityProjectionSummary = useMemo(() => {
    const lastYear = tenYearProsperityData[tenYearProsperityData.length - 1];
    const firstYear = tenYearProsperityData[0];
    const extremeReduction = Number((((firstYear.extremePovertyRatePct - lastYear.extremePovertyRatePct) / firstYear.extremePovertyRatePct) * 100).toFixed(1));
    const moderateReduction = Number((((firstYear.moderatePovertyRatePct - lastYear.moderatePovertyRatePct) / firstYear.moderatePovertyRatePct) * 100).toFixed(1));

    return {
      adoptionScenario: prosperityScenario,
      tenYearTotalRoyaltyDistributedTrillionUsd: lastYear.cumulativeRoyaltiesDistributedTrillionUsd,
      extremePovertyEliminatedPct: extremeReduction,
      moderatePovertyReductionPct: moderateReduction,
      livesLiftedAboveLivingFloorMillion: 740,
      royaltySplitRatioDescription: `${globalRoyaltySplitPct}% Creator & Citizen Covenant Standard`,
    };
  }, [tenYearProsperityData, prosperityScenario, globalRoyaltySplitPct]);

  // Founder Checklist State (Persisted in Component State)

  const [actionItems, setActionItems] = useState<FounderActionItem[]>([
    {
      id: 'fa-01',
      phase: 'Phase 1: Legal & Foundation Incorporation',
      title: 'Establish H.U.M.A.N. Initiative Foundation (Zug, Switzerland / Cayman VASP)',
      description: 'Form the non-profit sovereign supervisory foundation entity with strict charter provisions guaranteeing the 40% creator restitution covenant, universal monthly living payout floor, and 1% global wealth endowment trust.',
      priority: 'Critical Path',
      estimatedDuration: '4 - 6 Weeks',
      dependencies: ['Legal Counsel Retainer (Swiss FINMA / Cayman VASP specialist)'],
      deliverable: 'Foundation Articles of Association & Supervisory Board Governance Charter',
      completed: true,
    },
    {
      id: 'fa-02',
      phase: 'Phase 1: Legal & Foundation Incorporation',
      title: 'Obtain Tier-1 Regulatory Legal Opinions (Howey Test & MiCA Classification)',
      description: 'Commission comprehensive securities classification memo establishing $HUMAN utility token status, monthly living payment sovereign covenant, and non-security restitution rights under US SEC & EU MiCA frameworks.',
      priority: 'Critical Path',
      estimatedDuration: '3 - 5 Weeks',
      dependencies: ['Foundation Incorporation'],
      deliverable: 'Formal Legal Opinion Letter from Top-Tier Crypto Law Firm',
      completed: false,
    },
    {
      id: 'fa-03',
      phase: 'Phase 2: Technical Whitepaper & Spec',
      title: 'Publish Formal Proof-of-Restitution (PoR) & Dynamic Labor Sliding Scale Specification',
      description: 'Document the mathematical Byzantine consensus model, C2PA cryptographic oracle ingestion pipelines, zero-knowledge training attribution proofs, and automated per-capita country redistribution smart contracts.',
      priority: 'Critical Path',
      estimatedDuration: '3 Weeks',
      dependencies: ['Architecture Blueprints'],
      deliverable: '42-Page Master Technical Whitepaper v2.0 with formal mathematical theorems and country redistribution logic',
      completed: true,
    },
    {
      id: 'fa-04',
      phase: 'Phase 2: Technical Whitepaper & Spec',
      title: 'Design Zero-Knowledge Provenance & C2PA On-Chain Oracle Engine',
      description: 'Build decentralized oracle nodes that verify digital watermark hashes, cryptographic creator signatures, and SHA-256 asset manifests before issuing minting or restitution receipts.',
      priority: 'High',
      estimatedDuration: '4 Weeks',
      dependencies: ['PoR Initiative Specification'],
      deliverable: 'zk-SNARK Circuit Specification & Rust Oracle Client Repository',
      completed: false,
    },
    {
      id: 'fa-05',
      phase: 'Phase 3: Tokenomics & Cryptographic Modeling',
      title: 'Simulate Dynamic Universal Living Payout & Anti-Slack Tokenomics',
      description: 'Stress-test the sliding scale feedback loop (where monthly citizen income adjusts dynamically with verified human diligence while protecting AI-automated jobs) in Python/CadCAD notebooks.',
      priority: 'Critical Path',
      estimatedDuration: '3 Weeks',
      dependencies: ['PoR Initiative Specification'],
      deliverable: 'Tokenomics Macroeconomic Model with Per-Capita Country Rebalancing Simulator',
      completed: true,
    },
    {
      id: 'fa-06',
      phase: 'Phase 3: Tokenomics & Cryptographic Modeling',
      title: 'Implement Smart Contract Restitution Vaults & Automated Splitters',
      description: 'Develop the immutable Solidity / Rust contracts enforcing the 40% creator royalty, 30% universal human monthly living dividend, 15% compute commons, and Stripe Sandbox/Live settlement hooks.',
      priority: 'High',
      estimatedDuration: '4 Weeks',
      dependencies: ['Tokenomics Model'],
      deliverable: 'Open-Source Smart Contract Repository with 100% Unit Test Coverage',
      completed: false,
    },
    {
      id: 'fa-07',
      phase: 'Phase 4: Testnet & Validator Genesis',
      title: 'Deploy H.U.M.A.N. Initiative Testnet ("Genesis Alpha")',
      description: 'Spin up 25 geographically distributed genesis validator nodes running Tendermint-BFT consensus with sub-second block finality and full ERC-4337 account abstraction.',
      priority: 'Critical Path',
      estimatedDuration: '4 Weeks',
      dependencies: ['Smart Contract Repository', 'Rust Oracle Client'],
      deliverable: 'Public Block Explorer, Faucet, RPC Endpoints, and Validator Onboarding CLI',
      completed: false,
    },
    {
      id: 'fa-08',
      phase: 'Phase 5: Audits & Security Hardening',
      title: 'Engage Tier-1 Security Audit Firms (Formal Verification & Red Teaming)',
      description: 'Submit core blockchain consensus node software, oracle circuits, and restitution smart contracts to top security auditors (e.g., Trail of Bits, CertiK, OpenZeppelin).',
      priority: 'Critical Path',
      estimatedDuration: '6 Weeks',
      dependencies: ['Testnet Deployment'],
      deliverable: 'Clean Audit Certificates & Remediated Security Threat Assessment Report',
      completed: false,
    },
    {
      id: 'fa-09',
      phase: 'Phase 6: TGE & Global 1% Ingestion',
      title: 'Execute Token Generation Event (TGE) & Activate 1% Global Wealth Endowment',
      description: 'Launch mainnet genesis block, initiate institutional liquidity bootstrap pools, onboard enterprise AI apps, and route first real-time restitution micro-royalties to global human creators.',
      priority: 'Strategic',
      estimatedDuration: '2 Weeks',
      dependencies: ['Security Audits Completed', 'Exchange & Custody Integrations'],
      deliverable: 'Mainnet Live Block Production & Sovereign Restitution Ledger Active',
      completed: false,
    },
  ]);

  const toggleActionItem = (id: string) => {
    setActionItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  // Document Library Specs
  const documentSpecs: BlockchainDocumentSpec[] = [
    {
      id: 'wp-tech-01',
      category: 'Whitepaper & Technical',
      title: 'H.U.M.A.N. Initiative: Layer-1 Sovereign Restitution Blockchain Whitepaper',
      code: 'DOC-TECH-WP-01',
      status: 'Architecture Finalized',
      summary: 'Comprehensive 42-page technical specification of the Tendermint-BFT Proof-of-Restitution consensus, dual EVM/WASM execution runtime, and C2PA zero-knowledge data verification oracles with country-level per-capita rebalancing.',
      keySections: [
        '1. Executive Summary & The Problem of AI Human Value Extraction',
        '2. Universal Guaranteed Monthly Living Baseline ($1,450 - $2,400+ Sliding Scale)',
        '3. Proof-of-Restitution (PoR) Consensus & Byzantine Fault Tolerance',
        '4. Zero-Knowledge Training Attribution Circuits (zk-STARKs)',
        '5. Country Per-Capita Accountability: AI Protection vs. Human Slack Penalties',
        '6. Global Mutual Aid Pillar Architecture & Emergency Crisis Routing',
        '7. Cryptographic Security Bounds, Slashing Conditions & Formal Verification',
      ],
      jurisdictionOrStandard: 'IEEE / ACM Distributed Systems Standard + C2PA v2.1',
      downloadFilename: 'HUMAN_Initiative_Technical_Whitepaper_v2.0.pdf',
    },
    {
      id: 'wp-tokenomics-02',
      category: 'Economic & Tokenomics',
      title: 'Macroeconomic Monetary Policy: Dynamic Productivity & Universal Monthly Living Payout',
      code: 'DOC-ECON-TP-02',
      status: 'Draft Ready',
      summary: 'The mathematical economic model governing the $HUMAN native token, the $4.50 Trillion endowment yield distribution, monthly citizen living disbursements, and the zero-debt anti-slack redistribution matrix.',
      keySections: [
        '1. Macro Endowment Architecture ($4.50T Global 1% Ingestion Model)',
        '2. Individual Monthly Living Stat Breakdown ($1,450 Baseline / $2,400 Surge)',
        '3. Dynamic Sliding Scale: Rewarding Collective Diligence and Collaborative Spirit',
        '4. AI Displacement Safeguard: Full Protection for Automated Workforce Sectors',
        '5. Zero-Sum Redistribution: How Slacking Country Penalties Fund Diligent Communities',
        '6. Staking Security, Validator Rewards & Perpetual Restitution Vaults',
      ],
      jurisdictionOrStandard: 'CadCAD Continuous Token Model & Nobel Economics Behavioral Principles',
      downloadFilename: 'HUMAN_Tokenomics_and_Dynamic_Monthly_Living_Model.pdf',
    },
    {
      id: 'wp-legal-03',
      category: 'Legal & Regulatory',
      title: 'Sovereign Foundation Articles of Association & Global Charter (Zug, Switzerland)',
      code: 'DOC-LEG-ART-03',
      status: 'Legal Review Required',
      summary: 'The statutory legal framework under Swiss Civil Code (Art. 80 et seq.) establishing the non-profit foundation with an irrevocable fiduciary mandate to protect human creators and govern restitution pools.',
      keySections: [
        'Article 1: Corporate Name, Domicile (Canton Zug) and Purpose',
        'Article 2: Foundation Endowment & Immutable Restitution Covenant (40% Minimum)',
        'Article 3: Universal Monthly Living Fund & Per-Capita Equity Charter',
        'Article 4: Foundation Council, Technical Steering Committee & Community Assembly',
        'Article 5: Supervisory Authority (Swiss Federal Foundation Supervisory Board - ESA)',
        'Article 6: Dissolution Protections & Perpetual Human Benefit Lock',
      ],
      jurisdictionOrStandard: 'Swiss Civil Code (Art. 80 ff. ZGB) / FINMA Regulatory Compliance',
      downloadFilename: 'HUMAN_Initiative_Foundation_Articles_of_Association.pdf',
    },
    {
      id: 'wp-legal-04',
      category: 'Legal & Regulatory',
      title: 'Global Securities & Regulatory Opinion: US Howey Test & EU MiCA Compliance',
      code: 'DOC-LEG-MICA-04',
      status: 'Draft Ready',
      summary: 'Legal analysis establishing $HUMAN as a decentralized utility, staking, and restitution token exempt from security classification through functional decentralization and programmatic execution.',
      keySections: [
        '1. Analysis under US Securities Act of 1933 & SEC Framework for Investment Contracts',
        '2. European Union Markets in Crypto-Assets (MiCA) Utility Token Classification',
        '3. Fiduciary Treatment of Automated Restitution Settlements vs. Dividend Securities',
        '4. Universal Living Fund Smart Contract Trust Characterization',
        '5. Anti-Money Laundering (AML) & Travel Rule Compliance Architecture',
      ],
      jurisdictionOrStandard: 'US SEC Howey Jurisprudence + EU MiCA Regulation (EU 2023/1114)',
      downloadFilename: 'HUMAN_Global_Regulatory_and_MiCA_Legal_Opinion.pdf',
    },
    {
      id: 'wp-covenant-05',
      category: 'Governance & Compliance',
      title: 'The Creator Restitution Covenant: Smart Contract SLA & Enterprise AI Licensing Charter',
      code: 'DOC-GOV-COV-05',
      status: 'Architecture Finalized',
      summary: 'Standardized smart contract agreement required for any AI model, foundation lab, or commercial platform seeking the H.U.M.A.N. Initiative Ethical AI Seal and verified training data access.',
      keySections: [
        'Clause 1: 40% Minimum Gross Revenue Restitution Split to Contributing Creators',
        'Clause 2: Mandatory C2PA Provenance Manifest Verification on All Synthetic Outputs',
        'Clause 3: Automated Micro-Settlement Hooks & Stripe/Blockchain Invoicing',
        'Clause 4: Penalties, Slashing, and Revocation of Trust Badge for Non-Compliance',
      ],
      jurisdictionOrStandard: 'WIPO Copyright Treaty & Open Content Provenance Standard',
      downloadFilename: 'HUMAN_Creator_Covenant_and_Enterprise_SLA.pdf',
    },
    {
      id: 'wp-ublf-treaty-06',
      category: 'Governance & Compliance',
      title: 'Universal Basic Living Fund (UBLF): Multilateral Sovereign State Treaty & Greed-Shift Accord',
      code: 'DOC-TREATY-UBLF-06',
      status: 'Architecture Finalized',
      summary: 'The formal United Nations & Multilateral Sovereign Treaty protocol binding participating world governments to allocate 1.8% - 3.5% of GDP into the Universal Basic Living Fund, shifting governance away from corporate lobbying and speculative casino capitalism toward direct, automated citizen nourishment and technology commons.',
      keySections: [
        'Article 1: The Principle of Inalienable Human Baseline Security (Zero Means-Testing)',
        'Article 2: Programmatic GDP Allocation Formulas & Central Bank Digital Rail Integration',
        'Article 3: Dissolution of Administrative Bureaucracy & Direct Passkey Wallet Payouts',
        'Article 4: Friction Taxes on Algorithmic Speculative Arbitrage & Corporate Greed',
        'Article 5: Mutual Aid Rebalancing: How Diligent Nations Unlock Civilizational Megaprojects',
        'Article 6: Sanctions, Sovereign Neutrality, and Anti-Weaponization Guarantees',
      ],
      jurisdictionOrStandard: 'Vienna Convention on the Law of Treaties + UN General Assembly Draft Resolution',
      downloadFilename: 'UBLF_Multilateral_Sovereign_Government_Treaty_Accord.pdf',
    },
  ];

  // Blockchain Nuts & Bolts Technical Layers
  const nutsAndBoltsSpecs: BlockchainNutsAndBoltsSpec[] = [
    {
      layer: 'Consensus & Network',
      title: 'Proof-of-Restitution (PoR) & Byzantine Fault Tolerant Consensus',
      specification: 'Custom Cosmos-SDK / CometBFT-derived high-throughput consensus. Validators are weighted not merely by bonded tokens, but also by their verified verification throughput of C2PA provenance proofs and automated country rebalancing checks.',
      technologyStack: ['CometBFT (Go)', 'Cosmos SDK v0.50', 'libp2p Secure Transport', 'BLS Multi-Signatures'],
      keyParameters: {
        'Block Time': '850 milliseconds (sub-second finality)',
        'Max Throughput': '55,000+ Transactions Per Second (TPS)',
        'Validator Set': '100 Active Consensus Nodes + 500 Oracle Nodes',
        'Slashing Penalty': '5% Bond Slash for Double Sign; 0.5% for Oracle Downtime',
      },
      securityAuditCheckpoints: [
        'Byzantine Fault Tolerance under 33% malicious stake threshold',
        'Censorship-resistance via encrypted transaction mempools',
        'Sybil-resistant cryptographic validator bonding',
      ],
    },
    {
      layer: 'Execution & VM',
      title: 'Dual-Engine Virtual Machine (EVM + Rust WASM Runtime)',
      specification: 'Simultaneous execution of Solidity smart contracts via revm (Rust EVM) alongside ultra-fast Rust WebAssembly modules for high-frequency micro-royalty calculations and provenance proofs.',
      technologyStack: ['revm (Rust EVM)', 'Wasmer WebAssembly Engine', 'Zero-Copy State DB', 'RocksDB / Drizzle SQL Storage'],
      keyParameters: {
        'Gas Model': 'EIP-1559 Dynamic Base Fee with 50% Initiative Burn',
        'EVM Compatibility': '100% Bytecode Compatible with Ethereum Tooling (Hardhat, Foundry)',
        'WASM Execution Speed': '<0.1ms average smart contract invocation',
        'State Access Latency': 'Sub-millisecond Merkle-Patricia Trie retrieval',
      },
      securityAuditCheckpoints: [
        'Reentrancy guard bytecodes built directly into VM opcode layer',
        'Deterministic gas metering for all mathematical matrix computations',
      ],
    },
    {
      layer: 'Zero-Knowledge & Privacy',
      title: 'zk-Attribution Circuits & Privacy-Preserving Proof of Labor',
      specification: 'Zero-knowledge STARK circuits that allow creators and dataset authors to prove their work was utilized in training an AI model without revealing confidential source code, raw data, or personal biometric keys.',
      technologyStack: ['Plonky2 / Halo2 zk-SNARKs', 'Circom 2.0', 'C2PA SHA-256 Verifier', 'Rust Cryptographic Primitives'],
      keyParameters: {
        'Proof Generation Time': '<1.8 seconds on consumer hardware',
        'Verification Gas Cost': '<45,000 gas on EVM layer',
        'Proof Size': '~1.2 Kilobytes per attribution receipt',
      },
      securityAuditCheckpoints: [
        'Zero knowledge leak of creator source material',
        'Quantum-resistant lattice commitment scheme roadmap',
      ],
    },
    {
      layer: 'Oracles & Provenance',
      title: 'Decentralized C2PA Ingestion Oracle Network (D-PION)',
      specification: 'Multi-node oracle network that continuously scrapes, indexes, and verifies C2PA metadata manifests embedded in digital media, code repositories (GitHub/GitLab), and generative AI platforms.',
      technologyStack: ['Rust C2PA SDK', 'Chainlink Decentralized Oracle Architecture', 'IPFS Content-Addressed Storage', 'Arweave Immutable Archiving'],
      keyParameters: {
        'Oracle Consensus Threshold': '67% Supermajority Signature Requirement',
        'Manifest Resolution Speed': '<300ms global latency',
        'Supported Formats': 'PNG, JPEG, MP3, MP4, WAV, Rust, TS, Py, Solidity',
      },
      securityAuditCheckpoints: [
        'Oracle manipulation resistance via multi-source median aggregation',
        'Tamper-proof hardware enclave (SGX/Nitro) validator attestations',
      ],
    },
    {
      layer: 'Account & Gas Abstraction',
      title: 'Native ERC-4337 Account Abstraction & Gasless Restitution Claims',
      specification: 'Creators, artists, and testers do not need crypto to receive payouts. Gas fees are natively sponsored by the 15% Compute Commons Treasury, allowing users to sign in with Google/Apple OAuth and receive payouts directly to Stripe or bank accounts.',
      technologyStack: ['ERC-4337 Bundlers', 'WebAuthn Passkeys', 'Stripe Fiat Paymaster', 'Firebase/Google Auth Relayer'],
      keyParameters: {
        'User Onboarding Friction': '0 Crypto Wallets Required (Web2 One-Click)',
        'Payout Rails': 'Stripe Connect, Bank ACH, USDC, Native $HUMAN Token',
        'Recovery Mechanism': 'Social Recovery & Biometric Multi-Factor Guardians',
      },
      securityAuditCheckpoints: [
        'Paymaster front-running protection and daily withdrawal rate limits',
        'Non-custodial cryptographic key isolation via client-side WebAuthn',
      ],
    },
  ];

  const selectedDoc = useMemo(() => {
    return documentSpecs.find((d) => d.id === selectedDocId) || documentSpecs[0];
  }, [selectedDocId]);

  // Format Large Currency Strings ($4,500,000,000,000)
  const formatTrillions = (amount: number) => {
    if (amount >= 1_000_000_000_000) {
      return `$${(amount / 1_000_000_000_000).toFixed(2)} Trillion USD`;
    }
    if (amount >= 1_000_000_000) {
      return `$${(amount / 1_000_000_000).toFixed(2)} Billion USD`;
    }
    if (amount >= 1_000_000) {
      return `$${(amount / 1_000_000).toFixed(2)} Million USD`;
    }
    return `$${amount.toLocaleString()} USD`;
  };

  const handleDownloadSpec = (filename: string, title: string) => {
    const markdownContent = `# ${title}\n\n` +
      `Official Architectural Blueprint & Document Specification\n` +
      `Generated by The H.U.M.A.N. Initiative Core Console\n` +
      `Date: ${new Date().toISOString()}\n\n` +
      `=== PRIMARY STAT: UNIVERSAL GUARANTEED MONTHLY LIVING PAYMENT ===\n` +
      `Base Monthly Living Floor: $${BASE_MONTHLY_LIVING_FLOOR_USD.toLocaleString()} / month / citizen\n` +
      `Current Dynamic Monthly Payout (Sliding Scale): $${currentMonthlyLivingPayoutUsd.toLocaleString()} / month / citizen\n` +
      `Annual Per-Capita Equivalent: $${annualCitizenEquivalentUsd.toLocaleString()} / year\n` +
      `Dynamic Productivity Multiplier: ${dynamicProductivityMultiplier}x\n\n` +
      `=== MACROECONOMIC FUND INJECTION ===\n` +
      `Total Global Wealth Benchmark: ${formatTrillions(GLOBAL_WEALTH_USD)}\n` +
      `1% Global Humanity Fund Inflow: ${formatTrillions(FUND_INJECTION_USD)}\n` +
      `Annual Sustainable Dynamic Yield: ${formatTrillions(dynamicAnnualYieldUsd)}/year\n\n` +
      `=== SPECIFICATION DETAILS ===\n` +
      `Document Code: ${selectedDoc.code}\n` +
      `Category: ${selectedDoc.category}\n` +
      `Jurisdiction / Standard: ${selectedDoc.jurisdictionOrStandard}\n\n` +
      `=== SUMMARY ===\n${selectedDoc.summary}\n\n` +
      `=== KEY SECTIONS & CLAUSES ===\n` +
      selectedDoc.keySections.map((s) => `- ${s}`).join('\n') +
      `\n\n=== VERIFICATION & COMPLIANCE ===\n` +
      `This document is registered on The H.U.M.A.N. Initiative Sovereign Restitution Ledger with immutable hash provenance.\n`;

    const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename.replace('.pdf', '.md');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Hero Banner with Macro Value Callout */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950/80 to-slate-950 border border-indigo-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -top-16 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold tracking-wide">
              <Globe2 className="w-3.5 h-3.5 text-amber-400" />
              GLOBAL MACRO ARCHITECTURE & UNIVERSAL LIVING PAYMENT CONSOLE
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              Universal Monthly Living Payout & Sovereign Blockchain
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Every individual receives a guaranteed monthly living payment that adjusts on a dynamic sliding scale based on collective human effort. Slacking countries transfer their share to hardworking nations, fostering competitive spirit, community unity, and global crisis resilience.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
            {/* The Most Important Stat Card (Hero Focus) */}
            <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-br from-emerald-950/90 to-slate-900 border-2 border-emerald-400 shadow-xl shadow-emerald-500/10 text-center sm:text-right">
              <div className="text-[11px] text-emerald-300 font-extrabold uppercase tracking-wider flex items-center justify-center sm:justify-end gap-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                THE MOST IMPORTANT STAT: CITIZEN MONTHLY LIVING
              </div>
              <div className="text-2xl sm:text-4xl font-mono font-extrabold text-emerald-400 mt-1">
                ${currentMonthlyLivingPayoutUsd.toLocaleString()} <span className="text-sm font-sans font-bold text-slate-300">/ mo</span>
              </div>
              <div className="text-[11px] text-emerald-200 mt-0.5 font-medium">
                ${annualCitizenEquivalentUsd.toLocaleString()}/yr Guaranteed • Sliding Scale ({dynamicProductivityMultiplier}x)
              </div>
            </div>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-wrap items-center gap-2">
          
          <button
            onClick={() => setActiveSubTab('living-payment-stat')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'living-payment-stat'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30 ring-2 ring-emerald-400 font-extrabold'
                : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/60'
            }`}
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            ★ The Most Important Stat: Monthly Living Floor ($1,450 - $2,400/mo)
          </button>

          <button
            onClick={() => setActiveSubTab('prosperity-projection')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'prosperity-projection'
                ? 'bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-slate-950 shadow-lg shadow-teal-500/30 ring-2 ring-emerald-300 font-extrabold'
                : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/60'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            📈 10-Year Global Prosperity Projection (50% Royalty Split)
          </button>

          <button
            onClick={() => setActiveSubTab('ublf-government-treaty')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'ublf-government-treaty'
                ? 'bg-gradient-to-r from-amber-400 to-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/30 ring-2 ring-amber-300 font-extrabold'
                : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/60'
            }`}
          >
            <Building2 className="w-4 h-4 text-amber-500" />
            🏛️ Universal Basic Living Fund (Gov Treaty & Shift from Greed)
          </button>

          <button
            onClick={() => setActiveSubTab('cost-of-living-deflation')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'cost-of-living-deflation'
                ? 'bg-teal-500 text-slate-950 shadow-lg shadow-teal-500/30 ring-2 ring-teal-300 font-extrabold'
                : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/60'
            }`}
          >
            <TrendingDown className="w-4 h-4 text-teal-400" />
            📉 Driving Down Cost of Living (-64% Deflationary Abundance)
          </button>

          <button
            onClick={() => setActiveSubTab('peace-dividend')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'peace-dividend'
                ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/30 ring-2 ring-amber-300 font-extrabold'
                : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/60'
            }`}
          >
            <HeartHandshake className="w-4 h-4 text-amber-500" />
            🕊️ The Global Peace Dividend ($2.44T Redirected from Destruction to Construction)
          </button>

          <button
            onClick={() => setActiveSubTab('country-accountability')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'country-accountability'
                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30 ring-2 ring-indigo-400'
                : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/60'
            }`}
          >
            <Scale className="w-4 h-4 text-cyan-300" />
            Country Per-Capita Accountability & Mutual Aid Directory
          </button>


          <button
            onClick={() => setActiveSubTab('macro-fund')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'macro-fund'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
                : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/60'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            1% Macro Wealth Inflow ($4.50T)
          </button>

          <button
            onClick={() => setActiveSubTab('productivity-engine')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'productivity-engine'
                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/60'
            }`}
          >
            <Zap className="w-4 h-4 text-amber-400" />
            Dynamic Productivity Yield Engine
          </button>

          <button
            onClick={() => setActiveSubTab('blockchain-nuts-bolts')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'blockchain-nuts-bolts'
                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/60'
            }`}
          >
            <Cpu className="w-4 h-4 text-cyan-400" />
            Blockchain Nuts & Bolts (L1 Tech)
          </button>

          <button
            onClick={() => setActiveSubTab('whitepapers-legal')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'whitepapers-legal'
                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/60'
            }`}
          >
            <FileText className="w-4 h-4 text-emerald-400" />
            Whitepapers & Legal Blueprints
          </button>

          <button
            onClick={() => setActiveSubTab('founder-roadmap')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'founder-roadmap'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/60'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            Founder Action Plan (Nuts to Bolts)
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SUB-VIEW 1: THE MOST IMPORTANT STAT - UNIVERSAL GUARANTEED MONTHLY LIVING */}
      {/* ========================================================================= */}
      {activeSubTab === 'living-payment-stat' && (
        <div className="space-y-6">
          
          {/* Main Stat Presentation Card */}
          <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/90 border-2 border-emerald-500/50 shadow-2xl space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  THE FUNDAMENTAL STATISTIC: INDIVIDUAL UNIVERSAL GUARANTEE
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Universal Guaranteed Monthly Living Payment (UGMB)
                </h2>
                <p className="text-sm text-slate-300 max-w-3xl">
                  This is the exact monthly cash amount every individual adult citizen receives automatically on the 1st of every month to live comfortably with dignity, free of poverty, debt, or government bureaucracy.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/40 text-center sm:text-right shrink-0">
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Current Dynamic Monthly Payout</div>
                <div className="text-3xl sm:text-4xl font-mono font-extrabold text-emerald-400">
                  ${currentMonthlyLivingPayoutUsd.toLocaleString()}
                </div>
                <div className="text-xs text-slate-400 font-medium mt-0.5">
                  Per individual / month (${annualCitizenEquivalentUsd.toLocaleString()} / year)
                </div>
              </div>
            </div>

            {/* Sliding Scale Interactive Engine */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              <div className="lg:col-span-2 space-y-6 p-6 rounded-xl bg-slate-800/50 border border-slate-700/70">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-emerald-400" />
                    How Hard Society Works (Dynamic Sliding Scale Controls)
                  </h3>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    Live Simulator
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  When human society actively engages, builds, codes, researches, and creates alongside AI automation, the monthly payment increases dynamically. If sectors experience human-caused laziness, the pool contracts and re-routes toward hardworking communities.
                </p>

                <div className="space-y-4">
                  {/* Slider 1: Human Work Ethic & Output */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-blue-400" />
                        Human Society Work Ethic & Diligence Score:
                      </span>
                      <span className="font-mono font-bold text-emerald-400">{productivityScore}/100</span>
                    </div>
                    <input
                      type="range"
                      min="40"
                      max="100"
                      value={productivityScore}
                      onChange={(e) => setProductivityScore(Number(e.target.value))}
                      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                      <span>40 (Severe Society Slack)</span>
                      <span>80 (Healthy Standard)</span>
                      <span>100 (Peak Diligence & Creation)</span>
                    </div>
                  </div>

                  {/* Slider 2: Workforce Engagement */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
                        Active Human Workforce Participation:
                      </span>
                      <span className="font-mono font-bold text-indigo-400">{workforceParticipation}%</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="95"
                      value={workforceParticipation}
                      onChange={(e) => setWorkforceParticipation(Number(e.target.value))}
                      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-400"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                      <span>50% (High Absenteeism)</span>
                      <span>75% (Standard)</span>
                      <span>95% (Hyper-Engaged Civilization)</span>
                    </div>
                  </div>

                  {/* Slider 3: AI Automation Adoption (PROTECTED - Doesn't penalize) */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                        <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                        AI & Automation Displacement Level (100% Protected):
                      </span>
                      <span className="font-mono font-bold text-cyan-400">{aiAutomationAdoptionPct}% Automated</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="90"
                      value={aiAutomationAdoptionPct}
                      onChange={(e) => setAiAutomationAdoptionPct(Number(e.target.value))}
                      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                    />
                    <div className="flex justify-between text-[10px] text-cyan-400/80 font-mono">
                      <span>10% Low AI Automation</span>
                      <span>50% Balanced Co-Pilot</span>
                      <span>90% Ultra-Automated Abundance</span>
                    </div>
                  </div>
                </div>

                {/* Important Distinction Banner */}
                <div className="p-3.5 rounded-xl bg-indigo-950/60 border border-indigo-500/40 text-xs space-y-1">
                  <div className="flex items-center gap-2 text-indigo-300 font-bold">
                    <Shield className="w-4 h-4 text-emerald-400" />
                    Crucial Initiative Rule: AI Displacement vs. Human Slack
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    If AI automates a factory, hospital, or coding job, workers in that sector are <strong>100% protected</strong> and receive their full guaranteed monthly payment. But if an un-automated sector experiences a drop in production because humans stop showing up or delivering quality output, that is classified as <strong>Human-Caused Slack</strong>, triggering the sliding-scale reduction.
                  </p>
                </div>

              </div>

              {/* Payout Tier Breakdown Card */}
              <div className="space-y-3 p-6 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-emerald-400" />
                    Dynamic Living Payout Tiers
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Monthly income adjustments based on global diligence:
                  </p>
                </div>

                <div className="space-y-2.5">
                  {/* Tier 1 */}
                  <div className={`p-3 rounded-lg border text-xs transition-all ${
                    currentMonthlyLivingPayoutUsd <= 1200 
                      ? 'bg-amber-500/15 border-amber-500 text-white font-bold ring-1 ring-amber-400'
                      : 'bg-slate-800/40 border-slate-700/60 text-slate-300'
                  }`}>
                    <div className="flex justify-between items-center">
                      <span>Low Diligence / Severe Slack Floor</span>
                      <span className="font-mono font-bold text-amber-300">$950 - $1,200/mo</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Guarantees basic survival shelter & sustenance.</div>
                  </div>

                  {/* Tier 2 */}
                  <div className={`p-3 rounded-lg border text-xs transition-all ${
                    currentMonthlyLivingPayoutUsd > 1200 && currentMonthlyLivingPayoutUsd <= 1650
                      ? 'bg-blue-500/15 border-blue-500 text-white font-bold ring-1 ring-blue-400'
                      : 'bg-slate-800/40 border-slate-700/60 text-slate-300'
                  }`}>
                    <div className="flex justify-between items-center">
                      <span>Baseline Standard (Human Standard)</span>
                      <span className="font-mono font-bold text-blue-300">$1,450/mo ($17,400/yr)</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Comfortable independent living & healthcare baseline.</div>
                  </div>

                  {/* Tier 3 */}
                  <div className={`p-3 rounded-lg border text-xs transition-all ${
                    currentMonthlyLivingPayoutUsd > 1650 && currentMonthlyLivingPayoutUsd <= 2200
                      ? 'bg-emerald-500/20 border-emerald-400 text-white font-bold ring-2 ring-emerald-400'
                      : 'bg-slate-800/40 border-slate-700/60 text-slate-300'
                  }`}>
                    <div className="flex justify-between items-center">
                      <span>High Diligence Surge (Current Active)</span>
                      <span className="font-mono font-bold text-emerald-400">${currentMonthlyLivingPayoutUsd.toLocaleString()}/mo</span>
                    </div>
                    <div className="text-[10px] text-emerald-300/80 mt-0.5 font-medium">Extra surplus for education, travel, creative pursuits.</div>
                  </div>

                  {/* Tier 4 */}
                  <div className={`p-3 rounded-lg border text-xs transition-all ${
                    currentMonthlyLivingPayoutUsd > 2200
                      ? 'bg-indigo-500/20 border-indigo-400 text-white font-bold ring-2 ring-indigo-400'
                      : 'bg-slate-800/40 border-slate-700/60 text-slate-300'
                  }`}>
                    <div className="flex justify-between items-center">
                      <span>Peak Technological & Human Synergy</span>
                      <span className="font-mono font-bold text-indigo-300">$2,400 - $3,600+/mo</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Civilizational hyper-abundance dividend.</div>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Smart Contract Settlement Rails:</span>
                  <span className="text-emerald-400 font-mono font-bold">Auto-Stripe / ACH / USDC</span>
                </div>
              </div>

            </div>

          </div>

          {/* 3 Value Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-2.5">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 w-fit">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white">Competitive Spirit & Inspiration</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                By making the monthly payment transparently linked to diligence, communities are inspired to collaborate, build local businesses, and educate their youth, driving genuine civilizational pride.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-2.5">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 w-fit">
                <Scale className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white">Zero-Debt Redistribution</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                When an underperforming sector slacks off, its forfeited percentage flows straight to the top-performing, hardworking nations. No national debt is issued and no inflation is created.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-2.5">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 w-fit">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white">Global Crisis Resilience Pillars</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Instead of the entire world suffering during a crisis, high-performing nations are clearly identified so the international community knows exactly who has surplus capacity to provide aid.
              </p>
            </div>

          </div>

          {/* Quick CTA Banner to 10-Year Prosperity Chart */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-teal-950/40 to-slate-900 border border-teal-500/40 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-xl bg-teal-500/15 border border-teal-500/30 text-teal-300">
                <LineChartIcon className="w-6 h-6 text-teal-400" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-white">
                  Visual Projection: 10-Year Global Poverty Eradication (-98.6%)
                </h4>
                <p className="text-xs text-slate-300">
                  Simulating the 10-year macroeconomic impact of universal 50% royalty split adoption across 8.1 Billion humans.
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveSubTab('prosperity-projection')}
              className="px-4 py-2 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-teal-500/20 transition-all cursor-pointer shrink-0"
            >
              <span>Explore Projection Chart</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-VIEW: 10-YEAR GLOBAL PROSPERITY PROJECTION (50% ROYALTY SPLIT) */}
      {/* ========================================================================= */}
      {activeSubTab === 'prosperity-projection' && (
        <div className="space-y-6">
          
          {/* Hero Header & Scenario Controller */}
          <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-slate-900 via-teal-950/40 to-slate-950 border-2 border-teal-500/40 shadow-2xl space-y-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
              <div className="space-y-2 max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-300 text-xs font-bold tracking-wide">
                  <TrendingUp className="w-3.5 h-3.5 text-teal-400" />
                  10-YEAR MACROECONOMIC CIVILIZATIONAL PROJECTION (2026 – 2035)
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Global Prosperity Projection: Poverty Eradication via 50% Royalty Split
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed">
                  When the <strong className="text-teal-300">50% Creator & Citizen Royalty Standard</strong> is integrated across AI platforms, automated commerce, and digital services, humanity experiences a structural transition from resource scarcity to sustainable baseline abundance. Within 10 years, extreme poverty is projected to decrease by <strong className="text-emerald-400">98.6%</strong>, safeguarding children and guaranteeing universal dignity.
                </p>
              </div>

              {/* Key Highlights Metrics */}
              <div className="grid grid-cols-2 gap-3 w-full lg:w-auto shrink-0">
                <div className="p-4 rounded-xl bg-slate-950/90 border border-teal-500/40 text-center">
                  <div className="text-[10px] text-teal-300 font-bold uppercase tracking-wider">10-Yr Cumulative Flow</div>
                  <div className="text-2xl sm:text-3xl font-mono font-extrabold text-teal-400 mt-1">
                    ${prosperitySummary.tenYearTotalRoyaltyDistributedTrillionUsd.toFixed(1)}T
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Direct to Citizen Passkeys</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/90 border border-emerald-500/40 text-center">
                  <div className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider">Extreme Poverty Reduction</div>
                  <div className="text-2xl sm:text-3xl font-mono font-extrabold text-emerald-400 mt-1">
                    -{prosperitySummary.extremePovertyEliminatedPct}%
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">8.5% → 0.12% Population</div>
                </div>
              </div>
            </div>

            {/* Interactive Scenario Controls */}
            <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <Sliders className="w-4 h-4 text-teal-400" />
                  Interactive Scenario & Royalty Split Parameters
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Royalty Covenant Standard:</span>
                  <span className="text-xs font-mono font-bold text-teal-300 bg-teal-500/10 px-2.5 py-1 rounded border border-teal-500/30">
                    {globalRoyaltySplitPct}% Immutable Split
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Scenario Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Globe2 className="w-3.5 h-3.5 text-blue-400" />
                    Global Adoption Velocity Scenario:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Baseline Accord', 'Accelerated Treaty', 'Conservative Organic'] as const).map((scen) => (
                      <button
                        key={scen}
                        type="button"
                        onClick={() => setProsperityScenario(scen)}
                        className={`px-3 py-2 rounded-lg text-xs font-bold transition-all border text-center cursor-pointer ${
                          prosperityScenario === scen
                            ? 'bg-teal-500/20 border-teal-400 text-teal-200 ring-1 ring-teal-400'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                        }`}
                      >
                        {scen === 'Baseline Accord' && 'Standard 10-Yr'}
                        {scen === 'Accelerated Treaty' && '⚡ Fast 5-Yr G20'}
                        {scen === 'Conservative Organic' && 'Phased Organic'}
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {prosperityScenario === 'Baseline Accord' && 'Represents standard multilateral adoption through UN/G20 covenants.'}
                    {prosperityScenario === 'Accelerated Treaty' && 'Fast-track sovereign treaty acceleration driven by automated AI surplus dividends.'}
                    {prosperityScenario === 'Conservative Organic' && 'Gradual voluntary adoption across tech platforms and independent sovereign funds.'}
                  </p>
                </div>

                {/* Royalty Split Percentage Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                      <Percent className="w-3.5 h-3.5 text-emerald-400" />
                      Platform Royalty Split Allocation Rate:
                    </span>
                    <span className="font-mono font-bold text-teal-300">{globalRoyaltySplitPct}% to Creators & Citizens</span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="70"
                    step="5"
                    value={globalRoyaltySplitPct}
                    onChange={(e) => setGlobalRoyaltySplitPct(Number(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-400"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>30% Minimum Floor</span>
                    <span>50% (Core Covenant)</span>
                    <span>70% Hyper-Commons</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* 4 Summary Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">Extreme Poverty</span>
                <TrendingDown className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-mono font-extrabold text-white">
                8.5% → <span className="text-emerald-400">0.12%</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Projected to lift over <strong className="text-slate-200">740 Million</strong> people completely out of severe poverty by Year 10.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">Child Labor Eradication</span>
                <HeartHandshake className="w-4 h-4 text-teal-400" />
              </div>
              <div className="text-2xl font-mono font-extrabold text-white">
                <span className="text-teal-300">99.4%</span> Eradicated
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Guaranteed parental monthly baseline ensures children remain in education and safe development.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Annual Royalty Inflow</span>
                <Coins className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-mono font-extrabold text-amber-400">
                ${tenYearProsperityData[tenYearProsperityData.length - 1].annualRoyaltiesDistributedTrillionUsd.toFixed(2)}T / yr
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                By Year 10, automated platform royalties distribute nearly $6 Trillion annually into direct citizen liquidity.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Global Living Security</span>
                <Shield className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-2xl font-mono font-extrabold text-cyan-300">
                26 → <span className="text-cyan-400">97 / 100</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Universal access to baseline nutrition, clean energy, healthcare, and digital compute commons.
              </p>
            </div>

          </div>

          {/* Recharts Visual Projection Card */}
          <div className="p-6 rounded-2xl bg-slate-900/95 border border-slate-800 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="space-y-1">
                <span className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
                  <LineChartIcon className="w-4 h-4 text-teal-400" />
                  RECHARTS INTERACTIVE MACRO PROJECTION
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  10-Year Trajectory of Global Poverty Eradication & Royalty Capital Distribution
                </h3>
                <p className="text-xs text-slate-400">
                  Visualizing the direct causal link between 50% platform royalty adoption and the collapse of poverty.
                </p>
              </div>

              {/* View Toggle Tabs */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <button
                  type="button"
                  onClick={() => setChartViewMetric('all')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    chartViewMetric === 'all'
                      ? 'bg-teal-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  All-in-One Dual Axis
                </button>
                <button
                  type="button"
                  onClick={() => setChartViewMetric('poverty')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    chartViewMetric === 'poverty'
                      ? 'bg-rose-500 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Poverty Curves (%)
                </button>
                <button
                  type="button"
                  onClick={() => setChartViewMetric('royalties')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    chartViewMetric === 'royalties'
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Royalty Flows ($T)
                </button>
                <button
                  type="button"
                  onClick={() => setChartViewMetric('security')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    chartViewMetric === 'security'
                      ? 'bg-cyan-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Child Protection (%)
                </button>
              </div>
            </div>

            {/* Recharts Chart Container */}
            <div className="w-full h-[400px] pt-2">
              <ResponsiveContainer width="100%" height="100%">
                {chartViewMetric === 'all' ? (
                  <ComposedChart data={tenYearProsperityData} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
                    <defs>
                      <linearGradient id="povertyGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="moderatePovertyGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#818cf8" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="royaltyGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                    <XAxis
                      dataKey="calendarYear"
                      stroke="#94a3b8"
                      tick={{ fill: '#cbd5e1', fontSize: 12 }}
                      tickFormatter={(val, idx) => `Yr ${idx + 1} (${val})`}
                    />
                    <YAxis
                      yAxisId="left"
                      stroke="#f43f5e"
                      tick={{ fill: '#fca5a5', fontSize: 11 }}
                      tickFormatter={(val) => `${val}%`}
                      domain={[0, 30]}
                      label={{ value: 'Poverty Rate (%)', angle: -90, position: 'insideLeft', fill: '#fca5a5', fontSize: 11 }}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      stroke="#10b981"
                      tick={{ fill: '#6ee7b7', fontSize: 11 }}
                      tickFormatter={(val) => `$${val}T`}
                      domain={[0, 7]}
                      label={{ value: 'Annual Royalties ($T)', angle: 90, position: 'insideRight', fill: '#6ee7b7', fontSize: 11 }}
                    />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload as GlobalProsperityYearData;
                          return (
                            <div className="p-4 rounded-xl bg-slate-950/95 border border-slate-700 shadow-2xl space-y-2 text-xs text-white min-w-[240px]">
                              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                                <span className="font-extrabold text-teal-300">Year {data.year} ({data.calendarYear})</span>
                                <span className="font-mono text-emerald-400">{data.globalRoyaltyAdoptionPct}% Adoption</span>
                              </div>
                              <div className="space-y-1 font-mono text-[11px]">
                                <div className="flex justify-between text-rose-300">
                                  <span>Extreme Poverty:</span>
                                  <strong className="text-white">{data.extremePovertyRatePct}%</strong>
                                </div>
                                <div className="flex justify-between text-indigo-300">
                                  <span>Moderate Poverty:</span>
                                  <strong className="text-white">{data.moderatePovertyRatePct}%</strong>
                                </div>
                                <div className="flex justify-between text-emerald-300">
                                  <span>Annual Royalties:</span>
                                  <strong className="text-emerald-400">${data.annualRoyaltiesDistributedTrillionUsd}T / yr</strong>
                                </div>
                                <div className="flex justify-between text-amber-300">
                                  <span>Cumulative Royalties:</span>
                                  <strong className="text-amber-400">${data.cumulativeRoyaltiesDistributedTrillionUsd}T</strong>
                                </div>
                                <div className="flex justify-between text-cyan-300">
                                  <span>Monthly Living Floor:</span>
                                  <strong className="text-cyan-300">${data.medianCitizenMonthlyLivingFloorUsd}/mo</strong>
                                </div>
                                <div className="flex justify-between text-teal-300">
                                  <span>Child Labor Reduction:</span>
                                  <strong className="text-teal-300">{data.childLaborReductionPct}%</strong>
                                </div>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend
                      verticalAlign="top"
                      height={36}
                      wrapperStyle={{ paddingBottom: '10px', fontSize: '12px' }}
                    />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="moderatePovertyRatePct"
                      name="Moderate Poverty / Distress (%)"
                      stroke="#818cf8"
                      fill="url(#moderatePovertyGradient)"
                      strokeWidth={2}
                    />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="extremePovertyRatePct"
                      name="Extreme Poverty Rate (%)"
                      stroke="#f43f5e"
                      fill="url(#povertyGradient)"
                      strokeWidth={3}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="annualRoyaltiesDistributedTrillionUsd"
                      name="Annual Royalties Distributed ($T)"
                      stroke="#10b981"
                      strokeWidth={3}
                      dot={{ r: 4, fill: '#10b981' }}
                      activeDot={{ r: 7 }}
                    />
                  </ComposedChart>
                ) : chartViewMetric === 'poverty' ? (
                  <AreaChart data={tenYearProsperityData} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
                    <defs>
                      <linearGradient id="povertyGradientSolo" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.5} />
                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="modPovertySolo" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                    <XAxis dataKey="calendarYear" stroke="#94a3b8" tick={{ fill: '#cbd5e1' }} />
                    <YAxis stroke="#f43f5e" tick={{ fill: '#fca5a5' }} unit="%" domain={[0, 30]} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '12px' }}
                    />
                    <Legend verticalAlign="top" height={36} />
                    <Area type="monotone" dataKey="moderatePovertyRatePct" name="Moderate Poverty Rate (%)" stroke="#6366f1" fill="url(#modPovertySolo)" strokeWidth={2} />
                    <Area type="monotone" dataKey="extremePovertyRatePct" name="Extreme Poverty Rate (%)" stroke="#f43f5e" fill="url(#povertyGradientSolo)" strokeWidth={3} />
                  </AreaChart>
                ) : chartViewMetric === 'royalties' ? (
                  <BarChart data={tenYearProsperityData} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                    <XAxis dataKey="calendarYear" stroke="#94a3b8" tick={{ fill: '#cbd5e1' }} />
                    <YAxis stroke="#10b981" tick={{ fill: '#6ee7b7' }} unit="T" />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '12px' }}
                    />
                    <Legend verticalAlign="top" height={36} />
                    <Bar dataKey="annualRoyaltiesDistributedTrillionUsd" name="Annual Distributed ($ Trillions USD)" fill="#10b981" radius={[6, 6, 0, 0]} />
                  </BarChart>
                ) : (
                  <LineChart data={tenYearProsperityData} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                    <XAxis dataKey="calendarYear" stroke="#94a3b8" tick={{ fill: '#cbd5e1' }} />
                    <YAxis stroke="#06b6d4" tick={{ fill: '#67e8f9' }} unit="%" domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '12px' }}
                    />
                    <Legend verticalAlign="top" height={36} />
                    <Line type="monotone" dataKey="childLaborReductionPct" name="Child Labor Eradication (%)" stroke="#06b6d4" strokeWidth={3} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="globalLivingSecurityIndex" name="Civilizational Living Security Index" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>

            {/* Dynamic Legend Insights Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-rose-500 shrink-0 animate-pulse" />
                <div className="text-xs">
                  <strong className="text-white block font-semibold">Near-Zero Extreme Poverty by Year 10</strong>
                  <span className="text-slate-400 text-[11px]">8.5% → 0.12% with 50% royalty streams</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-400 shrink-0" />
                <div className="text-xs">
                  <strong className="text-white block font-semibold">$5.88 Trillion / yr Direct Liquidity</strong>
                  <span className="text-slate-400 text-[11px]">Direct automated flow from platforms to citizens</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-cyan-400 shrink-0" />
                <div className="text-xs">
                  <strong className="text-white block font-semibold">End of Child Economic Coercion</strong>
                  <span className="text-slate-400 text-[11px]">Enables children to be children and study freely</span>
                </div>
              </div>
            </div>

          </div>

          {/* Year-by-Year Scannable Data Table */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Year-by-Year Macroeconomic Trajectory Matrix</h3>
                <p className="text-xs text-slate-400">Detailed 10-year step progression under the 50% royalty split covenant.</p>
              </div>
              <span className="text-xs font-mono text-teal-300 bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/30">
                10-Year Horizon: 2026 – 2035
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
                    <th className="py-3 px-3">Year</th>
                    <th className="py-3 px-3">Royalty Adoption</th>
                    <th className="py-3 px-3">Extreme Poverty</th>
                    <th className="py-3 px-3">Moderate Distress</th>
                    <th className="py-3 px-3">Annual Royalties</th>
                    <th className="py-3 px-3">Cumulative Cash</th>
                    <th className="py-3 px-3">Citizen Living Floor</th>
                    <th className="py-3 px-3">Child Labor Reduction</th>
                    <th className="py-3 px-3">Civilization Index</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono text-slate-200">
                  {tenYearProsperityData.map((row) => (
                    <tr
                      key={row.year}
                      onMouseEnter={() => setSelectedHoverYear(row.year)}
                      onMouseLeave={() => setSelectedHoverYear(null)}
                      className={`transition-colors ${
                        selectedHoverYear === row.year
                          ? 'bg-teal-500/15 text-white'
                          : row.year === 10
                          ? 'bg-emerald-950/30 text-emerald-300 font-bold'
                          : 'hover:bg-slate-800/40'
                      }`}
                    >
                      <td className="py-3 px-3 font-bold text-white flex items-center gap-1.5">
                        <span>Yr {row.year}</span>
                        <span className="text-[10px] text-slate-400 font-sans">({row.calendarYear})</span>
                      </td>
                      <td className="py-3 px-3 text-teal-300">{row.globalRoyaltyAdoptionPct}%</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          row.extremePovertyRatePct <= 0.5
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : row.extremePovertyRatePct <= 2.5
                            ? 'bg-cyan-500/20 text-cyan-300'
                            : 'bg-rose-500/20 text-rose-300'
                        }`}>
                          {row.extremePovertyRatePct}%
                        </span>
                      </td>
                      <td className="py-3 px-3 text-indigo-300">{row.moderatePovertyRatePct}%</td>
                      <td className="py-3 px-3 font-bold text-amber-300">${row.annualRoyaltiesDistributedTrillionUsd}T</td>
                      <td className="py-3 px-3 text-amber-400/80">${row.cumulativeRoyaltiesDistributedTrillionUsd}T</td>
                      <td className="py-3 px-3 text-emerald-400 font-bold">${row.medianCitizenMonthlyLivingFloorUsd.toLocaleString()}/mo</td>
                      <td className="py-3 px-3 text-cyan-300">{row.childLaborReductionPct}%</td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-12 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-teal-400 to-emerald-400 rounded-full"
                              style={{ width: `${row.globalLivingSecurityIndex}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-slate-300">{row.globalLivingSecurityIndex}/100</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 4 Core Pillars Explaining the Reduction Mechanics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2.5">
              <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20 w-fit">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white">1. Direct Liquid Transmission</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                By bypassing predatory middlemen and bureaucratic siphons, 50% platform royalties flow directly into individual citizen wallets on the 1st of every month.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2.5">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 w-fit">
                <Shield className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white">2. Eradication of Child Labor</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Poverty is the primary driver of premature child labor. When households have guaranteed living security, children are protected from early exploitation and freed to learn and create.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2.5">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 w-fit">
                <Coins className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white">3. 100% Non-Debt Funded</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Funded entirely through organic platform revenues, autonomous AI productivity, and sovereign GDP treaties without increasing government debt or inflation.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2.5">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 w-fit">
                <Zap className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white">4. Multiplier Velocity of Money</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Every dollar disbursed to everyday citizens generates 3.4x local economic velocity through grocery purchases, healthcare, home upgrades, and education.
              </p>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-VIEW: UNIVERSAL BASIC LIVING FUND (SOVEREIGN GOVERNMENT TREATY & SHIFT FROM GREED) */}
      {/* ========================================================================= */}
      {activeSubTab === 'ublf-government-treaty' && (
        <div className="space-y-6">
          
          {/* Hero Banner: The Core Theory */}
          <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-slate-900 via-amber-950/40 to-slate-950 border-2 border-amber-500/40 shadow-2xl space-y-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
              <div className="space-y-2 max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold tracking-wide">
                  <Building2 className="w-3.5 h-3.5 text-amber-400" />
                  THE UNIVERSAL BASIC LIVING FUND (UBLF) SOVEREIGN GOVERNANCE TREATY
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Shifting from Oligarchic Greed to Governing for the People
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed">
                  <strong className="text-amber-300">The Core Proposition:</strong> If all world governments contribute regular, proportional GDP allocations into the Universal Basic Living Fund, the systemic mandate of government shifts from managing debt, corporate lobbying, and warfare to its true purpose: <strong className="text-emerald-400">protecting, elevating, and nourishing the human citizens they represent</strong>.
                </p>
              </div>

              {/* Top Key Metrics */}
              <div className="grid grid-cols-2 gap-3 w-full lg:w-auto shrink-0">
                <div className="p-4 rounded-xl bg-slate-950/90 border border-amber-500/40 text-center">
                  <div className="text-[10px] text-amber-300 font-bold uppercase tracking-wider">Annual Treaty Inflow</div>
                  <div className="text-2xl sm:text-3xl font-mono font-extrabold text-amber-400 mt-1">
                    ${(ublfMetrics.aggregateAnnualGovernmentContributionsUsd / 1_000_000_000_000).toFixed(2)}T
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{globalGdpPledgeRatePct}% Global GDP + Speculative Tax</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/90 border border-emerald-500/40 text-center">
                  <div className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider">Direct Citizen Efficiency</div>
                  <div className="text-2xl sm:text-3xl font-mono font-extrabold text-emerald-400 mt-1">
                    98.8%
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Zero Bureaucracy Siphon</div>
                </div>
              </div>
            </div>

            {/* Shift Paradigm Callout: Greed vs. Governance */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-2">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                  <AlertCircle className="w-4 h-4 text-rose-400" />
                  The Legacy Governance Trap (Systemic Greed)
                </div>
                <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-4 leading-relaxed">
                  <li>Trillions siphoned into corporate subsidies, high-frequency speculative manipulation, and offshore tax evasion.</li>
                  <li>Over $1.5 Trillion consumed annually by bloated, humiliating welfare paperwork, means-testing agencies, and red tape.</li>
                  <li>Elected representatives forced to prioritize donor capital over citizen health, education, and shelter.</li>
                </ul>
              </div>

              <div className="p-5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  The UBLF Governance Paradigm (Sovereign Service)
                </div>
                <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-4 leading-relaxed">
                  <li>Direct programmatic blockchain settlement to every citizen's Passkey wallet on the 1st of every month.</li>
                  <li>Zero means-testing stigma; baseline dignity guaranteed as an inalienable birthright.</li>
                  <li>Governments judged and re-elected solely on how effectively they advance clean infrastructure, safety, culture, and science.</li>
                </ul>
              </div>
            </div>

            {/* Interactive Macro Treaty Simulator Controls */}
            <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <Sliders className="w-4 h-4 text-amber-400" />
                  Interactive World Government Treaty & Greed-Shift Simulator
                </div>
                <span className="text-xs font-mono font-bold text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/30">
                  Global Baseline GDP: $105.00 Trillion USD
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Control 1: Global GDP Pledge Rate */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                      <Globe2 className="w-3.5 h-3.5 text-blue-400" />
                      Sovereign GDP Pledge Rate:
                    </span>
                    <span className="font-mono font-bold text-amber-400">{globalGdpPledgeRatePct.toFixed(1)}% of GDP</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="5.0"
                    step="0.1"
                    value={globalGdpPledgeRatePct}
                    onChange={(e) => setGlobalGdpPledgeRatePct(Number(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>0.5% ($525B/yr)</span>
                    <span>1.8% ($1.89T/yr)</span>
                    <span>5.0% ($5.25T/yr)</span>
                  </div>
                </div>

                {/* Control 2: Speculative Greed Tax Rate */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                      Algorithmic Speculation Friction Tax:
                    </span>
                    <span className="font-mono font-bold text-emerald-400">{speculativeGreedTaxRatePct.toFixed(1)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="5.0"
                    step="0.5"
                    value={speculativeGreedTaxRatePct}
                    onChange={(e) => setSpeculativeGreedTaxRatePct(Number(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>0.5% (Light)</span>
                    <span>2.5% (Optimal)</span>
                    <span>5.0% (Aggressive Curb)</span>
                  </div>
                </div>

                {/* Control 3: Bureaucracy Overhead Elimination */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-cyan-400" />
                      Red Tape Overhead Dissolution:
                    </span>
                    <span className="font-mono font-bold text-cyan-400">{bureaucracyEliminationRatePct}% automated</span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="98"
                    step="2"
                    value={bureaucracyEliminationRatePct}
                    onChange={(e) => setBureaucracyEliminationRatePct(Number(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>40% Paperwork</span>
                    <span>85% Autonomous</span>
                    <span>98% Pure Smart Contract</span>
                  </div>
                </div>
              </div>

              {/* Instant Dynamic Yield Results Strip */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-700/80 flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Calculated Citizen Living Floor</div>
                  <div className="text-xl sm:text-2xl font-mono font-extrabold text-emerald-400">
                    ${ublfMetrics.baseMonthlyLivingFloorPerCitizenUsd.toLocaleString()} <span className="text-xs font-sans text-slate-300">/ mo per human</span>
                  </div>
                </div>

                <div className="space-y-0.5">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Total Greed & Waste Redirected</div>
                  <div className="text-xl sm:text-2xl font-mono font-extrabold text-amber-400">
                    ${(ublfMetrics.greedShiftRatio.capitalDivertedFromSpeculativeGreedUsd / 1_000_000_000_000).toFixed(2)} Trillion / yr
                  </div>
                </div>

                <div className="space-y-0.5">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Global Liquidity Disbursed Monthly</div>
                  <div className="text-xl sm:text-2xl font-mono font-extrabold text-cyan-400">
                    ${(ublfMetrics.monthlyGlobalDistributableFundUsd / 1_000_000_000_000).toFixed(2)} Trillion / mo
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* 4 Core Governance Pillars of the Treaty */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {ublfMetrics.governanceProtocols.map((protocol, idx) => (
              <div
                key={idx}
                className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 transition-all space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20">
                      {idx === 0 && <Shield className="w-4 h-4 text-emerald-400" />}
                      {idx === 1 && <Zap className="w-4 h-4 text-cyan-400" />}
                      {idx === 2 && <TrendingUp className="w-4 h-4 text-amber-400" />}
                      {idx === 3 && <HeartHandshake className="w-4 h-4 text-rose-400" />}
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      Pillar 0{idx + 1}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white">{protocol.title}</h3>
                  <p className="text-xs text-amber-200/90 italic font-serif">"{protocol.axiom}"</p>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80 text-[11px] text-slate-300">
                  <strong className="text-amber-400">Execution:</strong> {protocol.mechanism}
                </div>
              </div>
            ))}
          </div>

          {/* Sovereign Country Treaty Ledger & Pledge Registry */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">SOVEREIGN STATE PLEDGE REGISTRY</span>
                <h3 className="text-lg sm:text-xl font-bold text-white mt-0.5">
                  World Government Contributions & Citizen Guarantees
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  How individual nation-states route regular GDP shares into the Universal Basic Living Fund to guarantee living standards.
                </p>
              </div>

              {/* Filter by Country */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-medium">Filter Nation:</span>
                <select
                  value={selectedGovCountry}
                  onChange={(e) => setSelectedGovCountry(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer"
                >
                  <option value="ALL">All Participating Sovereign Nations ({sovereignGovernmentData.length})</option>
                  {sovereignGovernmentData.map((c) => (
                    <option key={c.countryCode} value={c.countryCode}>
                      {c.flagEmoji} {c.countryName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Country Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {sovereignGovernmentData
                .filter((c) => selectedGovCountry === 'ALL' || c.countryCode === selectedGovCountry)
                .map((c) => (
                  <div
                    key={c.countryCode}
                    className="p-5 rounded-xl bg-slate-800/40 border border-slate-700/70 hover:border-amber-500/40 transition-all space-y-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{c.flagEmoji}</span>
                        <div>
                          <h4 className="text-base font-bold text-white flex items-center gap-2">
                            {c.countryName}
                            <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                              c.treatyStatus === 'Ratified Treaty'
                                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                                : c.treatyStatus === 'Parliamentary Review'
                                ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                                : 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                            }`}>
                              {c.treatyStatus}
                            </span>
                          </h4>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Annual GDP: <strong className="text-slate-200 font-mono">${c.gdpAnnualTrillionUsd.toFixed(2)}T</strong> • Population: <strong className="text-slate-200 font-mono">{c.populationMillion}M citizens</strong>
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-[10px] text-slate-400 uppercase font-bold">Annual Inflow</div>
                        <div className="text-sm font-mono font-bold text-amber-400">
                          ${(c.annualContributionUsd / 1_000_000_000).toFixed(1)}B / yr
                        </div>
                        <div className="text-[10px] text-emerald-400 font-mono">
                          ${(c.monthlyDisbursementToUBLFUsd / 1_000_000_000).toFixed(1)}B / mo
                        </div>
                      </div>
                    </div>

                    {/* Shift from Greed Performance Metrics */}
                    <div className="grid grid-cols-3 gap-2 p-3 rounded-lg bg-slate-900/90 border border-slate-800 text-center">
                      <div>
                        <div className="text-[10px] text-slate-400">Lobbying Waste Reclaimed</div>
                        <div className="text-xs font-mono font-bold text-rose-400">
                          ${(c.shiftFromGreedMetric.divertedLobbyingAndWasteUsd / 1_000_000_000).toFixed(1)}B
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400">Paperwork Siphon Cut</div>
                        <div className="text-xs font-mono font-bold text-cyan-400">
                          ${(c.shiftFromGreedMetric.administrativeBureaucracySavedUsd / 1_000_000_000).toFixed(1)}B
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400">Direct Citizen Yield</div>
                        <div className="text-xs font-mono font-bold text-emerald-400">
                          {c.shiftFromGreedMetric.directCitizenYieldEfficiencyPct}% Direct
                        </div>
                      </div>
                    </div>

                    {/* Guaranteed Civic Pillars for Citizens */}
                    <div className="space-y-1.5">
                      <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        Guaranteed Citizen Rights Under Treaty:
                      </div>
                      <div className="space-y-1">
                        {c.civicPillarsGuaranteed.map((pillar, pIdx) => (
                          <div key={pIdx} className="text-xs text-slate-300 flex items-start gap-2 pl-1">
                            <span className="text-amber-400 font-bold">•</span>
                            <span>{pillar}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                ))}
            </div>

          </div>

          {/* Theoretical Proof & Ratification Architecture */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-950 border border-indigo-500/30 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                <BookOpen className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  Why This System Can Initiate the Transition
                </h3>
                <p className="text-xs text-slate-300">
                  Proof of Restitution (PoR) and zero-knowledge cryptographic smart contracts provide the exact neutral, non-corruptible ledger needed for sovereign governments to coordinate without trusting centralized intermediaries.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-300">
              <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
                <strong className="text-white block font-semibold">1. Zero Default Risk</strong>
                <p className="text-[11px] text-slate-400">Contributions are automated via programmatic central bank digital currency (CBDC) or treasury repo settlements directly into the smart restitution pool.</p>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
                <strong className="text-white block font-semibold">2. Biometric & Passkey Privacy</strong>
                <p className="text-[11px] text-slate-400">Citizens claim their monthly living dividends using zero-knowledge proofs (zk-STARKs), guaranteeing that no government can spy on, track, or arbitrarily freeze citizen funds.</p>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
                <strong className="text-white block font-semibold">3. Elimination of the Profit-from-Suffering Motive</strong>
                <p className="text-[11px] text-slate-400">When basic food, energy, housing, and health are unconditionally funded through the UBLF commons, predatory monopolies collapse and true human flourishing commences.</p>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-VIEW: DRIVING DOWN THE COST OF LIVING (DEFLATIONARY ABUNDANCE ENGINE)  */}
      {/* ========================================================================= */}
      {activeSubTab === 'cost-of-living-deflation' && (
        <div className="space-y-6">
          
          {/* Top Overview & Dual Engine Banner */}
          <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-slate-900 via-teal-950/70 to-slate-950 border-2 border-teal-500/40 shadow-2xl space-y-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
              <div className="space-y-2 max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-300 text-xs font-bold tracking-wide">
                  <TrendingDown className="w-3.5 h-3.5 text-teal-400" />
                  TECHNOLOGICAL ABUNDANCE & STRUCTURAL DEFLATION ARCHITECTURE
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Driving Down the Cost of Living: The Dual Abundance Multiplier
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed">
                  True universal security isn't just about distributing a monthly living payment—it's about <strong className="text-teal-300">systematically collapsing the cost of essential goods and services toward zero marginal cost</strong>. By funding open compute, open biotech, robotic agriculture, and modular housing commons, everyday human expenses plummet by <strong className="text-teal-400 font-mono">-{deflationModel.netCostOfLivingReductionPct}%</strong>.
                </p>
              </div>

              {/* Purchasing Power Multiplier Callout */}
              <div className="grid grid-cols-2 gap-3 w-full lg:w-auto shrink-0">
                <div className="p-4 rounded-xl bg-slate-950/90 border border-teal-500/40 text-center">
                  <div className="text-[10px] text-teal-300 font-bold uppercase tracking-wider">Net Cost Reduction</div>
                  <div className="text-2xl sm:text-3xl font-mono font-extrabold text-teal-400 mt-1">
                    -{deflationModel.netCostOfLivingReductionPct}%
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Average Household Spend</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/90 border border-emerald-500/40 text-center">
                  <div className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider">Real Purchasing Power</div>
                  <div className="text-2xl sm:text-3xl font-mono font-extrabold text-emerald-400 mt-1">
                    {deflationModel.effectivePurchasingPowerMultiplier}x
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Effective Wealth Expansion</div>
                </div>
              </div>
            </div>

            {/* The Dual Abundance Equation */}
            <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-teal-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-400" />
                  The Universal Freedom Equation: Dynamic Inflow + Structural Deflation
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  Zero Debt • Zero Inflation
                </span>
              </div>

              <div className="p-4 rounded-lg bg-slate-900 border border-slate-700/80 font-mono text-center sm:text-left text-xs sm:text-sm text-slate-200">
                <span className="text-emerald-400 font-bold">Effective Individual Living Standard</span> ={' '}
                <span className="text-indigo-300 font-semibold">($1,450 – $2,400 Monthly Guaranteed Inflow)</span> ×{' '}
                <span className="text-teal-300 font-semibold">({deflationModel.effectivePurchasingPowerMultiplier}x Real Cost Collapse Multiplier)</span>
                <div className="text-xs text-slate-400 font-sans mt-2">
                  A guaranteed monthly payout of $1,450/month provides the purchasing equivalence of <strong className="text-white font-mono">${Math.round(1450 * deflationModel.effectivePurchasingPowerMultiplier).toLocaleString()}/month</strong> because food, energy, housing, and healthcare have plummeted in price.
                </div>
              </div>
            </div>

            {/* Before vs After Macro Cost Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-rose-500/30 space-y-1 text-center sm:text-left">
                <div className="text-[11px] text-rose-300 font-bold uppercase">1. Pre-Fund Monopolistic Baseline</div>
                <div className="text-2xl font-mono font-extrabold text-rose-400">
                  ${deflationModel.totalAverageHouseholdSpendBaselineUsd.toLocaleString()} <span className="text-xs text-slate-400 font-sans">/ year</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Crippled by pharmaceutical patents, fossil fuel scarcity, mortgage inflation, and predatory distribution middlemen.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-teal-500/40 space-y-1 text-center sm:text-left">
                <div className="text-[11px] text-teal-300 font-bold uppercase">2. Post-Fund Abundance Cost</div>
                <div className="text-2xl font-mono font-extrabold text-teal-400">
                  ${deflationModel.totalAverageHouseholdSpendAbundanceUsd.toLocaleString()} <span className="text-xs text-slate-400 font-sans">/ year</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Driven by zero-marginal-cost renewable energy grids, open-source medicine, autonomous harvesting, and 3D modular building.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-emerald-500/40 space-y-1 text-center sm:text-left">
                <div className="text-[11px] text-emerald-300 font-bold uppercase">3. Net Annual Family Surplus</div>
                <div className="text-2xl font-mono font-extrabold text-emerald-400">
                  +${deflationModel.disposableSurplusAnnualUsd.toLocaleString()} <span className="text-xs text-slate-400 font-sans">/ year</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Direct capital retained by every family annually to invest in education, travel, arts, and creative entrepreneurship.
                </p>
              </div>
            </div>

          </div>

          {/* Interactive Sector-by-Sector Deflation Matrix */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">SECTOR-BY-SECTOR BREAKDOWN</span>
                <h3 className="text-lg sm:text-xl font-bold text-white mt-0.5">
                  How Each Living Expense Category Collapses
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Adjust the sliders to simulate technological adoption curves and public commons efficiency.
                </p>
              </div>

              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/30">
                6 Critical Human Categories
              </span>
            </div>

            {/* Sector Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {costOfLivingBreakdown.map((item, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-xl bg-slate-800/40 border border-slate-700/70 hover:border-teal-500/40 transition-all space-y-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-300 border border-teal-500/20">
                        {item.category === 'Energy' && <Zap className="w-5 h-5 text-amber-400" />}
                        {item.category === 'Food & Agriculture' && <Wheat className="w-5 h-5 text-emerald-400" />}
                        {item.category === 'Healthcare & Biotech' && <HeartPulse className="w-5 h-5 text-rose-400" />}
                        {item.category === 'Housing & Construction' && <Home className="w-5 h-5 text-blue-400" />}
                        {item.category === 'Education & Compute' && <GraduationCap className="w-5 h-5 text-purple-400" />}
                        {item.category === 'Logistics & Mobility' && <Truck className="w-5 h-5 text-cyan-400" />}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-700 text-slate-300">
                            {item.category}
                          </span>
                          <span className="text-xs font-mono font-bold text-teal-400">
                            -{item.deflationPct}% Deflation
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-white mt-1">{item.sector}</h4>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs line-through text-rose-400/80 font-mono">
                        ${item.baselineAnnualCostUsd.toLocaleString()}/yr
                      </div>
                      <div className="text-base font-mono font-extrabold text-teal-400">
                        ${item.postFundAbundanceCostUsd.toLocaleString()}/yr
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="text-slate-300 font-medium">
                      <strong className="text-slate-200">Driver:</strong> {item.primaryDriver}
                    </div>
                    <p className="text-slate-400 leading-relaxed text-[11px] bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                      {item.mechanism}
                    </p>
                  </div>

                  {/* Individual Sector Sliders */}
                  <div className="pt-2 border-t border-slate-700/60 space-y-1.5">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-400">Adopted Automation & Commons Depth:</span>
                      <span className="font-mono font-bold text-teal-300">{item.deflationPct}% Cost Drop</span>
                    </div>

                    {item.category === 'Energy' && (
                      <input
                        type="range"
                        min="20"
                        max="98"
                        value={energyDeflationMultiplier * 100}
                        onChange={(e) => setEnergyDeflationMultiplier(Number(e.target.value) / 100)}
                        className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-400"
                      />
                    )}
                    {item.category === 'Food & Agriculture' && (
                      <input
                        type="range"
                        min="20"
                        max="95"
                        value={agriFoodDeflationMultiplier * 100}
                        onChange={(e) => setAgriFoodDeflationMultiplier(Number(e.target.value) / 100)}
                        className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-400"
                      />
                    )}
                    {item.category === 'Healthcare & Biotech' && (
                      <input
                        type="range"
                        min="20"
                        max="95"
                        value={healthBiotechDeflationMultiplier * 100}
                        onChange={(e) => setHealthBiotechDeflationMultiplier(Number(e.target.value) / 100)}
                        className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-400"
                      />
                    )}
                    {item.category === 'Housing & Construction' && (
                      <input
                        type="range"
                        min="20"
                        max="90"
                        value={housingDeflationMultiplier * 100}
                        onChange={(e) => setHousingDeflationMultiplier(Number(e.target.value) / 100)}
                        className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-400"
                      />
                    )}
                    {item.category === 'Education & Compute' && (
                      <input
                        type="range"
                        min="30"
                        max="99"
                        value={computeEduDeflationMultiplier * 100}
                        onChange={(e) => setComputeEduDeflationMultiplier(Number(e.target.value) / 100)}
                        className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-400"
                      />
                    )}
                    {item.category === 'Logistics & Mobility' && (
                      <input
                        type="range"
                        min="20"
                        max="95"
                        value={logisticsDeflationMultiplier * 100}
                        onChange={(e) => setLogisticsDeflationMultiplier(Number(e.target.value) / 100)}
                        className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-400"
                      />
                    )}

                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
                      <span>Annual Family Savings:</span>
                      <span className="text-emerald-400 font-bold">+${item.annualSavingsPerFamilyUsd.toLocaleString()} / year</span>
                    </div>
                  </div>

                </div>
              ))}
            </div>

          </div>

          {/* Deep-Dive Architectural Pillars */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950/70 border border-indigo-500/30 shadow-xl space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  The 5 Structural Pillars of Deflationary Abundance
                </h3>
                <p className="text-xs text-slate-400">
                  Why traditional fiat currency inflates while The H.U.M.A.N. Initiative engineering model causes hyper-deflation in survival necessities.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
                  <Sun className="w-4 h-4" />
                  1. Zero Marginal Cost Energy Grids
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Energy is the master resource. When photovoltaic fabrication, small modular reactors, and sodium-ion batteries become sovereign public assets, electricity drops to fractions of a cent per kWh.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                  <Wheat className="w-4 h-4" />
                  2. Automated Autonomous Farming
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Solar-powered robotic weeders, AI water-table monitors, and vertical indoor farming remove diesel dependency and distribution markups, guaranteeing abundant nutrient-dense food.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-rose-400 text-xs font-bold">
                  <HeartPulse className="w-4 h-4" />
                  3. Open-Source AI Medicine Commons
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  By replacing predatory 20-year patent monopolies with decentralized restitution for bio-researchers, life-saving therapeutics and mRNA formulations are synthesized locally for pennies.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-blue-400 text-xs font-bold">
                  <Home className="w-4 h-4" />
                  4. Robotic 3D Modular Housing
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Prefabricated carbon-negative timber and robotic on-site assembly collapse construction timelines and overhead, breaking land-speculator cartels and restoring affordable home ownership.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-purple-400 text-xs font-bold">
                  <Cpu className="w-4 h-4" />
                  5. Free Global Compute & Intelligence
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  The initiative's dedicated 15% compute commons pool ensures no child or creator is locked behind expensive AI paywalls, democratizing world-class education and synthesis tools.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold">
                  <Shield className="w-4 h-4" />
                  6. Zero National Debt or Taxation
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Funded exclusively via the 1% endowment and real-time AI enterprise ingestion royalties, abundance is achieved through physical and technological productivity—never through money printing.
                </p>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-VIEW: THE GLOBAL PEACE DIVIDEND (REPURPOSING MILITARY CAPITAL)        */}
      {/* ========================================================================= */}
      {activeSubTab === 'peace-dividend' && (
        <div className="space-y-6">
          
          {/* Top Banner: The Civilizational Pivot */}
          <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-slate-900 via-amber-950/60 to-slate-950 border-2 border-amber-500/40 shadow-2xl space-y-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
              <div className="space-y-2 max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold tracking-wide">
                  <HeartHandshake className="w-3.5 h-3.5 text-amber-400" />
                  THE ULTIMATE CIVILIZATIONAL PIVOT: FROM MUTUAL DESTRUCTION TO MUTUAL CREATION
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  What Happens When Humanity Stops Funding War & Builds Together?
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Every year, the world spends over <strong className="text-amber-300 font-mono">$2.44 Trillion USD</strong> on bombs, missiles, stealth bombers, and destructive war machines. When nations unite under The H.U.M.A.N. Initiative to protect and build for one another instead of competing for territorial dominance, this capital and genius transforms the planet into a post-scarcity paradise.
                </p>
              </div>

              {/* Dynamic Reallocation Callout */}
              <div className="grid grid-cols-2 gap-3 w-full lg:w-auto shrink-0">
                <div className="p-4 rounded-xl bg-slate-950/90 border border-amber-500/40 text-center">
                  <div className="text-[10px] text-amber-300 font-bold uppercase tracking-wider">Annual Peace Capital</div>
                  <div className="text-2xl sm:text-3xl font-mono font-extrabold text-amber-400 mt-1">
                    ${(peaceDividendMetrics.reallocatedAnnualCapitalUsd / 1_000_000_000_000).toFixed(2)}T
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{peaceDividendMetrics.reallocationPct}% Global War Budget Redirected</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/90 border border-emerald-500/40 text-center">
                  <div className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider">Direct Monthly Citizen Bonus</div>
                  <div className="text-2xl sm:text-3xl font-mono font-extrabold text-emerald-400 mt-1">
                    +${peaceDividendMetrics.perCapitaMonthlyPeaceBonusUsd}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Added to Monthly Living Floor</div>
                </div>
              </div>
            </div>

            {/* Interactive Military Reallocation Slider */}
            <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-amber-400" />
                  Simulate Global Disarmament & Creative Redirection Level
                </span>
                <span className="text-xs font-mono font-bold px-3 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {peaceDividendMetrics.reallocationPct}% Redirected = ${(peaceDividendMetrics.reallocatedAnnualCapitalUsd / 1_000_000_000_000).toFixed(2)} Trillion / year
                </span>
              </div>

              <input
                type="range"
                min="0"
                max="100"
                value={militaryReallocationPct}
                onChange={(e) => setMilitaryReallocationPct(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />

              <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                <span>0% (Status Quo: $2.44T War Machine)</span>
                <span>50% (Partial De-escalation Accord)</span>
                <span className="text-amber-300 font-bold">75% (Global Planetary Alliance)</span>
                <span className="text-emerald-400 font-bold">100% (Complete Global Demilitarization)</span>
              </div>
            </div>

            {/* The Civilizational Transformation Metric Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-rose-500/30 space-y-1 text-center sm:text-left">
                <div className="text-[11px] text-rose-300 font-bold uppercase">1. Global Military Spend Status Quo</div>
                <div className="text-2xl font-mono font-extrabold text-rose-400">
                  $2.44 Trillion <span className="text-xs text-slate-400 font-sans">/ year</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Wasted on hypersonic munitions, nuclear silos, surveillance paranoia, and destructive proxy warfare across borders.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-amber-500/40 space-y-1 text-center sm:text-left">
                <div className="text-[11px] text-amber-300 font-bold uppercase">2. Unlocked Peace Dividend Inflow</div>
                <div className="text-2xl font-mono font-extrabold text-amber-400">
                  +${(peaceDividendMetrics.reallocatedAnnualCapitalUsd / 1_000_000_000_000).toFixed(2)} Trillion <span className="text-xs text-slate-400 font-sans">/ year</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Directly funds 6 planetary mega-engineering projects and injects bonus cash into every human being's monthly account.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-emerald-500/40 space-y-1 text-center sm:text-left">
                <div className="text-[11px] text-emerald-300 font-bold uppercase">3. Total Boosted Citizen Floor</div>
                <div className="text-2xl font-mono font-extrabold text-emerald-400">
                  ${BASE_MONTHLY_LIVING_FLOOR_USD + peaceDividendMetrics.perCapitaMonthlyPeaceBonusUsd} <span className="text-xs text-slate-400 font-sans">/ month</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  ${BASE_MONTHLY_LIVING_FLOOR_USD} Base Living Floor + ${peaceDividendMetrics.perCapitaMonthlyPeaceBonusUsd}/mo Peace Dividend paid automatically on the 1st of every month.
                </p>
              </div>
            </div>

          </div>

          {/* 6 Planetary Mega-Projects Unlocked by Peace */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">PLANETARY SCALE ENGINEERING</span>
                <h3 className="text-lg sm:text-xl font-bold text-white mt-0.5">
                  6 Mega-Civilization Projects Funded by Ending War
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  What our collective engineering power builds when we stop targeting each other.
                </p>
              </div>

              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
                100% Fully Funded via ${(peaceDividendMetrics.reallocatedAnnualCapitalUsd / 1_000_000_000_000).toFixed(2)}T Reallocation
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {peaceDividendMetrics.globalMegaProjectsFunded.map((project, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-xl bg-slate-800/40 border border-slate-700/70 hover:border-amber-500/40 transition-all space-y-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/20">
                        {project.category === 'Energy & Fusion' && <Atom className="w-5 h-5 text-amber-400" />}
                        {project.category === 'Planetary Reforestation & Biosphere' && <Trees className="w-5 h-5 text-emerald-400" />}
                        {project.category === 'Global High-Speed Transit' && <Rocket className="w-5 h-5 text-indigo-400" />}
                        {project.category === 'Clean Water & Ocean Restoration' && <Droplets className="w-5 h-5 text-cyan-400" />}
                        {project.category === 'Space Exploration & Planetary Defense' && <Rocket className="w-5 h-5 text-purple-400" />}
                        {project.category === 'Disease Eradication' && <HeartPulse className="w-5 h-5 text-rose-400" />}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-700 text-slate-300">
                            {project.category}
                          </span>
                          <span className="text-xs font-mono font-bold text-amber-400">
                            {project.timelineYears} Year Rollout
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-white mt-1">{project.title}</h4>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-base font-mono font-extrabold text-amber-400">
                        ${(project.annualCostUsd / 1_000_000_000).toFixed(0)}B <span className="text-xs text-slate-400 font-sans">/ yr</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                    {project.impactDescription}
                  </p>

                  <div className="p-2.5 rounded-lg bg-amber-950/30 border border-amber-500/30 flex items-center gap-2 text-xs">
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="text-amber-200">
                      <strong>Civilization Milestone:</strong> {project.unlockedCivilizationMilestone}
                    </span>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Diverted Human Genius: From Weapon Designers to World Builders */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-amber-950/70 border border-amber-500/30 shadow-xl space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Lightbulb className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  Diverting Human Genius: Turning Weapon Scientists into Planetary Architects
                </h3>
                <p className="text-xs text-slate-400">
                  Money is just numbers—the true tragedy of war is squandering humanity's sharpest scientific minds on lethal weapons.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold">
                  <Rocket className="w-4 h-4" />
                  Aerospace Engineers: Missiles ➔ Deep Space & Interplanetary Ships
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {peaceDividendMetrics.divertedHumanGenius.aerospaceWeaponsToSpaceExploration}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold">
                  <Shield className="w-4 h-4" />
                  Cyber Warfare Units ➔ Universal Cryptographic Protectors
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {peaceDividendMetrics.divertedHumanGenius.cyberWarfareToUniversalCyberSecurity}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
                  <Atom className="w-4 h-4" />
                  Ballistics & Explosives ➔ 15km Geothermal Borehole Diggers
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {peaceDividendMetrics.divertedHumanGenius.explosivesAndBallisticsToGeothermalAndDeepMining}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                  <Trees className="w-4 h-4" />
                  Spy Satellite Constellations ➔ Planetary Ecosystem Guardians
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {peaceDividendMetrics.divertedHumanGenius.surveillanceInfrastructureToGlobalEcosystemMonitoring}
                </p>
              </div>

            </div>

          </div>

        </div>
      )}


      {/* ========================================================================= */}
      {/* SUB-VIEW 2: COUNTRY-BY-COUNTRY PER-CAPITA ACCOUNTABILITY & MUTUAL AID      */}
      {/* ========================================================================= */}
      {activeSubTab === 'country-accountability' && (
        <div className="space-y-6">
          
          {/* Header & Explanation Card */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-indigo-500/30 shadow-xl space-y-4">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-bold">
                  <Globe2 className="w-3.5 h-3.5" />
                  PER-CAPITA POPULATION EQUITY & ANTI-SLACK TRANSFER MATRIX
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  Country Productivity Ledger & Mutual Aid Directory
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 max-w-3xl">
                  To ensure planetary fairness, every country is weighted per capita by population. Countries that work diligently receive bonus pool distributions; countries that drop output due to human-caused slack surrender their percentage to the hardest workers.
                </p>
              </div>

              {/* Monthly Slack Re-routed Pool */}
              <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/40 text-center sm:text-right shrink-0">
                <div className="text-[10px] text-amber-300 font-bold uppercase tracking-wider">
                  Monthly Slack Penalty Re-routed
                </div>
                <div className="text-2xl sm:text-3xl font-mono font-extrabold text-amber-400">
                  +${(totalPenalizedSlackTransferredMonthlyUsd / 1_000_000_000).toFixed(2)} Billion / mo
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Surrendered from slacking regions $\rightarrow$ Paid to top producers
                </div>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="pt-4 border-t border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setCountryFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    countryFilter === 'all'
                      ? 'bg-slate-700 text-white border border-slate-500'
                      : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
                  }`}
                >
                  All Regions ({baseCountriesData.length})
                </button>

                <button
                  onClick={() => setCountryFilter('surge')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    countryFilter === 'surge'
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                      : 'bg-slate-800 text-emerald-400 hover:bg-slate-700 border border-emerald-500/30'
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  Surge Producers (+Bonus)
                </button>

                <button
                  onClick={() => setCountryFilter('protected')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    countryFilter === 'protected'
                      ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                      : 'bg-slate-800 text-cyan-400 hover:bg-slate-700 border border-cyan-500/30'
                  }`}
                >
                  <Cpu className="w-3.5 h-3.5" />
                  AI Transition Protected
                </button>

                <button
                  onClick={() => setCountryFilter('penalty')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    countryFilter === 'penalty'
                      ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                      : 'bg-slate-800 text-rose-400 hover:bg-slate-700 border border-rose-500/30'
                  }`}
                >
                  <AlertCircle className="w-3.5 h-3.5" />
                  Slack Penalties (Redistributed)
                </button>

                <button
                  onClick={() => setCountryFilter('mutual-aid')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    countryFilter === 'mutual-aid'
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'bg-slate-800 text-amber-400 hover:bg-slate-700 border border-amber-500/30'
                  }`}
                >
                  <HeartHandshake className="w-3.5 h-3.5" />
                  Top Crisis Aid Pillars (Score &ge; 90)
                </button>
              </div>

              {/* Search Box */}
              <div className="relative min-w-[240px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search country, code, or strength..."
                  value={countrySearchQuery}
                  onChange={(e) => setCountrySearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

            </div>
          </div>

          {/* Country Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCountries.map((country) => (
              <div
                key={country.countryCode}
                className={`p-5 rounded-2xl border transition-all space-y-4 relative overflow-hidden ${
                  country.status === 'Surge Producer (+Bonus Pool Inflow)'
                    ? 'bg-slate-900/90 border-emerald-500/40 hover:border-emerald-400 shadow-lg'
                    : country.status === 'Slack Penalty (Redistributed Outward)'
                    ? 'bg-rose-950/20 border-rose-500/40 hover:border-rose-400 shadow-lg'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 shadow-md'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{country.flagEmoji}</span>
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                        {country.countryName}
                        <span className="text-[10px] font-mono px-1.5 py-0.2 bg-slate-800 text-slate-400 rounded">
                          {country.countryCode}
                        </span>
                      </h3>
                      <div className="text-[11px] text-slate-400 font-mono">
                        Pop: {country.populationMln} Million Citizens (Per-Capita Weighted)
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border whitespace-nowrap ${
                      country.status === 'Surge Producer (+Bonus Pool Inflow)'
                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                        : country.status === 'Slack Penalty (Redistributed Outward)'
                        ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                        : 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
                    }`}
                  >
                    {country.redistributionDeltaPct > 0 ? `+${country.redistributionDeltaPct}% Bonus` : country.redistributionDeltaPct < 0 ? `${country.redistributionDeltaPct}% Penalty` : 'Baseline'}
                  </span>
                </div>

                {/* Primary Payout Metric */}
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Net Citizen Monthly Income</div>
                    <div className={`text-xl font-mono font-extrabold ${
                      country.actualDynamicMonthlyPayoutUsd >= 1800
                        ? 'text-emerald-400'
                        : country.actualDynamicMonthlyPayoutUsd < 1200
                        ? 'text-rose-400'
                        : 'text-white'
                    }`}>
                      ${country.actualDynamicMonthlyPayoutUsd.toLocaleString()} <span className="text-xs font-sans text-slate-400 font-normal">/ mo</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Annual Equivalent</div>
                    <div className="text-xs font-mono font-bold text-slate-300">
                      ${(country.actualDynamicMonthlyPayoutUsd * 12).toLocaleString()} / yr
                    </div>
                  </div>
                </div>

                {/* Production Diagnostics (Human Effort vs AI vs Slack) */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Human Effort / Diligence:</span>
                    <span className="font-mono font-bold text-slate-200">{country.humanEffortProductivityScore}%</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-cyan-400 flex items-center gap-1">
                      <Cpu className="w-3 h-3" />
                      AI Job Displacement (Protected):
                    </span>
                    <span className="font-mono font-bold text-cyan-300">{country.aiAutomationDisplacementPct}%</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-rose-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Human-Caused Slack Drop:
                    </span>
                    <span className={`font-mono font-bold ${country.humanCausedSlackDropPct > 15 ? 'text-rose-400' : 'text-slate-300'}`}>
                      {country.humanCausedSlackDropPct}%
                    </span>
                  </div>
                </div>

                {/* Mutual Aid Score (Who to Call on for Help) */}
                <div className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-700/60 space-y-1.5">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-amber-300 font-bold flex items-center gap-1">
                      <HeartHandshake className="w-3.5 h-3.5 text-amber-400" />
                      Global Mutual Aid Reliability Score:
                    </span>
                    <span className={`font-mono font-extrabold ${
                      country.mutualAidReliabilityIndex >= 90
                        ? 'text-emerald-400'
                        : country.mutualAidReliabilityIndex >= 80
                        ? 'text-amber-300'
                        : 'text-rose-400'
                    }`}>
                      {country.mutualAidReliabilityIndex}/100
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-1">
                    {country.strengths.map((str, idx) => (
                      <span
                        key={idx}
                        className="text-[9px] px-1.5 py-0.5 rounded bg-slate-700/80 text-slate-200 border border-slate-600/50"
                      >
                        {str}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Redistribution Flow Footer */}
                <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-800 flex items-center justify-between">
                  {country.redistributionAmountMonthlyUsd > 0 ? (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      Receiving +${(country.redistributionAmountMonthlyUsd / 1_000_000_000).toFixed(1)}B/mo in bonus inflows
                    </span>
                  ) : country.redistributionAmountMonthlyUsd < 0 ? (
                    <span className="text-rose-400 flex items-center gap-1">
                      <ArrowDownRight className="w-3 h-3" />
                      Surrendering ${(Math.abs(country.redistributionAmountMonthlyUsd) / 1_000_000_000).toFixed(1)}B/mo to diligent nations
                    </span>
                  ) : (
                    <span className="text-slate-400">
                      Standard per-capita baseline equilibrium
                    </span>
                  )}
                </div>

              </div>
            ))}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-VIEW 3: MACRO FUND NUMBERS ($4.50T & $225B/YR)                        */}
      {/* ========================================================================= */}
      {activeSubTab === 'macro-fund' && (
        <div className="space-y-6">
          {/* 3 Main Highlight Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <Globe2 className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/30">
                  Planetary Benchmark
                </span>
              </div>
              <div>
                <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total Global Net Worth</div>
                <div className="text-2xl sm:text-3xl font-mono font-extrabold text-white mt-1">
                  $450 Trillion
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  $450,000,000,000,000 total global household wealth base.
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/90 border border-emerald-500/30 shadow-xl space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Coins className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  1.0% Inflow Pledge
                </span>
              </div>
              <div>
                <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Fund for Humanity Endowment</div>
                <div className="text-2xl sm:text-3xl font-mono font-extrabold text-emerald-400 mt-1">
                  $4.50 Trillion
                </div>
                <div className="text-xs text-emerald-500/80 mt-1 font-mono">
                  $4,500,000,000,000 injected into sovereign smart vaults.
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/90 border border-indigo-500/30 shadow-xl space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                  5.0% Baseline Yield
                </span>
              </div>
              <div>
                <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Perpetual Annual Distribution</div>
                <div className="text-2xl sm:text-3xl font-mono font-extrabold text-indigo-300 mt-1">
                  $225 Billion / Year
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  $225,000,000,000 recurring annual liquidity distributed perpetually.
                </div>
              </div>
            </div>

          </div>

          {/* Allocation Breakdown Table */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  Programmatic Annual Yield Allocation Matrix (Smart Contract Enforced)
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Baseline annual yield of $225 Billion distributed across 5 core societal tiers:
                </p>
              </div>

              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                Zero Debt • 100% Asset-Backed
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              
              <div className="p-4 rounded-xl bg-slate-800/60 border border-emerald-500/30 space-y-2">
                <div className="text-[11px] font-bold text-emerald-400 flex items-center justify-between">
                  <span>CREATORS RESTITUTION</span>
                  <span>40%</span>
                </div>
                <div className="text-xl font-mono font-extrabold text-white">
                  $90.00B <span className="text-xs font-sans text-slate-400">/ yr</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">
                  Direct micro-royalties to coders, writers, artists, and testers whose work trains AI models.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/60 border border-blue-500/30 space-y-2">
                <div className="text-[11px] font-bold text-blue-400 flex items-center justify-between">
                  <span>UNIVERSAL MONTHLY LIVING</span>
                  <span>30%</span>
                </div>
                <div className="text-xl font-mono font-extrabold text-white">
                  $67.50B <span className="text-xs font-sans text-slate-400">/ yr</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">
                  Universal guaranteed monthly living baseline payments distributed per capita.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/60 border border-purple-500/30 space-y-2">
                <div className="text-[11px] font-bold text-purple-400 flex items-center justify-between">
                  <span>COMPUTE COMMONS</span>
                  <span>15%</span>
                </div>
                <div className="text-xl font-mono font-extrabold text-white">
                  $33.75B <span className="text-xs font-sans text-slate-400">/ yr</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">
                  Decentralized GPU training clusters and zero-monopoly open-weights infrastructure.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/60 border border-amber-500/30 space-y-2">
                <div className="text-[11px] font-bold text-amber-400 flex items-center justify-between">
                  <span>PUBLIC GOODS & EDU</span>
                  <span>10%</span>
                </div>
                <div className="text-xl font-mono font-extrabold text-white">
                  $22.50B <span className="text-xs font-sans text-slate-400">/ yr</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">
                  Open-source toolchains, global digital literacy, and AI safety alignment research.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/60 border border-rose-500/30 space-y-2">
                <div className="text-[11px] font-bold text-rose-400 flex items-center justify-between">
                  <span>SECURITY & RESERVE</span>
                  <span>5%</span>
                </div>
                <div className="text-xl font-mono font-extrabold text-white">
                  $11.25B <span className="text-xs font-sans text-slate-400">/ yr</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">
                  Validator staking rewards, proof-of-restitution audits, and contingency stabilization.
                </p>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-VIEW 4: DYNAMIC PRODUCTIVITY YIELD ENGINE                             */}
      {/* ========================================================================= */}
      {activeSubTab === 'productivity-engine' && (
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/90 border border-indigo-500/30 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">MATHEMATICAL YIELD FORMULA</span>
                <h2 className="text-xl font-bold text-white mt-1">
                  Dynamic Productivity Multiplier: Society Investing In Itself
                </h2>
                <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                  Yield is mathematically bound to societal diligence, active contribution hours, and verified innovation commits.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-indigo-950/60 border border-indigo-500/40 text-center sm:text-right shrink-0">
                <div className="text-[10px] text-indigo-300 font-bold uppercase">Dynamic Yield Multiplier</div>
                <div className="text-2xl font-mono font-extrabold text-amber-400">
                  {dynamicProductivityMultiplier}x
                </div>
                <div className="text-[10px] text-slate-400">
                  Current Annual Yield: {formatTrillions(dynamicAnnualYieldUsd)}/yr
                </div>
              </div>
            </div>

            {/* Formula Callout */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 space-y-2">
              <div className="text-emerald-400 font-bold text-sm">
                Annual Yield = Base ($225B) × (Productivity / 80) × (Participation / 75) × Innovation
              </div>
              <div className="text-slate-400 text-[11px]">
                = $225,000,000,000 × ({productivityScore}/80) × ({workforceParticipation}/75) × {innovationMultiplier} = <strong className="text-white">{formatTrillions(dynamicAnnualYieldUsd)} USD/Year</strong>
              </div>
            </div>

            {/* Explanatory Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-2">
                <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4" />
                  Growth Phase Dividend Expansion
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  When human contributors and software developers deliver high-quality work, the fund expands dynamically, multiplying restitution payouts without inflation or sovereign debt.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-2">
                <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" />
                  Contraction Safeguard & Anti-Slack Protection
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  If collective participation drops due to human laziness, payouts contract proportionally, preserving the core endowment principal while re-routing funds to hardworking communities.
                </p>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-VIEW 5: BLOCKCHAIN NUTS & BOLTS                                       */}
      {/* ========================================================================= */}
      {activeSubTab === 'blockchain-nuts-bolts' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-cyan-500/30 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">LAYER-1 INITIATIVE SPECIFICATION</span>
                <h2 className="text-xl font-bold text-white mt-1">
                  Sovereign Blockchain Architecture: Nuts & Bolts
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  High-throughput, Byzantine fault-tolerant Proof-of-Restitution blockchain engineered for real-time micro-royalties.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  55,000+ TPS • 850ms Finality
                </span>
              </div>
            </div>

            {/* Architecture Cards */}
            <div className="space-y-4">
              {nutsAndBoltsSpecs.map((spec, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-xl bg-slate-800/50 border border-slate-700/80 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {spec.layer}
                      </span>
                      <h3 className="text-sm font-bold text-white mt-1">{spec.title}</h3>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {spec.technologyStack.map((tech, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-700"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{spec.specification}</p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-700/60">
                    {Object.entries(spec.keyParameters).map(([paramKey, paramVal]) => (
                      <div key={paramKey} className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                        <div className="text-[9px] text-slate-400 uppercase font-semibold">{paramKey}</div>
                        <div className="text-xs font-mono font-bold text-cyan-300 mt-0.5">{paramVal}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-VIEW 6: WHITEPAPERS & LEGAL BLUEPRINTS                                */}
      {/* ========================================================================= */}
      {activeSubTab === 'whitepapers-legal' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Document Selector Sidebar */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                Whitepapers & Legal Charters
              </h3>

              <div className="space-y-2">
                {documentSpecs.map((doc) => (
                  <button
                    key={doc.id}
                    onClick={() => setSelectedDocId(doc.id)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                      selectedDocId === doc.id
                        ? 'bg-indigo-950/80 border-indigo-500 text-white shadow-lg'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                      <span className="font-mono font-bold text-indigo-400">{doc.code}</span>
                      <span className="px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">{doc.category}</span>
                    </div>
                    <div className="text-xs font-bold text-white line-clamp-1">{doc.title}</div>
                    <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-between">
                      <span>Status: {doc.status}</span>
                      <ArrowRight className="w-3 h-3 text-slate-500" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Document Viewer */}
            <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-indigo-400">{selectedDoc.code}</span>
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                      {selectedDoc.status}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-white">{selectedDoc.title}</h2>
                  <div className="text-xs text-slate-400">{selectedDoc.jurisdictionOrStandard}</div>
                </div>

                <button
                  onClick={() => handleDownloadSpec(selectedDoc.downloadFilename, selectedDoc.title)}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/10 transition-all cursor-pointer shrink-0"
                >
                  <Download className="w-4 h-4" />
                  Download Blueprint
                </button>
              </div>

              {/* Summary */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Executive Scope</h4>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-800/40 p-4 rounded-xl border border-slate-700/60">
                  {selectedDoc.summary}
                </p>
              </div>

              {/* Key Sections & Clauses */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Mandatory Articles & Clauses</h4>
                <div className="space-y-2">
                  {selectedDoc.keySections.map((sec, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/80 text-xs text-slate-200 flex items-start gap-2.5"
                    >
                      <FileText className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                      <span>{sec}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer Stamp */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                <div className="flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Immutable C2PA Provenance Hash: SHA-256 (0x7f8a...c92b)</span>
                </div>
                <span>The H.U.M.A.N. Initiative Legal Repository</span>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-VIEW 7: FOUNDER ACTION PLAN (CHECKLIST)                               */}
      {/* ========================================================================= */}
      {activeSubTab === 'founder-roadmap' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-amber-500/30 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">FOUNDER ACTION ROADMAP</span>
                <h2 className="text-xl font-bold text-white mt-1">
                  Nuts-to-Bolts Execution Checklist (From Legal to Genesis TGE)
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  The complete step-by-step master plan required to launch the sovereign blockchain and activate the 1% Humanity Fund.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-[11px] text-slate-400 font-semibold">Progress</div>
                  <div className="text-lg font-mono font-bold text-amber-400">
                    {actionItems.filter((i) => i.completed).length} of {actionItems.length} Done
                  </div>
                </div>
              </div>
            </div>

            {/* Action Items List */}
            <div className="space-y-4">
              {actionItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleActionItem(item.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-4 ${
                    item.completed
                      ? 'bg-emerald-950/20 border-emerald-500/40 text-slate-300'
                      : 'bg-slate-800/60 border-slate-700/80 hover:border-amber-500/50 text-white'
                  }`}
                >
                  <div className="pt-0.5">
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => toggleActionItem(item.id)}
                      className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                    />
                  </div>

                  <div className="flex-1 space-y-2 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-700 text-slate-300">
                          {item.phase.split(':')[0]}
                        </span>
                        <span className={`text-xs font-bold ${item.completed ? 'text-emerald-300 line-through' : 'text-slate-100'}`}>
                          {item.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-[10px]">
                        <span
                          className={`px-2 py-0.5 rounded font-semibold ${
                            item.priority === 'Critical Path'
                              ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                              : 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30'
                          }`}
                        >
                          {item.priority}
                        </span>
                        <span className="text-slate-400 font-mono">{item.estimatedDuration}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>

                    <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-[11px] border-t border-slate-700/40">
                      <div className="text-slate-400">
                        <strong className="text-slate-300">Deliverable:</strong> {item.deliverable}
                      </div>
                      <div className="text-slate-500 text-[10px]">
                        Dependencies: {item.dependencies.join(', ')}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
