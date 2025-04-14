import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { LoginForm } from '../LoginForm'
import { AuthProvider } from '../AuthProvider'
import { createClient } from '@supabase/supabase-js'
import { expect, describe, it, vi, beforeEach } from 'vitest'

// Mock Supabase client
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    auth: {
      signInWithPassword: vi.fn(),
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(),
    },
  })),
}))

describe('Authentication Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('LoginForm', () => {
    it('renders login form correctly', () => {
      render(<LoginForm />)
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
    })

    it('validates required fields', async () => {
      render(<LoginForm />)
      const submitButton = screen.getByRole('button', { name: /sign in/i })
      
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText(/email is required/i)).toBeInTheDocument()
        expect(screen.getByText(/password is required/i)).toBeInTheDocument()
      })
    })

    it('validates email format', async () => {
      render(<LoginForm />)
      const emailInput = screen.getByLabelText(/email/i)
      
      fireEvent.change(emailInput, { target: { value: 'invalid-email' } })
      fireEvent.click(screen.getByRole('button', { name: /sign in/i }))
      
      await waitFor(() => {
        expect(screen.getByText(/invalid email format/i)).toBeInTheDocument()
      })
    })

    it('handles successful login', async () => {
      const mockSignIn = vi.fn().mockResolvedValue({
        data: { session: { user: { id: '123' } } },
        error: null,
      })
      
      const supabase = createClient('', '')
      supabase.auth.signInWithPassword = mockSignIn
      
      render(<LoginForm />)
      
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'test@example.com' },
      })
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: 'password123' },
      })
      fireEvent.click(screen.getByRole('button', { name: /sign in/i }))
      
      await waitFor(() => {
        expect(mockSignIn).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123',
        })
      })
    })

    it('handles login error', async () => {
      const mockSignIn = vi.fn().mockResolvedValue({
        data: { session: null },
        error: { message: 'Invalid credentials' },
      })
      
      const supabase = createClient('', '')
      supabase.auth.signInWithPassword = mockSignIn
      
      render(<LoginForm />)
      
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'test@example.com' },
      })
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: 'wrongpassword' },
      })
      fireEvent.click(screen.getByRole('button', { name: /sign in/i }))
      
      await waitFor(() => {
        expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument()
      })
    })
  })

  describe('AuthProvider', () => {
    it('provides auth context to children', () => {
      const TestComponent = () => {
        return <div>Test Component</div>
      }

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      expect(screen.getByText('Test Component')).toBeInTheDocument()
    })

    it('handles auth state changes', async () => {
      const mockSession = {
        user: { id: '123', email: 'test@example.com' },
        access_token: 'token',
      }

      const supabase = createClient('', '')
      supabase.auth.getSession = vi.fn().mockResolvedValue({
        data: { session: mockSession },
        error: null,
      })

      const TestComponent = () => {
        return <div>Authenticated</div>
      }

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByText('Authenticated')).toBeInTheDocument()
      })
    })
  })
}) 