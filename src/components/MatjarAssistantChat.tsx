import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  RotateCcw,
  User,
  Calculator,
  Wrench,
  Store,
  Zap,
  BrainCircuit,
  MessageSquare,
  X,
  AlertCircle,
  Loader2,
} from 'lucide-react';

export interface ChatTurn {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  modelUsed?: string;
}

interface RoleOption {
  id: 'pos_advisor' | 'accounting_expert' | 'tech_support';
  title: string;
  subtitle: string;
  icon: React.ElementType;
  welcomeMessage: string;
  quickPrompts: string[];
}

const CHAT_ROLES: RoleOption[] = [
  {
    id: 'pos_advisor',
    title: 'مستشار متجر برو والأنظمة',
    subtitle: 'المميزات، الباقات، والأنظمة الـ 7 للمهندس بلال البحري',
    icon: Store,
    welcomeMessage:
      'مرحباً بك في المساعد الذكي لنظام «متجر برو»! أنا هنا للإجابة عن كافة استفساراتك حول نظام الكاشير، الطباعة الحرارية، العمل بدون إنترنت، أو أي من الأنظمة المحاسبية والإدارية الـ 7 للمهندس والمحاسب بلال البحري.',
    quickPrompts: [
      'ما هي مميزات نظام متجر برو للمحلات في مأرب؟',
      'ما هي الأنظمة المحاسبية الـ 7 المتوفرة لديكم؟',
      'ما الفرق بين الباقة الشهرية والباقة السنوية؟',
    ],
  },
  {
    id: 'accounting_expert',
    title: 'خبير المحاسبة والأرباح',
    subtitle: 'تسعير الأصناف، حساب هامش الربح، وفرق الصرف',
    icon: Calculator,
    welcomeMessage:
      'أهلاً بك! بصفتي خبير المحاسبة والتسعير في «متجر برو»، يمكنني مساعدتك في حساب صافي أرباح أصنافك بالعبوة أو الكرتون، وتحديد سعر البيع المناسب بالريال اليمني أو السعودي.',
    quickPrompts: [
      'إذا اشتريت كرتون بـ 12,000 ر.ي وبعته بـ 15,600 ر.ي فكم نسبة ربحه؟',
      'كيف أحمي أرباح متجري عند تغير سعر صرف الريال السعودي؟',
      'كيف أنظم الديون الآجلة للعملاء بدون ضياع؟',
    ],
  },
  {
    id: 'tech_support',
    title: 'مساعد الإعداد والدعم الفني',
    subtitle: 'ربط الطابعة الحرارية 80mm/58mm وقارئ الباركود',
    icon: Wrench,
    welcomeMessage:
      'مرحباً بك في الدعم الفني السريع لنظام «متجر برو»! اسألني عن طريقة ربط الطابعات الحرارية (80mm و 58mm)، إعداد قارئ الباركود، أو تشغيل النظام على الكمبيوتر والتابلت والأندرويد.',
    quickPrompts: [
      'كيف أربط الطابعة الحرارية 80mm بالكمبيوتر والتابلت؟',
      'هل يعمل النظام والباركود إذا انقطع الإنترنت والكهرباء؟',
      'كيف أحصل على النسخة التجريبية المجانية لمدة 14 يوماً؟',
    ],
  },
];

