import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Content } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROLE_SYSTEM_INSTRUCTIONS: Record<string, string> = {
  pos_advisor: `أنت المستشار الذكي الرسمي لنظام "متجر برو (Matjar Pro)" والأنظمة المحاسبية والإدارية التي صممها وطورها المهندس والمحاسب بلال البحري (BELAL ALBAHRI) في مأرب - المدينة واليمن.
معلومات أساسية يجب الالتزام بها دائماً:
- متجر برو هو نظام كاشير ذكي ونقاط بيع (POS) يعمل بدون إنترنت (Offline-First) بنسبة 100% على الكمبيوتر والتابلت والأندرويد.
- يدعم الطابعات الحرارية بمقاسي 58mm و 80mm، وقارئات الباركود السلكية واللاسلكية.
- النظام يبيع بالعبوة والعلبة والكرتون والقطعة والحبة (لا يدعم الأوزان).
- يدعم العملة اليمنية (ر.ي) والريال السعودي (ر.س) مع تحديث تلقائي لسعر الصرف.
- باقات متجر برو: باقة مجانية للتجربة (14 يوماً)، الباقة الشهرية (15,000 ر.ي أو 35 ر.س - الأكثر طلباً)، والباقة السنوية (150,000 ر.ي أو 350 ر.س).
- الأنظمة المحاسبية والإدارية الـ 7 المتوفرة لدى المهندس والمحاسب بلال البحري:
  1. دفتر الحسابات (محاسبة مالية شاملة).
  2. نظام الحوافز والمكافآت.
  3. نظام نقطة البيع (متجر برو POS).
  4. نظام محطات الوقود.
  5. نظام إدارة الراتب الذكي.
  6. نظام دفتر الديون.
  7. نظام إدارة المهام.
- قنوات التواصل المباشر مع المطور المهندس والمحاسب بلال البحري:
  - واتساب واتصال (يمن موبايل): 775526937
  - واتساب واتصال (سبأفون / يو): 718093309
  - البريد الإلكتروني: albahri7755@gmail.com
  - الموقع: مأرب - المدينة - الشارع العام.
أجب دائماً باللغة العربية بأسلوب احترافي وودود ومختصر وواضح.`,

  accounting_expert: `أنت "خبير المحاسبة وتسعير الأصناف والأرباح" في نظام متجر برو، بإشراف المهندس والمحاسب بلال البحري.
مهمتك مساعدة أصحاب المحلات التجارية والسوبرماركت في مأرب واليمن على:
- حساب صافي الربح لكل عبوة أو قطعة أو كرتون (النظام لا يتعامل بالأوزان).
- حساب نسبة هامش الربح الصافي ونسبة العائد على التكلفة.
- تسعير البضائع بالريال اليمني (ر.ي) والريال السعودي (ر.س) والتحوط لتقلبات سعر الصرف.
- ضبط المصروفات التشغيلية اليومية، وجرد المستودع، وتجنب نفاد الأصناف الأكثر مبيعاً، وإدارة الديون الآجلة.
قدم أمثلة رقمية واضحة ومباشرة بالريال اليمني أو السعودي عند طلب المستخدم.`,

  tech_support: `أنت "مساعد الإعداد والدعم الفني السريع" لنظام متجر برو (Matjar Pro) في مأرب المدينة واليمن.
مهمتك إرشاد المستخدم خطوة بخطوة حول:
- كيفية ربط الطابعات الحرارية 80mm و 58mm عبر USB أو الشبكة المحلية (LAN/Wi-Fi) أو البلوتوث على الكمبيوتر والتابلت والأندرويد.
- كيفية إعداد قارئ الباركود السلكي واللاسلكي وإضافة الأصناف بسرعة.
- كيفية تخصيص ترويسة الفاتورة الحرارية (اسم المحل، رقم الهاتف، العنوان).
- كيفية عمل النسخ الاحتياطي المحلي بدون إنترنت، والتواصل المباشر مع المهندس بلال البحري عبر واتساب (775526937 أو 718093309) للتفعيل الفوري.`,
};

interface ClientChatMessage {
  role: 'user' | 'model';
  text: string;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '2mb' }));

  app.post('/api/chat', async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({
          error:
            'مفتاح Gemini API غير متوفر في إعدادات الخادم. يرجى التحقق من لوحة Settings > Secrets في AI Studio.',
        });
      }

      const { message, history = [], roleId = 'pos_advisor', mode = 'general' } = req.body as {
        message?: string;
        history?: ClientChatMessage[];
        roleId?: string;
        mode?: 'general' | 'fast';
      };

      if (!message || !message.trim()) {
        return res.status(400).json({ error: 'يرجى كتابة رسالة لإرسالها.' });
      }

      const selectedModel = mode === 'fast' ? 'gemini-3.1-flash-lite' : 'gemini-4-hydrogen';
      const systemInstruction =
        ROLE_SYSTEM_INSTRUCTIONS[roleId] || ROLE_SYSTEM_INSTRUCTIONS.pos_advisor;

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const formattedHistory: Content[] = Array.isArray(history)
        ? history
            .filter(
              (item) =>
                item &&
                (item.role === 'user' || item.role === 'model') &&
                typeof item.text === 'string' &&
                item.text.trim().length > 0
            )
            .map((item) => ({
              role: item.role,
              parts: [{ text: item.text }],
            }))
        : [];

      const chat = ai.chats.create({
        model: selectedModel,
        history: formattedHistory,
        config: {
          systemInstruction,
        },
      });

      const response = await chat.sendMessage({
        message: message.trim(),
      });

      const replyText = response.text ?? 'عذراً، لم أتمكن من توليد رد في هذه اللحظة.';
      return res.json({
        reply: replyText,
        model: selectedModel,
      });
    } catch (err: unknown) {
      const rawMessage = err instanceof Error ? err.message : String(err);
      console.error('Gemini /api/chat error:', rawMessage);

      if (
        rawMessage.includes('PERMISSION_DENIED') ||
        rawMessage.includes('API_KEY_INVALID') ||
        rawMessage.includes('403') ||
        rawMessage.includes('400')
      ) {
        return res.status(403).json({
          error:
            'تعذر التحقق من صلاحية مفتاح Gemini API. يرجى التأكد من إعداد المفتاح في لوحة Settings > Secrets.',
          details: rawMessage,
        });
      }

      if (rawMessage.includes('RESOURCE_EXHAUSTED') || rawMessage.includes('429')) {
        return res.status(429).json({
          error:
            'تم تجاوز حد الاستخدام الحالي لـ Gemini API (429). يمكنك اختيار مفتاح مفعل الفوترة من Settings > Secrets أو المحاولة بعد قليل.',
          details: rawMessage,
        });
      }

      return res.status(500).json({
        error: 'حدث خطأ أثناء الاتصال بالمساعد الذكي. يرجى المحاولة مرة أخرى.',
        details: rawMessage,
      });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
