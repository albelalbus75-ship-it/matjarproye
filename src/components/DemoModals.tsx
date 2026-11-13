import React, { useState } from 'react';
import {
  X,
  Play,
  CheckCircle2,
  Printer,
  WifiOff,
  BarChart3,
  MessageCircle,
  Store,
  ArrowLeft,
} from 'lucide-react';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartTrial: () => void;
}

export const VideoDemoModal: React.FC<VideoModalProps> = ({
  isOpen,
  onClose,
  onStartTrial,
}) => {
  const [activeStep, setActiveStep] = useState<number>(0);

  if (!isOpen) return null;

  const steps = [
    {
      title: '01. بيع سريع ومسح باركود فوري',
      duration: '0:45 دقيقة',
      description:
        'أضف آلاف الأصناف بالباركود أو البحث السريع، وأصدر فاتورة العميل بضغطة زر واحدة مع حساب الباقي تلقائياً بالريال اليمني.',
      metrics: 'سرعة إصدار الفاتورة: أقل من 3 ثوانٍ · يدعم قارئات الباركود السلكية واللاسلكية',
      icon: Printer,
    },
    {
      title: '02. يعمل بدون إنترنت طوال اليوم',
      duration: '1:10 دقيقة',
      description:
        'لا تتوقف مبيعاتك أبداً عند انقطاع الكهرباء أو الإنترنت. يتم حفظ جميع الفواتير وحركة المخزون محلياً في جهازك وتتم المزامنة فور عودة الاتصال.',
      metrics: 'حفظ محلي آمن 100% · يعمل على الكمبيوتر والتابلت والأندرويد',
      icon: WifiOff,
    },
    {
      title: '03. جرد المخزون وتقارير الأرباح الصافية',
      duration: '0:55 دقيقة',
      description:
        'اعرف مبيعاتك اليومية، الأصناف الأكثر ربحاً، وتنبيهات قرب نفاد البضاعة من المستودع بضغطة زر ومن أي مكان.',
      metrics: 'تقارير يومية وشهرية دقيقة · حساب تكلفة البضاعة وصافي الربح',
      icon: BarChart3,
    },
  ];

  const CurrentIcon = steps[activeStep].icon;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#231911]/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="video-modal-title"
    >
      <div className="bg-[#F9F6F0] text-[#231911] border border-[#231911]/15 rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#231911] text-[#F9F6F0]">
          <div>
            <h3 id="video-modal-title" className="text-lg font-bold">
              جولة تعريفية مصورة: كيف يعمل نظام متجر برو؟
            </h3>
            <p className="text-xs text-[#C9A86A]">
              شاهد كيف تدير الكاشير والمخزون والفواتير الحرارية بسهولة تامة
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-[#F9F6F0]/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="إغلاق النافذة"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Interactive Walkthrough Stage */}
        <div className="p-6 sm:p-8">
          <div className="bg-[#231911] text-[#F9F6F0] rounded-xl p-6 sm:p-8 mb-6 border border-[#C9A86A]/30">
            <div className="flex items-center justify-between gap-4 mb-4">
              <span className="text-xs font-mono text-[#C9A86A]">
                الفصل التفاعلي {activeStep + 1} من {steps.length} · {steps[activeStep].duration}
              </span>
              <span className="text-xs text-emerald-400 font-medium">
                شرح عملي لواجهة النظام
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 py-4">
              <div className="w-16 h-16 rounded-2xl bg-[#C9A86A]/15 border border-[#C9A86A]/40 flex items-center justify-center shrink-0">
                <CurrentIcon className="w-8 h-8 text-[#C9A86A]" />
              </div>
              <div>
                <h4 className="text-xl sm:text-2xl font-bold text-[#F9F6F0] mb-2">
                  {steps[activeStep].title}
                </h4>
                <p className="text-sm sm:text-base text-[#F9F6F0]/80 leading-relaxed">
                  {steps[activeStep].description}
                </p>
                <p className="text-xs text-[#C9A86A] mt-3 font-medium">
                  {steps[activeStep].metrics}
                </p>
              </div>
            </div>
          </div>

          {/* Chapter Selector Tabs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            {steps.map((step, idx) => (
              <button
                key={step.title}
                type="button"
                onClick={() => setActiveStep(idx)}
                className={`text-right p-3.5 rounded-xl border transition-all cursor-pointer ${
                  activeStep === idx
                    ? 'bg-[#231911] text-[#F9F6F0] border-[#231911]'
                    : 'bg-white text-[#231911] border-[#231911]/15 hover:border-[#C9A86A]'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1 opacity-75">
                  <span>جزء {idx + 1}</span>
                  <Play className="w-3.5 h-3.5" />
                </div>
                <p className="text-xs font-bold truncate">{step.title}</p>
              </button>
            ))}
          </div>

          {/* Modal Footer Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#231911]/10">
            <p className="text-xs text-[#231911]/70">
              هل ترغب بتجربة النظام مباشرة على بضاعة متجرك؟
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-lg border border-[#231911]/20 text-xs font-bold text-[#231911] hover:bg-[#231911]/5 transition-colors cursor-pointer whitespace-nowrap"
              >
                إغلاق
              </button>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onStartTrial();
                }}
                className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <span>ابدأ تجربتك المجانية الآن</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface TrialModalProps {
  isOpen: boolean;
  selectedPlan: string;
  onClose: () => void;
}

export const FreeTrialModal: React.FC<TrialModalProps> = ({
  isOpen,
  selectedPlan,
  onClose,
}) => {
  const [storeName, setStoreName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('مأرب - المدينة');
  const [storeType, setStoreType] = useState('سوبرماركت وتموينات');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeName.trim() || !ownerName.trim()) {
      setError('يرجى إدخال اسم المتجر واسم المسؤول بالكامل.');
      return;
    }
    const cleanPhone = phone.replace(/\s+/g, '');
    if (!/^\d{9,12}$/.test(cleanPhone)) {
      setError('يرجى إدخال رقم هاتف يمني صحيح (مثال: 777123456).');
      return;
    }
    setError('');
    setSubmitted(true);
  };

  const resetAndClose = () => {
    setSubmitted(false);
    setError('');
    onClose();
  };

  const whatsappUrl = `https://wa.me/967775526937?text=${encodeURIComponent(
    `مرحباً المهندس بلال البحري، أرغب بتفعيل حساب متجري في نظام متجر برو:\n- اسم المتجر: ${storeName || 'متجر جديد'}\n- الاسم: ${ownerName}\n- الهاتف: ${phone}\n- المدينة: ${city}\n- النشاط: ${storeType}\n- الباقة المطلوبة: ${selectedPlan}`
  )}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#231911]/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="trial-modal-title"
    >
      <div className="bg-[#F9F6F0] text-[#231911] border border-[#231911]/15 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 bg-[#231911] text-[#F9F6F0]">
          <div className="flex items-center gap-2.5">
            <Store className="w-5 h-5 text-[#C9A86A]" />
            <div>
              <h3 id="trial-modal-title" className="text-base font-bold">
                تفعيل حساب متجرك في «متجر برو»
              </h3>
              <p className="text-xs text-[#C9A86A]">
                الباقة المختارة: {selectedPlan} · إعداد مجاني وفوري
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={resetAndClose}
            className="p-1.5 rounded-lg text-[#F9F6F0]/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {submitted ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-[#231911]">
                تم تجهيز نسخة متجرك ({storeName}) بنجاح!
              </h4>
              <p className="text-sm text-[#231911]/75 max-w-md mx-auto leading-relaxed">
                سيتواصل معك المهندس بلال البحري وفريق الدعم الفني في مأرب على الرقم{' '}
                <span className="font-mono font-bold tabular-nums">{phone}</span>{' '}
                خلال دقائق لإرسال رابط التحميل وتجهيز إعدادات الطابعة الحرارية.
              </p>
              <div className="pt-3 flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>تأكيد الطلب فوراً عبر واتساب</span>
                </a>
                <button
                  type="button"
                  onClick={resetAndClose}
                  className="px-4 py-3 rounded-xl border border-[#231911]/20 text-sm font-bold text-[#231911] hover:bg-[#231911]/5 transition-colors cursor-pointer"
                >
                  العودة للصفحة
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs font-medium">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#231911] mb-1.5">
                  اسم المتجر أو المحل التجاري *
                </label>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  placeholder="مثال: سوبرماركت سبأ / مركز مأرب التجاري"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#231911]/20 text-sm focus:outline-none focus:border-[#231911]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-[#231911] mb-1.5">
                    اسم المالك أو المدير *
                  </label>
                  <input
                    type="text"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="مثال: صالح الماربي"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#231911]/20 text-sm focus:outline-none focus:border-[#231911]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#231911] mb-1.5">
                    رقم الجوال (واتساب) *
                  </label>
                  <input
                    type="tel"
                    dir="ltr"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="775 526 937"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#231911]/20 text-sm text-right font-mono tabular-nums focus:outline-none focus:border-[#231911]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-[#231911] mb-1.5">
                    المدينة / المحافظة
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#231911]/20 text-sm focus:outline-none focus:border-[#231911]"
                  >
                    <option value="مأرب - المدينة">مأرب - المدينة</option>
                    <option value="مأرب - الوادي / الجوبة">مأرب - الوادي / الجوبة</option>
                    <option value="صنعاء">صنعاء</option>
                    <option value="عدن">عدن</option>
                    <option value="حضرموت - المكلا / سيئون">حضرموت - المكلا / سيئون</option>
                    <option value="تعز">تعز</option>
                    <option value="شبوة / الجوف / المهرة">شبوة / الجوف / المهرة</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#231911] mb-1.5">
                    نوع النشاط التجاري
                  </label>
                  <select
                    value={storeType}
                    onChange={(e) => setStoreType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#231911]/20 text-sm focus:outline-none focus:border-[#231911]"
                  >
                    <option value="سوبرماركت وتموينات">سوبرماركت وتموينات</option>
                    <option value="ملابس وأحذية وعطور">ملابس وأحذية وعطور</option>
                    <option value="إلكترونيات وجوالات">إلكترونيات وجوالات</option>
                    <option value="قطع غيار ومواد بناء">قطع غيار ومواد بناء</option>
                    <option value="بهارات وعسل وعطارة">بهارات وعسل وعطارة</option>
                    <option value="مطعم أو كافيه">مطعم أو كافيه</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-colors shadow-md cursor-pointer"
                >
                  افتح حساب متجرك مجاناً الآن
                </button>
                <p className="text-[11px] text-center text-[#231911]/60 mt-2.5">
                  لا يتطلب بطاقة بنكية · يعمل على الكمبيوتر والتابلت والأندرويد · دعم فني في مأرب واليمن
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
