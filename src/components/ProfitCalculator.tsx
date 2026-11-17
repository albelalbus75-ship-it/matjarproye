import React, { useState } from 'react';
import {
  Calculator,
  BarChart3,
  Coins,
  Plus,
  Trash2,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowLeft,
  Package,
  ArrowRightLeft,
  RefreshCw,
} from 'lucide-react';

interface SimulatedReportItem {
  id: string;
  name: string;
  unitLabel: string;
  /** Stored in base YER so changing exchange rate or toggling currency updates all items accurately */
  baseCostYER: number;
  basePriceYER: number;
  dailyQty: number;
}

interface PresetItem {
  id: string;
  name: string;
  unitLabel: string;
  baseCostYER: number;
  basePriceYER: number;
  defaultDailyQty: number;
}

const DEFAULT_EXCHANGE_RATE = 425; // 1 SAR = 425 YER
const QUICK_RATES = [420, 425, 430, 530];

const PRESET_PRODUCTS: PresetItem[] = [
  {
    id: 'preset-honey',
    name: 'عسل سدر مأربي أصلي',
    unitLabel: 'عبوة فاخرة',
    baseCostYER: 14875,
    basePriceYER: 21250,
    defaultDailyQty: 4,
  },
  {
    id: 'preset-coffee',
    name: 'قهوة يمنية مختصة محمصة',
    unitLabel: 'علبة محكمة',
    baseCostYER: 2975,
    basePriceYER: 4250,
    defaultDailyQty: 15,
  },
  {
    id: 'preset-oud',
    name: 'عطر عود ملكي فاخر',
    unitLabel: 'زجاجة 100 مل',
    baseCostYER: 9350,
    basePriceYER: 14450,
    defaultDailyQty: 6,
  },
  {
    id: 'preset-milk',
    name: 'حليب مجفف كامل الدسم',
    unitLabel: 'علبة معدنية',
    baseCostYER: 4250,
    basePriceYER: 5525,
    defaultDailyQty: 20,
  },
];

interface ProfitCalculatorProps {
  onStartTrial?: () => void;
}

