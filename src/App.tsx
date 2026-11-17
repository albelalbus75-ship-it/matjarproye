/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  ShoppingCart,
  Barcode,
  Printer,
  BarChart3,
  WifiOff,
  Coins,
  Play,
  Check,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  MessageCircle,
  MapPin,
  Phone,
  ArrowLeft,
  Store,
  PackagePlus,
  Receipt,
  CheckCircle2,
  Menu,
  X,
} from 'lucide-react';
import { ThermalReceiptDemo } from './components/ThermalReceiptDemo';
import { ProfitCalculator } from './components/ProfitCalculator';
import { LowStockAlerts } from './components/LowStockAlerts';
import { VideoDemoModal, FreeTrialModal } from './components/DemoModals';
import { DeveloperContactSection } from './components/DeveloperContactSection';

import slide1DarkOud from './assets/images/matjar_pos_dark_oud_store_1794544757027.jpg';
import slide2LightStore from './assets/images/matjar_pos_light_modern_store_1794544756193.jpg';
import slide3TabletPos from './assets/images/matjar_pos_tablet_hero_1794536337582.jpg';

const OFFICIAL_LOGO_PRIMARY = '/slider/slide-4.jpeg';
const OFFICIAL_LOGO_FALLBACK_1 = '/assets/aistudio/_____1f57c178.jpeg';
const OFFICIAL_LOGO_FALLBACK_2 = '/slider/slide-4.svg';

interface HeroSlide {
  id: string;
  sources: string[];
  alt: string;
  fit: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'slide-1',
    sources: ['/slider/slide-1.jpg', slide1DarkOud, '/slider/slide-1.svg'],
    alt: 'نقاط البيع - متجر برو (الوضع الداكن الفاخر مع الطابعة الحرارية)',
    fit: 'object-cover',
  },
  {
    id: 'slide-2',
    sources: ['/slider/slide-2.jpg', slide2LightStore, '/slider/slide-2.svg'],
    alt: 'نقاط البيع - متجر برو (الواجهة العصرية المضيئة مع الطابعة الحرارية)',
    fit: 'object-cover',
  },
  {
    id: 'slide-3',
    sources: [
      '/slider/slide-3.jpg',
      slide3TabletPos,
      '/assets/aistudio/____________2026-11-13_064049_a25277cd.png',
      '/slider/slide-3.svg',
    ],
    alt: 'نظام كاشير متجر برو على التابلت مع الطابعة الحرارية وقارئ الباركود',
    fit: 'object-cover',
  },
  {
    id: 'slide-4',
    sources: [OFFICIAL_LOGO_PRIMARY, OFFICIAL_LOGO_FALLBACK_1, OFFICIAL_LOGO_FALLBACK_2],
    alt: 'شعار المطور المهندس والمحاسب بلال البحري - متجر برو',
    fit: 'object-contain bg-white p-8 pb-24',
  },
];

