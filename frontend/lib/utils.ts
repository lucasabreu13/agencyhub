import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function formatDate(value: string | Date | undefined | null, options?: Intl.DateTimeFormatOptions): string {
  if (!value) return ""
  const d = typeof value === "string" ? new Date(value) : value
  return d instanceof Date && !isNaN(d.getTime()) ? d.toLocaleDateString("pt-BR", options) : ""
}
