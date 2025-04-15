/// <reference types="vitest" />
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { createClientComponentClient } from '@/lib/supabase'
import FasciaNameForm from '../FasciaNameForm'

vi.mock('@supabase/auth-helpers-nextjs', () => ({
  createClientComponentClient: () => ({
    from: () => ({
      insert: vi.fn().mockResolvedValue({ error: null }),
    }),
  }),
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    refresh: vi.fn(),
    push: vi.fn(),
  }),
}))

describe('FasciaNameForm', () => {
  const mockUserData = {
    company_name: 'Test Company',
    booth_number: 'A123',
  }

  it('renders with user data', () => {
    render(<FasciaNameForm userData={mockUserData} />)
    
    expect(screen.getByLabelText(/company name/i)).toHaveValue('Test Company')
    expect(screen.getByLabelText(/booth number/i)).toHaveValue('A123')
  })

  it('shows validation errors for empty required fields', async () => {
    render(<FasciaNameForm userData={null} />)
    
    const submitButton = screen.getByRole('button', { name: /submit form/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/company name is required/i)).toBeInTheDocument()
      expect(screen.getByText(/fascia name is required/i)).toBeInTheDocument()
      expect(screen.getByText(/booth number is required/i)).toBeInTheDocument()
    })
  })

  it('shows error for fascia name exceeding max length', async () => {
    render(<FasciaNameForm userData={null} />)
    
    const fasciaInput = screen.getByLabelText(/fascia name/i)
    fireEvent.change(fasciaInput, {
      target: { value: 'This is a very long fascia name that exceeds the maximum length' },
    })

    const submitButton = screen.getByRole('button', { name: /submit form/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/fascia name must be 24 characters or less/i)).toBeInTheDocument()
    })
  })

  it('submits form successfully with valid data', async () => {
    render(<FasciaNameForm userData={mockUserData} />)
    
    const fasciaInput = screen.getByLabelText(/fascia name/i)
    fireEvent.change(fasciaInput, {
      target: { value: 'Test Fascia Name' },
    })

    const submitButton = screen.getByRole('button', { name: /submit form/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(submitButton).toBeDisabled()
      expect(submitButton).toHaveTextContent(/submitting/i)
    })
  })

  it('handles draft saving state', async () => {
    render(<FasciaNameForm userData={mockUserData} />)
    
    const draftButton = screen.getByRole('button', { name: /save as draft/i })
    fireEvent.click(draftButton)

    await waitFor(() => {
      expect(draftButton).toBeDisabled()
      expect(draftButton).toHaveTextContent(/saving/i)
    })
  })
}) 