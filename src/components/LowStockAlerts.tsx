import React, { useState } from 'react';
import {
  AlertTriangle,
  PackageCheck,
  MessageCircle,
  Barcode,
  Plus,
  Minus,
  RotateCcw,
  BellRing,
  Truck,
  CheckCircle2,
  SlidersHorizontal,
  ShoppingBag,
} from 'lucide-react';

export interface InventoryProduct {
  id: string;
  name: string;
  category: string;
  barcode: string;
  unitLabel: string;
  currentStock: number;
  minThreshold: number;
  reorderQty: number;
  supplierName: string;
  supplierPhone: string;
  unitCostYER: number;
}

const INITIAL_INVENTORY: InventoryProduct[] = [
  {
    id: 'inv-1',
    name: 'عسل سدر مأربي فاخر (عبوة ملكية)',
    category: 'عسل وتمور',
    barcode: '628100982101',
    unitLabel: 'عبوة ملكية',
    currentStock: 3,
    minThreshold: 8,
    reorderQty: 15,
    supplierName: 'مناحل وادي سبأ - مأرب',
    supplierPhone: '967775526937',
    unitCostYER: 14500,
  },
  {
    id: 'inv-2',
    name: 'بن يمني خولاني محمص (علبة محكمة)',
    category: 'قهوة وشاي',
    barcode: '628100982102',
    unitLabel: 'علبة محكمة',
    currentStock: 0,
    minThreshold: 10,
    reorderQty: 25,
    supplierName: 'مؤسسة البن اليمني للتجارة',
    supplierPhone: '967775526937',
    unitCostYER: 4800,
  },
  {
    id: 'inv-3',
    name: 'حليب مجفف كامل الدسم (علبة معدنية)',
    category: 'مواد غذائية',
    barcode: '628100982107',
    unitLabel: 'علبة معدنية',
    currentStock: 5,
    minThreshold: 12,
    reorderQty: 30,
    supplierName: 'شركة التوريدات الغذائية - مأرب',
    supplierPhone: '967775526937',
    unitCostYER: 3900,
  },
  {
    id: 'inv-4',
    name: 'زيت سمسم بلدي نقي (عبوة أصلية)',
    category: 'زيوت طبيعية',
    barcode: '628100982106',
    unitLabel: 'عبوة أصلية',
    currentStock: 4,
    minThreshold: 10,
    reorderQty: 20,
    supplierName: 'معصرة الخير للزيوت الطبيعية',
    supplierPhone: '967775526937',
    unitCostYER: 3400,
  },
  {
    id: 'inv-5',
    name: 'تمر سكري فاخر معبأ (علبة ممتازة)',
    category: 'عسل وتمور',
    barcode: '628100982103',
    unitLabel: 'علبة ممتازة',
    currentStock: 28,
    minThreshold: 10,
    reorderQty: 20,
    supplierName: 'مؤسسة الواحة للتمور',
    supplierPhone: '967775526937',
    unitCostYER: 2100,
  },
  {
    id: 'inv-6',
    name: 'شاي كبوس فاخر (علبة كبيرة)',
    category: 'قهوة وشاي',
    barcode: '628100982105',
    unitLabel: 'علبة كبيرة',
    currentStock: 42,
    minThreshold: 15,
    reorderQty: 40,
    supplierName: 'شركة التوريدات الغذائية - مأرب',
    supplierPhone: '967775526937',
    unitCostYER: 1850,
  },
];