export default function App() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isTrialOpen, setIsTrialOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('الباقة الشهرية (الأكثر طلباً)');
  const [currency, setCurrency] = useState<'YER' | 'SAR'>('YER');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Hero Carousel State: continuous 3-second rotation + fallback & skip-on-missing logic
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideSourceIdx, setSlideSourceIdx] = useState<Record<string, number>>({});
  const [skippedSlides, setSkippedSlides] = useState<Record<string, boolean>>({});
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const activeSlides = HERO_SLIDES.filter((slide) => !skippedSlides[slide.id]);
  const slidesToRender = activeSlides.length > 0 ? activeSlides : HERO_SLIDES;
  const totalSlides = slidesToRender.length;
  const safeSlideIndex = totalSlides > 0 ? currentSlide % totalSlides : 0;

  useEffect(() => {
    if (totalSlides <= 1) return;
    const intervalId = window.setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 3000);
    return () => window.clearInterval(intervalId);
  }, [totalSlides]);

  const goToNextSlide = () => {
    if (totalSlides <= 1) return;
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const goToPrevSlide = () => {
    if (totalSlides <= 1) return;
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const handleSlideImageError = (slide: HeroSlide, slideIdx: number) => {
    const currentSrcIdx = slideSourceIdx[slide.id] ?? 0;
    const nextSrcIdx = currentSrcIdx + 1;

    if (nextSrcIdx < slide.sources.length) {
      setSlideSourceIdx((prev) => ({
        ...prev,
        [slide.id]: nextSrcIdx,
      }));
    } else {
      // All local sources for this slide failed: mark skipped and immediately move to next slide
      setSkippedSlides((prev) => ({
        ...prev,
        [slide.id]: true,
      }));
      if (slideIdx === safeSlideIndex && totalSlides > 1) {
        setCurrentSlide((prev) => (prev + 1) % Math.max(1, totalSlides - 1));
      }
    }
  };

  const handleLogoImgError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (!img.dataset.fallbackStep) {
      img.dataset.fallbackStep = '1';
      img.src = OFFICIAL_LOGO_FALLBACK_1;
    } else if (img.dataset.fallbackStep === '1') {
      img.dataset.fallbackStep = '2';
      img.src = OFFICIAL_LOGO_FALLBACK_2;
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const deltaX = touchStartX.current - touchEndX.current;
    if (Math.abs(deltaX) > 40) {
      if (deltaX > 0) {
        goToNextSlide();
      } else {
        goToPrevSlide();
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const mobileNavLinks = [
    { label: 'المميزات', href: '#features' },
    { label: 'معاينة الفاتورة الحرارية', href: '#receipt-demo' },
    { label: 'حاسبة الأرباح والهوامش', href: '#profit-calculator' },
    { label: 'تنبيهات نواقص المخزون', href: '#low-stock-alerts' },
    { label: 'خطوات التشغيل', href: '#how-it-works' },
    { label: 'باقات الأسعار', href: '#pricing' },
    { label: 'آراء العملاء', href: '#testimonials' },
    { label: 'الأسئلة الشائعة', href: '#faq' },
    { label: 'أنظمة محاسبية وإدارية أخرى', href: '#other-systems' },
    { label: 'المطور وقنوات التواصل', href: '#developer-contact' },
    { label: 'تواصل معنا', href: '#contact' },
  ];

  // Quick Contact Form state in Contact / Final section
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactDistrict, setContactDistrict] = useState('مأرب - المدينة (الشارع العام)');
  const [contactSent, setContactSent] = useState(false);
  const [contactError, setContactError] = useState('');

  const handleOpenTrial = (planName: string) => {
    setSelectedPlan(planName);
    setIsTrialOpen(true);
  };

  const handleQuickContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !/^\d{9,12}$/.test(contactPhone.replace(/\s+/g, ''))) {
      setContactError('يرجى إدخال الاسم ورقم الجوال اليمني بشكل صحيح (9 أرقام على الأقل).');
      return;
    }
    setContactError('');
    setContactSent(true);
  };

  const whatsappDirectLink =
    'https://wa.me/967775526937?text=' +
    encodeURIComponent(
      'مرحباً المهندس بلال البحري، أرغب بالاستفسار وتجربة نظام الكاشير الذكي (متجر برو) لمتجري.'
    );

  const features = [
    {
      index: '01',
      title: 'نقطة بيع سريعة - POS',
      description:
        'واجهة كاشير عربية سريعة الاستجابة مصممة لتقليل طوابير الانتظار في أوقات الذروة، مع دعم البيع النقدي والآجل والحوالات المصرفية.',
      meta: 'إصدار الفاتورة في 3 ثوانٍ · اختصارات لوحة المفاتيح وشاشات اللمس',
      icon: ShoppingCart,
      span: 'lg:col-span-7',
    },
    {
      index: '02',
      title: 'إدارة المخزون والباركود',
      description:
        'تتبع دقيق للكميات المتبقية في المحل والمستودع، مع دعم قارئات الباركود السلكية واللاسلكية وتوليد ملصقات باركود للأصناف المحلية.',
      meta: 'تنبيهات تلقائية عند قرب نفاد الكمية · جرد فوري بالباركود',
      icon: Barcode,
      span: 'lg:col-span-5',
    },
    {
      index: '03',
      title: 'طباعة حرارية 58mm و 80mm',
      description:
        'توافق فوري ومباشر مع جميع الطابعات الحرارية المكتبية والمحمولة عبر USB أو الشبكة أو البلوتوث، مع تخصيص شعار المتجر وأرقام التواصل.',
      meta: 'مقاس 80mm للكاشير الرئيسي · مقاس 58mm للطابعات المحمولة',
      icon: Printer,
      span: 'lg:col-span-5',
    },
    {
      index: '04',
      title: 'تقارير المبيعات والأرباح',
      description:
        'اعرف صافي ربحك الحقيقي نهاية كل يوم أو شهر، وراقب حركة الصندوق، المصروفات اليومية، والأصناف الأكثر مبيعاً في متجرك بدقة تامة.',
      meta: 'تقارير ورديات الكاشير · حساب تكلفة البضاعة وصافي الأرباح',
      icon: BarChart3,
      span: 'lg:col-span-7',
    },
    {
      index: '05',
      title: 'يعمل بدون انترنت',
      description:
        'مصمم ليتحمل ظروف انقطاع الإنترنت والكهرباء في اليمن؛ تستمر عمليات البيع والطباعة وحفظ الفواتير محلياً بنسبة 100% دون أي توقف على الكمبيوتر والتابلت والأندرويد.',
      meta: 'يعمل على الكمبيوتر والتابلت والأندرويد · حفظ محلي ومزامنة تلقائية',
      icon: WifiOff,
      span: 'lg:col-span-6',
    },
    {
      index: '06',
      title: 'دعم للعربية والعملة اليمنية',
      description:
        'مصمم بالكامل باللغة العربية الواضحة، ويدعم التسعير بالريال اليمني (ر.ي) مع إمكانية تحديث أسعار الصرف بضغطة زر واحدة لجميع الأصناف.',
      meta: 'دعم الريال اليمني والعملات المتعددة · تقريب تلقائي للكسور',
      icon: Coins,
      span: 'lg:col-span-6',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'سجل متجرك',
      subtitle: 'إعداد الحساب في دقيقتين',
      description:
        'أدخل اسم متجرك وعنوانك وشعارك، واختر مقاس ورق الطابعة الحرارية المناسبة لك (58mm أو 80mm) ليصبح نظامك جاهزاً للعمل فوراً.',
      icon: Store,
    },
    {
      number: '02',
      title: 'اضف منتجاتك',
      subtitle: 'بالباركود أو الاستيراد السريع',
      description:
        'امسح باركود البضاعة الموجودة في محلك أو استورد قائمة أصنافك وأسعارها دفعة واحدة مع تحديد سعر التكلفة وسعر البيع.',
      icon: PackagePlus,
    },
    {
      number: '03',
      title: 'ابدأ البيع',
      subtitle: 'فواتير فورية وتقارير يومية',
      description:
        'ابدأ بإصدار الفواتير الحرارية لعملائك حتى بدون إنترنت، وتابع مبيعاتك وأرباحك الصافية وحركة المخزون أولاً بأول.',
      icon: Receipt,
    },
  ];

  const pricingPlans = [
    {
      id: 'trial',
      name: 'مجاني للتجربة',
      kicker: 'للتجربة العملية في متجرك لمدة 14 يوماً',
      priceYER: '0',
      priceSAR: '0',
      period: 'لمدة 14 يوماً كاملة',
      description: 'جرب كافة مميزات الكاشير والطباعة الحرارية وإدارة المخزون على بضاعتك الفعلية قبل الاشتراك.',
      highlighted: false,
      ctaLabel: 'ابدأ التجربة المجانية',
      features: [
        'نقطة بيع سريعة (POS) تعمل بدون إنترنت',
        'إضافة حتى 250 صنفاً مع دعم الباركود',
        'طباعة فواتير حرارية مقاس 58mm و 80mm',
        'تقرير المبيعات وحركة الصندوق اليومية',
        'دعم فني عبر واتساب للتشغيل الأولي',
      ],
    },
    {
      id: 'monthly',
      name: 'الباقة الشهرية',
      kicker: 'الأكثر طلباً',
      priceYER: '15,000',
      priceSAR: '35',
      period: 'شهرياً · بدون التزام سنوي',
      description: 'الحل المتكامل للسوبرماركت، محلات العطارة والبهارات، الملابس، والإلكترونيات في اليمن.',
      highlighted: true,
      ctaLabel: 'اشترك في الباقة الشهرية',
      features: [
        'أصناف وفواتير مبيعات غير محدودة',
        'يعمل بدون إنترنت مع نسخ احتياطي تلقائي',
        'دعم كامل للطابعات الحرارية 58mm و 80mm والباركود',
        'تقارير الأرباح الصافية وجرد المستودع المتقدم',
        'تعدد المستخدمين وصلاحيات الكاشير والمدير',
        'دعم فني مباشر في مأرب وجميع المحافظات',
      ],
    },
    {
      id: 'annual',
      name: 'الباقة السنوية',
      kicker: 'توفير شهرين مجاناً + تأسيس المخزون',
      priceYER: '150,000',
      priceSAR: '350',
      period: 'سنوياً (وفر 30,000 ر.ي)',
      description: 'للمتاجر المستقرة التي تبحث عن أفضل قيمة سنوية مع مساعدة مجانية في إدخال البضاعة.',
      highlighted: false,
      ctaLabel: 'اشترك في الباقة السنوية',
      features: [
        'جميع مميزات الباقة الشهرية بالكامل',
        'إدخال وتأسيس قائمة أصناف متجرك مجاناً',
        'تفعيل حتى 3 نقاط كاشير في نفس المتجر',
        'تدريب مباشر لطاقم الكاشير على استخدام النظام',
        'أولوية القصوى في الدعم الفني والتحديثات',
      ],
    },
  ];

  const testimonials = [
    {
      name: 'صالح ناجي الماربي',
      role: 'مالك سوبرماركت سبأ الحديث',
      location: 'مأرب · المدينة (الشارع العام)',
      outcome: 'تقليص وقت المحاسبة بنسبة 65% وضبط نواقص المستودع بالكامل',
      quote:
        'كنا نعاني وقت الذروة وعند انقطاع الإنترنت من بطء الحسابات اليدوية. بعد تركيب «متجر برو» ربطنا قارئ الباركود والطابعة الحرارية 80mm خلال نصف ساعة، وأصبح الكاشير يصدر الفاتورة في ثوانٍ حتى والكهرباء طافية.',
    },
    {
      name: 'عبدالله محمد الحداد',
      role: 'مدير مركز الإخلاص للمواد الغذائية',
      location: 'مأرب · المدينة (حي الروضة)',
      outcome: 'توفير ساعتين يومياً في الجرد ومعرفة صافي الربح اليومي بالريال اليمني',
      quote:
        'أكثر ما أعجبني في متجر برو هو سهولة الواجهة العربية وسرعة إضافة الأصناف بالباركود وتشغيله السلس على الكمبيوتر والتابلت والأندرويد. في نهاية كل ليلة أطبع تقرير الصندوق وأعرف المبيعات والأرباح الصافية بدقة تامة.',
    },
    {
      name: 'عمر خالد الشدادي',
      role: 'مالك معرض النخبة للعطور والملابس',
      location: 'مأرب · المدينة (شارع صنعاء)',
      outcome: 'فواتير حرارية احترافية زادت ثقة العملاء وضبطت حسابات الموردين',
      quote:
        'الفاتورة الحرارية التي تخرج باسم المحل وشعارنا أعطت انطباعاً راقياً جداً لعملائنا في مأرب المدينة. والمهندس بلال البحري متجاوب معنا على الواتساب في أي وقت نحتاج فيه مساعدة أو تحديث.',
    },
  ];

  const faqs = [
    {
      question: 'هل يعمل بدون انترنت؟',
      answer:
        'نعم، يعمل «متجر برو» بدون إنترنت بشكل كامل (Offline-First) على الكمبيوتر والتابلت وأجهزة الأندرويد. يمكنك البيع، مسح الباركود، طباعة الفواتير الحرارية، وإضافة الأصناف وتعديل المخزون طوال اليوم دون الحاجة للاتصال بالإنترنت.',
    },
    {
      question: 'هل يدعم الطابعة الحرارية؟',
      answer:
        'بالتأكيد. يدعم النظام جميع أنواع الطابعات الحرارية المتوفرة في السوق اليمني بمقاسي 58mm و 80mm، سواء كانت متصلة عبر سلك USB، أو شبكة المحل (LAN/Wi-Fi)، أو البلوتوث للتابلت والأندرويد. كما يمكنك تخصيص ترويسة الفاتورة بشعار متجرك وأرقام هواتفك.',
    },
    {
      question: 'هل يدعم الباركود؟',
      answer:
        'نعم، يدعم النظام كافة قارئات الباركود السلكية واللاسلكية (1D و 2D). بمجرد تمرير الصنف أمام القارئ يضاف فوراً إلى شاشة الكاشير بالعدد والعبوة، كما يتيح لك النظام توليد وطباعة ملصقات باركود خاصة بالأصناف والمنتجات غير المرصعة بباركود مسبق.',
    },
    {
      question: 'كيف اشترك؟',
      answer:
        'الاشتراك بسيط وفوري: اضغط على زر «جرب مجاناً» أو تواصل مباشرة عبر زر الواتساب مع المطور المهندس بلال البحري. سيتم تفعيل حساب متجرك في مأرب المدينة أو أي محافظة يمنية فوراً ومنحك فترة تجربة مجانية لمدة 14 يوماً، مع مساعدتك في ربط الطابعة الحرارية وقارئ الباركود.',
    },
  ];

  return (
    <div dir="rtl" className="min-h-screen bg-[#F9F6F0] text-[#231911] font-sans">
      {/* 1. HEADER: Brand + Developer Belal Albahri subtitle + Responsive Mobile Menu */}
      <header className="sticky top-0 z-40 bg-[#F9F6F0]/95 backdrop-blur-md border-b border-[#231911]/10">
        <div className="max-w-7xl mx-auto h-16 px-4 sm:px-8 flex items-center justify-between gap-4 sm:gap-8">
          {/* Zone 1: Integrated Official Logo + Brand Title "متجر برو" + "المطور بلال البحري" */}
          <a
            href="#"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-3 whitespace-nowrap shrink-0 group"
          >
            <div className="w-11 h-11 rounded-xl bg-white border-2 border-[#C9A86A] p-1 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
              <img
                src={OFFICIAL_LOGO_PRIMARY}
                onError={handleLogoImgError}
                alt="شعار متجر برو - البحري"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col leading-tight">
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg sm:text-xl font-extrabold tracking-tight text-[#231911] font-display">
                  متجر برو
                </span>
                <span className="text-[10px] font-mono font-bold text-[#9A7432] uppercase tracking-wider hidden sm:inline">
                  Matjar Pro
                </span>
              </div>
              <span className="text-[11px] font-bold text-[#9A7432] -mt-0.5">
                المطور بلال البحري
              </span>
            </div>
          </a>

          {/* Zone 2: Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-bold text-[#231911]/80">
            <a
              href="#features"
              className="hover:text-[#231911] hover:underline underline-offset-8 decoration-[#C9A86A] decoration-2 transition-colors whitespace-nowrap shrink-0"
            >
              المميزات
            </a>
            <a
              href="#receipt-demo"
              className="hover:text-[#231911] hover:underline underline-offset-8 decoration-[#C9A86A] decoration-2 transition-colors whitespace-nowrap shrink-0"
            >
              الفاتورة الحرارية
            </a>
            <a
              href="#profit-calculator"
              className="hover:text-[#231911] hover:underline underline-offset-8 decoration-[#C9A86A] decoration-2 transition-colors whitespace-nowrap shrink-0"
            >
              حاسبة الأرباح
            </a>
            <a
              href="#pricing"
              className="hover:text-[#231911] hover:underline underline-offset-8 decoration-[#C9A86A] decoration-2 transition-colors whitespace-nowrap shrink-0"
            >
              الأسعار
            </a>
            <a
              href="#other-systems"
              className="hover:text-[#231911] hover:underline underline-offset-8 decoration-[#C9A86A] decoration-2 transition-colors whitespace-nowrap shrink-0"
            >
              أنظمة محاسبية وإدارية أخرى
            </a>
            <a
              href="#developer-contact"
              className="hover:text-[#231911] hover:underline underline-offset-8 decoration-[#C9A86A] decoration-2 transition-colors whitespace-nowrap shrink-0"
            >
              المطور والتواصل
            </a>
            <a
              href="#contact"
              className="hover:text-[#231911] hover:underline underline-offset-8 decoration-[#C9A86A] decoration-2 transition-colors whitespace-nowrap shrink-0"
            >
              تواصل معنا
            </a>
          </nav>

          {/* Zone 3: Primary Action Button + Mobile Hamburger Button */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                handleOpenTrial('تجربة مجانية لمدة 14 يوماً');
              }}
              className="px-4 sm:px-5 py-2 text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-sm"
            >
              جرب مجاناً
            </button>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-expanded={isMobileMenuOpen}
              aria-label={isMobileMenuOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
              className="md:hidden w-10 h-10 rounded-xl border border-[#231911]/15 bg-white/80 hover:bg-[#231911] text-[#231911] hover:text-[#F9F6F0] flex items-center justify-center transition-colors cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu Panel */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-[#231911]/10 bg-[#F9F6F0] shadow-xl px-4 pt-3 pb-6 space-y-4">
            <nav className="grid grid-cols-1 gap-1">
              {mobileNavLinks.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-3.5 py-2.5 rounded-xl text-sm font-bold text-[#231911] hover:bg-[#231911]/5 active:bg-[#231911]/10 flex items-center justify-between transition-colors"
                >
                  <span>{item.label}</span>
                  <ArrowLeft className="w-4 h-4 text-[#C9A86A]" />
                </a>
              ))}
            </nav>

            <div className="pt-3 border-t border-[#231911]/10 flex flex-col gap-2.5">
              <div className="grid grid-cols-2 gap-2.5">
                <a
                  href={whatsappDirectLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>واتساب (775526937)</span>
                </a>
                <a
                  href="tel:+967775526937"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="py-2.5 px-3 rounded-xl bg-[#231911] text-[#F9F6F0] font-bold text-xs flex items-center justify-center gap-1.5"
                >
                  <Phone className="w-4 h-4 text-[#C9A86A]" />
                  <span>اتصال مباشر</span>
                </a>
              </div>
              <p className="text-[11px] text-center text-[#231911]/65 font-medium">
                المطور: المهندس والمحاسب بلال البحري · albahri7755@gmail.com
              </p>
            </div>
          </div>
        )}
      </header>

      <main>
        {/* 2. HERO SECTION */}
        <section className="pt-10 pb-14 lg:pt-16 lg:pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
            {/* Hero Text Column (6 cols) */}
            <div className="lg:col-span-6 flex flex-col justify-center">
              {/* Integrated Brand & Logo Lockup in Hero */}
              <div className="inline-flex items-center gap-3 self-start mb-5 p-2 pr-2.5 pl-4 rounded-2xl bg-white border border-[#C9A86A]/50 shadow-xs">
                <img
                  src={OFFICIAL_LOGO_PRIMARY}
                  onError={handleLogoImgError}
                  alt="شعار متجر برو - البحري"
                  className="w-10 h-10 object-contain rounded-lg"
                />
                <div className="leading-tight">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-extrabold text-[#231911] font-display">
                      متجر برو · Matjar Pro
                    </span>
                  </div>
                  <p className="text-[11px] font-bold text-[#9A7432]">
                    نظام كاشير ذكي · المطور بلال البحري
                  </p>
                </div>
              </div>

              <h1
                className="font-display font-extrabold text-[#231911] tracking-tight leading-[1.18] mb-5"
                style={{
                  fontSize: 'clamp(2.25rem, 4vw, 3.65rem)',
                  textWrap: 'balance',
                }}
              >
                متجرك كله في شاشة واحدة
              </h1>

              <p className="text-base sm:text-lg text-[#231911]/80 leading-relaxed mb-8 max-w-xl">
                كاشير، مخزون، فواتير، طباعة حرارية، وتقارير - بدون انترنت، وبالعربي. صُمم خصيصاً ليمنح أصحاب المحلات والسوبرماركت في مأرب المدينة وكل محافظات اليمن سرعة في البيع ودقة في حساب الأرباح.
              </p>

              {/* 2 Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 mb-8">
                <button
                  type="button"
                  onClick={() => handleOpenTrial('تجربة مجانية لمدة 14 يوماً')}
                  className="px-7 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm sm:text-base transition-colors shadow-md flex items-center gap-2.5 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>ابدأ الآن مجاناً</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsVideoOpen(true)}
                  className="px-6 py-3.5 rounded-xl bg-[#231911] hover:bg-[#35261b] text-[#F9F6F0] font-bold text-sm sm:text-base transition-colors flex items-center gap-2.5 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Play className="w-4 h-4 text-[#C9A86A] fill-[#C9A86A]" />
                  <span>شاهد فيديو</span>
                </button>
              </div>

              {/* Unboxed trust highlights */}
              <div className="pt-6 border-t border-[#231911]/10 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs sm:text-sm font-medium text-[#231911]/75">
                <span>تجربة مجانية 14 يوماً</span>
                <span aria-hidden="true" className="text-[#C9A86A] font-bold">·</span>
                <span>يدعم الطابعات الحرارية 58mm و 80mm</span>
                <span aria-hidden="true" className="text-[#C9A86A] font-bold">·</span>
                <span className="font-bold text-[#231911]">يعمل على الكمبيوتر والتابلت والأندرويد</span>
              </div>
            </div>

            {/* Hero Visual Column (6 cols): 4-Slide Fade Carousel with Fixed Box, Arrows, Touch Swipe & Dots Below */}
            <div className="lg:col-span-6 flex flex-col justify-center">
              {/* Fixed-Size Image Box (Size never changes across slides) */}
              <div
                className="relative w-full h-[360px] sm:h-[430px] rounded-2xl overflow-hidden border border-[#231911]/15 bg-[#231911] shadow-xl select-none touch-pan-y"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                {/* 4 Stacked Slides with Smooth Fade Transition & Skip-On-Error */}
                {slidesToRender.map((slide, index) => {
                  const isActive = index === safeSlideIndex;
                  const srcIdx = slideSourceIdx[slide.id] ?? 0;
                  const resolvedSrc = slide.sources[Math.min(srcIdx, slide.sources.length - 1)];
                  return (
                    <img
                      key={slide.id}
                      src={resolvedSrc}
                      alt={slide.alt}
                      draggable={false}
                      onError={() => handleSlideImageError(slide, index)}
                      className={`absolute inset-0 w-full h-full ${slide.fit} transition-opacity duration-700 ease-in-out ${
                        isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                      }`}
                    />
                  );
                })}

                {/* Right & Left Navigation Arrows */}
                <button
                  type="button"
                  onClick={goToPrevSlide}
                  aria-label="الصورة السابقة"
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-[#231911]/75 hover:bg-[#231911] text-[#C9A86A] border border-[#C9A86A]/40 flex items-center justify-center shadow-lg transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                <button
                  type="button"
                  onClick={goToNextSlide}
                  aria-label="الصورة التالية"
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-[#231911]/75 hover:bg-[#231911] text-[#C9A86A] border border-[#C9A86A]/40 flex items-center justify-center shadow-lg transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Stationary Overlay Text & Action Button (Never moves when slides change) */}
                <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-[#231911] via-[#231911]/85 to-transparent p-5 sm:p-6 text-[#F9F6F0] pointer-events-none">
                  <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                      <p className="text-xs text-[#C9A86A] font-bold">
                        واجهة الكاشير المعتمدة في متاجر مأرب المدينة واليمن
                      </p>
                      <p className="text-sm sm:text-base font-bold text-[#F9F6F0] mt-0.5">
                        يعمل على الكمبيوتر والتابلت والأندرويد مع ربط فوري للباركود والطابعة الحرارية
                      </p>
                    </div>
                    <a
                      href="#receipt-demo"
                      className="pointer-events-auto text-xs font-bold text-[#231911] bg-[#C9A86A] hover:bg-[#d8b97e] px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-md"
                    >
                      جرب الكاشير الحي بالأسفل
                    </a>
                  </div>
                </div>
              </div>

              {/* Small Pagination Dots Under the Image Box */}
              <div
                className="flex items-center justify-center gap-2.5 mt-4"
                role="tablist"
                aria-label="التنقل بين صور الواجهة الرئيسية"
              >
                {slidesToRender.map((slide, index) => {
                  const isActive = index === safeSlideIndex;
                  return (
                    <button
                      key={slide.id}
                      type="button"
                      onClick={() => setCurrentSlide(index)}
                      aria-label={`عرض الصورة ${index + 1}`}
                      aria-selected={isActive}
                      className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                        isActive
                          ? 'w-8 bg-[#231911] border border-[#C9A86A]'
                          : 'w-2.5 bg-[#231911]/25 hover:bg-[#231911]/50'
                      }`}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          {/* 3. STATS BAR: Full-width 4-column strip below the hero split */}
          <div className="mt-12 bg-[#231911] text-[#F9F6F0] rounded-2xl p-6 sm:p-8 border border-[#C9A86A]/25">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 divide-y lg:divide-y-0 lg:divide-x lg:divide-x-reverse divide-[#F9F6F0]/10">
              <div className="pt-4 first:pt-0 lg:pt-0 lg:px-4 first:lg:pr-0">
                <p className="text-2xl sm:text-3xl font-extrabold text-[#C9A86A] font-display tabular-nums">
                  +500 متجر يستخدمه
                </p>
                <p className="text-xs sm:text-sm text-[#F9F6F0]/75 mt-1">
                  سوبرماركت، تموينات، ملابس، وإلكترونيات في مأرب واليمن
                </p>
              </div>

              <div className="pt-4 sm:pt-0 lg:px-4">
                <p className="text-2xl sm:text-3xl font-extrabold text-[#C9A86A] font-display tabular-nums">
                  99% رضا العملاء
                </p>
                <p className="text-xs sm:text-sm text-[#F9F6F0]/75 mt-1">
                  سهولة في الاستخدام وسرعة في إصدار الفواتير وجرد البضاعة
                </p>
              </div>

              <div className="pt-4 lg:pt-0 lg:px-4">
                <p className="text-2xl sm:text-3xl font-extrabold text-[#C9A86A] font-display">
                  يعمل بدون انترنت
                </p>
                <p className="text-xs sm:text-sm text-[#F9F6F0]/75 mt-1">
                  يعمل بكفاءة على الكمبيوتر والتابلت والأندرويد دون توقف
                </p>
              </div>

              <div className="pt-4 lg:pt-0 lg:px-4 last:lg:pl-0">
                <p className="text-2xl sm:text-3xl font-extrabold text-[#C9A86A] font-display">
                  دعم بالعربي
                </p>
                <p className="text-xs sm:text-sm text-[#F9F6F0]/75 mt-1">
                  دعم فني محلي مباشر في مأرب المدينة يتحدث لغتك ويخدمك عبر واتساب
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. FEATURES GRID (6 Cards with Icons in Asymmetric Bento Grid) */}
        <section id="features" className="py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <p className="text-xs sm:text-sm font-bold text-[#231911]/65 mb-2">
              قدرات متكاملة لإدارة المحلات التجارية · بدون تعقيد محاسبي
            </p>
            <h2
              className="text-3xl sm:text-4xl font-extrabold text-[#231911] tracking-tight"
              style={{ textWrap: 'balance' }}
            >
              كل ما يحتاجه متجرك للبيع السريع وضبط المخزون والأرباح
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {features.map((feature) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={feature.index}
                  className={`${feature.span} bg-white rounded-2xl p-6 sm:p-8 border border-[#231911]/10 hover:border-[#C9A86A] transition-colors flex flex-col justify-between`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-4 mb-5">
                      <span className="text-sm font-mono font-bold text-[#C9A86A] tabular-nums">
                        {feature.index}.
                      </span>
                      <div className="w-11 h-11 rounded-xl bg-[#231911] text-[#C9A86A] flex items-center justify-center shrink-0">
                        <IconComponent className="w-5 h-5" />
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-[#231911] mb-3">
                      {feature.title}
                    </h3>

                    <p className="text-sm sm:text-base text-[#231911]/75 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#231911]/10 text-xs font-medium text-[#231911]/65">
                    {feature.meta}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* EXTRA: Interactive Demo Invoice & Thermal Receipt Preview Card */}
        <ThermalReceiptDemo />

        {/* EXTRA: Interactive Profit Calculator & Margin Reporting Simulation */}
        <ProfitCalculator onStartTrial={() => handleOpenTrial('تجربة مجانية لمدة 14 يوماً')} />

        {/* EXTRA: Interactive Low Stock Alerts & Supplier WhatsApp Reorder Panel */}
        <LowStockAlerts />

        {/* 5. HOW IT WORKS (3 Steps: سجل متجرك، اضف منتجاتك، ابدأ البيع) */}
        <section id="how-it-works" className="py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <p className="text-xs sm:text-sm font-bold text-[#231911]/65 mb-2">
                تشغيل سريع في نفس اليوم · لا يحتاج خبرة تقنية مسبقة
              </p>
              <h2
                className="text-3xl sm:text-4xl font-extrabold text-[#231911] tracking-tight"
                style={{ textWrap: 'balance' }}
              >
                ابدأ إدارة متجرك في 3 خطوات بسيطة
              </h2>
            </div>
            <button
              type="button"
              onClick={() => handleOpenTrial('تجربة مجانية لمدة 14 يوماً')}
              className="self-start md:self-auto px-5 py-2.5 rounded-xl bg-[#231911] hover:bg-[#35261b] text-[#F9F6F0] text-xs sm:text-sm font-bold transition-colors cursor-pointer whitespace-nowrap"
            >
              افتح حساب متجرك الآن
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((step) => {
              const StepIcon = step.icon;
              return (
                <div
                  key={step.number}
                  className="bg-white rounded-2xl p-6 sm:p-8 border border-[#231911]/10 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-2xl font-extrabold font-mono text-[#C9A86A] tabular-nums">
                        {step.number}.
                      </span>
                      <div className="w-10 h-10 rounded-xl bg-[#F9F6F0] border border-[#231911]/10 flex items-center justify-center text-[#231911]">
                        <StepIcon className="w-5 h-5" />
                      </div>
                    </div>

                    <p className="text-xs font-bold text-emerald-700 mb-1">
                      {step.subtitle}
                    </p>
                    <h3 className="text-xl font-bold text-[#231911] mb-3">
                      {step.title}
                    </h3>
                    <p className="text-sm sm:text-base text-[#231911]/75 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 6. PRICING SECTION (3 Plans - Middle Plan Highlighted "الأكثر طلباً") */}
        <section
          id="pricing"
          className="py-16 lg:py-24 bg-[#F2ECE1] border-y border-[#231911]/10"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div>
                <p className="text-xs sm:text-sm font-bold text-[#231911]/65 mb-2">
                  باقات واضحة ومرنة تناسب جميع أحجام المتاجر في اليمن
                </p>
                <h2
                  className="text-3xl sm:text-4xl font-extrabold text-[#231911] tracking-tight"
                  style={{ textWrap: 'balance' }}
                >
                  اختر الباقة المناسبة لمتجرك وابدأ مجاناً
                </h2>
              </div>

              {/* Interactive Currency Toggle Control */}
              <div className="inline-flex items-center gap-1 p-1 bg-white rounded-xl border border-[#231911]/15 self-start">
                <button
                  type="button"
                  onClick={() => setCurrency('YER')}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    currency === 'YER'
                      ? 'bg-[#231911] text-[#F9F6F0]'
                      : 'text-[#231911]/70 hover:text-[#231911]'
                  }`}
                >
                  بالريال اليمني (ر.ي)
                </button>
                <button
                  type="button"
                  onClick={() => setCurrency('SAR')}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    currency === 'SAR'
                      ? 'bg-[#231911] text-[#F9F6F0]'
                      : 'text-[#231911]/70 hover:text-[#231911]'
                  }`}
                >
                  بالريال السعودي (ر.س)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
              {pricingPlans.map((plan) => (
                <div
                  key={plan.id}
                  className={`rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-all ${
                    plan.highlighted
                      ? 'bg-[#231911] text-[#F9F6F0] border-2 border-[#C9A86A] shadow-xl'
                      : 'bg-white text-[#231911] border border-[#231911]/12'
                  }`}
                >
                  <div>
                    {/* Clean unboxed editorial kicker (Zero-Pill compliant) */}
                    <div className="flex items-center justify-between gap-2 pb-4 mb-5 border-b border-current/10">
                      <span
                        className={`text-xs font-bold ${
                          plan.highlighted ? 'text-[#C9A86A]' : 'text-[#231911]/65'
                        }`}
                      >
                        {plan.kicker}
                      </span>
                      {plan.highlighted && (
                        <span className="text-xs font-extrabold text-emerald-400">
                          الأكثر طلباً
                        </span>
                      )}
                    </div>

                    <h3 className="text-2xl font-extrabold mb-2">{plan.name}</h3>
                    <p
                      className={`text-xs sm:text-sm leading-relaxed mb-6 ${
                        plan.highlighted ? 'text-[#F9F6F0]/75' : 'text-[#231911]/70'
                      }`}
                    >
                      {plan.description}
                    </p>

                    <div className="mb-6">
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl sm:text-4xl font-extrabold font-mono tabular-nums">
                          {currency === 'YER' ? plan.priceYER : plan.priceSAR}
                        </span>
                        <span
                          className={`text-sm font-bold ${
                            plan.highlighted ? 'text-[#C9A86A]' : 'text-[#231911]/80'
                          }`}
                        >
                          {currency === 'YER' ? 'ريال يمني' : 'ريال سعودي'}
                        </span>
                      </div>
                      <p
                        className={`text-xs mt-1 ${
                          plan.highlighted ? 'text-[#F9F6F0]/65' : 'text-[#231911]/60'
                        }`}
                      >
                        {plan.period}
                      </p>
                    </div>

                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feat) => (
                        <li key={feat} className="flex items-start gap-2.5 text-sm">
                          <Check
                            className={`w-4 h-4 mt-1 shrink-0 ${
                              plan.highlighted ? 'text-[#C9A86A]' : 'text-emerald-600'
                            }`}
                          />
                          <span
                            className={
                              plan.highlighted ? 'text-[#F9F6F0]/90' : 'text-[#231911]/85'
                            }
                          >
                            {feat}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenTrial(plan.name)}
                    className={`w-full py-3.5 px-5 rounded-xl font-bold text-sm transition-colors cursor-pointer whitespace-nowrap ${
                      plan.highlighted
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
                        : 'bg-[#231911] hover:bg-[#35261b] text-[#F9F6F0]'
                    }`}
                  >
                    {plan.ctaLabel}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. TESTIMONIALS (3 Reviews from Shop Owners in Marib City) */}
        <section id="testimonials" className="py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <p className="text-xs sm:text-sm font-bold text-[#231911]/65 mb-2">
              قصص نجاح حقيقية من الميدان · مأرب - المدينة
            </p>
            <h2
              className="text-3xl sm:text-4xl font-extrabold text-[#231911] tracking-tight"
              style={{ textWrap: 'balance' }}
            >
              ماذا يقول أصحاب المتاجر في مأرب المدينة عن «متجر برو»؟
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            {testimonials.map((item) => (
              <article
                key={item.name}
                className="bg-white rounded-2xl p-6 sm:p-8 border border-[#231911]/10 flex flex-col justify-between"
              >
                <div>
                  {/* Quantified outcome header (unboxed text, no thick left border) */}
                  <p className="text-xs font-bold text-emerald-700 pb-4 mb-4 border-b border-[#231911]/10">
                    النتيجة: {item.outcome}
                  </p>

                  <blockquote className="text-sm sm:text-base text-[#231911]/85 leading-relaxed mb-6">
                    «{item.quote}»
                  </blockquote>
                </div>

                <div className="pt-4 border-t border-[#231911]/10 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-base font-bold text-[#231911]">{item.name}</p>
                    <p className="text-xs text-[#231911]/65 mt-0.5">
                      {item.role} · {item.location}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* 8. FAQ SECTION (4 Questions) */}
        <section id="faq" className="py-16 lg:py-20 bg-white border-t border-[#231911]/10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-xs sm:text-sm font-bold text-[#231911]/65 mb-2">
                إجابات واضحة على استفسارات أصحاب المحلات
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#231911] tracking-tight">
                الأسئلة الشائعة
              </h2>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={faq.question}
                    className="rounded-2xl border border-[#231911]/12 bg-[#F9F6F0] overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full px-6 py-5 text-right flex items-center justify-between gap-4 font-bold text-base sm:text-lg text-[#231911] hover:bg-[#231911]/[0.02] transition-colors cursor-pointer"
                      aria-expanded={isOpen}
                    >
                      <span>{faq.question}</span>
                      <ChevronDown
                        className={`w-5 h-5 text-[#231911]/70 shrink-0 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-[#C9A86A]' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-5 pt-1 text-sm sm:text-base text-[#231911]/80 leading-relaxed border-t border-[#231911]/10">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* DEVELOPER PROFILE & DIRECT CONTACT CHANNELS (Belal Albahri) */}
        <DeveloperContactSection />

        {/* 9. FINAL CTA & DIRECT CONTACT SECTION */}
        <section id="contact" className="py-16 lg:py-24 bg-[#231911] text-[#F9F6F0]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* CTA Statement & WhatsApp Button (7 cols) */}
              <div className="lg:col-span-7 space-y-5">
                <p className="text-xs sm:text-sm font-bold text-[#C9A86A]">
                  تطوير وإشراف: المهندس والمحاسب بلال البحري · دعم فني مباشر في اليمن
                </p>
                <h2
                  className="text-3xl sm:text-5xl font-extrabold text-[#F9F6F0] tracking-tight font-display"
                  style={{ textWrap: 'balance' }}
                >
                  جاهز تطور متجرك؟
                </h2>
                <p className="text-base sm:text-lg text-[#F9F6F0]/80 leading-relaxed max-w-xl">
                  ودّع دفاتر الديون والحسابات اليدوية المتعبة. تواصل الآن مباشرة مع المطور بلال البحري عبر واتساب لتفعيل نسختك التجريبية المجانية ومساعدتك في ربط الطابعة الحرارية وقارئ الباركود.
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <a
                    href={whatsappDirectLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 px-7 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm sm:text-base transition-colors shadow-lg whitespace-nowrap shrink-0"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>تواصل عبر واتساب (775526937)</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => handleOpenTrial('تجربة مجانية لمدة 14 يوماً')}
                    className="px-6 py-4 rounded-xl border border-[#C9A86A] text-[#C9A86A] hover:bg-[#C9A86A] hover:text-[#231911] font-bold text-sm sm:text-base transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    سجل متجرك مجاناً
                  </button>
                </div>

                <div className="pt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[#F9F6F0]/75">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[#C9A86A]" />
                    <span>المركز الرئيسي: مأرب - المدينة · صنعاء · عدن</span>
                  </span>
                  <span aria-hidden="true">·</span>
                  <a
                    href="tel:+967775526937"
                    className="inline-flex items-center gap-1.5 font-mono tabular-nums hover:text-[#C9A86A]"
                  >
                    <Phone className="w-4 h-4 text-[#C9A86A]" />
                    <span dir="ltr">+967 775 526 937</span>
                  </a>
                  <span aria-hidden="true">·</span>
                  <a
                    href="tel:+967718093309"
                    className="inline-flex items-center gap-1.5 font-mono tabular-nums hover:text-[#C9A86A]"
                  >
                    <span dir="ltr">+967 718 093 309</span>
                  </a>
                  <span aria-hidden="true">·</span>
                  <a
                    href="mailto:albahri7755@gmail.com"
                    className="font-mono hover:text-[#C9A86A]"
                  >
                    albahri7755@gmail.com
                  </a>
                </div>
              </div>

              {/* Quick Callback Request Card (5 cols) */}
              <div className="lg:col-span-5 bg-[#2E2118] border border-[#C9A86A]/25 rounded-2xl p-6 sm:p-8">
                <h3 className="text-lg font-bold text-[#F9F6F0] mb-1">
                  اطلب اتصالاً أو تأسيساً لنظام متجرك
                </h3>
                <p className="text-xs text-[#F9F6F0]/70 mb-5">
                  اترك رقمك وسيتواصل معك المهندس بلال البحري لتجهيز النظام والطابعة الحرارية.
                </p>

                {contactSent ? (
                  <div className="p-5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-center space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                    <p className="text-sm font-bold text-white">
                      تم استلام طلبك بنجاح يا {contactName}!
                    </p>
                    <p className="text-xs text-emerald-200">
                      سيتم التواصل معك فوراً على الرقم{' '}
                      <span className="font-mono tabular-nums">{contactPhone}</span> لترتيب تفعيل النظام.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setContactSent(false);
                        setContactName('');
                        setContactPhone('');
                      }}
                      className="text-xs text-[#C9A86A] underline pt-2 cursor-pointer"
                    >
                      إرسال طلب آخر
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleQuickContactSubmit} className="space-y-3.5" noValidate>
                    {contactError && (
                      <div className="p-2.5 rounded-lg bg-red-950/90 border border-red-500/40 text-red-200 text-xs">
                        {contactError}
                      </div>
                    )}
                    <div>
                      <label className="block text-xs font-medium text-[#F9F6F0]/80 mb-1">
                        الاسم واسم المتجر
                      </label>
                      <input
                        type="text"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="مثال: صالح الماربي - سوبرماركت سبأ"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#231911] border border-[#F9F6F0]/15 text-sm text-[#F9F6F0] placeholder:text-[#F9F6F0]/40 focus:outline-none focus:border-[#C9A86A]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#F9F6F0]/80 mb-1">
                        رقم الجوال (واتساب / اتصال)
                      </label>
                      <input
                        type="tel"
                        dir="ltr"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        placeholder="775 526 937"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#231911] border border-[#F9F6F0]/15 text-sm text-right font-mono tabular-nums text-[#F9F6F0] placeholder:text-[#F9F6F0]/40 focus:outline-none focus:border-[#C9A86A]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#F9F6F0]/80 mb-1">
                        الموقع / المحافظة
                      </label>
                      <select
                        value={contactDistrict}
                        onChange={(e) => setContactDistrict(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#231911] border border-[#F9F6F0]/15 text-sm text-[#F9F6F0] focus:outline-none focus:border-[#C9A86A]"
                      >
                        <option value="مأرب - المدينة (الشارع العام)">مأرب - المدينة (الشارع العام)</option>
                        <option value="مأرب - المدينة (حي الروضة)">مأرب - المدينة (حي الروضة)</option>
                        <option value="مأرب - المدينة (شارع صنعاء)">مأرب - المدينة (شارع صنعاء)</option>
                        <option value="مأرب - المجمع / الوادي">مأرب - المجمع / الوادي</option>
                        <option value="صنعاء">صنعاء</option>
                        <option value="عدن">عدن</option>
                        <option value="محافظة أخرى">محافظة أخرى</option>
                      </select>
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3 px-5 rounded-xl bg-[#C9A86A] hover:bg-[#d8b97e] text-[#231911] font-extrabold text-sm transition-colors cursor-pointer"
                    >
                      اطلب تواصل سريع الآن
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 10. FOOTER */}
      <footer className="bg-[#18110B] text-[#F9F6F0]/75 border-t border-[#C9A86A]/15 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-8 border-b border-[#F9F6F0]/10">
            <div className="flex items-center gap-3.5">
              <div className="w-13 h-13 rounded-2xl bg-white border-2 border-[#C9A86A] p-1.5 flex items-center justify-center shrink-0 shadow-md">
                <img
                  src={OFFICIAL_LOGO_PRIMARY}
                  onError={handleLogoImgError}
                  alt="شعار متجر برو - البحري"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="text-xl font-extrabold text-[#F9F6F0] font-display">
                    متجر برو - Matjar Pro
                  </span>
                  <span className="text-xs font-bold text-[#C9A86A]">
                    · المطور بلال البحري
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#F9F6F0]/65 mt-1">
                  نظام كاشير ذكي يدير متجرك كامل من مكان واحد · يعمل على الكمبيوتر والتابلت والأندرويد بدون إنترنت
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-xs sm:text-sm">
              <a href="#features" className="hover:text-[#C9A86A] transition-colors">
                المميزات
              </a>
              <a href="#receipt-demo" className="hover:text-[#C9A86A] transition-colors">
                الفاتورة الحرارية
              </a>
              <a href="#pricing" className="hover:text-[#C9A86A] transition-colors">
                الأسعار
              </a>
              <a href="#other-systems" className="hover:text-[#C9A86A] transition-colors">
                أنظمة محاسبية وإدارية أخرى
              </a>
              <a
                href="mailto:albahri7755@gmail.com"
                className="hover:text-[#C9A86A] transition-colors font-mono"
              >
                albahri7755@gmail.com
              </a>
              <a
                href={whatsappDirectLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-bold"
              >
                <MessageCircle className="w-4 h-4" />
                <span>واتساب: 775526937</span>
              </a>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#F9F6F0]/65 text-center sm:text-right">
            <p className="font-bold text-[#F9F6F0]/85">
              تصميم وتطوير: المهندس والمحاسب بلال البحري - 2026 © BELAL ALBAHRI - جميع الحقوق محفوظة
            </p>
            <p dir="ltr" className="font-mono tabular-nums text-[11px] text-[#C9A86A]">
              Yemen · Marib City / Sana'a / Aden · Mobile: +967 775526937 / +967 718093309 · Email: albahri7755@gmail.com
            </p>
          </div>
        </div>
      </footer>

      {/* EXTRA: Floating WhatsApp Button Bottom Left (Compact to respect 15% mobile sticky cap) */}
      <a
        href={whatsappDirectLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="تواصل معنا عبر واتساب"
        className="fixed bottom-5 left-5 z-40 inline-flex items-center gap-2 px-4 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-xl transition-transform hover:scale-105 whitespace-nowrap"
      >
        <MessageCircle className="w-5 h-5 shrink-0" />
        <span>تواصل واتساب</span>
      </a>

      {/* Interactive Modals */}
      <VideoDemoModal
        isOpen={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
        onStartTrial={() => handleOpenTrial('تجربة مجانية لمدة 14 يوماً')}
      />

      <FreeTrialModal
        isOpen={isTrialOpen}
        selectedPlan={selectedPlan}
        onClose={() => setIsTrialOpen(false)}
      />
    </div>
  );
}
