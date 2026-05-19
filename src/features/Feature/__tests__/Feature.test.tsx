import { describe, expect, it, vi } from 'vitest';
import { http, HttpResponse } from 'msw';
import { screen, waitFor, renderHook, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClientProvider } from '@tanstack/react-query';
import { server } from '@/test/server';
import { createTestQueryClient, renderWithProviders } from '@/test/testUtils';
import { getFeatureItems, createFeatureItem } from '@/features/Feature/services';
import { useCreateFeatureItem, useFeatureItems } from '@/features/Feature/hooks';
import { FeatureForm } from '@/features/Feature/components/FeatureForm';
import { FeaturePage } from '@/features/Feature/pages/FeaturePage';

vi.mock('@/features/Feature/hooks', async importOriginal => {
  const actual = await importOriginal<typeof import('@/features/Feature/hooks')>();
  return {
    ...actual,
    useFeatureItems: vi.fn(),
    useCreateFeatureItem: vi.fn(),
  };
});

const mockedUseFeatureItems = vi.mocked(useFeatureItems);
const mockedUseCreateFeatureItem = vi.mocked(useCreateFeatureItem);

describe('Feature services', () => {
  it('gets feature items from API', async () => {
    server.use(http.get('http://localhost:5000/api/features', () => HttpResponse.json([
      { id: '1', name: 'Portal', owner: 'Product', status: 'Active' },
    ])));

    await expect(getFeatureItems()).resolves.toEqual([{ id: '1', name: 'Portal', owner: 'Product', status: 'Active' }]);
  });

  it('posts a new feature item to API', async () => {
    server.use(http.post('http://localhost:5000/api/features', async ({ request }) => {
      const body = await request.json() as { name: string; owner: string };
      expect(body).toEqual({ name: 'Billing', owner: 'Finance' });
      return HttpResponse.json({ id: '2', name: body.name, owner: body.owner, status: 'Draft' }, { status: 201 });
    }));

    await expect(createFeatureItem({ name: 'Billing', owner: 'Finance' })).resolves.toMatchObject({ id: '2', status: 'Draft' });
  });
});

describe('Feature hooks', () => {
  it('loads feature items with useFeatureItems', async () => {
    vi.resetModules();
    vi.doMock('@/features/Feature/services', () => ({
      getFeatureItems: vi.fn().mockResolvedValue([{ id: '1', name: 'Portal', owner: 'Product', status: 'Active' }]),
      createFeatureItem: vi.fn(),
    }));
    const { useFeatureItems: realUseFeatureItems } = await import('@/features/Feature/hooks');
    const client = createTestQueryClient();
    const wrapper = ({ children }: { children: React.ReactNode }) => <QueryClientProvider client={client}>{children}</QueryClientProvider>;

    const { result } = renderHook(() => realUseFeatureItems(), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(1);
  });

  it('invalidates feature list after create succeeds', async () => {
    vi.resetModules();
    vi.doMock('@/features/Feature/services', () => ({
      getFeatureItems: vi.fn(),
      createFeatureItem: vi.fn().mockResolvedValue({ id: '3', name: 'New', owner: 'Ops', status: 'Draft' }),
    }));
    const { useCreateFeatureItem: realUseCreateFeatureItem, featureQueryKeys } = await import('@/features/Feature/hooks');
    const client = createTestQueryClient();
    const invalidateSpy = vi.spyOn(client, 'invalidateQueries');
    const wrapper = ({ children }: { children: React.ReactNode }) => <QueryClientProvider client={client}>{children}</QueryClientProvider>;

    const { result } = renderHook(() => realUseCreateFeatureItem(), { wrapper });
    await act(async () => {
      await result.current.mutateAsync({ name: 'New', owner: 'Ops' });
    });

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: featureQueryKeys.all });
  });
});

describe('FeatureForm', () => {
  it('submits form, resets through mutation success callback, and calls onCreated', async () => {
    const user = userEvent.setup();
    const onCreated = vi.fn();
    const mutate = vi.fn((_dto, options?: { onSuccess?: () => void }) => options?.onSuccess?.());
    mockedUseCreateFeatureItem.mockReturnValue({ mutate, isPending: false } as never);

    renderWithProviders(<FeatureForm onCreated={onCreated} />);
    await user.type(screen.getByLabelText('Name'), 'Portal');
    await user.type(screen.getByLabelText('Owner'), 'Product');
    await user.click(screen.getByRole('button', { name: /create item/i }));

    expect(mutate).toHaveBeenCalledWith({ name: 'Portal', owner: 'Product' }, expect.objectContaining({ onSuccess: expect.any(Function) }));
    expect(onCreated).toHaveBeenCalledTimes(1);
    expect(screen.getByLabelText('Name')).toHaveValue('');
    expect(screen.getByLabelText('Owner')).toHaveValue('');
  });

  it('disables submit while pending', () => {
    mockedUseCreateFeatureItem.mockReturnValue({ mutate: vi.fn(), isPending: true } as never);
    renderWithProviders(<FeatureForm onCreated={vi.fn()} />);
    expect(screen.getByRole('button', { name: /create item/i })).toBeDisabled();
  });
});

describe('FeaturePage', () => {
  it('renders API data in table and opens/closes create modal', async () => {
    const user = userEvent.setup();
    mockedUseFeatureItems.mockReturnValue({
      data: [{ id: '10', name: 'Inventory', owner: 'Ops', status: 'Active' }],
      isPending: false,
      isError: false,
    } as never);
    mockedUseCreateFeatureItem.mockReturnValue({ mutate: vi.fn((_dto, options?: { onSuccess?: () => void }) => options?.onSuccess?.()), isPending: false } as never);

    renderWithProviders(<FeaturePage />);
    expect(screen.getByRole('heading', { name: 'Feature' })).toBeInTheDocument();
    expect(screen.getByText('Inventory')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /add item/i }));
    expect(screen.getByRole('heading', { name: /create feature item/i })).toBeInTheDocument();
    await user.click(screen.getByLabelText('Close modal'));
    expect(screen.queryByRole('heading', { name: /create feature item/i })).not.toBeInTheDocument();
  });

  it('shows loading and fallback sample data on API error', () => {
    mockedUseFeatureItems.mockReturnValue({ data: undefined, isPending: true, isError: true } as never);
    mockedUseCreateFeatureItem.mockReturnValue({ mutate: vi.fn(), isPending: false } as never);

    renderWithProviders(<FeaturePage />);
    expect(screen.getByText(/loader2 records/i)).toBeInTheDocument();
    expect(screen.getByText(/showing sample data/i)).toBeInTheDocument();
    expect(screen.getByText('Customer Portal')).toBeInTheDocument();
    expect(screen.getByText('Billing Automation')).toBeInTheDocument();
  });
});