export const LowStockAlerts: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryProduct[]>(INITIAL_INVENTORY);
  const [filterMode, setFilterMode] = useState<'low-only' | 'all'>('low-only');
  const [storeTitle, setStoreTitle] = useState<string>('مركز سبأ التجاري - مأرب المدينة');
  const [customSupplierPhone, setCustomSupplierPhone] = useState<string>('775526937');
  const [recentlyOrderedIds, setRecentlyOrderedIds] = useState<Record<string, boolean>>({});

  // Analyze inventory to identify items that are Out of Stock or Low Stock (currentStock <= minThreshold)
  const lowStockItems = inventory.filter((item) => item.currentStock <= item.minThreshold);
  const outOfStockCount = inventory.filter((item) => item.currentStock === 0).length;
  const criticalLowCount = lowStockItems.length - outOfStockCount;
  const healthyStockCount = inventory.length - lowStockItems.length;

  const displayedItems = filterMode === 'low-only' ? lowStockItems : inventory;

  const totalEstimatedReorderCost = lowStockItems.reduce(
    (sum, item) => sum + item.reorderQty * item.unitCostYER,
    0
  );

  // Adjust current stock to test live low-stock detection
  const handleAdjustStock = (id: string, delta: number) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, currentStock: Math.max(0, item.currentStock + delta) }
          : item
      )
    );
  };

  // Adjust reorder quantity for a specific product
  const handleAdjustReorderQty = (id: string, newQty: number) => {
    const safeQty = Math.max(1, Math.min(500, Math.round(newQty || 1)));
    setInventory((prev) =>
      prev.map((item) => (item.id === id ? { ...item, reorderQty: safeQty } : item))
    );
  };

  const handleSimulateRushSales = () => {
    setInventory((prev) =>
      prev.map((item) => ({
        ...item,
        currentStock: Math.max(0, item.currentStock - Math.floor(Math.random() * 8 + 3)),
      }))
    );
  };

  const handleResetInventory = () => {
    setInventory(INITIAL_INVENTORY);
    setRecentlyOrderedIds({});
  };

  // Format phone number for wa.me link
  const getFormattedWhatsAppPhone = (fallbackPhone: string): string => {
    const cleaned = customSupplierPhone.replace(/\D/g, '');
    if (!cleaned) return fallbackPhone;
    if (cleaned.startsWith('967')) return cleaned;
    if (cleaned.startsWith('0')) return `967${cleaned.slice(1)}`;
    return `967${cleaned}`;
  };

  // Build ready-made WhatsApp message for single item reorder
  const buildSingleOrderWhatsAppUrl = (item: InventoryProduct): string => {
    const targetPhone = getFormattedWhatsAppPhone(item.supplierPhone);
    const statusLabel = item.currentStock === 0 ? 'نافد تماماً (0)' : `متبقي ${item.currentStock} ${item.unitLabel}`;
    const message = [
      `السلام عليكم (${item.supplierName})،`,
      `طلبية توريد بضاعة جديدة من: *${storeTitle.trim() || 'متجر برو - مأرب المدينة'}*`,
      `────────────────────`,
      `• الصنف المطلوب: *${item.name}*`,
      `• رقم الباركود: ${item.barcode}`,
      `• حالة المخزون الحالية: ${statusLabel}`,
      `• الكمية المطلوبة للتوريد: *${item.reorderQty} ${item.unitLabel}*`,
      `• التكلفة التقديرية: ${(item.reorderQty * item.unitCostYER).toLocaleString('en-US')} ر.ي`,
      `────────────────────`,
      `يرجى تأكيد توفر الكمية وموعد التوصيل. (تم الإرسال عبر نظام متجر برو POS)`,
    ].join('\n');

    return `https://wa.me/${targetPhone}?text=${encodeURIComponent(message)}`;
  };

  // Build ready-made WhatsApp message for all low-stock items at once
  const buildBulkOrderWhatsAppUrl = (): string => {
    const targetPhone = getFormattedWhatsAppPhone('967775526937');
    const lines = lowStockItems.map(
      (item, idx) =>
        `${idx + 1}. *${item.name}* — المطلوب: *${item.reorderQty} ${item.unitLabel}* (المتبقي: ${item.currentStock})`
    );

    const message = [
      `السلام عليكم ورحمة الله،`,
      `طلبية نواقص مستودع مجمّعة من: *${storeTitle.trim() || 'متجر برو - مأرب المدينة'}*`,
      `عدد الأصناف المطلوبة: ${lowStockItems.length} أصناف`,
      `────────────────────`,
      ...lines,
      `────────────────────`,
      `إجمالي التكلفة التقديرية للطلبية: *${totalEstimatedReorderCost.toLocaleString('en-US')} ر.ي*`,
      `يرجى تجهيز الطلبية وإرسال الفاتورة. (صادر آلياً من نظام متجر برو POS)`,
    ].join('\n');

    return `https://wa.me/${targetPhone}?text=${encodeURIComponent(message)}`;
  };

  const markAsOrdered = (id: string) => {
    setRecentlyOrderedIds((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <section
      id="low-stock-alerts"
      className="py-16 lg:py-24 bg-[#F9F6F0] border-b border-[#231911]/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-600/30 text-amber-900 text-xs font-extrabold mb-3">
              <BellRing className="w-4 h-4 text-amber-700" />
              <span>نظام الإنذار المبكر للمخزون · طلبات توريد فورية عبر واتساب</span>
            </div>
            <h2
              className="text-3xl sm:text-4xl font-extrabold text-[#231911] tracking-tight"
              style={{ textWrap: 'balance' }}
            >
              لوحة تنبيهات نواقص المخزون وإعادة الطلب الذكي
            </h2>
            <p className="text-sm sm:text-base text-[#231911]/75 mt-2 max-w-2xl leading-relaxed">
              يحلل نظام «متجر برو» كميات البضاعة المتبقية في متجرك لحظياً ويبرز الأصناف التي اقتربت من النفاد في لوحة تنبيهات خاصة، مع إرسال رسالة طلبية جاهزة للمورد عبر واتساب بضغطة زر واحدة.
            </p>
          </div>

          {/* Quick Simulation Actions */}
          <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto">
            <button
              type="button"
              onClick={handleSimulateRushSales}
              className="px-4 py-2.5 rounded-xl bg-[#231911] hover:bg-[#35261b] text-[#C9A86A] text-xs font-extrabold flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>محاكاة حركة بيع سريعة (إنقاص المخزون)</span>
            </button>
            <button
              type="button"
              onClick={handleResetInventory}
              className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-[#EFECE6] text-[#231911] border border-[#231911]/15 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>إعادة ضبط الكميات</span>
            </button>
          </div>
        </div>

        {/* Top Summary KPI Strip + Supplier WhatsApp Configuration */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          {/* 3 Status Summary Cards (7 cols) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Out of Stock Card */}
            <div className="bg-red-950 text-white rounded-2xl p-5 border border-red-500/30 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-red-200">أصناف نفدت تماماً</span>
                <span className="w-8 h-8 rounded-lg bg-red-500/20 text-red-300 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </span>
              </div>
              <div className="mt-3">
                <p className="text-3xl font-extrabold font-mono tabular-nums text-red-300">
                  {outOfStockCount}
                </p>
                <p className="text-[11px] text-red-200/75 mt-1">
                  تحتاج طلب توريد فوري اليوم
                </p>
              </div>
            </div>

            {/* Low Stock Near Depletion Card */}
            <div className="bg-[#231911] text-[#F9F6F0] rounded-2xl p-5 border border-[#C9A86A]/40 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#C9A86A]">اقتربت من النفاد</span>
                <span className="w-8 h-8 rounded-lg bg-[#C9A86A]/20 text-[#C9A86A] flex items-center justify-center">
                  <BellRing className="w-4 h-4" />
                </span>
              </div>
              <div className="mt-3">
                <p className="text-3xl font-extrabold font-mono tabular-nums text-[#C9A86A]">
                  {criticalLowCount}
                </p>
                <p className="text-[11px] text-[#F9F6F0]/70 mt-1">
                  وصلت إلى أو أقل من حد الطلب
                </p>
              </div>
            </div>

            {/* Healthy Stock Card */}
            <div className="bg-white text-[#231911] rounded-2xl p-5 border border-[#231911]/12 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#231911]/70">مخزون آمن ومكتمل</span>
                <span className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-700 flex items-center justify-center">
                  <PackageCheck className="w-4 h-4" />
                </span>
              </div>
              <div className="mt-3">
                <p className="text-3xl font-extrabold font-mono tabular-nums text-emerald-700">
                  {healthyStockCount}
                </p>
                <p className="text-[11px] text-[#231911]/60 mt-1">
                  كميات كافية فوق حد التنبيه
                </p>
              </div>
            </div>
          </div>

          {/* Supplier WhatsApp Order Settings Bar (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-[#231911]/12 flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-3">
              <SlidersHorizontal className="w-4 h-4 text-[#9A7432]" />
              <span className="text-xs sm:text-sm font-extrabold text-[#231911]">
                إعدادات رسالة طلب التوريد للمورد عبر واتساب
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="low-stock-store-name"
                  className="block text-[11px] font-bold text-[#231911]/70 mb-1"
                >
                  اسم متجرك في رسالة الطلب
                </label>
                <input
                  id="low-stock-store-name"
                  type="text"
                  value={storeTitle}
                  onChange={(e) => setStoreTitle(e.target.value)}
                  placeholder="مركز سبأ التجاري - مأرب"
                  className="w-full px-3 py-2 rounded-xl bg-[#F9F6F0] border border-[#231911]/15 text-xs font-bold text-[#231911] focus:outline-none focus:border-[#C9A86A]"
                />
              </div>

              <div>
                <label
                  htmlFor="low-stock-supplier-phone"
                  className="block text-[11px] font-bold text-[#231911]/70 mb-1"
                >
                  رقم واتساب المورد (للتجربة الفورية)
                </label>
                <input
                  id="low-stock-supplier-phone"
                  type="tel"
                  dir="ltr"
                  value={customSupplierPhone}
                  onChange={(e) => setCustomSupplierPhone(e.target.value)}
                  placeholder="775526937"
                  className="w-full px-3 py-2 rounded-xl bg-[#F9F6F0] border border-[#231911]/15 text-xs font-mono tabular-nums font-bold text-right text-[#231911] focus:outline-none focus:border-[#C9A86A]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Dedicated Low-Stock Alert Panel Container */}
        <div className="bg-white rounded-3xl border border-[#231911]/12 shadow-sm overflow-hidden">
          {/* Panel Filter & Bulk Action Header */}
          <div className="bg-[#231911] text-[#F9F6F0] px-6 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center p-1 rounded-xl bg-[#18110B] border border-[#F9F6F0]/10">
                <button
                  type="button"
                  onClick={() => setFilterMode('low-only')}
                  className={`px-3.5 py-2 rounded-lg text-xs font-extrabold transition-colors cursor-pointer flex items-center gap-2 ${
                    filterMode === 'low-only'
                      ? 'bg-[#C9A86A] text-[#231911]'
                      : 'text-[#F9F6F0]/75 hover:text-white'
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>أصناف قاربت على النفاد ({lowStockItems.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFilterMode('all')}
                  className={`px-3.5 py-2 rounded-lg text-xs font-extrabold transition-colors cursor-pointer flex items-center gap-2 ${
                    filterMode === 'all'
                      ? 'bg-[#C9A86A] text-[#231911]'
                      : 'text-[#F9F6F0]/75 hover:text-white'
                  }`}
                >
                  <span>كافة أصناف المستودع ({inventory.length})</span>
                </button>
              </div>

              <span className="text-xs text-[#F9F6F0]/65">
                جرب إنقاص أو زيادة المخزون بـ (+/-) لمشاهدة التحديث التلقائي للإنذارات
              </span>
            </div>

            {lowStockItems.length > 0 && (
              <a
                href={buildBulkOrderWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold flex items-center justify-center gap-2 transition-colors shadow-sm whitespace-nowrap"
              >
                <MessageCircle className="w-4 h-4" />
                <span>
                  إرسال طلبية مجمّعة بجميع النواقص ({lowStockItems.length} أصناف) عبر واتساب
                </span>
              </a>
            )}
          </div>

          {/* Alerts Cards / Rows List */}
          <div className="p-6">
            {displayedItems.length === 0 ? (
              <div className="text-center py-12 bg-[#F9F6F0] rounded-2xl border border-[#231911]/10">
                <PackageCheck className="w-10 h-10 text-emerald-600 mx-auto mb-3" />
                <h3 className="text-lg font-extrabold text-[#231911]">
                  ممتاز! جميع الأصناف في متجرك بكميات آمنة وكافية
                </h3>
                <p className="text-xs sm:text-sm text-[#231911]/65 mt-1">
                  اضغط على «محاكاة حركة بيع سريعة» أو اعرض «كافة أصناف المستودع» لتجربة نظام الإنذار.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {displayedItems.map((item) => {
                  const isOut = item.currentStock === 0;
                  const isLow = item.currentStock <= item.minThreshold;
                  const stockRatio = Math.min(
                    100,
                    Math.round((item.currentStock / Math.max(1, item.minThreshold * 2)) * 100)
                  );
                  const wasOrdered = Boolean(recentlyOrderedIds[item.id]);

                  return (
                    <div
                      key={item.id}
                      className={`rounded-2xl p-5 border transition-all flex flex-col justify-between ${
                        isOut
                          ? 'bg-red-50/50 border-red-500/40'
                          : isLow
                          ? 'bg-amber-50/40 border-[#C9A86A]'
                          : 'bg-[#F9F6F0]/60 border-[#231911]/12'
                      }`}
                    >
                      <div>
                        {/* Card Top Status & Barcode */}
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div>
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              {isOut ? (
                                <span className="px-2.5 py-0.5 rounded-full bg-red-600 text-white text-[11px] font-extrabold inline-flex items-center gap-1">
                                  <AlertTriangle className="w-3 h-3" />
                                  نفد من المخزون (0)
                                </span>
                              ) : isLow ? (
                                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-600/40 text-amber-900 text-[11px] font-extrabold inline-flex items-center gap-1">
                                  <AlertTriangle className="w-3 h-3 text-amber-700" />
                                  اقترب من النفاد
                                </span>
                              ) : (
                                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-800 text-[11px] font-extrabold inline-flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" />
                                  مخزون آمن
                                </span>
                              )}

                              <span className="text-[11px] font-bold text-[#9A7432] bg-white px-2 py-0.5 rounded-md border border-[#231911]/10">
                                {item.unitLabel}
                              </span>
                            </div>

                            <h3 className="text-base sm:text-lg font-extrabold text-[#231911]">
                              {item.name}
                            </h3>
                          </div>

                          <div className="text-left shrink-0">
                            <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#231911]/60 bg-white px-2 py-1 rounded-lg border border-[#231911]/10">
                              <Barcode className="w-3.5 h-3.5 text-[#9A7432]" />
                              {item.barcode.slice(-6)}
                            </span>
                          </div>
                        </div>

                        {/* Supplier Info & Stock Level Bar */}
                        <div className="mb-4 space-y-2">
                          <div className="flex items-center justify-between text-xs text-[#231911]/75">
                            <span className="inline-flex items-center gap-1.5 font-medium">
                              <Truck className="w-3.5 h-3.5 text-[#9A7432]" />
                              <span>المورد: {item.supplierName}</span>
                            </span>
                            <span className="font-mono tabular-nums text-[11px] text-[#231911]/60">
                              حد الطلب الأدنى: {item.minThreshold} {item.unitLabel}
                            </span>
                          </div>

                          <div className="w-full h-2.5 rounded-full bg-[#231911]/10 overflow-hidden">
                            <div
                              style={{ width: `${stockRatio}%` }}
                              className={`h-full transition-all duration-300 ${
                                isOut
                                  ? 'bg-red-600'
                                  : isLow
                                  ? 'bg-amber-500'
                                  : 'bg-emerald-600'
                              }`}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Interactive Controls: Current Stock (+/-) + Reorder Quantity + WhatsApp Reorder Button */}
                      <div className="pt-3.5 border-t border-[#231911]/10 space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          {/* Current Remaining Stock Stepper */}
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-[#231911]/75">
                              المتبقي حالياً:
                            </span>
                            <div className="inline-flex items-center gap-1.5 bg-white rounded-xl px-2 py-1 border border-[#231911]/15">
                              <button
                                type="button"
                                onClick={() => handleAdjustStock(item.id, -1)}
                                aria-label="إنقاص المخزون"
                                className="w-6 h-6 rounded-lg bg-[#F9F6F0] hover:bg-[#231911] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span
                                className={`min-w-8 text-center font-mono tabular-nums text-sm font-extrabold ${
                                  isOut
                                    ? 'text-red-600'
                                    : isLow
                                    ? 'text-amber-800'
                                    : 'text-emerald-700'
                                }`}
                              >
                                {item.currentStock}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleAdjustStock(item.id, 1)}
                                aria-label="زيادة المخزون"
                                className="w-6 h-6 rounded-lg bg-[#F9F6F0] hover:bg-[#231911] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Reorder Quantity Input */}
                          <div className="flex items-center gap-2">
                            <label
                              htmlFor={`reorder-qty-${item.id}`}
                              className="text-xs font-bold text-[#231911]/75"
                            >
                              كمية إعادة الطلب:
                            </label>
                            <input
                              id={`reorder-qty-${item.id}`}
                              type="number"
                              min="1"
                              max="500"
                              value={item.reorderQty}
                              onChange={(e) =>
                                handleAdjustReorderQty(item.id, parseInt(e.target.value, 10))
                              }
                              className="w-16 px-2 py-1 rounded-xl bg-white border border-[#231911]/20 text-center font-mono tabular-nums text-xs font-extrabold text-[#231911] focus:outline-none focus:border-[#C9A86A]"
                            />
                          </div>
                        </div>

                        {/* Direct WhatsApp Reorder Button */}
                        <div className="flex items-center justify-between gap-3">
                          <a
                            href={buildSingleOrderWhatsAppUrl(item)}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => markAsOrdered(item.id)}
                            className={`w-full py-2.5 px-4 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs ${
                              isLow
                                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                : 'bg-[#231911] hover:bg-[#35261b] text-[#F9F6F0]'
                            }`}
                          >
                            <MessageCircle className="w-4 h-4" />
                            <span>
                              إعادة طلب ({item.reorderQty} {item.unitLabel}) عبر واتساب المورد
                            </span>
                          </a>

                          {wasOrdered && (
                            <span className="text-[11px] font-bold text-emerald-700 whitespace-nowrap shrink-0 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>جُهز الطلب</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
