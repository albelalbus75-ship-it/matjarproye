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
} from 'lucide-react';

export const DeveloperContactSection: React.FC = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
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
    <section id="developer-contact" className="py-16 lg:py-24 bg-[#F9F6F0] border-t border-[#231911]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        {/* 1. Developer Profile Banner (Inspired by Screenshot 2) */}
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
                  src="/assets/aistudio/_____1f57c178.jpeg"
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

        {/* 2. Direct Communication Channels Grid (Matching Screenshots 1 & 3) */}
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
                      src="/assets/aistudio/_____1f57c178.jpeg"
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
                      src="/assets/aistudio/_____1f57c178.jpeg"
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

        {/* 3. Developer Guarantee Strip (From Screenshot 1 bottom dark bar) */}
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
