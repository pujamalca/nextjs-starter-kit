/**
 * Date & Currency Formatting Utilities
 */

/**
 * Format date to Indonesian locale
 */
export function formatDate(
  date: Date | string | number,
  options?: Intl.DateTimeFormatOptions
): string {
  const d = new Date(date);
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    ...options,
  });
}

/**
 * Format date to short format
 */
export function formatDateShort(date: Date | string | number): string {
  return formatDate(date, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/**
 * Format datetime
 */
export function formatDateTime(
  date: Date | string | number,
  options?: Intl.DateTimeFormatOptions
): string {
  const d = new Date(date);
  return d.toLocaleString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    ...options,
  });
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: Date | string | number): string {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffWeek = Math.floor(diffDay / 7);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffDay / 365);

  if (diffSec < 60) return "Baru saja";
  if (diffMin < 60) return `${diffMin} menit yang lalu`;
  if (diffHour < 24) return `${diffHour} jam yang lalu`;
  if (diffDay < 7) return `${diffDay} hari yang lalu`;
  if (diffWeek < 4) return `${diffWeek} minggu yang lalu`;
  if (diffMonth < 12) return `${diffMonth} bulan yang lalu`;
  return `${diffYear} tahun yang lalu`;
}

/**
 * Format currency (Indonesian Rupiah)
 */
export function formatCurrency(
  amount: number,
  currency: string = "IDR",
  locale: string = "id-ID"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format number with thousand separators
 */
export function formatNumber(
  num: number,
  locale: string = "id-ID"
): string {
  return new Intl.NumberFormat(locale).format(num);
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  const units = ["B", "KB", "MB", "GB", "TB"];
  let i = 0;
  while (bytes >= 1024 && i < units.length - 1) {
    bytes /= 1024;
    i++;
  }
  return `${bytes.toFixed(i > 0 ? 1 : 0)} ${units[i]}`;
}

/**
 * Format percentage
 */
export function formatPercent(
  value: number,
  decimals: number = 0
): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Format phone number (Indonesian format)
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  
  if (cleaned.startsWith("62")) {
    const num = cleaned.slice(2);
    return `+62 ${num.slice(0, 3)}-${num.slice(3, 7)}-${num.slice(7)}`;
  }
  
  if (cleaned.startsWith("0")) {
    const num = cleaned.slice(1);
    return `0${num.slice(0, 3)}-${num.slice(3, 7)}-${num.slice(7)}`;
  }
  
  return phone;
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(
  text: string,
  maxLength: number,
  ellipsis: string = "..."
): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - ellipsis.length) + ellipsis;
}

/**
 * Generate initials from name
 */
export function getInitials(name: string, maxLength: number = 2): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, maxLength);
}
