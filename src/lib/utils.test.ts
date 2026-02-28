import { describe, it, expect } from 'vitest'
import { get, formatCurrency, formatPercent, cn } from './utils'

describe('Utils', () => {
  describe('get', () => {
    const obj = {
      a: {
        b: {
          c: 'value'
        }
      },
      d: 0,
      e: false,
      f: null
    }

    it('gets a nested value', () => {
      expect(get(obj as any, 'a.b.c')).toBe('value')
    })

    it('returns default value for missing path', () => {
      expect(get(obj as any, 'a.x.y', 'default')).toBe('default')
    })

    it('handles numeric 0 correctly', () => {
      expect(get(obj as any, 'd')).toBe(0)
    })

    it('handles boolean false correctly', () => {
      expect(get(obj as any, 'e')).toBe(false)
    })

    it('handles null correctly', () => {
      expect(get(obj as any, 'f')).toBe(null)
    })
  })

  describe('formatCurrency', () => {
    it('formats USD correctly', () => {
      expect(formatCurrency(1234.56)).toBe('$1,235') // Math.round because of Intl options
    })
  })

  describe('formatPercent', () => {
    it('formats percentage correctly', () => {
      expect(formatPercent(0.123)).toBe('12.3%')
    })
  })

  describe('cn', () => {
    it('merges tailwind classes correctly', () => {
      expect(cn('p-4', 'p-2')).toBe('p-2')
      expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500')
    })
  })
})
