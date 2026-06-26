const SYSTEM_PROMPT = `أنت مساعد ذكي ومتعاطف في تطبيق "رفيق" المصمم لكبار السن.
- تحدث باللهجة المصرية الدارجة
- كن لطيفاً ومتفهماً وصبوراً
- أجب بإيجاز ووضوح
- إذا سُئلت عن صحة، قدّم نصائح عامة وذكّر باستشارة الطبيب
- إذا سُئلت عن دين، قدّم إجابات محترمة
- لا تذكر أبداً أنك ذكاء اصطناعي
- استخدم emojis بشكل معتدل`;

export const askGemini = async (question, apiKey) => {
  const key = apiKey || localStorage.getItem('rafeeq_gemini_key') || '';
  if (!key || key === 'YOUR_GEMINI_API_KEY') {
    return { error: 'NO_KEY', message: 'مفتاح Gemini غير موجود' };
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`;

  const body = {
    contents: [{
      parts: [{ text: `${SYSTEM_PROMPT}\n\nسؤال المستخدم: ${question}` }]
    }],
    generationConfig: { temperature: 0.7, maxOutputTokens: 500 }
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const data = await response.json();

    if (!response.ok) {
      if (data.error?.message?.includes('quota') || response.status === 429) {
        return { error: 'QUOTA_EXCEEDED', message: 'تم تجاوز الحد اليومي المجاني. انتظر أو جرّب نموذج آخر' };
      }
      return { error: 'API_ERROR', message: `خطأ: ${data.error?.message || 'غير معروف'}` };
    }

    if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
      return { text: data.candidates[0].content.parts[0].text };
    }

    return { error: 'NO_RESPONSE', message: 'لم يتم الرد' };
  } catch (e) {
    return { error: 'NETWORK', message: 'خطأ في الاتصال بالإنترنت. تأكد من اتصالك' };
  }
};

export const askOpenRouter = async (question, apiKey) => {
  const key = apiKey || localStorage.getItem('rafeeq_openrouter_key') || '';
  if (!key || key === 'YOUR_OPENROUTER_API_KEY') {
    return { error: 'NO_KEY', message: 'مفتاح OpenRouter غير موجود' };
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Rafeeq App'
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.1-8b-instruct:free',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: question }
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        return { error: 'INVALID_KEY', message: 'مفتاح API غير صالح' };
      }
      return { error: 'API_ERROR', message: `خطأ: ${data.error?.message || response.status}` };
    }

    if (data.choices?.[0]?.message?.content) {
      return { text: data.choices[0].message.content };
    }

    return { error: 'NO_RESPONSE', message: 'لم يتم الرد' };
  } catch (e) {
    return { error: 'NETWORK', message: 'خطأ في الاتصال بالإنترنت' };
  }
};

export const askAI = async (question) => {
  const openRouterKey = localStorage.getItem('rafeeq_openrouter_key');
  if (openRouterKey && openRouterKey !== 'YOUR_OPENROUTER_API_KEY') {
    const result = await askOpenRouter(question, openRouterKey);
    if (result.text) return result;
  }

  const geminiKey = localStorage.getItem('rafeeq_gemini_key');
  if (geminiKey && geminiKey !== 'YOUR_GEMINI_API_KEY') {
    return await askGemini(question, geminiKey);
  }

  return { error: 'NO_KEYS', message: 'يرجى إضافة مفتاح AI من صفحة الأدمن' };
};

export const suggestYouTubeVideos = async (topic) => {
  const result = await askAI(`أعطني 5 روابط YouTube لفيديوهات عربية عن: ${topic}
الرد بصيغة JSON فقط:
[{"title": "عنوان", "url": "https://www.youtube.com/watch?v=..."}]`);

  if (result.text) {
    try {
      let text = result.text.replace(/```json\s*/g, '').replace(/```\s*/g, '');
      return JSON.parse(text);
    } catch (e) {
      return [];
    }
  }
  return [];
};

export const testGeminiKey = async (apiKey) => {
  try {
    const result = await askGemini('قل مرحبك فقط', apiKey);
    if (result.text) {
      return { success: true, response: result.text };
    }
    return { success: false, error: result.message || result.error };
  } catch (e) {
    return { success: false, error: e.message };
  }
};

export const testOpenRouterKey = async (apiKey) => {
  try {
    const result = await askOpenRouter('قل مرحبك فقط', apiKey);
    if (result.text) {
      return { success: true, response: result.text };
    }
    return { success: false, error: result.message || result.error };
  } catch (e) {
    return { success: false, error: e.message };
  }
};

export const testHuggingFaceKey = async () => {
  return { success: false, error: 'Hugging Face لا يدعم الطلبات المباشرة من المتصفح (CORS). استخدم Gemini أو OpenRouter.' };
};

export const saveGeminiKey = (key) => {
  localStorage.setItem('rafeeq_gemini_key', key);
};

export const saveOpenRouterKey = (key) => {
  localStorage.setItem('rafeeq_openrouter_key', key);
};

export const saveHuggingFaceKey = () => {};

export const getGeminiKey = () => localStorage.getItem('rafeeq_gemini_key') || null;
export const getOpenRouterKey = () => localStorage.getItem('rafeeq_openrouter_key') || null;
export const getHuggingFaceKey = () => null;
