import React, { useState } from 'react';
import {
  Printer,
  Barcode,
  Plus,
  Minus,
  RotateCcw,
  CheckCircle2,
  Receipt,
  QrCode,
  WifiOff,
  Store,
  Settings,
  MapPin,
  Phone,
} from 'lucide-react';

export interface PosProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  barcode: string;
  stock: number;
}

export interface CartItem extends PosProduct {
  qty: number;
}

const YEMENI_PRODUCTS: PosProduct[] = [
  {
    id: 'p1',
    name: 'عسل سدر يمني فاخر (عبوة ملكية)',
    category: 'عسل وتمور',
    price: 18500,
    barcode: '628100982101',
    stock: 24,
  },
  {
    id: 'p2',
    name: 'بن يمني خولاني محمص (عبوة مغلفة)',
    category: 'قهوة وشاي',
    price: 6200,
    barcode: '628100982102',
    stock: 42,
  },
  {
    id: 'p3',
    name: 'تمر فاخر معبأ (علبة ممتازة)',
    category: 'عسل وتمور',
    price: 2800,
    barcode: '628100982103',
    stock: 65,
  },
  {
    id: 'p4',
    name: 'بهارات مشكلة فاخرة (علبة محكمة)',
    category: 'بهارات وعطارة',
    price: 1500,
    barcode: '628100982104',
    stock: 80,
  },
  {
    id: 'p5',
    name: 'شاي كبوس فاخر (علبة كبيرة)',
    category: 'قهوة وشاي',
    price: 2400,
    barcode: '628100982105',
    stock: 110,
  },
  {
    id: 'p6',
    name: 'زيت سمسم بلدي (عبوة أصلية)',
    category: 'زيوت طبيعية',
    price: 4500,
    barcode: '628100982106',
    stock: 19,
  },
];

