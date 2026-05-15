import { renderHook, act } from '@testing-library/react';
import { useOrderData } from '../hooks/useOrderData';
import { setupServer } from 'msw/node';
import { rest } from 'msw';

test('should fetch and update order data', async () => {
  const server = setupServer(
    rest.get('/api/orders', (req, res, ctx) => {
      return res(
        ctx.json([
          { id: '1', orderNumber: '10001', customerId: 'customer-1', totalAmount: 100.0 },
        ])
      );
    })
  );
  server.listen();

  const { result, waitForNextUpdate } = renderHook(() => useOrderData());

  await waitForNextUpdate();

  expect(result.current.orders).toHaveLength(1);
  expect(result.current.orders[0].orderNumber).toBe('10001');

  act(() => {
    result.current.updateOrder({ id: '1', orderNumber: '10002' });
  });

  expect(result.current.orders[0].orderNumber).toBe('10002');

  server.close();
});