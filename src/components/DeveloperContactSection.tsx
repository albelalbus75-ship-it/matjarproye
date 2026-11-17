import React, { useState } from 'react';
import {
  Phone,
  MessageCircle,
  Copy,
  Check,
  Mail,
  ExternalLink,
  ShieldCheck,
  Zap,
  WifiOff,
  Award,
  BookOpen,
  Receipt,
  Fuel,
  Wallet,
  FileText,
  ClipboardCheck,
} from 'lucide-react';

const LOGO_PRIMARY = '/slider/slide-4.jpeg';
const LOGO_FALLBACK_1 = '/assets/aistudio/_____1f57c178.jpeg';
const LOGO_FALLBACK_2 = '/slider/slide-4.svg';

interface AccountingSystemItem {
  number: string;
  category: string;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  badgeIcon: React.ElementType;
  whatsappText: string;
}

const OTHER_SYSTEMS: AccountingSystemItem[] = [
  {
    number: '01',
    category: 'محاسبة مالية',
    title: 'دفتر الحسابات',
    subtitle: 'نظام محاسبي مالي شامل لإدارة القيود وشجرة الحسابات والتقارير',
    description:
      'منظومة محاسبية متكاملة بالقيود المزدوجة، كشوف الحسابات التفصيلية، ميزان المراجعة، قائمة الدخل، والأرباح والخسائر بدقة متناهية وفق المعايير المحاسبية.',
    features: [
      'شجرة حسابات هرمية متكاملة',
      'ميزان مراجعة وميزانية عمومية',
      'كشوف حسابات العملاء والموردين',
      'دعم العملات المتعددة وسندات القبض والصرف',
    ],
    badgeIcon: BookOpen,
    whatsappText:
      'مرحباً المهندس بلال البحري، أرغب بالاستفسار وطلب نسخة من (نظام دفتر الحسابات المحاسبي الشامل).',
  },
  {
    number: '02',
    category: 'إدارة الموارد والحوافز',
    title: 'نظام الحوافز والمكافآت',
    subtitle: 'إدارة أداء الموظفين، العمولات البيعية، والمكافآت التشجيعية',
    description:
      'حل احترافي لربط إنتاجية وأداء الموظفين بحوافز مالية مباشرة؛ حساب عمولات المبيعات، المكافآت التشجيعية، مسيرات الرواتب، والخصومات تلقائياً.',
    features: [
      'حساب عمولات ونسب البيع آلياً',
      'مؤشرات أداء KPI وتقييم الموظفين',
      'كشوف الرواتب والعهد النقدية',
      'تقارير تفصيلية لمكافآت كل قسم',
    ],
    badgeIcon: Award,
    whatsappText:
      'مرحباً المهندس بلال البحري، أرغب بالاستفسار وطلب نسخة من (نظام الحوافز والمكافآت وإدارة الموظفين).',
  },
  {
    number: '03',
    category: 'نقاط بيع وتجزئة',
    title: 'نظام نقطة البيع',
    subtitle: 'كاشير سريع، مسح الباركود، والفاتورة الإلكترونية والحرارية 80 مم',
    description:
      'نظام نقاط بيع مخصص للسوبرماركت والأنشطة التجارية؛ سرعة فائقة مع أجهزة الباركود، وضع الإدخال السريع بـ Enter، تعدد العملات، وطباعة إيصالات حرارية 80 مم.',
    features: [
      'إدخال سريع بضغطة زر Enter مع الباركود',
      'طباعة حرارية مهيأة لمقاس 80 مم مع QR',
      'بيع نقدي وآجل واختيار العملة المناسبة',
      'إقفال الوردية وجرد الصناديق الفوري',
    ],
    badgeIcon: Receipt,
    whatsappText:
      'مرحباً المهندس بلال البحري، أرغب بالاستفسار وطلب نسخة من (نظام نقطة البيع السريعة POS).',
  },
  {
    number: '04',
    category: 'محطات وقود وطاقة',
    title: 'نظام محطات الوقود',
    subtitle: 'إدارة خزانات الوقود، الطرمبات، المعايرة، والمبيعات اليومية',
    description:
      'منظومة مخصصة لإدارة محطات المحروقات (بنزين، ديزل، غاز)؛ تسجيل قراءات العدادات، متابعة الكميات المتبقية بالخزانات، مبيعات الآجل، وجرد يومي فوري.',
    features: [
      'مطابقة قراءات عدادات الطرمبات اليومية',
      'مراقبة مخزون الخزانات الفعلية والمحسوبة',
      'إثبات مبيعات الوقود الآجلة للشركات والسيارات',
      'كشوف الإيرادات وهوامش ربح المحطة',
    ],
    badgeIcon: Fuel,
    whatsappText:
      'مرحباً المهندس بلال البحري، أرغب بالاستفسار وطلب نسخة من (نظام إدارة محطات الوقود والمحروقات).',
  },
  {
    number: '05',
    category: 'الموارد البشرية والرواتب',
    title: 'نظام إدارة الراتب الذكي',
    subtitle: 'إدارة مسيرات الرواتب، السلف، الغياب، والإضافي والاستقطاعات آلياً',
    description:
      'منظومة ذكية متكاملة لإدارة شؤون الموظفين والرواتب والأجور؛ احتساب تلقائي لصافي الراتب بعد السلف والخصومات والساعات الإضافية، مع إصدار قسائم راتب تفصيلية وتقارير شهرية دقيقة.',
    features: [
      'إعداد مسيرات الرواتب الشهرية بضغطة زر',
      'إدارة سلف الموظفين والخصم التلقائي المقسط',
      'احتساب الحضور والغياب والساعات الإضافية',
      'طباعة قسائم الرواتب وكشوف الصرف بالعملات',
    ],
    badgeIcon: Wallet,
    whatsappText:
      'مرحباً المهندس بلال البحري، أرغب بالاستفسار وطلب نسخة من (نظام إدارة الراتب الذكي وشؤون الموظفين).',
  },
  {
    number: '06',
    category: 'إدارة الديون والآجل',
    title: 'نظام دفتر الديون',
    subtitle: 'تتبع ديون العملاء والموردين، الأقساط، والتنبيهات وكشوف المطابقة',
    description:
      'نظام متخصص لضبط المبيعات الآجلة والديون التجارية؛ يسجل مديونية كل عميل ومورد بدقة، مع جدولة السداد، إرسال إشعارات المطالبة وكشوف الحساب عبر واتساب، ومعرفة إجمالي الديون المستحقة لحظياً.',
    features: [
      'تسجيل الديون والدفعات المسددة للعملاء والموردين',
      'كشف حساب تفصيلي ومطابقة رصيد فورية عبر واتساب',
      'تنبيهات بالديون المتأخرة وسقف الائتمان لكل عميل',
      'دعم تعدد العملات (يمني، سعودي، دولار) بدون إنترنت',
    ],
    badgeIcon: FileText,
    whatsappText:
      'مرحباً المهندس بلال البحري، أرغب بالاستفسار وطلب نسخة من (نظام دفتر الديون وإدارة الحسابات الآجلة).',
  },
  {
    number: '07',
    category: 'الإدارة والتشغيل',
    title: 'نظام إدارة المهام',
    subtitle: 'توزيع مهام فرق العمل، متابعة الإنجاز اليومي، والتنبيهات والمواعيد',
    description:
      'منظومة إدارية ذكية لتنظيم سير العمل داخل الشركات والمؤسسات والمحلات؛ تتيح إسناد المهام للموظفين، تحديد الأولويات ومواعيد التسليم، ومتابعة نسب الإنجاز اليومية والأسبوعية بدقة.',
    features: [
      'إسناد وتفويض المهام للموظفين والأقسام',
      'متابعة حالة التنفيذ ونسب الإنجاز لحظياً',
      'جدولة المهام المتكررة وتنبيهات المواعيد',
      'تقارير إنتاجية فرق العمل والأداء الإداري',
    ],
    badgeIcon: ClipboardCheck,
    whatsappText:
      'مرحباً المهندس بلال البحري، أرغب بالاستفسار وطلب نسخة من (نظام إدارة المهام ومتابعة فرق العمل).',
  },
];