export const ThermalReceiptDemo: React.FC = () => {
  const [paperSize, setPaperSize] = useState<'80mm' | '58mm'>('80mm');
  const [paymentMethod, setPaymentMethod] = useState<'نقداً (كاش)' | 'حوالة / العمقي'>('نقداً (كاش)');
  const [discount, setDiscount] = useState<number>(500);
  const [invoiceNumber, setInvoiceNumber] = useState<number>(10482);
  const [lastScannedBarcode, setLastScannedBarcode] = useState<string | null>(null);
  const [isPrinting, setIsPrinting] = useState<boolean>(false);
  const [printSuccess, setPrintSuccess] = useState<boolean>(false);

  // Live Customizable Receipt Header Settings
  const [storeName, setStoreName] = useState<string>('مركز سبأ التجاري للتسوق');
  const [storePhone, setStorePhone] = useState<string>('775526937');
  const [storeLocation, setStoreLocation] = useState<string>('مأرب - المدينة - الشارع العام');

  const [cart, setCart] = useState<CartItem[]>([
    { ...YEMENI_PRODUCTS[0], qty: 1 },
    { ...YEMENI_PRODUCTS[1], qty: 2 },
    { ...YEMENI_PRODUCTS[3], qty: 1 },
  ]);

  const addToCart = (product: PosProduct) => {
    setPrintSuccess(false);
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const updateQty = (id: string, delta: number) => {
    setPrintSuccess(false);
    setCart((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, qty: item.qty + delta } : item))
        .filter((item) => item.qty > 0)
    );
  };

  const simulateBarcodeScan = () => {
    const randomProduct =
      YEMENI_PRODUCTS[Math.floor(Math.random() * YEMENI_PRODUCTS.length)];
    setLastScannedBarcode(`${randomProduct.barcode} — ${randomProduct.name}`);
    addToCart(randomProduct);
    setTimeout(() => {
      setLastScannedBarcode(null);
    }, 2600);
  };

  const resetDemo = () => {
    setCart([
      { ...YEMENI_PRODUCTS[0], qty: 1 },
      { ...YEMENI_PRODUCTS[1], qty: 2 },
      { ...YEMENI_PRODUCTS[3], qty: 1 },
    ]);
    setDiscount(500);
    setStoreName('مركز سبأ التجاري للتسوق');
    setStorePhone('775526937');
    setStoreLocation('مأرب - المدينة - الشارع العام');
    setInvoiceNumber((n) => n + 1);
    setPrintSuccess(false);
  };

  const handlePrint = () => {
    if (cart.length === 0) return;
    setIsPrinting(true);
    setPrintSuccess(false);
    setTimeout(() => {
      setIsPrinting(false);
      setPrintSuccess(true);
      setInvoiceNumber((n) => n + 1);
    }, 650);
  };

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const effectiveDiscount = subtotal > discount ? discount : 0;
  const finalTotal = Math.max(0, subtotal - effectiveDiscount);

  return (
    <section id="receipt-demo" className="py-20 bg-[#231911] text-[#F9F6F0] border-y border-[#C9A86A]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <p className="text-sm font-medium text-[#C9A86A] mb-2">
              معاينة حية لنظام الكاشير والطباعة الحرارية · يعمل بدون إنترنت
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#F9F6F0] tracking-tight" style={{ textWrap: 'balance' }}>
              جرب إصدار فاتورة فورية وعاين مقاس الطباعة الحرارية
            </h2>
          </div>
          <p className="text-base text-[#F9F6F0]/75 max-w-md leading-relaxed">
            اضغط على الأصناف أو امسح الباركود لتجربة سرعة الكاشير، وبدّل بين مقاس ورق 80mm و 58mm كما يظهر في طابعتك الحرارية تماماً.
          </p>
        </div>

        {/* Interactive Split Grid: Left = Cashier Control Panel, Right = Realistic Thermal Receipt */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* POS Interactive Terminal (7 columns) */}
          <div className="lg:col-span-7 bg-[#2E2118] border border-[#C9A86A]/20 rounded-2xl p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-5 mb-6 border-b border-[#F9F6F0]/10">
              <div className="flex items-center gap-3">
                <Store className="w-5 h-5 text-[#C9A86A] shrink-0" />
                <div>
                  <h3 className="text-lg font-bold text-[#F9F6F0]">
                    شاشة نقطة البيع السريعة (POS)
                  </h3>
                  <p className="text-xs text-[#F9F6F0]/60">
                    الفرع الرئيسي: مأرب - المدينة · وضع العمل دون اتصال مفعل
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={simulateBarcodeScan}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#C9A86A] text-[#231911] font-bold text-xs hover:bg-[#d6b77c] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Barcode className="w-4 h-4" />
                  <span>مسح باركود تلقائي</span>
                </button>
                <button
                  type="button"
                  onClick={resetDemo}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#F9F6F0]/15 text-[#F9F6F0]/80 hover:text-[#F9F6F0] hover:bg-[#F9F6F0]/5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  title="إعادة ضبط الفاتورة"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>فاتورة جديدة</span>
                </button>
              </div>
            </div>

            {/* Scanned barcode feedback banner */}
            {lastScannedBarcode && (
              <div className="mb-5 px-4 py-2.5 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs flex items-center justify-between">
                <span>تم قراءة الباركود بنجاح وإضافة الصنف للفاتورة:</span>
                <span className="font-mono tabular-nums font-semibold">{lastScannedBarcode}</span>
              </div>
            )}

            {/* Product Tiles Grid */}
            <div className="mb-6">
              <div className="flex items-center justify-between text-xs text-[#F9F6F0]/60 mb-3">
                <span>الأصناف الأكثر مبيعاً (اضغط للإضافة السريعة)</span>
                <span>الأسعار بالريال اليمني (ر.ي)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {YEMENI_PRODUCTS.map((product) => {
                  const inCart = cart.find((c) => c.id === product.id);
                  return (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() => addToCart(product)}
                      className={`text-right p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        inCart
                          ? 'bg-[#231911] border-[#C9A86A] shadow-sm'
                          : 'bg-[#231911]/50 border-[#F9F6F0]/10 hover:border-[#C9A86A]/50'
                      }`}
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-[#F9F6F0] truncate">
                          {product.name}
                        </p>
                        <p className="text-xs text-[#F9F6F0]/55 mt-0.5 tabular-nums">
                          {product.category} · باركود {product.barcode.slice(-4)}
                        </p>
                      </div>
                      <div className="text-left shrink-0">
                        <p className="text-sm font-bold text-[#C9A86A] tabular-nums">
                          {product.price.toLocaleString('en-US')} ر.ي
                        </p>
                        {inCart ? (
                          <span className="text-xs text-emerald-400 font-medium tabular-nums">
                            بالفاتورة ({inCart.qty})
                          </span>
                        ) : (
                          <span className="text-xs text-[#F9F6F0]/45">
                            + إضافة
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Cart Quantity Controls, Header Customization & Printer Settings */}
            <div className="pt-5 border-t border-[#F9F6F0]/10 space-y-4">
              {/* Simple Receipt Header Settings Panel */}
              <div className="bg-[#231911] rounded-xl p-4 border border-[#C9A86A]/30">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <Settings className="w-4 h-4 text-[#C9A86A]" />
                    <span className="text-xs sm:text-sm font-bold text-[#F9F6F0]">
                      إعدادات ترويسة الفاتورة (تحديث فوري في المعاينة)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setStoreName('مركز سبأ التجاري للتسوق');
                      setStorePhone('775526937');
                      setStoreLocation('مأرب - المدينة - الشارع العام');
                    }}
                    className="text-[11px] text-[#C9A86A] hover:underline cursor-pointer"
                  >
                    استعادة الافتراضي
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label
                      htmlFor="receipt-store-name"
                      className="flex items-center gap-1 text-[11px] font-medium text-[#F9F6F0]/70 mb-1"
                    >
                      <Store className="w-3 h-3 text-[#C9A86A]" />
                      <span>اسم المحل / المتجر</span>
                    </label>
                    <input
                      id="receipt-store-name"
                      type="text"
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                      placeholder="مثال: سوبرماركت النخبة"
                      className="w-full px-3 py-2 rounded-lg bg-[#2E2118] border border-[#F9F6F0]/15 text-xs font-bold text-[#F9F6F0] placeholder:text-[#F9F6F0]/40 focus:outline-none focus:border-[#C9A86A]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="receipt-store-phone"
                      className="flex items-center gap-1 text-[11px] font-medium text-[#F9F6F0]/70 mb-1"
                    >
                      <Phone className="w-3 h-3 text-[#C9A86A]" />
                      <span>رقم الهاتف</span>
                    </label>
                    <input
                      id="receipt-store-phone"
                      type="tel"
                      dir="ltr"
                      value={storePhone}
                      onChange={(e) => setStorePhone(e.target.value)}
                      placeholder="775526937"
                      className="w-full px-3 py-2 rounded-lg bg-[#2E2118] border border-[#F9F6F0]/15 text-xs font-mono tabular-nums font-bold text-right text-[#F9F6F0] placeholder:text-[#F9F6F0]/40 focus:outline-none focus:border-[#C9A86A]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="receipt-store-location"
                      className="flex items-center gap-1 text-[11px] font-medium text-[#F9F6F0]/70 mb-1"
                    >
                      <MapPin className="w-3 h-3 text-[#C9A86A]" />
                      <span>الموقع / العنوان</span>
                    </label>
                    <input
                      id="receipt-store-location"
                      type="text"
                      value={storeLocation}
                      onChange={(e) => setStoreLocation(e.target.value)}
                      placeholder="مأرب - المدينة - الشارع العام"
                      className="w-full px-3 py-2 rounded-lg bg-[#2E2118] border border-[#F9F6F0]/15 text-xs font-bold text-[#F9F6F0] placeholder:text-[#F9F6F0]/40 focus:outline-none focus:border-[#C9A86A]"
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-4">
                {/* Thermal Paper Size Selector (Interactive Segmented Control) */}
                <div>
                  <label className="block text-xs text-[#F9F6F0]/60 mb-1.5">
                    مقاس ورق الطابعة الحرارية
                  </label>
                  <div className="inline-flex items-center gap-1 p-1 bg-[#231911] rounded-lg border border-[#F9F6F0]/10">
                    <button
                      type="button"
                      onClick={() => setPaperSize('80mm')}
                      className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        paperSize === '80mm'
                          ? 'bg-[#C9A86A] text-[#231911]'
                          : 'text-[#F9F6F0]/70 hover:text-[#F9F6F0]'
                      }`}
                    >
                      طابعة كاشير 80mm
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaperSize('58mm')}
                      className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        paperSize === '58mm'
                          ? 'bg-[#C9A86A] text-[#231911]'
                          : 'text-[#F9F6F0]/70 hover:text-[#F9F6F0]'
                      }`}
                    >
                      طابعة محمولة 58mm
                    </button>
                  </div>
                </div>

                {/* Payment Method Selector */}
                <div>
                  <label className="block text-xs text-[#F9F6F0]/60 mb-1.5">
                    طريقة الدفع في الفاتورة
                  </label>
                  <div className="inline-flex items-center gap-1 p-1 bg-[#231911] rounded-lg border border-[#F9F6F0]/10">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('نقداً (كاش)')}
                      className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        paymentMethod === 'نقداً (كاش)'
                          ? 'bg-emerald-600 text-white'
                          : 'text-[#F9F6F0]/70 hover:text-[#F9F6F0]'
                      }`}
                    >
                      نقداً (كاش)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('حوالة / العمقي')}
                      className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        paymentMethod === 'حوالة / العمقي'
                          ? 'bg-emerald-600 text-white'
                          : 'text-[#F9F6F0]/70 hover:text-[#F9F6F0]'
                      }`}
                    >
                      حوالة / العمقي
                    </button>
                  </div>
                </div>
              </div>

              {/* Cart Items Quick Adjustment List */}
              <div className="bg-[#231911] rounded-xl p-4 border border-[#F9F6F0]/10">
                <div className="flex items-center justify-between text-xs text-[#F9F6F0]/60 mb-3">
                  <span>تعديل كميات الفاتورة الحالية ({cart.length} أصناف)</span>
                  <button
                    type="button"
                    onClick={() => setDiscount((d) => (d === 0 ? 500 : 0))}
                    className="text-[#C9A86A] hover:underline cursor-pointer"
                  >
                    {discount > 0 ? 'إلغاء الخصم التجريبي (500 ر.ي)' : '+ إضافة خصم تجريبي (500 ر.ي)'}
                  </button>
                </div>

                {cart.length === 0 ? (
                  <p className="text-sm text-[#F9F6F0]/50 py-4 text-center">
                    الفاتورة فارغة حالياً — اضغط على أي صنف بالأعلى لإضافته فوراً.
                  </p>
                ) : (
                  <div className="space-y-2 max-h-44 overflow-y-auto pl-1">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between gap-3 py-1.5 border-b border-[#F9F6F0]/5 last:border-0 text-sm"
                      >
                        <span className="truncate font-medium text-[#F9F6F0]">
                          {item.name}
                        </span>
                        <div className="flex items-center gap-3 shrink-0">
                          <div className="flex items-center gap-1.5 bg-[#2E2118] rounded-lg px-2 py-1 border border-[#F9F6F0]/10">
                            <button
                              type="button"
                              onClick={() => updateQty(item.id, -1)}
                              className="p-0.5 text-[#F9F6F0]/70 hover:text-white cursor-pointer"
                              aria-label="إنقاص الكمية"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-6 text-center font-mono tabular-nums text-xs font-bold">
                              {item.qty}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQty(item.id, 1)}
                              className="p-0.5 text-[#F9F6F0]/70 hover:text-white cursor-pointer"
                              aria-label="زيادة الكمية"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <span className="font-mono tabular-nums text-xs font-bold text-[#C9A86A] w-20 text-left">
                            {(item.price * item.qty).toLocaleString('en-US')} ر.ي
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Realistic Thermal Receipt Preview Card (5 columns) */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="w-full flex items-center justify-between text-xs text-[#F9F6F0]/70 mb-3 px-2">
              <span className="inline-flex items-center gap-1.5">
                <Receipt className="w-4 h-4 text-[#C9A86A]" />
                <span>معاينة الفاتورة الحرارية ({paperSize})</span>
              </span>
              <span className="inline-flex items-center gap-1 text-[#C9A86A]">
                <WifiOff className="w-3.5 h-3.5" />
                <span>طباعة محلية بدون إنترنت</span>
              </span>
            </div>

            {/* Thermal Printer Slot Header */}
            <div className="w-full max-w-md bg-[#160F0A] rounded-t-2xl p-3 border-x border-t border-[#C9A86A]/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Printer className="w-4 h-4 text-[#C9A86A]" />
                <span className="text-xs font-medium text-[#F9F6F0]/80">
                  طابعة متجر برو الحرارية · {paperSize === '80mm' ? 'عرض 80 مم' : 'عرض 58 مم'}
                </span>
              </div>
              <span className="text-xs font-mono tabular-nums text-emerald-400">
                جاهزة للطباعة
              </span>
            </div>

            {/* The Paper Receipt itself */}
            <div
              className={`bg-white text-[#231911] shadow-2xl transition-all duration-200 relative ${
                paperSize === '80mm' ? 'w-full max-w-md px-6 py-6' : 'w-full max-w-xs px-4 py-5 text-xs'
              } ${isPrinting ? 'translate-y-2 opacity-90' : 'translate-y-0 opacity-100'}`}
            >
              {/* Receipt Store Header with Integrated Logo + Matjar Pro */}
              <div className="text-center border-b border-dashed border-[#231911]/30 pb-4 mb-4">
                <div className="inline-flex items-center justify-center gap-2 mb-1.5 px-3 py-1 rounded-lg bg-[#F9F6F0] border border-[#C9A86A]/40">
                  <img
                    src="/assets/aistudio/_____1f57c178.jpeg"
                    onError={(e) => {
                      if (!e.currentTarget.src.endsWith('/slider/slide-4.svg')) {
                        e.currentTarget.src = '/slider/slide-4.svg';
                      }
                    }}
                    alt="شعار متجر برو - البحري"
                    className="w-7 h-7 object-contain rounded-sm bg-white p-0.5"
                  />
                  <div className="text-right leading-tight">
                    <span className="block text-xs font-extrabold text-[#231911]">
                      متجر برو POS
                    </span>
                    <span className="block text-[9px] font-bold text-[#9A7432]">
                      المطور بلال البحري
                    </span>
                  </div>
                </div>
                <h4 className="text-lg font-extrabold tracking-tight text-[#231911] break-words">
                  {storeName.trim() || 'اسم المتجر التجاري'}
                </h4>
                <p className="text-xs text-[#231911]/75 mt-0.5 break-words">
                  {storeLocation.trim() || 'مأرب - المدينة'}
                </p>
                <p className="text-xs text-[#231911]/70 font-mono tabular-nums mt-0.5 break-words">
                  هاتف: {storePhone.trim() || '775526937'} · فاتورة ضريبية مبسطة
                </p>
              </div>

              {/* Receipt Meta Info */}
              <div className="grid grid-cols-2 gap-y-1 text-xs text-[#231911]/80 border-b border-dashed border-[#231911]/30 pb-3 mb-3 font-mono tabular-nums">
                <div>رقم الفاتورة: #{invoiceNumber}</div>
                <div className="text-left">التاريخ: 2026/11/12</div>
                <div>الكاشير: أحمد الماربي</div>
                <div className="text-left">الدفع: {paymentMethod}</div>
              </div>

              {/* Receipt Table Headers */}
              <div className="grid grid-cols-12 text-xs font-bold border-b border-[#231911] pb-1.5 mb-2">
                <div className="col-span-6">الصنف</div>
                <div className="col-span-2 text-center">الكمية</div>
                <div className="col-span-4 text-left">الإجمالي</div>
              </div>

              {/* Receipt Line Items */}
              <div className="space-y-2 border-b border-dashed border-[#231911]/30 pb-3 mb-3 min-h-[120px]">
                {cart.length === 0 ? (
                  <p className="text-xs text-center text-[#231911]/50 py-8">
                    لا توجد أصناف مضافة في الفاتورة
                  </p>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.id}
                      className="grid grid-cols-12 items-start text-xs gap-1"
                    >
                      <div className="col-span-6 font-semibold text-[#231911] leading-snug">
                        {item.name}
                        <div className="text-[11px] font-normal text-[#231911]/60 font-mono tabular-nums">
                          سعر الوحدة: {item.price.toLocaleString('en-US')}
                        </div>
                      </div>
                      <div className="col-span-2 text-center font-mono tabular-nums font-semibold">
                        ×{item.qty}
                      </div>
                      <div className="col-span-4 text-left font-mono tabular-nums font-bold">
                        {(item.price * item.qty).toLocaleString('en-US')} ر.ي
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Subtotal, Discount, Grand Total */}
              <div className="space-y-1.5 text-xs border-b border-dashed border-[#231911]/30 pb-3 mb-4">
                <div className="flex justify-between text-[#231911]/80">
                  <span>المجموع الفرعي:</span>
                  <span className="font-mono tabular-nums font-semibold">
                    {subtotal.toLocaleString('en-US')} ر.ي
                  </span>
                </div>
                {effectiveDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>خصم خاص للعميل:</span>
                    <span className="font-mono tabular-nums">
                      -{effectiveDiscount.toLocaleString('en-US')} ر.ي
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-baseline text-base font-extrabold text-[#231911] pt-1 border-t border-[#231911]/15">
                  <span>الإجمالي النهائي:</span>
                  <span className="font-mono tabular-nums text-lg">
                    {finalTotal.toLocaleString('en-US')} ر.ي
                  </span>
                </div>
              </div>

              {/* Barcode & QR Footer */}
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="flex items-center justify-center gap-3 py-1">
                  <QrCode className="w-11 h-11 text-[#231911]" />
                  <div className="text-right">
                    <p className="text-xs font-bold text-[#231911]">
                      شكراً لتسوقكم معنا!
                    </p>
                    <p className="text-[11px] text-[#231911]/70">
                      البضاعة المباعة ترد وتستبدل خلال 3 أيام
                    </p>
                    <p className="text-[10px] font-mono text-[#231911]/60 mt-0.5">
                      صادرة عبر نظام متجر برو POS
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Serrated Paper Bottom Tear */}
            <div
              className={`h-3 bg-white/90 ${
                paperSize === '80mm' ? 'w-full max-w-md' : 'w-full max-w-xs'
              } rounded-b-sm`}
            />

            {/* Print Action Button below receipt */}
            <div className="w-full max-w-md mt-5 flex flex-col gap-2">
              <button
                type="button"
                onClick={handlePrint}
                disabled={cart.length === 0 || isPrinting}
                className="w-full py-3 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-lg cursor-pointer whitespace-nowrap"
              >
                <Printer className="w-4 h-4" />
                <span>
                  {isPrinting
                    ? 'جاري إرسال الفاتورة للطابعة الحرارية...'
                    : `اختبر طباعة الفاتورة الآن (${finalTotal.toLocaleString('en-US')} ر.ي)`}
                </span>
              </button>

              {printSuccess && (
                <div className="flex items-center justify-center gap-2 text-xs text-emerald-300 bg-emerald-950/70 border border-emerald-500/30 rounded-lg py-2 px-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>تمت طباعة الفاتورة الحرارية وحفظ العملية في سجل المبيعات دون إنترنت!</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
