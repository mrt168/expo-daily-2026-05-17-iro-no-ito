// utils/dateUtils.ts

export const todayKey = (d: Date = new Date()): string => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

export const formatJpDate = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date + 'T00:00:00') : date;
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
};

export const formatJpMonth = (year: number, month: number): string => {
  return `${year}年${month + 1}月`;
};

export const daysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

export const firstDayOfWeek = (year: number, month: number): number => {
  return new Date(year, month, 1).getDay();
};

export const last7Days = (): string[] => {
  const days: string[] = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    days.push(todayKey(d));
  }
  return days;
};

export const dateKeyForMonthDay = (year: number, month: number, day: number): string => {
  const m = String(month + 1).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${year}-${m}-${d}`;
};
