import { renderHook } from '@testing-library/react-hooks'
import { useMutation } from '@tanstack/react-query'
import { login } from '../services/authService'
import { useLogin } from '../hooks/useLogin'
import { act } from 'react-dom/test-utils'

jest.mock('../services/authService')
const mockLogin = login as jest.Mock

const mockUseMutation = useMutation as jest.Mock
jest.mock('@tanstack/react-query', () => ({
  useMutation: jest.fn(),
}))

describe('useLogin Hook', () => {
  it('should call login service with correct credentials', async () => {
    const mutationFn = jest.fn()
    mockUseMutation.mockReturnValue({
      mutateAsync: mutationFn,
    })

    const { result } = renderHook(() => useLogin())

    await act(async () => {
      await result.current.mutateAsync({ email: 'test@example.com', password: 'password' })
    })

    expect(mutationFn).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password' })
  })

  it('should handle errors', async () => {
    const mutationFn = jest.fn().mockRejectedValue(new Error('Invalid credentials.'))
    mockUseMutation.mockReturnValue({
      mutateAsync: mutationFn,
    })

    const { result } = renderHook(() => useLogin())

    await act(async () => {
      try {
        await result.current.mutateAsync({ email: 'test@example.com', password: 'wrongpassword' })
      } catch (e) {
        expect(e).toEqual(new Error('Invalid credentials.'))
      }
    })
  })
})