export const MatjarAssistantChat: React.FC = () => {
  const [selectedRoleId, setSelectedRoleId] = useState<RoleOption['id']>('pos_advisor');
  const [mode, setMode] = useState<'general' | 'fast'>('general');
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isFloatingOpen, setIsFloatingOpen] = useState<boolean>(false);

  const activeRole = CHAT_ROLES.find((r) => r.id === selectedRoleId) || CHAT_ROLES[0];

  // Store conversation history per role so switching roles preserves or starts clean
  const [threadsByRole, setThreadsByRole] = useState<Record<string, ChatTurn[]>>({
    pos_advisor: [
      {
        id: 'welcome-pos',
        role: 'model',
        text: CHAT_ROLES[0].welcomeMessage,
        timestamp: 'الآن',
      },
    ],
    accounting_expert: [
      {
        id: 'welcome-acc',
        role: 'model',
        text: CHAT_ROLES[1].welcomeMessage,
        timestamp: 'الآن',
      },
    ],
    tech_support: [
      {
        id: 'welcome-tech',
        role: 'model',
        text: CHAT_ROLES[2].welcomeMessage,
        timestamp: 'الآن',
      },
    ],
  });

  const currentMessages = threadsByRole[selectedRoleId] || [];
  const inlineScrollRef = useRef<HTMLDivElement | null>(null);
  const floatingScrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (inlineScrollRef.current) {
      inlineScrollRef.current.scrollTop = inlineScrollRef.current.scrollHeight;
    }
    if (floatingScrollRef.current) {
      floatingScrollRef.current.scrollTop = floatingScrollRef.current.scrollHeight;
    }
  }, [currentMessages, isLoading, isFloatingOpen]);

  const formatNowTime = () => {
    try {
      return new Date().toLocaleTimeString('ar-YE', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'الآن';
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const trimmed = (textToSend ?? input).trim();
    if (!trimmed || isLoading) return;

    setErrorMessage(null);
    if (!textToSend) {
      setInput('');
    }

    const userTurn: ChatTurn = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: trimmed,
      timestamp: formatNowTime(),
    };

    const previousTurns = threadsByRole[selectedRoleId] || [];
    const updatedTurns = [...previousTurns, userTurn];

    setThreadsByRole((prev) => ({
      ...prev,
      [selectedRoleId]: updatedTurns,
    }));
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          roleId: selectedRoleId,
          mode,
          history: previousTurns.map((m) => ({
            role: m.role,
            text: m.text,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || 'حدث خطأ أثناء الاتصال بالمساعد الذكي. يرجى المحاولة مرة أخرى.'
        );
      }

      const modelTurn: ChatTurn = {
        id: `model-${Date.now()}`,
        role: 'model',
        text: data.reply || 'تم استلام رسالتك بنجاح.',
        timestamp: formatNowTime(),
        modelUsed: data.model,
      };

      setThreadsByRole((prev) => ({
        ...prev,
        [selectedRoleId]: [...(prev[selectedRoleId] || []), modelTurn],
      }));
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : 'تعذر الاتصال بالمساعد الذكي في الوقت الحالي.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetThread = () => {
    setErrorMessage(null);
    setThreadsByRole((prev) => ({
      ...prev,
      [selectedRoleId]: [
        {
          id: `welcome-${Date.now()}`,
          role: 'model',
          text: activeRole.welcomeMessage,
          timestamp: formatNowTime(),
        },
      ],
    }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage();
  };

  return (
    <>
      {/* Main Inline Multi-Turn Gemini Chat Section */}
      <section
        id="smart-assistant"
        className="py-16 lg:py-24 bg-[#231911] text-[#F9F6F0] border-y border-[#C9A86A]/25"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C9A86A]/15 border border-[#C9A86A]/40 text-[#C9A86A] text-xs font-extrabold mb-3">
                <Sparkles className="w-4 h-4" />
                <span>المساعد الذكي التفاعلي · محادثة متعددة الأدوار بالذكاء الاصطناعي</span>
              </div>
              <h2
                className="text-3xl sm:text-4xl font-extrabold text-[#F9F6F0] tracking-tight"
                style={{ textWrap: 'balance' }}
              >
                اسأل مستشار «متجر برو» الذكي في أي وقت
              </h2>
              <p className="text-sm sm:text-base text-[#F9F6F0]/75 mt-2 max-w-2xl leading-relaxed">
                اختر شخصية المساعد الذكي المناسبة لك (مستشار الأنظمة، خبير المحاسبة والتسعير، أو الدعم الفني) وأجرِ محادثة متكاملة حول إدارة متجرك وحساب أرباحك.
              </p>
            </div>

            {/* Model Speed / Reasoning Mode Selector */}
            <div className="inline-flex items-center p-1.5 rounded-xl bg-[#18110B] border border-[#C9A86A]/30 self-start lg:self-auto">
              <button
                type="button"
                onClick={() => setMode('general')}
                className={`px-3.5 py-2 rounded-lg text-xs font-extrabold transition-colors cursor-pointer flex items-center gap-1.5 ${
                  mode === 'general'
                    ? 'bg-[#C9A86A] text-[#231911]'
                    : 'text-[#F9F6F0]/70 hover:text-white'
                }`}
              >
                <BrainCircuit className="w-3.5 h-3.5" />
                <span>إجابة شاملة ودقيقة</span>
              </button>
              <button
                type="button"
                onClick={() => setMode('fast')}
                className={`px-3.5 py-2 rounded-lg text-xs font-extrabold transition-colors cursor-pointer flex items-center gap-1.5 ${
                  mode === 'fast'
                    ? 'bg-[#C9A86A] text-[#231911]'
                    : 'text-[#F9F6F0]/70 hover:text-white'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>رد فوري سريع</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Right Column: Role Selector Cards & Quick Prompts (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              <p className="text-xs font-bold text-[#C9A86A] mb-2">
                1. اختر تخصص المساعد الذكي:
              </p>

              <div className="space-y-3">
                {CHAT_ROLES.map((role) => {
                  const RoleIcon = role.icon;
                  const isSelected = role.id === selectedRoleId;
                  return (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => {
                        setSelectedRoleId(role.id);
                        setErrorMessage(null);
                      }}
                      className={`w-full text-right p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                        isSelected
                          ? 'bg-[#2E2118] border-[#C9A86A] shadow-lg'
                          : 'bg-[#18110B]/70 border-[#F9F6F0]/10 hover:border-[#C9A86A]/40'
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'bg-[#C9A86A] text-[#231911]'
                            : 'bg-[#231911] text-[#C9A86A] border border-[#C9A86A]/30'
                        }`}
                      >
                        <RoleIcon className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm sm:text-base font-extrabold text-[#F9F6F0]">
                          {role.title}
                        </h3>
                        <p className="text-xs text-[#F9F6F0]/65 mt-0.5 leading-relaxed">
                          {role.subtitle}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Quick Suggested Questions */}
              <div className="p-4 rounded-2xl bg-[#18110B] border border-[#F9F6F0]/10 space-y-2.5">
                <p className="text-xs font-bold text-[#C9A86A]">
                  2. أسئلة سريعة مقترحة ({activeRole.title}):
                </p>
                <div className="space-y-2">
                  {activeRole.quickPrompts.map((promptText) => (
                    <button
                      key={promptText}
                      type="button"
                      disabled={isLoading}
                      onClick={() => handleSendMessage(promptText)}
                      className="w-full text-right text-xs font-medium text-[#F9F6F0]/85 hover:text-[#C9A86A] bg-[#231911] hover:bg-[#2E2118] p-3 rounded-xl border border-[#F9F6F0]/10 hover:border-[#C9A86A]/40 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      «{promptText}»
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Left Column: Scrollable Multi-Turn Chat Thread (8 cols) */}
            <div className="lg:col-span-8 bg-[#F9F6F0] text-[#231911] rounded-3xl border border-[#C9A86A]/40 shadow-2xl overflow-hidden flex flex-col h-[540px]">
              {/* Thread Top Bar */}
              <div className="bg-white px-5 py-4 border-b border-[#231911]/10 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#231911] text-[#C9A86A] flex items-center justify-center shrink-0">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm sm:text-base font-extrabold text-[#231911]">
                        {activeRole.title}
                      </h3>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-800 text-[10px] font-extrabold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                        متصل الآن
                      </span>
                    </div>
                    <p className="text-[11px] text-[#231911]/60">
                      يحتفظ بسياق المحادثة بالكامل · مدعوم بـ Gemini
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleResetThread}
                  className="px-3 py-1.5 rounded-xl bg-[#F9F6F0] hover:bg-[#231911]/10 text-[#231911]/75 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>محادثة جديدة</span>
                </button>
              </div>

              {/* Scrollable Messages Area */}
              <div
                ref={inlineScrollRef}
                className="flex-1 overflow-y-auto p-5 space-y-4"
              >
                {currentMessages.map((turn) => {
                  const isUser = turn.role === 'user';
                  return (
                    <div
                      key={turn.id}
                      className={`flex items-start gap-3 ${
                        isUser ? 'flex-row-reverse' : 'flex-row'
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                          isUser
                            ? 'bg-emerald-600 text-white'
                            : 'bg-[#231911] text-[#C9A86A]'
                        }`}
                      >
                        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                      </div>

                      <div
                        className={`max-w-[82%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                          isUser
                            ? 'bg-emerald-700 text-white rounded-tl-xs'
                            : 'bg-white text-[#231911] border border-[#231911]/10 rounded-tr-xs shadow-xs'
                        }`}
                      >
                        <p>{turn.text}</p>
                        <span
                          className={`block text-[10px] mt-1.5 ${
                            isUser ? 'text-emerald-100/80' : 'text-[#231911]/45'
                          }`}
                        >
                          {turn.timestamp}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {isLoading && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#231911] text-[#C9A86A] flex items-center justify-center shrink-0">
                      <Loader2 className="w-4 h-4 animate-spin" />
                    </div>
                    <div className="bg-white text-[#231911] border border-[#231911]/10 rounded-2xl px-4 py-3 text-xs font-bold flex items-center gap-2">
                      <span>جاري تحضير الإجابة من {activeRole.title}...</span>
                    </div>
                  </div>
                )}

                {errorMessage && (
                  <div className="p-3.5 rounded-2xl bg-red-50 border border-red-500/30 text-red-800 text-xs flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">{errorMessage}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Message Input Form */}
              <form
                onSubmit={handleFormSubmit}
                className="p-4 bg-white border-t border-[#231911]/10 flex items-center gap-2.5"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={`اكتب سؤالك هنا لـ ${activeRole.title}...`}
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 rounded-xl bg-[#F9F6F0] border border-[#231911]/15 text-xs sm:text-sm font-medium text-[#231911] placeholder:text-[#231911]/45 focus:outline-none focus:border-[#C9A86A] disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="px-5 py-3 rounded-xl bg-[#231911] hover:bg-[#35261b] disabled:opacity-50 text-[#C9A86A] font-extrabold text-xs sm:text-sm flex items-center gap-2 transition-colors cursor-pointer shrink-0"
                >
                  <span>إرسال</span>
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Quick-Chat Drawer Trigger (Bottom Right so it never overlaps Bottom-Left WhatsApp button) */}
      <div className="fixed bottom-5 right-5 z-40">
        {isFloatingOpen ? (
          <div
            dir="rtl"
            className="w-[340px] sm:w-[380px] h-[470px] rounded-3xl bg-[#F9F6F0] text-[#231911] border-2 border-[#C9A86A] shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Drawer Header */}
            <div className="bg-[#231911] text-[#F9F6F0] px-4 py-3.5 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#C9A86A] text-[#231911] flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-white">
                    المساعد الذكي · متجر برو
                  </h4>
                  <p className="text-[10px] text-[#C9A86A]">{activeRole.title}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsFloatingOpen(false)}
                aria-label="إغلاق نافذة المحادثة"
                className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Compact Role Switcher inside Drawer */}
            <div className="bg-white px-3 py-2 border-b border-[#231911]/10 flex items-center gap-1 overflow-x-auto">
              {CHAT_ROLES.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setSelectedRoleId(r.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-colors cursor-pointer ${
                    r.id === selectedRoleId
                      ? 'bg-[#231911] text-[#C9A86A]'
                      : 'bg-[#F9F6F0] text-[#231911]/70'
                  }`}
                >
                  {r.title}
                </button>
              ))}
            </div>

            {/* Drawer Messages */}
            <div
              ref={floatingScrollRef}
              className="flex-1 overflow-y-auto p-3.5 space-y-3"
            >
              {currentMessages.map((turn) => {
                const isUser = turn.role === 'user';
                return (
                  <div
                    key={turn.id}
                    className={`flex items-start gap-2 ${
                      isUser ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed whitespace-pre-wrap ${
                        isUser
                          ? 'bg-emerald-700 text-white'
                          : 'bg-white text-[#231911] border border-[#231911]/10 shadow-xs'
                      }`}
                    >
                      <p>{turn.text}</p>
                    </div>
                  </div>
                );
              })}

              {isLoading && (
                <div className="text-xs font-bold text-[#231911]/70 bg-white p-2.5 rounded-xl border border-[#231911]/10 flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#9A7432]" />
                  <span>جاري الكتابة...</span>
                </div>
              )}

              {errorMessage && (
                <div className="p-2.5 rounded-xl bg-red-50 border border-red-500/30 text-red-800 text-[11px]">
                  {errorMessage}
                </div>
              )}
            </div>

            {/* Drawer Input */}
            <form
              onSubmit={handleFormSubmit}
              className="p-2.5 bg-white border-t border-[#231911]/10 flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="اسأل المساعد الذكي..."
                disabled={isLoading}
                className="flex-1 px-3 py-2 rounded-xl bg-[#F9F6F0] border border-[#231911]/15 text-xs text-[#231911] focus:outline-none focus:border-[#C9A86A]"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="p-2 rounded-xl bg-[#231911] text-[#C9A86A] disabled:opacity-50 cursor-pointer"
                aria-label="إرسال"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsFloatingOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-3 rounded-full bg-[#231911] hover:bg-[#35261b] text-[#C9A86A] border border-[#C9A86A]/50 font-bold text-xs sm:text-sm shadow-xl transition-transform hover:scale-105 cursor-pointer whitespace-nowrap"
          >
            <MessageSquare className="w-5 h-5 shrink-0" />
            <span>المساعد الذكي</span>
          </button>
        )}
      </div>
    </>
  );
};