export const ProfitCalculator: React.FC<ProfitCalculatorProps> = ({ onStartTrial }) => {
  const [currency, setCurrency] = useState<'YER' | 'SAR'>('YER');
  const [exchangeRate, setExchangeRate] = useState<number>(DEFAULT_EXCHANGE_RATE);
  const [selectedPresetId, setSelectedPresetId] = useState<string>('preset-coffee');

  // Active Calculator Inputs (stored in current selected currency for direct user editing)
  const [itemName, setItemName] = useState<string>('قهوة يمنية مختصة محمصة');
  const [unitLabel, setUnitLabel] = useState<string>('علبة محكمة');
  const [purchaseCost, setPurchaseCost] = useState<number>(2975);
  const [sellingPrice, setSellingPrice] = useState<number>(4250);
  const [dailyQty, setDailyQty] = useState<number>(15);
  const [dailyExpenses, setDailyExpenses] = useState<number>(2125);

  // Simulated POS Profit & Sales Report Table Items (stored in base YER so they convert dynamically)
  const [reportItems, setReportItems] = useState<SimulatedReportItem[]>([
    {
      id: 'rep-1',
      name: 'قهوة يمنية مختصة محمصة',
      unitLabel: 'علبة محكمة',
      baseCostYER: 2975,
      basePriceYER: 4250,
      dailyQty: 15,
    },
    {
      id: 'rep-2',
      name: 'عسل سدر مأربي أصلي',
      unitLabel: 'عبوة فاخرة',
      baseCostYER: 14875,
      basePriceYER: 21250,
      dailyQty: 4,
    },
    {
      id: 'rep-3',
      name: 'عطر عود ملكي فاخر',
      unitLabel: 'زجاجة 100 مل',
      baseCostYER: 9350,
      basePriceYER: 14450,
      dailyQty: 6,
    },
  ]);

  const safeRate = Math.max(1, Number.isFinite(exchangeRate) && exchangeRate > 0 ? exchangeRate : DEFAULT_EXCHANGE_RATE);
  const currencyLabel = currency === 'YER' ? 'ر.ي' : 'ر.س';
  const secondaryCurrencyLabel = currency === 'YER' ? 'ر.س' : 'ر.ي';

  // Helper to round converted currency values cleanly
  const roundCurrencyValue = (val: number, targetCurrency: 'YER' | 'SAR'): number => {
    if (!Number.isFinite(val)) return 0;
    if (targetCurrency === 'YER') {
      return Math.round(val);
    }
    return Math.round(val * 100) / 100;
  };

  // Convert a base YER amount to whichever currency is currently active
  const fromBaseYER = (amountYER: number, targetCurrency: 'YER' | 'SAR' = currency): number => {
    if (targetCurrency === 'YER') {
      return roundCurrencyValue(amountYER, 'YER');
    }
    return roundCurrencyValue(amountYER / safeRate, 'SAR');
  };

  // Convert from active display currency to the other currency for instant dual-currency display
  const toSecondaryCurrency = (amountInActiveCurrency: number): number => {
    if (currency === 'YER') {
      return roundCurrencyValue(amountInActiveCurrency / safeRate, 'SAR');
    }
    return roundCurrencyValue(amountInActiveCurrency * safeRate, 'YER');
  };

  // Switch between YER and SAR from either the top switcher or the Reports Panel switcher
  const handleCurrencySwitch = (newCurrency: 'YER' | 'SAR') => {
    if (newCurrency === currency) return;

    if (newCurrency === 'SAR') {
      setPurchaseCost((prev) => roundCurrencyValue(prev / safeRate, 'SAR'));
      setSellingPrice((prev) => roundCurrencyValue(prev / safeRate, 'SAR'));
      setDailyExpenses((prev) => roundCurrencyValue(prev / safeRate, 'SAR'));
    } else {
      setPurchaseCost((prev) => roundCurrencyValue(prev * safeRate, 'YER'));
      setSellingPrice((prev) => roundCurrencyValue(prev * safeRate, 'YER'));
      setDailyExpenses((prev) => roundCurrencyValue(prev * safeRate, 'YER'));
    }

    setCurrency(newCurrency);
  };

  // Handle exchange rate update and automatically update displayed values if needed
  const handleExchangeRateChange = (newRateInput: number) => {
    const clampedRate = Math.max(1, Math.min(5000, newRateInput || 1));
    const oldRate = safeRate;
    setExchangeRate(clampedRate);

    // If user is currently viewing in YER and changes the SAR->YER exchange rate,
    // scale active YER inputs proportionally to reflect the new exchange rate
    if (currency === 'YER' && oldRate > 0) {
      const ratio = clampedRate / oldRate;
      setPurchaseCost((prev) => Math.round(prev * ratio));
      setSellingPrice((prev) => Math.round(prev * ratio));
      setDailyExpenses((prev) => Math.round(prev * ratio));
      setReportItems((prevItems) =>
        prevItems.map((item) => ({
          ...item,
          baseCostYER: Math.round(item.baseCostYER * ratio),
          basePriceYER: Math.round(item.basePriceYER * ratio),
        }))
      );
    }
  };

  const handleSelectPreset = (preset: PresetItem) => {
    setSelectedPresetId(preset.id);
    setItemName(preset.name);
    setUnitLabel(preset.unitLabel);
    setPurchaseCost(fromBaseYER(preset.baseCostYER, currency));
    setSellingPrice(fromBaseYER(preset.basePriceYER, currency));
    setDailyQty(preset.defaultDailyQty);
  };

  const handleReset = () => {
    setExchangeRate(DEFAULT_EXCHANGE_RATE);
    const defaultPreset = PRESET_PRODUCTS[1];
    setSelectedPresetId(defaultPreset.id);
    setItemName(defaultPreset.name);
    setUnitLabel(defaultPreset.unitLabel);
    if (currency === 'YER') {
      setPurchaseCost(defaultPreset.baseCostYER);
      setSellingPrice(defaultPreset.basePriceYER);
      setDailyExpenses(2125);
    } else {
      setPurchaseCost(roundCurrencyValue(defaultPreset.baseCostYER / DEFAULT_EXCHANGE_RATE, 'SAR'));
      setSellingPrice(roundCurrencyValue(defaultPreset.basePriceYER / DEFAULT_EXCHANGE_RATE, 'SAR'));
      setDailyExpenses(5);
    }
    setDailyQty(defaultPreset.defaultDailyQty);
  };

  // Single-item instant calculations
  const safeCost = Math.max(0, Number.isFinite(purchaseCost) ? purchaseCost : 0);
  const safePrice = Math.max(0, Number.isFinite(sellingPrice) ? sellingPrice : 0);
  const safeQty = Math.max(1, Number.isFinite(dailyQty) ? Math.round(dailyQty) : 1);
  const safeExpenses = Math.max(0, Number.isFinite(dailyExpenses) ? dailyExpenses : 0);

  const unitProfit = roundCurrencyValue(safePrice - safeCost, currency);
  const grossMarginPercent = safePrice > 0 ? ((safePrice - safeCost) / safePrice) * 100 : 0;
  const markupPercent = safeCost > 0 ? ((safePrice - safeCost) / safeCost) * 100 : 0;

  const dailyRevenue = roundCurrencyValue(safePrice * safeQty, currency);
  const dailyTotalCost = roundCurrencyValue(safeCost * safeQty, currency);
  const dailyGrossProfit = roundCurrencyValue((safePrice - safeCost) * safeQty, currency);
  const dailyNetProfit = roundCurrencyValue(dailyGrossProfit - safeExpenses, currency);
  const monthlyNetProfit = roundCurrencyValue(dailyNetProfit * 30, currency);
  const netMarginAfterExpensesPercent =
    dailyRevenue > 0 ? (dailyNetProfit / dailyRevenue) * 100 : 0;

  // Proportions for visual bar
  const totalBarBase = Math.max(dailyRevenue, dailyTotalCost + safeExpenses, 1);
  const costSharePercent = Math.min(100, Math.max(0, (dailyTotalCost / totalBarBase) * 100));
  const expenseSharePercent = Math.min(
    100 - costSharePercent,
    Math.max(0, (safeExpenses / totalBarBase) * 100)
  );
  const profitSharePercent =
    dailyNetProfit > 0 ? Math.max(0, 100 - costSharePercent - expenseSharePercent) : 0;

  const handleAddToReport = () => {
    const trimmedName = itemName.trim() || 'صنف تجاري';
    const baseCostInYER = currency === 'YER' ? safeCost : Math.round(safeCost * safeRate);
    const basePriceInYER = currency === 'YER' ? safePrice : Math.round(safePrice * safeRate);

    const newItem: SimulatedReportItem = {
      id: `rep-${Date.now()}`,
      name: trimmedName,
      unitLabel: unitLabel.trim() || 'عبوة',
      baseCostYER: baseCostInYER,
      basePriceYER: basePriceInYER,
      dailyQty: safeQty,
    };
    setReportItems((prev) => [...prev, newItem]);
  };

  const handleRemoveReportItem = (id: string) => {
    setReportItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Aggregate Store Report Totals in active currency
  const reportTotals = reportItems.reduce(
    (acc, item) => {
      const unitCostActive = fromBaseYER(item.baseCostYER, currency);
      const unitPriceActive = fromBaseYER(item.basePriceYER, currency);
      const rev = unitPriceActive * item.dailyQty;
      const cost = unitCostActive * item.dailyQty;
      const prof = rev - cost;
      return {
        revenue: roundCurrencyValue(acc.revenue + rev, currency),
        cost: roundCurrencyValue(acc.cost + cost, currency),
        grossProfit: roundCurrencyValue(acc.grossProfit + prof, currency),
        units: acc.units + item.dailyQty,
      };
    },
    { revenue: 0, cost: 0, grossProfit: 0, units: 0 }
  );

  const reportNetAfterExpenses = roundCurrencyValue(
    reportTotals.grossProfit - safeExpenses,
    currency
  );
  const reportOverallMargin =
    reportTotals.revenue > 0 ? (reportNetAfterExpenses / reportTotals.revenue) * 100 : 0;

  // Cross-currency automatic equivalents for the report summary
  const reportRevenueSecondary = toSecondaryCurrency(reportTotals.revenue);
  const reportNetSecondary = toSecondaryCurrency(reportNetAfterExpenses);

  const isLoss = unitProfit < 0 || dailyNetProfit < 0;

  return (
    <section
      id="profit-calculator"
      className="py-16 lg:py-24 bg-[#EFECE6]/70 border-y border-[#231911]/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#231911] text-[#C9A86A] text-xs font-bold mb-3">
              <Calculator className="w-4 h-4" />
              <span>أداة تفاعلية حية · تقارير الأرباح والمبيعات متعددة العملات</span>
            </div>
            <h2
              className="text-3xl sm:text-4xl font-extrabold text-[#231911] tracking-tight"
              style={{ textWrap: 'balance' }}
            >
              حاسبة الأرباح الصافية ولوحة تقارير العملات الفورية
            </h2>
            <p className="text-sm sm:text-base text-[#231911]/75 mt-2 max-w-2xl leading-relaxed">
              أدخل سعر التكلفة وسعر البيع لأي صنف وبدّل فوراً بين الريال اليمني (ر.ي) والريال السعودي (ر.س) مع تحديث تلقائي لقيم الصرف في حاسبة الصنف وفي لوحة تقارير المبيعات والأرباح.
            </p>
          </div>

          {/* Main Currency Switcher + Live Exchange Rate Badge */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 self-start md:self-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#231911]/5 border border-[#231911]/15 text-xs font-bold text-[#231911]">
              <ArrowRightLeft className="w-3.5 h-3.5 text-[#9A7432]" />
              <span>سعر الصرف الفعال:</span>
              <span className="font-mono tabular-nums font-extrabold text-[#9A7432]">
                1 ر.س = {safeRate.toLocaleString('en-US')} ر.ي
              </span>
            </div>

            <div className="inline-flex items-center p-1.5 rounded-xl bg-white border border-[#231911]/15 shadow-xs">
              <button
                type="button"
                onClick={() => handleCurrencySwitch('YER')}
                className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                  currency === 'YER'
                    ? 'bg-[#231911] text-[#C9A86A]'
                    : 'text-[#231911]/70 hover:text-[#231911]'
                }`}
              >
                <Coins className="w-3.5 h-3.5" />
                <span>ريال يمني (ر.ي)</span>
              </button>
              <button
                type="button"
                onClick={() => handleCurrencySwitch('SAR')}
                className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                  currency === 'SAR'
                    ? 'bg-[#231911] text-[#C9A86A]'
                    : 'text-[#231911]/70 hover:text-[#231911]'
                }`}
              >
                <Coins className="w-3.5 h-3.5" />
                <span>ريال سعودي (ر.س)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Preset Quick Selector Bar */}
        <div className="mb-8">
          <p className="text-xs font-bold text-[#231911]/70 mb-2.5">
            اختر صنفاً جاهزاً للتجربة السريعة أو عدّل الأرقام وسعر الصرف بنفسك:
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {PRESET_PRODUCTS.map((preset) => {
              const active = selectedPresetId === preset.id && itemName === preset.name;
              const pCost = fromBaseYER(preset.baseCostYER, currency);
              const pPrice = fromBaseYER(preset.basePriceYER, currency);
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className={`p-3.5 rounded-xl border text-right transition-all cursor-pointer flex flex-col justify-between ${
                    active
                      ? 'bg-[#231911] text-[#F9F6F0] border-[#C9A86A] shadow-md'
                      : 'bg-white text-[#231911] border-[#231911]/10 hover:border-[#C9A86A]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-xs sm:text-sm font-extrabold line-clamp-1">
                      {preset.name}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 ${
                        active
                          ? 'bg-[#C9A86A]/20 text-[#C9A86A]'
                          : 'bg-[#F9F6F0] text-[#9A7432]'
                      }`}
                    >
                      {preset.unitLabel}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] opacity-80 font-mono tabular-nums pt-1 border-t border-current/10">
                    <span>شراء: {pCost.toLocaleString('en-US')}</span>
                    <span className={active ? 'text-[#C9A86A] font-bold' : 'text-emerald-700 font-bold'}>
                      بيع: {pPrice.toLocaleString('en-US')} {currencyLabel}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Calculator Grid: 5 Cols Input Form + 7 Cols Instant Analytics & Report Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* RIGHT COLUMN (RTL): Inputs Panel (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 sm:p-8 border border-[#231911]/10 shadow-sm">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#231911]/10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#231911] text-[#C9A86A] flex items-center justify-center">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-[#231911]">
                    بيانات الصنف والتكلفة
                  </h3>
                  <p className="text-xs text-[#231911]/60">
                    أدخل تكلفة الشراء وسعر البيع بالعبوة أو القطعة
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleReset}
                title="إعادة ضبط القيم"
                className="p-2 rounded-lg text-xs font-bold text-[#231911]/60 hover:text-[#231911] hover:bg-[#F9F6F0] transition-colors flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>إعادة ضبط</span>
              </button>
            </div>

            <div className="space-y-5">
              {/* Product Name & Unit Type */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label
                    htmlFor="calc-item-name"
                    className="block text-xs font-bold text-[#231911]/80 mb-1.5"
                  >
                    اسم الصنف أو المنتج
                  </label>
                  <input
                    id="calc-item-name"
                    type="text"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    placeholder="مثال: عسل سدر مأربي"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F9F6F0] border border-[#231911]/15 text-sm font-bold text-[#231911] focus:outline-none focus:border-[#C9A86A]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="calc-unit-label"
                    className="block text-xs font-bold text-[#231911]/80 mb-1.5"
                  >
                    الوحدة (بدون أوزان)
                  </label>
                  <select
                    id="calc-unit-label"
                    value={unitLabel}
                    onChange={(e) => setUnitLabel(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#F9F6F0] border border-[#231911]/15 text-sm font-bold text-[#231911] focus:outline-none focus:border-[#C9A86A]"
                  >
                    <option value="علبة محكمة">علبة محكمة</option>
                    <option value="عبوة فاخرة">عبوة فاخرة</option>
                    <option value="قطعة / حبة">قطعة / حبة</option>
                    <option value="كرتون كامل">كرتون كامل</option>
                    <option value="زجاجة 100 مل">زجاجة 100 مل</option>
                    <option value="علبة معدنية">علبة معدنية</option>
                  </select>
                </div>
              </div>

              {/* Purchase Cost & Selling Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="calc-purchase-cost"
                    className="block text-xs font-bold text-[#231911]/80 mb-1.5"
                  >
                    سعر التكلفة / الشراء ({currencyLabel})
                  </label>
                  <div className="relative">
                    <input
                      id="calc-purchase-cost"
                      type="number"
                      min="0"
                      step={currency === 'YER' ? '100' : '0.5'}
                      value={purchaseCost}
                      onChange={(e) => setPurchaseCost(parseFloat(e.target.value) || 0)}
                      className="w-full px-3.5 py-3 rounded-xl bg-[#F9F6F0] border border-[#231911]/20 text-base font-extrabold font-mono tabular-nums text-[#231911] focus:outline-none focus:border-[#C9A86A]"
                    />
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#231911]/50">
                      {currencyLabel}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#231911]/55 font-mono tabular-nums mt-1">
                    يعادل تقريباً: {toSecondaryCurrency(safeCost).toLocaleString('en-US')}{' '}
                    {secondaryCurrencyLabel}
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="calc-selling-price"
                    className="block text-xs font-bold text-emerald-800 mb-1.5"
                  >
                    سعر البيع للعميل ({currencyLabel})
                  </label>
                  <div className="relative">
                    <input
                      id="calc-selling-price"
                      type="number"
                      min="0"
                      step={currency === 'YER' ? '100' : '0.5'}
                      value={sellingPrice}
                      onChange={(e) => setSellingPrice(parseFloat(e.target.value) || 0)}
                      className="w-full px-3.5 py-3 rounded-xl bg-emerald-50/60 border-2 border-emerald-600/40 text-base font-extrabold font-mono tabular-nums text-[#231911] focus:outline-none focus:border-emerald-600"
                    />
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-emerald-700">
                      {currencyLabel}
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-800/75 font-mono tabular-nums mt-1">
                    يعادل تقريباً: {toSecondaryCurrency(safePrice).toLocaleString('en-US')}{' '}
                    {secondaryCurrencyLabel}
                  </p>
                </div>
              </div>

              {/* Daily Sold Quantity Slider + Input */}
              <div className="p-4 rounded-xl bg-[#F9F6F0] border border-[#231911]/10">
                <div className="flex items-center justify-between mb-2">
                  <label
                    htmlFor="calc-daily-qty"
                    className="text-xs font-bold text-[#231911]/85"
                  >
                    الكمية المباعة يومياً ({unitLabel})
                  </label>
                  <span className="text-sm font-extrabold font-mono tabular-nums text-[#231911] bg-white px-2.5 py-0.5 rounded-lg border border-[#231911]/15">
                    {safeQty} {unitLabel} / يومياً
                  </span>
                </div>
                <input
                  id="calc-daily-qty"
                  type="range"
                  min="1"
                  max="100"
                  value={safeQty}
                  onChange={(e) => setDailyQty(parseInt(e.target.value, 10) || 1)}
                  className="w-full accent-[#231911] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-[#231911]/55 font-mono mt-1">
                  <span>1 عبوة</span>
                  <span>25 عبوة</span>
                  <span>50 عبوة</span>
                  <span>100 عبوة</span>
                </div>
              </div>

              {/* Optional Daily Expenses */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="calc-daily-expenses"
                    className="text-xs font-bold text-[#231911]/80"
                  >
                    المصروفات اليومية أو الخصومات الممنوحة ({currencyLabel})
                  </label>
                  <span className="text-[11px] text-[#231911]/55">اختياري</span>
                </div>
                <div className="relative">
                  <input
                    id="calc-daily-expenses"
                    type="number"
                    min="0"
                    step={currency === 'YER' ? '500' : '1'}
                    value={dailyExpenses}
                    onChange={(e) => setDailyExpenses(parseFloat(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F9F6F0] border border-[#231911]/15 text-sm font-bold font-mono tabular-nums text-[#231911] focus:outline-none focus:border-[#C9A86A]"
                  />
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#231911]/50">
                    {currencyLabel} / يوم
                  </span>
                </div>
              </div>

              {/* Add to Store Profit Report Button */}
              <button
                type="button"
                onClick={handleAddToReport}
                className="w-full py-3.5 px-5 rounded-xl bg-[#231911] hover:bg-[#35261b] text-[#C9A86A] font-extrabold text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>أضف الصنف إلى جدول محاكاة تقارير المتجر</span>
              </button>
            </div>
          </div>

          {/* LEFT COLUMN (RTL): Live Profit Margin Output & Multi-Currency POS Report Simulation (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Primary Instant Profit & Margin Card */}
            <div className="bg-[#231911] text-[#F9F6F0] rounded-2xl p-6 sm:p-8 border border-[#C9A86A]/35 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-6 border-b border-[#F9F6F0]/10">
                <div>
                  <span className="text-xs font-bold text-[#C9A86A] block">
                    تحليل الربحية الفوري للصنف: {itemName || 'صنف تجاري'}
                  </span>
                  <h3 className="text-lg sm:text-xl font-extrabold text-[#F9F6F0] mt-0.5">
                    نتائج صافي الربح وهامش البيع ({currencyLabel})
                  </h3>
                </div>

                {isLoss ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 border border-red-400/40 text-red-300 text-xs font-bold">
                    <AlertTriangle className="w-4 h-4" />
                    <span>تنبيه: سعر البيع أقل من التكلفة والمصروفات</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>هامش ربح صحي ومربح</span>
                  </span>
                )}
              </div>

              {/* 4 Key Profit Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                {/* Net Profit per Unit */}
                <div className="p-4 rounded-xl bg-[#F9F6F0]/5 border border-[#F9F6F0]/10">
                  <p className="text-xs text-[#F9F6F0]/70 mb-1">ربح العبوة الواحدة</p>
                  <p
                    className={`text-xl sm:text-2xl font-extrabold font-mono tabular-nums ${
                      unitProfit >= 0 ? 'text-[#C9A86A]' : 'text-red-400'
                    }`}
                  >
                    {unitProfit.toLocaleString('en-US')}
                    <span className="text-xs font-normal mr-1">{currencyLabel}</span>
                  </p>
                  <p className="text-[11px] text-[#F9F6F0]/55 font-mono tabular-nums mt-1">
                    ≈ {toSecondaryCurrency(unitProfit).toLocaleString('en-US')}{' '}
                    {secondaryCurrencyLabel}
                  </p>
                </div>

                {/* Gross Profit Margin % */}
                <div className="p-4 rounded-xl bg-[#F9F6F0]/5 border border-[#F9F6F0]/10">
                  <p className="text-xs text-[#F9F6F0]/70 mb-1">هامش الربح من البيع</p>
                  <p
                    className={`text-xl sm:text-2xl font-extrabold font-mono tabular-nums ${
                      grossMarginPercent >= 0 ? 'text-emerald-400' : 'text-red-400'
                    }`}
                  >
                    {grossMarginPercent.toFixed(1)}%
                  </p>
                  <p className="text-[11px] text-[#F9F6F0]/55 mt-1">
                    العائد على التكلفة: {markupPercent.toFixed(1)}%
                  </p>
                </div>

                {/* Daily Net Profit */}
                <div className="p-4 rounded-xl bg-[#F9F6F0]/5 border border-[#F9F6F0]/10">
                  <p className="text-xs text-[#F9F6F0]/70 mb-1">صافي الربح اليومي</p>
                  <p
                    className={`text-xl sm:text-2xl font-extrabold font-mono tabular-nums ${
                      dailyNetProfit >= 0 ? 'text-[#F9F6F0]' : 'text-red-400'
                    }`}
                  >
                    {dailyNetProfit.toLocaleString('en-US')}
                    <span className="text-xs font-normal mr-1">{currencyLabel}</span>
                  </p>
                  <p className="text-[11px] text-[#F9F6F0]/55 font-mono tabular-nums mt-1">
                    ≈ {toSecondaryCurrency(dailyNetProfit).toLocaleString('en-US')}{' '}
                    {secondaryCurrencyLabel} ({safeMarginLabel(netMarginAfterExpensesPercent)})
                  </p>
                </div>

                {/* Monthly Projected Net Profit */}
                <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/35">
                  <p className="text-xs text-emerald-300 font-bold mb-1">
                    صافي الربح الشهري (30 يوماً)
                  </p>
                  <p
                    className={`text-xl sm:text-2xl font-extrabold font-mono tabular-nums ${
                      monthlyNetProfit >= 0 ? 'text-emerald-400' : 'text-red-400'
                    }`}
                  >
                    {monthlyNetProfit.toLocaleString('en-US')}
                    <span className="text-xs font-normal mr-1">{currencyLabel}</span>
                  </p>
                  <p className="text-[11px] text-emerald-200/75 font-mono tabular-nums mt-1">
                    ≈ {toSecondaryCurrency(monthlyNetProfit).toLocaleString('en-US')}{' '}
                    {secondaryCurrencyLabel} شهرياً
                  </p>
                </div>
              </div>

              {/* Visual Breakdown Bar: Cost vs Expenses vs Net Profit */}
              <div className="p-4 rounded-xl bg-[#18110B] border border-[#F9F6F0]/10">
                <div className="flex flex-wrap items-center justify-between text-xs mb-2 gap-2">
                  <span className="font-bold text-[#F9F6F0]/90">
                    توزيع إيرادات المبيعات اليومية ({dailyRevenue.toLocaleString('en-US')}{' '}
                    {currencyLabel})
                  </span>
                  <div className="flex flex-wrap items-center gap-4 text-[11px]">
                    <span className="inline-flex items-center gap-1.5 text-[#F9F6F0]/75">
                      <span className="w-2.5 h-2.5 rounded-xs bg-amber-600/80 inline-block" />
                      تكلفة البضاعة: {costSharePercent.toFixed(0)}%
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-[#F9F6F0]/75">
                      <span className="w-2.5 h-2.5 rounded-xs bg-rose-500/80 inline-block" />
                      المصروفات: {expenseSharePercent.toFixed(0)}%
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-emerald-400 font-bold">
                      <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500 inline-block" />
                      صافي الربح: {profitSharePercent.toFixed(0)}%
                    </span>
                  </div>
                </div>

                <div className="w-full h-3.5 rounded-full bg-[#F9F6F0]/10 overflow-hidden flex">
                  <div
                    style={{ width: `${costSharePercent}%` }}
                    className="h-full bg-amber-600/85 transition-all duration-300"
                    title="تكلفة الشراء"
                  />
                  <div
                    style={{ width: `${expenseSharePercent}%` }}
                    className="h-full bg-rose-500/85 transition-all duration-300"
                    title="المصروفات اليومية"
                  />
                  <div
                    style={{ width: `${profitSharePercent}%` }}
                    className="h-full bg-emerald-500 transition-all duration-300"
                    title="صافي الربح"
                  />
                </div>
              </div>
            </div>

            {/* Simulated Multi-Item POS Profit & Sales Report Panel with Dedicated Currency & Exchange Rate Controls */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#231911]/10 shadow-sm">
              {/* Report Panel Top Bar: Title + Dedicated Report Currency Toggle */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-4 border-b border-[#231911]/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600/10 text-emerald-700 flex items-center justify-center shrink-0">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base sm:text-lg font-extrabold text-[#231911]">
                        لوحة تقارير الأرباح والمبيعات اليومية
                      </h4>
                      <span className="text-[11px] font-mono font-bold text-[#9A7432] bg-[#F9F6F0] px-2.5 py-0.5 rounded-md border border-[#C9A86A]/40">
                        {reportItems.length} أصناف
                      </span>
                    </div>
                    <p className="text-xs text-[#231911]/65 mt-0.5">
                      بدّل عملة التقرير بين الريال اليمني والسعودي مع تحديث فوري لسعر الصرف
                    </p>
                  </div>
                </div>

                {/* Dedicated Currency Switcher inside the Reports Panel */}
                <div
                  className="inline-flex items-center p-1 rounded-xl bg-[#F9F6F0] border border-[#231911]/15 self-start sm:self-auto"
                  role="group"
                  aria-label="اختيار عملة عرض التقرير"
                >
                  <button
                    type="button"
                    onClick={() => handleCurrencySwitch('YER')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                      currency === 'YER'
                        ? 'bg-[#231911] text-[#C9A86A] shadow-xs'
                        : 'text-[#231911]/70 hover:text-[#231911]'
                    }`}
                  >
                    <span>عرض بالريال اليمني (ر.ي)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCurrencySwitch('SAR')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                      currency === 'SAR'
                        ? 'bg-[#231911] text-[#C9A86A] shadow-xs'
                        : 'text-[#231911]/70 hover:text-[#231911]'
                    }`}
                  >
                    <span>عرض بالريال السعودي (ر.س)</span>
                  </button>
                </div>
              </div>

              {/* Automatic Exchange Rate Control Bar inside the Reports Panel */}
              <div className="mb-5 p-3.5 rounded-xl bg-[#F9F6F0] border border-[#C9A86A]/40 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-[#9A7432] shrink-0" />
                  <span className="text-xs font-bold text-[#231911]">
                    تحديث سعر الصرف التلقائي في التقارير (1 ر.س مقابل ر.ي):
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Quick Preset Exchange Rate Buttons */}
                  <div className="inline-flex items-center gap-1">
                    {QUICK_RATES.map((ratePreset) => (
                      <button
                        key={ratePreset}
                        type="button"
                        onClick={() => handleExchangeRateChange(ratePreset)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer ${
                          safeRate === ratePreset
                            ? 'bg-[#231911] text-[#C9A86A]'
                            : 'bg-white text-[#231911]/75 border border-[#231911]/15 hover:border-[#C9A86A]'
                        }`}
                      >
                        {ratePreset}
                      </button>
                    ))}
                  </div>

                  {/* Direct Custom Exchange Rate Input */}
                  <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-[#231911]/20">
                    <span className="text-[11px] font-bold text-[#231911]/60">1 ر.س =</span>
                    <input
                      type="number"
                      min="1"
                      max="5000"
                      step="5"
                      aria-label="سعر صرف الريال السعودي مقابل الريال اليمني"
                      value={exchangeRate}
                      onChange={(e) => handleExchangeRateChange(parseFloat(e.target.value) || DEFAULT_EXCHANGE_RATE)}
                      className="w-16 text-center font-mono tabular-nums text-xs font-extrabold text-[#231911] focus:outline-none"
                    />
                    <span className="text-[11px] font-bold text-[#9A7432]">ر.ي</span>
                  </div>
                </div>
              </div>

              {reportItems.length === 0 ? (
                <div className="text-center py-8 bg-[#F9F6F0]/60 rounded-xl border border-dashed border-[#231911]/15">
                  <p className="text-xs sm:text-sm font-bold text-[#231911]/70">
                    لا توجد أصناف في الجدول حالياً. اضغط «أضف الصنف إلى جدول محاكاة تقارير المتجر» لإضافته.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-right border-collapse">
                    <thead>
                      <tr className="border-b border-[#231911]/10 text-[11px] font-bold text-[#231911]/60">
                        <th className="py-2.5 pr-2">الصنف والوحدة</th>
                        <th className="py-2.5 px-2">الكمية</th>
                        <th className="py-2.5 px-2">التكلفة ({currencyLabel})</th>
                        <th className="py-2.5 px-2">سعر البيع ({currencyLabel})</th>
                        <th className="py-2.5 px-2">المبيعات ({currencyLabel})</th>
                        <th className="py-2.5 px-2">صافي الربح ({currencyLabel})</th>
                        <th className="py-2.5 px-2">الهامش</th>
                        <th className="py-2.5 pl-2 text-center">حذف</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#231911]/8 text-xs sm:text-sm">
                      {reportItems.map((item) => {
                        const itemCostUnit = fromBaseYER(item.baseCostYER, currency);
                        const itemPriceUnit = fromBaseYER(item.basePriceYER, currency);
                        const itemRev = roundCurrencyValue(itemPriceUnit * item.dailyQty, currency);
                        const itemCostTotal = roundCurrencyValue(
                          itemCostUnit * item.dailyQty,
                          currency
                        );
                        const itemProf = roundCurrencyValue(itemRev - itemCostTotal, currency);
                        const itemProfSecondary = toSecondaryCurrency(itemProf);
                        const itemMargin = itemRev > 0 ? (itemProf / itemRev) * 100 : 0;

                        return (
                          <tr key={item.id} className="hover:bg-[#F9F6F0]/60 transition-colors">
                            <td className="py-3 pr-2">
                              <span className="font-bold text-[#231911] block">{item.name}</span>
                              <span className="text-[11px] text-[#9A7432]">{item.unitLabel}</span>
                            </td>
                            <td className="py-3 px-2 font-mono tabular-nums font-bold">
                              {item.dailyQty}
                            </td>
                            <td className="py-3 px-2 font-mono tabular-nums text-[#231911]/75">
                              {itemCostUnit.toLocaleString('en-US')}
                            </td>
                            <td className="py-3 px-2 font-mono tabular-nums font-bold text-[#231911]">
                              {itemPriceUnit.toLocaleString('en-US')}
                            </td>
                            <td className="py-3 px-2 font-mono tabular-nums font-bold text-[#231911]">
                              {itemRev.toLocaleString('en-US')}
                            </td>
                            <td className="py-3 px-2 font-mono tabular-nums">
                              <span
                                className={`font-extrabold block ${
                                  itemProf >= 0 ? 'text-emerald-700' : 'text-red-600'
                                }`}
                              >
                                {itemProf >= 0 ? '+' : ''}
                                {itemProf.toLocaleString('en-US')} {currencyLabel}
                              </span>
                              <span className="text-[10px] text-[#231911]/50 block">
                                ≈ {itemProfSecondary.toLocaleString('en-US')} {secondaryCurrencyLabel}
                              </span>
                            </td>
                            <td className="py-3 px-2 font-mono tabular-nums">
                              <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-bold text-xs">
                                {itemMargin.toFixed(1)}%
                              </span>
                            </td>
                            <td className="py-3 pl-2 text-center">
                              <button
                                type="button"
                                onClick={() => handleRemoveReportItem(item.id)}
                                aria-label={`حذف ${item.name}`}
                                className="p-1.5 rounded-lg text-[#231911]/40 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Summary Footer Strip inside Report Table Card with Dual-Currency Auto-Conversion */}
              <div className="mt-5 pt-4 border-t border-[#231911]/10 flex flex-wrap items-center justify-between gap-4 bg-[#F9F6F0] p-4 rounded-xl">
                <div className="flex flex-wrap items-center gap-6">
                  <div>
                    <span className="text-[11px] text-[#231911]/65 block">
                      إجمالي مبيعات التقرير اليومية
                    </span>
                    <span className="text-sm sm:text-base font-extrabold font-mono tabular-nums text-[#231911] block">
                      {reportTotals.revenue.toLocaleString('en-US')} {currencyLabel}
                    </span>
                    <span className="text-[11px] font-mono tabular-nums text-[#9A7432] font-bold">
                      المعادل التلقائي: {reportRevenueSecondary.toLocaleString('en-US')}{' '}
                      {secondaryCurrencyLabel}
                    </span>
                  </div>

                  <div className="pr-4 border-r border-[#231911]/10">
                    <span className="text-[11px] text-[#231911]/65 block">
                      صافي ربح التقرير (بعد المصروفات)
                    </span>
                    <span className="text-sm sm:text-base font-extrabold font-mono tabular-nums text-emerald-700 block">
                      {reportNetAfterExpenses.toLocaleString('en-US')} {currencyLabel} (
                      {reportOverallMargin.toFixed(1)}%)
                    </span>
                    <span className="text-[11px] font-mono tabular-nums text-emerald-800/80 font-bold">
                      المعادل التلقائي: {reportNetSecondary.toLocaleString('en-US')}{' '}
                      {secondaryCurrencyLabel}
                    </span>
                  </div>
                </div>

                {onStartTrial && (
                  <button
                    type="button"
                    onClick={onStartTrial}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>فعّل تقارير الأرباح في متجرك مجاناً</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

function safeMarginLabel(margin: number): string {
  if (!Number.isFinite(margin)) return '0.0%';
  return `هامش صافي ${margin.toFixed(1)}%`;
}
