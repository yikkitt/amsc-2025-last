import { describe, it, expect, vi } from 'vitest'
import { calculateLateCharge, submitForm } from '../submitHandler'
import { createClient } from '@supabase/supabase-js'

// Mock Supabase client
vi.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    from: () => ({
      insert: () => ({
        select: () => Promise.resolve({
          data: [{ id: 1 }],
          error: null,
        }),
      }),
    }),
  }),
}))

describe('Form Submission Handler', () => {
  describe('calculateLateCharge', () => {
    it('returns 0 when not past deadline', () => {
      expect(calculateLateCharge(2, 1000, false)).toBe(0)
      expect(calculateLateCharge(3, 1000, false)).toBe(0)
      expect(calculateLateCharge(4, 1000, false)).toBe(0)
    })

    it('calculates flat rate for Form 2', () => {
      expect(calculateLateCharge(2, 1000, true)).toBe(100)
    })

    it('calculates 10% for Form 3', () => {
      expect(calculateLateCharge(3, 1000, true)).toBe(100)
    })

    it('calculates 30% for Forms 4 and 5', () => {
      expect(calculateLateCharge(4, 1000, true)).toBe(300)
      expect(calculateLateCharge(5, 1000, true)).toBe(300)
    })

    it('returns 0 for forms with no late charges', () => {
      expect(calculateLateCharge(1, 1000, true)).toBe(0)
      expect(calculateLateCharge(6, 1000, true)).toBe(0)
      expect(calculateLateCharge(7, 1000, true)).toBe(0)
      expect(calculateLateCharge(8, 1000, true)).toBe(0)
    })
  })

  describe('submitForm', () => {
    const mockFormData = {
      company_name: 'Test Company',
      contact_person: 'John Doe',
      booth_number: 'A123',
      telephone: '1234567890',
      email: 'test@example.com',
      items: [
        {
          description: 'Test Item',
          quantity: 2,
          unit_price: 100,
          total: 200,
        },
      ],
    }

    it('submits form data successfully', async () => {
      const result = await submitForm(mockFormData, 2, false)
      expect(result.success).toBe(true)
      expect(result.data).toBeDefined()
    })

    it('calculates totals correctly with late charge', async () => {
      const result = await submitForm(mockFormData, 2, true)
      expect(result.success).toBe(true)
      expect(result.data).toBeDefined()
    })

    it('handles submission error', async () => {
      // Mock Supabase error
      vi.mocked(createClient).mockImplementationOnce(() => ({
        from: vi.fn(() => ({
          insert: vi.fn(() => ({
            select: vi.fn(() => ({
              data: null,
              error: new Error('Database error'),
            })),
          })),
        })),
      }))

      const result = await submitForm(mockFormData, 2, false)
      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
    })
  })
}) 