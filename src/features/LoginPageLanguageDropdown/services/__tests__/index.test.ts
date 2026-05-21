// Tests for fetchLanguages service
import { fetchLanguages } from '../index';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

describe('fetchLanguages', () => {
  const languagesResponse = {
    languages: [
      { code: 'en', label: 'English' },
      { code: 'es', label: 'Español' },
    ],
  };

  const server = setupServer(
    rest.get('/api/languages', (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(languagesResponse));
    })
  );

  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it('fetches available languages from API', async () => {
    const data = await fetchLanguages();
    expect(data).toEqual(languagesResponse);
  });

  it('throws on network error', async () => {
    server.use(
      rest.get('/api/languages', (req, res, ctx) => res(ctx.status(500)))
    );

    await expect(fetchLanguages()).rejects.toThrow();
  });
});
