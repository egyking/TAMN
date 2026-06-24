const ARABIC_MONTHS = [
  'يناير','فبراير','مارس','أبريل','مايو','يونيو',
  'يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'
];

const ARABIC_DAYS = ['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'];

export const toArabicNumerals = (str) =>
  String(str).replace(/[0-9]/g, d => '٠١٢٣٤٥٦٧٨٩'[+d]);

export const formatArabicDate = (dateStr) => {
  const d = new Date(dateStr);
  return `${toArabicNumerals(d.getDate())} ${ARABIC_MONTHS[d.getMonth()]} ${toArabicNumerals(d.getFullYear())}`;
};

export const getGreeting = (name) => {
  const hour = new Date().getHours();
  let greeting = '';
  if (hour >= 5 && hour < 12) greeting = 'صباح الخير';
  else if (hour >= 12 && hour < 17) greeting = 'مساء الخير';
  else if (hour >= 17 && hour < 21) greeting = 'أمسية طيبة';
  else greeting = 'ليلة سعيدة';
  return name ? `${greeting} يا ${name}` : greeting;
};

export const getWeekDays = () => {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push({
      label: ARABIC_DAYS[d.getDay()].charAt(0),
      date: d.toISOString().split('T')[0],
      isToday: i === 0,
    });
  }
  return days;
};
