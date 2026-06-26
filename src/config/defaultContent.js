export const DEFAULT_CONTENT_ITEMS = [
  { id: 'quran',    label: 'القرآن الكريم', icon: 'fa-solid fa-book-quran', color: '#2EAA1C', url: 'https://www.youtube.com/watch?v=C3v5ScU6ufM', enabled: true },
  { id: 'radio',    label: 'إذاعة القرآن',  icon: 'fa-solid fa-radio',      color: '#1A7DC4', url: 'https://www.youtube.com/embed/live_stream?channel=UCos52azQNBgW63_9uDJoPDA', enabled: true },
  { id: 'news',     label: 'أخبار اليوم',   icon: 'fa-solid fa-newspaper',  color: '#D32F2F', url: 'https://www.youtube.com/watch?v=s8VPN23K9m8', enabled: true },
  { id: 'health',   label: 'نصائح طبية',    icon: 'fa-solid fa-stethoscope',color: '#F57C00', url: 'https://www.youtube.com/watch?v=nwz3zb7aTd4', enabled: true },
  { id: 'cooking',  label: 'طبخ ووصفات',    icon: 'fa-solid fa-utensils',   color: '#7B1FA2', url: 'https://www.youtube.com/watch?v=GzK5QH-adR8', enabled: true },
  { id: 'nostalgia',label: 'كلاسيكيات',     icon: 'fa-solid fa-tv',         color: '#607D8B', url: 'https://www.youtube.com/watch?v=ATv_PvyMh4s', enabled: true },
];

export const DEFAULT_EXERCISE_VIDEOS = [
  { id: 'ev1', title: 'تمارين جلوس لكبار السن', url: 'https://www.youtube.com/watch?v=Ev6yE55kYGw', enabled: true },
  { id: 'ev2', title: 'تمارين إطالة خفيفة', url: 'https://www.youtube.com/watch?v=0gSELLy8Sw0', enabled: true },
];

export const DEFAULT_EXERCISES = [
  { id: 'walk', label: 'مشي في المكان', emoji: '🚶‍♂️', duration: 300, desc: 'يساعد على تنشيط الدورة الدموية. قف مستقيماً وابدأ المشي في مكانك.', enabled: true },
  { id: 'breathe', label: 'تمرين التنفس العميق', emoji: '🫁', duration: 120, desc: 'خذ نفساً عميقاً من الأنف، ثم أخرجه ببطء من الفم للاسترخاء.', enabled: true },
  { id: 'feet', label: 'تحريك القدمين', emoji: '🦶', duration: 60, desc: 'وأنت جالس، ارفع كعبيك عن الأرض ثم أنزلهما لتنشيط الدم.', enabled: true },
];

export const DEFAULT_TIPS = [
  'المشي لمدة 10 دقائق بعد الأكل يساعد في الهضم ويضبط مستوى السكر في الدم.',
  'شرب الماء بكثرة مهم لصحتك. حاول شرب 8 أكواب يومياً.',
  'النوم المبكر مفيد للقلب والذاكرة.',
  'ابتسم دائماً، فالابتسامة صدقة وتُذهب الهم.',
  'اقرأ القرآن يومياً ولو صفحة واحدة، فهو شفاء للصدور.',
  'تذكر أن الحركة ولو بسيطة أفضل من الجلوس الطويل.',
];

export const DEFAULT_ADMIN_CONFIG = {
  password: 'rafeeq2024',
  contentItems: DEFAULT_CONTENT_ITEMS,
  exerciseVideos: DEFAULT_EXERCISE_VIDEOS,
  exercises: DEFAULT_EXERCISES,
  tips: DEFAULT_TIPS,
  greeting: 'أهلاً بيك في رفيق 💚',
  appVersion: '1.0.0',
};
