import React, { useState, useRef, useEffect } from 'react';
import { askAI } from '../utils/ai';

const INITIAL_MESSAGES = [
  { role: 'assistant', text: 'أهلاً بيك! 💚\nأنا مساعدك في رفيق، اسألني عن أي حاجة:\n• نصائح صحية 🏥\n• معلومات دينية 📿\n• طبخ ووصفات 🍳\n• أو أي سؤال تاني!' }
];

export default function AIChat() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setLoading(true);

    const result = await askAI(userMessage);

    setLoading(false);
    if (result.text) {
      setMessages(prev => [...prev, { role: 'assistant', text: result.text }]);
    } else if (result.error === 'API_KEY_REQUIRED') {
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: 'عذراً، لم يتم ربط خدمة الذكاء الاصطناعي بعد.\nيرجى إخبار الأدمن بإضافة مفتاح Gemini API.'
      }]);
    } else {
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: 'عذراً، حدث خطأ في الاتصال. حاول مرة أخرى.'
      }]);
    }
  };

  const quickQuestions = [
    'نصيحة صحية اليوم',
    'دعاء الصباح',
    'وصفة أكلة خفيفة',
    'فوائد المشي'
  ];

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--bg)',
      fontFamily: "'Cairo', sans-serif",
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '16px 20px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <div style={{
          width: '40px', height: '40px', borderRadius: '50%',
          backgroundColor: 'var(--blue)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white', fontSize: '20px'
        }}>
          <i className="fa-solid fa-robot"></i>
        </div>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>مساعد رفيق</h2>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>بالذكاء الاصطناعي 🤖</p>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            alignSelf: msg.role === 'user' ? 'flex-start' : 'flex-end',
            maxWidth: '85%',
            backgroundColor: msg.role === 'user' ? 'var(--blue)' : 'white',
            color: msg.role === 'user' ? 'white' : 'var(--text)',
            borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
            padding: '12px 16px',
            fontSize: '16px',
            lineHeight: 1.8,
            whiteSpace: 'pre-wrap',
            boxShadow: msg.role === 'user' ? 'none' : '0 2px 8px rgba(0,0,0,0.06)'
          }}>
            {msg.text}
          </div>
        ))}
        {loading && (
          <div style={{
            alignSelf: 'flex-end',
            backgroundColor: 'white',
            borderRadius: '16px 16px 16px 4px',
            padding: '12px 16px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
          }}>
            <div style={{ display: 'flex', gap: '4px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--blue)', animation: 'bounce 1.4s infinite' }}></div>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--blue)', animation: 'bounce 1.4s infinite 0.2s' }}></div>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--blue)', animation: 'bounce 1.4s infinite 0.4s' }}></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {messages.length <= 2 && (
        <div style={{ padding: '0 16px 8px', display: 'flex', gap: '8px', overflowX: 'auto' }}>
          {quickQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => {
                setInput(q);
              }}
              style={{
                flexShrink: 0,
                padding: '8px 16px',
                borderRadius: '20px',
                border: '1px solid var(--border)',
                backgroundColor: 'white',
                fontSize: '14px',
                cursor: 'pointer',
                fontFamily: "'Cairo', sans-serif",
                whiteSpace: 'nowrap'
              }}
            >
              {q}
            </button>
          ))}
        </div>
      )}

      <div style={{
        backgroundColor: 'white',
        padding: '12px 16px',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        gap: '8px',
        alignItems: 'center'
      }}>
        <input
          placeholder="اكتب سؤالك هنا..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          style={{ flex: 1, fontSize: '16px', border: 'none', outline: 'none' }}
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          style={{
            width: '44px', height: '44px',
            borderRadius: '50%',
            border: 'none',
            backgroundColor: input.trim() && !loading ? 'var(--blue)' : '#ccc',
            color: 'white',
            cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px'
          }}
        >
          <i className="fa-solid fa-paper-plane"></i>
        </button>
      </div>
    </div>
  );
}
