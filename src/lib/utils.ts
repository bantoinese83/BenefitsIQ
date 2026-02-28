import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Utility for merging Tailwind CSS classes with clsx and tailwind-merge.
 * Enhances performance and developer experience when working with conditional classes.
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

/**
 * Formats a number as USD currency.
 */
export const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
    }).format(value)
}

/**
 * Formats a number as a percentage.
 */
export const formatPercent = (value: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'percent',
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
    }).format(value)
}

/**
 * Safely access nested objects or return default.
 */
export const get = <T>(obj: Record<string, unknown>, path: string, defaultValue?: T): T => {
    const result = path.split('.').reduce<unknown>((o, key) => {
        if (o && typeof o === 'object' && key in o) {
            return (o as Record<string, unknown>)[key]
        }
        return undefined
    }, obj)
    return (result === undefined ? defaultValue : result) as T
}
