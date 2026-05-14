import { render, screen, fireEvent } from '@testing-library/react'
import LoginForm from '../components/LoginForm'

const mockUseLogin = jest.fn()

jest.mock('../hooks/useLogin', () => ({
  useLogin: () => ({
    mutateAsync: mockUseLogin,
    isLoading: false,
    error: null
  })
}))

describe('LoginForm Component', () => {
  test('renders the login form', () => {
    render(<LoginForm onLoginSuccess={() => {}} />)

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
  })

  test('calls onLoginSuccess on successful login', async () => {
    const onSuccess = jest.fn()
    mockUseLogin.mockResolvedValue({ token: 'dummytoken', userId: 1 })

    render(<LoginForm onLoginSuccess={onSuccess} />)

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    })

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password' }
    })

    fireEvent.click(screen.getByRole('button', { name: /login/i }))

    expect(await screen.findByText(/login/i)).toBeInTheDocument()
    expect(onSuccess).toHaveBeenCalledWith('dummytoken', 1)
  })

  test('renders error on login failure', async () => {
    mockUseLogin.mockRejectedValue(new Error('Invalid credentials.'))

    render(<LoginForm onLoginSuccess={() => {}} />)

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    })

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'wrongpassword' }
    })

    fireEvent.click(screen.getByRole('button', { name: /login/i }))

    const errorMessage = await screen.findByText(/login failed/i)
    expect(errorMessage).toBeInTheDocument()
  })
})