export const DeveloperContactSection: React.FC = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const handleLogoError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (!img.dataset.fallbackStep) {
      img.dataset.fallbackStep = '1';
      img.src = LOGO_FALLBACK_1;
    } else if (img.dataset.fallbackStep === '1') {
      img.dataset.fallbackStep = '2';
      img.src = LOGO_FALLBACK_2;
    }
  };

  const whatsappPrimary =
    'https://wa.me/967775526937?text=' +
    encodeURIComponent(
      'مرحباً المهندس بلال البحري، أرغب بالاستفسار وطلب نسخة من نظام متجر برو (Matjar Pro).'
    );

  const whatsappSecondary =
    'https://wa.me/967718093309?text=' +
    encodeURIComponent(
      'مرحباً المهندس بلال البحري، أرغب بالاستفسار وطلب نسخة من نظام متجر برو (Matjar Pro).'
    );

  return (
    <section
      id="developer-contact"
      className="py-16 lg:py-24 bg-[#F9F6F0] border-t border-[#231911]/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* 1. Developer Profile Banner */}
        <div className="rounded-3xl bg-[#141C2B] text-[#F9F6F0] p-6 sm:p-10 lg:p-12 border border-[#C9A86A]/30 shadow-xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Right Side: Developer Bio & CTA */}
            <div className="flex-1 text-right space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C9A86A]/15 border border-[#C9A86A]/40 text-[#C9A86A] text-xs font-bold">
                <Award className="w-4 h-4" />
                <span>الملف التعريفي للمطور والمصمم</span>
              </div>

              <div>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-display">
                  المهندس والمحاسب بلال البحري
                </h2>
                <p className="text-xs sm:text-sm font-mono tracking-[0.2em] text-[#C9A86A] font-semibold mt-1">
                  BELAL ALBAHRI · FINANCE & SMART SYSTEMS
                </p>
              </div>

              <p className="text-sm sm:text-base font-bold text-[#F9F6F0]/95">
                المهندس والمحاسب / مصمم ومطور الأنظمة
              </p>

              <p className="text-sm sm:text-base text-[#F9F6F0]/75 leading-relaxed max-w-2xl">
                مهندس برمجيات ومحاسب مالي متخصص في تصميم وتطوير الأنظمة المحاسبية والإدارية، حلول نقاط البيع السريعة (متجر برو)، وأنظمة إدارة محطات الوقود وإدارة الموارد البشرية، مع التركيز على الأداء الفائق والسهولة وتوافق الأنظمة مع متطلبات السوق التجاري اليمني والعربي.
              </p>

              <div className="pt-3 flex flex-wrap items-center gap-3">
                <a
                  href={whatsappPrimary}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition-colors shadow-md whitespace-nowrap"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>واتساب مباشر (775526937)</span>
                </a>

                <a
                  href="tel:+967775526937"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-[#C9A86A]/40 hover:border-[#C9A86A] bg-white/5 hover:bg-white/10 text-[#F9F6F0] font-bold text-xs sm:text-sm transition-colors whitespace-nowrap"
                >
                  <Phone className="w-4 h-4 text-[#C9A86A]" />
                  <span>اتصال فوري</span>
                </a>

                <a
                  href="mailto:albahri7755@gmail.com"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-white/15 hover:border-[#C9A86A] bg-white/5 hover:bg-white/10 text-[#F9F6F0] font-bold text-xs sm:text-sm transition-colors whitespace-nowrap"
                >
                  <Mail className="w-4 h-4 text-[#C9A86A]" />
                  <span className="font-mono">albahri7755@gmail.com</span>
                </a>
              </div>
            </div>

            {/* Left Side: Official AB Albahri Logo Badge integrated with Matjar Pro */}
            <div className="shrink-0 flex flex-col items-center">
              <div className="relative w-36 h-36 sm:w-40 sm:h-40 rounded-full bg-white border-4 border-[#C9A86A] shadow-2xl flex flex-col items-center justify-center p-3">
                <img
                  src={LOGO_PRIMARY}
                  onError={handleLogoError}
                  alt="شعار المطور بلال البحري - متجر برو"
                  className="w-24 h-24 sm:w-28 sm:h-28 object-contain"
                />
                <span className="text-[10px] font-extrabold text-[#231911] bg-[#F9F6F0] px-2 py-0.5 rounded-full border border-[#C9A86A]/50 -mt-1">
                  متجر برو POS
                </span>
                <div
                  className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full bg-[#141C2B] border-2 border-[#C9A86A] flex items-center justify-center text-[#C9A86A]"
                  title="مطور ومصمم أنظمة معتمد"
                >
                  <ShieldCheck className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. OTHER ACCOUNTING & ADMINISTRATIVE SYSTEMS SECTION ("أنظمة محاسبية وإدارية أخرى") */}
        <div id="other-systems" className="scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 border-b border-[#231911]/10 pb-5">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-[#C9A86A] inline-block shrink-0" />
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#231911]">
                  أنظمة محاسبية وإدارية أخرى — الأنظمة والتطبيقات البرمجية
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-[#231911]/70 mt-1.5">
                حلول برمجية متطورة من تصميم وتطوير المهندس والمحاسب بلال البحري تلبي احتياجات الشركات، المحلات التجارية، والمؤسسات في مأرب واليمن
              </p>
            </div>

            <span className="self-start sm:self-auto px-4 py-1.5 rounded-full bg-[#EFECE6] border border-[#C9A86A]/50 text-[#9A7432] text-xs font-extrabold whitespace-nowrap shrink-0">
              {OTHER_SYSTEMS.length} منظومات تخصصية جاهزة للتثبيت
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {OTHER_SYSTEMS.map((sys) => {
              const BadgeIcon = sys.badgeIcon;
              const sysWhatsappUrl =
                'https://wa.me/967775526937?text=' + encodeURIComponent(sys.whatsappText);

              return (
                <div
                  key={sys.number}
                  className="bg-white rounded-3xl p-6 sm:p-8 border border-[#C9A86A]/40 hover:border-[#C9A86A] shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Top Row: Official AB Logo with Sub-Badge on Right, Category Pill & Number on Left */}
                    <div className="flex items-start justify-between gap-4 mb-5">
                      <div className="relative w-14 h-14 rounded-2xl bg-white border-2 border-[#C9A86A] p-1.5 flex items-center justify-center shrink-0 shadow-xs">
                        <img
                          src={LOGO_PRIMARY}
                          onError={handleLogoError}
                          alt="شعار البحري"
                          className="w-full h-full object-contain"
                        />
                        <div className="absolute -bottom-1.5 -left-1.5 w-6 h-6 rounded-lg bg-[#141C2B] text-[#C9A86A] border border-[#C9A86A] flex items-center justify-center shadow-xs">
                          <BadgeIcon className="w-3.5 h-3.5" />
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="px-3.5 py-1 rounded-full bg-[#F9F6F0] border border-[#C9A86A]/40 text-[#9A7432] text-xs font-bold">
                          {sys.category}
                        </span>
                        <span className="w-8 h-8 rounded-full bg-[#F9F6F0] border border-[#231911]/10 flex items-center justify-center font-mono text-xs font-extrabold text-[#231911]/70 tabular-nums">
                          {sys.number}
                        </span>
                      </div>
                    </div>

                    {/* System Title & Gold Subtitle */}
                    <h4 className="text-xl sm:text-2xl font-extrabold text-[#231911] mb-1">
                      {sys.title}
                    </h4>
                    <p className="text-xs sm:text-sm font-bold text-[#9A7432] mb-4">
                      {sys.subtitle}
                    </p>

                    {/* System Description */}
                    <p className="text-xs sm:text-sm text-[#231911]/75 leading-relaxed mb-6">
                      {sys.description}
                    </p>

                    {/* 2x2 Feature Checkmarks Grid */}
                    <div className="pt-4 border-t border-[#231911]/10 grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                      {sys.features.map((feat) => (
                        <div
                          key={feat}
                          className="flex items-center gap-2 text-xs font-bold text-[#231911]/85"
                        >
                          <Check className="w-4 h-4 text-[#C9A86A] shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Direct WhatsApp Order Button */}
                  <a
                    href={sysWhatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 px-5 rounded-2xl bg-[#141C2B] hover:bg-[#1e293b] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-400" />
                    <span>اطلب النظام الآن عبر واتساب</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#C9A86A]" />
                  </a>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Direct Communication Channels Grid */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3 border-b border-[#231911]/10 pb-4">
            <div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#231911] flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#C9A86A] inline-block" />
                <span>قنوات التواصل المباشر — المطور بلال البحري</span>
              </h3>
              <p className="text-xs sm:text-sm text-[#231911]/70 mt-1">
                اختر الوسيلة المناسبة لك للاتصال أو المراسلة عبر الواتساب أو البريد الإلكتروني أو متابعة الحسابات الرسمية
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {/* Card 1: Primary Phone - Yemen Mobile */}
            <div className="bg-white rounded-2xl p-5 border border-[#231911]/12 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="w-11 h-11 rounded-xl border border-[#C9A86A] bg-white p-1 flex items-center justify-center overflow-hidden shadow-xs">
                    <img
                      src={LOGO_PRIMARY}
                      onError={handleLogoError}
                      alt="شعار البحري"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="text-[11px] font-bold text-blue-800 bg-blue-50 px-2.5 py-1 rounded-md">
                    الرقم الرئيسي
                  </span>
                </div>

                <p className="text-xs text-[#231911]/65 font-medium">
                  يمن موبايل (Yemen Mobile)
                </p>
                <p
                  dir="ltr"
                  className="text-xl font-extrabold font-mono tabular-nums text-[#231911] text-right mt-1 mb-4"
                >
                  775 526 937
                </p>
              </div>

              <div className="space-y-2 pt-3 border-t border-[#231911]/10">
                <a
                  href={whatsappPrimary}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>محادثة واتساب</span>
                </a>
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href="tel:+967775526937"
                    className="py-2 px-2 rounded-lg bg-[#F9F6F0] hover:bg-[#231911]/10 text-[#231911] font-bold text-xs flex items-center justify-center gap-1 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>اتصال</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => handleCopy('775526937', 'phone1')}
                    className="py-2 px-2 rounded-lg border border-[#231911]/15 hover:bg-[#F9F6F0] text-[#231911] font-bold text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    {copiedId === 'phone1' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">تم النسخ</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>نسخ</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Card 2: Secondary Phone - SabaFon / YOU */}
            <div className="bg-white rounded-2xl p-5 border border-[#231911]/12 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="w-11 h-11 rounded-xl border border-[#C9A86A] bg-white p-1 flex items-center justify-center overflow-hidden shadow-xs">
                    <img
                      src={LOGO_PRIMARY}
                      onError={handleLogoError}
                      alt="شعار البحري"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="text-[11px] font-bold text-amber-900 bg-amber-100/80 px-2.5 py-1 rounded-md">
                    رقم بديل
                  </span>
                </div>

                <p className="text-xs text-[#231911]/65 font-medium">
                  سبأفون / يو (SabaFon / YOU)
                </p>
                <p
                  dir="ltr"
                  className="text-xl font-extrabold font-mono tabular-nums text-[#231911] text-right mt-1 mb-4"
                >
                  718 093 309
                </p>
              </div>

              <div className="space-y-2 pt-3 border-t border-[#231911]/10">
                <a
                  href={whatsappSecondary}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>محادثة واتساب</span>
                </a>
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href="tel:+967718093309"
                    className="py-2 px-2 rounded-lg bg-[#F9F6F0] hover:bg-[#231911]/10 text-[#231911] font-bold text-xs flex items-center justify-center gap-1 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>اتصال</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => handleCopy('718093309', 'phone2')}
                    className="py-2 px-2 rounded-lg border border-[#231911]/15 hover:bg-[#F9F6F0] text-[#231911] font-bold text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    {copiedId === 'phone2' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">تم النسخ</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>نسخ</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Card 3: Official Email */}
            <div className="bg-white rounded-2xl p-5 border border-[#231911]/12 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="w-11 h-11 rounded-xl border border-[#C9A86A] bg-[#F9F6F0] flex flex-col items-center justify-center text-[#231911] font-bold text-xs">
                    <Mail className="w-5 h-5 text-[#C9A86A]" />
                  </div>
                  <span className="text-[11px] font-bold text-emerald-900 bg-emerald-100/80 px-2.5 py-1 rounded-md">
                    البريد الرسمي
                  </span>
                </div>

                <p className="text-xs text-[#231911]/65 font-medium">
                  البريد الإلكتروني للمطور
                </p>
                <p
                  dir="ltr"
                  className="text-sm font-extrabold font-mono text-[#231911] text-right mt-1.5 mb-1 truncate"
                  title="albahri7755@gmail.com"
                >
                  albahri7755@gmail.com
                </p>
                <p className="text-[11px] text-[#231911]/60 mb-4">
                  لطلبات الأنظمة والدعم الفني للشركات
                </p>
              </div>

              <div className="space-y-2 pt-3 border-t border-[#231911]/10">
                <a
                  href="mailto:albahri7755@gmail.com?subject=طلب%20نظام%20متجر%20برو%20POS"
                  className="w-full py-2.5 px-3 rounded-xl bg-[#231911] hover:bg-[#35261b] text-[#F9F6F0] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Mail className="w-4 h-4 text-[#C9A86A]" />
                  <span>إرسال بريد إلكتروني</span>
                </a>
                <button
                  type="button"
                  onClick={() => handleCopy('albahri7755@gmail.com', 'email')}
                  className="w-full py-2 px-2 rounded-lg border border-[#231911]/15 hover:bg-[#F9F6F0] text-[#231911] font-bold text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer"
                >
                  {copiedId === 'email' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">تم نسخ البريد</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>نسخ البريد الإلكتروني</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Card 4: Facebook Official Page */}
            <div className="bg-white rounded-2xl p-5 border border-[#231911]/12 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="w-11 h-11 rounded-xl border border-blue-500/40 bg-blue-50 flex flex-col items-center justify-center text-blue-600 font-extrabold text-base">
                    f
                  </div>
                  <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md">
                    فيسبوك
                  </span>
                </div>

                <p className="text-xs text-[#231911]/65 font-medium">
                  الصفحة الرسمية
                </p>
                <p className="text-base font-extrabold text-[#231911] mt-1">
                  المهندس بلال البحري
                </p>
                <p className="text-[11px] text-[#231911]/60 mt-1 mb-4">
                  متابعة المنشورات البرمجية والأنظمة
                </p>
              </div>

              <div className="pt-3 border-t border-[#231911]/10">
                <a
                  href="https://www.facebook.com/search/top?q=%D8%A7%D9%84%D9%85%D9%87%D9%86%D8%AF%D8%B3%20%D8%A8%D9%84%D8%A7%D9%84%20%D8%A7%D9%84%D8%A8%D8%AD%D8%B1%D9%8A"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>زيارة فيسبوك</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Card 5: Instagram Official Account */}
            <div className="bg-white rounded-2xl p-5 border border-[#231911]/12 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="w-11 h-11 rounded-xl border border-pink-500/40 bg-pink-50 flex flex-col items-center justify-center text-pink-600 font-extrabold text-xs">
                    IG
                  </div>
                  <span className="text-[11px] font-bold text-pink-700 bg-pink-50 px-2.5 py-1 rounded-md">
                    إنستغرام
                  </span>
                </div>

                <p className="text-xs text-[#231911]/65 font-medium">
                  الحساب الرسمي
                </p>
                <p
                  dir="ltr"
                  className="text-sm font-extrabold font-mono text-[#231911] text-right mt-1"
                >
                  @b9e7al_albahri
                </p>
                <p className="text-[11px] text-[#231911]/60 mt-1 mb-4">
                  صور وتحديثات الأنظمة والتطوير
                </p>
              </div>

              <div className="pt-3 border-t border-[#231911]/10">
                <a
                  href="https://www.instagram.com/b9e7al_albahri/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-l from-purple-600 via-pink-600 to-orange-500 hover:opacity-95 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-opacity"
                >
                  <span>زيارة إنستغرام</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Developer Guarantee Strip */}
        <div className="rounded-2xl bg-[#141C2B] text-[#F9F6F0] p-6 sm:p-8 border border-[#C9A86A]/25">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x md:divide-x-reverse divide-white/10">
            <div className="flex items-start gap-4 pt-4 first:pt-0 md:pt-0 md:px-4 first:md:pr-0">
              <div className="w-11 h-11 rounded-xl bg-[#C9A86A]/15 border border-[#C9A86A]/40 flex items-center justify-center text-[#C9A86A] shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-bold text-white mb-1">
                  خبرة محاسبية وبرمجية مزدوجة
                </h4>
                <p className="text-xs text-[#F9F6F0]/70 leading-relaxed">
                  الأنظمة مصممة وفق أحدث المعايير المحاسبية المعتمدة لضمان دقة التقارير وسلامة ميزان المراجعة وحسابات الأرباح.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 pt-4 md:pt-0 md:px-4">
              <div className="w-11 h-11 rounded-xl bg-[#C9A86A]/15 border border-[#C9A86A]/40 flex items-center justify-center text-[#C9A86A] shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-bold text-white mb-1">
                  دعم محلي وتخصيص فوري
                </h4>
                <p className="text-xs text-[#F9F6F0]/70 leading-relaxed">
                  جاهزية لتعديل وتطوير الأنظمة لتلائم نشاطك التجاري بدقة، مع دعم فني مستمر وسريع في جميع محافظات اليمن.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 pt-4 md:pt-0 md:px-4 last:md:pl-0">
              <div className="w-11 h-11 rounded-xl bg-[#C9A86A]/15 border border-[#C9A86A]/40 flex items-center justify-center text-[#C9A86A] shrink-0">
                <WifiOff className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-bold text-white mb-1">
                  عمل دون إنترنت (Offline)
                </h4>
                <p className="text-xs text-[#F9F6F0]/70 leading-relaxed">
                  كافة الأنظمة تعمل محلياً بكفاءة تامة دون الحاجة إلى اتصال دائم بالإنترنت لضمان استمرارية البيع وإصدار الفواتير.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
